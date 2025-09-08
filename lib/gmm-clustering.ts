// GMM (Gaussian Mixture Model) 클러스터링 서비스
import { Patent } from '@/types';
import { koreanTextProcessor } from './korean-text-processor';

// GMM 클러스터 결과
export interface GMMCluster {
  id: string;
  patents: Patent[];
  centroid: number[];
  covariance: number[][];
  weight: number;
  probability: number[];
  size: number;
}

// GMM 파라미터
export interface GMMParams {
  nComponents: number;
  covarianceType: 'full' | 'tied' | 'diag' | 'spherical';
  maxIterations: number;
  tolerance: number;
  initMethod: 'kmeans' | 'random' | 'kmeans++';
  distanceMetric: 'euclidean' | 'cosine' | 'manhattan' | 'korean';
}

// GMM 클러스터링 서비스
export class GMMClusteringService {
  private params: GMMParams;
  
  constructor(params: GMMParams) {
    this.params = params;
  }
  
  // 메인 클러스터링 실행
  public async performClustering(
    patents: Patent[], 
    targetClusters?: number
  ): Promise<GMMCluster[]> {
    if (patents.length === 0) return [];
    
    const k = targetClusters || this.params.nComponents;
    
    // 1. 특허 텍스트를 벡터로 변환
    const vectors = await this.convertPatentsToVectors(patents);
    
    // 2. GMM 실행
    const clusters = this.runGMM(vectors, k, patents);
    
    return clusters;
  }
  
  // 특허를 벡터로 변환
  private async convertPatentsToVectors(patents: Patent[]): Promise<number[][]> {
    const vectors: number[][] = [];
    
    for (const patent of patents) {
      const text = this.extractPatentText(patent);
      const morphemes = koreanTextProcessor.analyzeMorphemes(text);
      const vector = this.createFeatureVector(morphemes);
      vectors.push(vector);
    }
    
    return vectors;
  }
  
  // 특허 텍스트 추출
  private extractPatentText(patent: Patent): string {
    return [
      patent.title,
      patent.abstract,
      patent.description,
      patent.claims?.join(' ') || '',
      patent.inventors?.join(' ') || '',
      patent.applicants?.join(' ') || ''
    ].filter(Boolean).join(' ');
  }
  
  // 특징 벡터 생성
  private createFeatureVector(morphemes: string[]): number[] {
    // 간단한 TF-IDF 스타일 벡터
    const termFreq = new Map<string, number>();
    
    morphemes.forEach(morpheme => {
      termFreq.set(morpheme, (termFreq.get(morpheme) || 0) + 1);
    });
    
    // 고정 크기 벡터로 정규화
    const vectorSize = 100;
    const vector = new Array(vectorSize).fill(0);
    
    let index = 0;
    for (const [term, freq] of termFreq) {
      if (index >= vectorSize) break;
      vector[index] = freq;
      index++;
    }
    
    // 정규화
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    if (magnitude > 0) {
      for (let i = 0; i < vector.length; i++) {
        vector[i] = vector[i] / magnitude;
      }
    }
    
    return vector;
  }
  
  // GMM 실행
  private runGMM(vectors: number[][], k: number, patents: Patent[]): GMMCluster[] {
    const n = vectors.length;
    const d = vectors[0].length;
    
    // 1. 초기화
    const { means, covariances, weights } = this.initializeGMM(vectors, k);
    
    // 2. EM 알고리즘 실행
    const { means: finalMeans, covariances: finalCovariances, weights: finalWeights, responsibilities } = 
      this.runEMAlgorithm(vectors, means, covariances, weights, k);
    
    // 3. 클러스터 할당
    const clusters = this.assignToClusters(vectors, finalMeans, finalCovariances, finalWeights, responsibilities, patents, k);
    
    return clusters;
  }
  
  // GMM 초기화
  private initializeGMM(vectors: number[][], k: number): {
    means: number[][];
    covariances: number[][][];
    weights: number[];
  } {
    const n = vectors.length;
    const d = vectors[0].length;
    
    let means: number[][];
    let covariances: number[][][];
    let weights: number[];
    
    switch (this.params.initMethod) {
      case 'kmeans':
        const kmeansResult = this.initializeWithKMeans(vectors, k);
        means = kmeansResult.means;
        covariances = kmeansResult.covariances;
        weights = kmeansResult.weights;
        break;
        
      case 'kmeans++':
        const kmeansPlusResult = this.initializeWithKMeansPlus(vectors, k);
        means = kmeansPlusResult.means;
        covariances = kmeansPlusResult.covariances;
        weights = kmeansPlusResult.weights;
        break;
        
      case 'random':
      default:
        const randomResult = this.initializeRandomly(vectors, k);
        means = randomResult.means;
        covariances = randomResult.covariances;
        weights = randomResult.weights;
        break;
    }
    
    return { means, covariances, weights };
  }
  
  // K-means로 초기화
  private initializeWithKMeans(vectors: number[][], k: number): {
    means: number[][];
    covariances: number[][][];
    weights: number[];
  } {
    const n = vectors.length;
    const d = vectors[0].length;
    
    // 간단한 K-means 초기화
    const means: number[][] = [];
    const covariances: number[][][] = [];
    const weights: number[] = [];
    
    // 랜덤하게 k개 점 선택
    const indices = this.getRandomIndices(n, k);
    for (let i = 0; i < k; i++) {
      means.push([...vectors[indices[i]]]);
    }
    
    // 클러스터 할당
    const assignments = this.assignToNearestMean(vectors, means);
    
    // 각 클러스터의 평균과 공분산 계산
    for (let i = 0; i < k; i++) {
      const clusterVectors = vectors.filter((_, idx) => assignments[idx] === i);
      
      if (clusterVectors.length > 0) {
        // 평균 업데이트
        const newMean = new Array(d).fill(0);
        clusterVectors.forEach(vec => {
          for (let j = 0; j < d; j++) {
            newMean[j] += vec[j];
          }
        });
        for (let j = 0; j < d; j++) {
          newMean[j] /= clusterVectors.length;
        }
        means[i] = newMean;
        
        // 공분산 계산
        const covariance = this.calculateCovariance(clusterVectors, newMean);
        covariances.push(covariance);
        
        // 가중치 계산
        weights.push(clusterVectors.length / n);
      } else {
        // 빈 클러스터 처리
        const identityCov = Array(d).fill(0).map(() => Array(d).fill(0));
        for (let j = 0; j < d; j++) {
          identityCov[j][j] = 1;
        }
        covariances.push(identityCov);
        weights.push(1 / k);
      }
    }
    
    return { means, covariances, weights };
  }
  
  // K-means++로 초기화
  private initializeWithKMeansPlus(vectors: number[][], k: number): {
    means: number[][];
    covariances: number[][][];
    weights: number[];
  } {
    const n = vectors.length;
    const d = vectors[0].length;
    
    const means: number[][] = [];
    const covariances: number[][][] = [];
    const weights: number[] = [];
    
    // 첫 번째 중심점 랜덤 선택
    const firstIndex = Math.floor(Math.random() * n);
    means.push([...vectors[firstIndex]]);
    
    // 나머지 중심점들 선택
    for (let i = 1; i < k; i++) {
      const distances = this.calculateDistancesToMeans(vectors, means);
      const probabilities = this.calculateSelectionProbabilities(distances);
      const nextIndex = this.selectNextCenter(probabilities);
      means.push([...vectors[nextIndex]]);
    }
    
    // 클러스터 할당 및 공분산 계산
    const assignments = this.assignToNearestMean(vectors, means);
    
    for (let i = 0; i < k; i++) {
      const clusterVectors = vectors.filter((_, idx) => assignments[idx] === i);
      
      if (clusterVectors.length > 0) {
        const covariance = this.calculateCovariance(clusterVectors, means[i]);
        covariances.push(covariance);
        weights.push(clusterVectors.length / n);
      } else {
        const identityCov = Array(d).fill(0).map(() => Array(d).fill(0));
        for (let j = 0; j < d; j++) {
          identityCov[j][j] = 1;
        }
        covariances.push(identityCov);
        weights.push(1 / k);
      }
    }
    
    return { means, covariances, weights };
  }
  
  // 랜덤 초기화
  private initializeRandomly(vectors: number[][], k: number): {
    means: number[][];
    covariances: number[][][];
    weights: number[];
  } {
    const n = vectors.length;
    const d = vectors[0].length;
    
    const means: number[][] = [];
    const covariances: number[][][] = [];
    const weights: number[] = [];
    
    // 랜덤한 중심점 선택
    for (let i = 0; i < k; i++) {
      const randomIndex = Math.floor(Math.random() * n);
      means.push([...vectors[randomIndex]]);
      
      // 단위 공분산 행렬
      const covariance = Array(d).fill(0).map(() => Array(d).fill(0));
      for (let j = 0; j < d; j++) {
        covariance[j][j] = 1;
      }
      covariances.push(covariance);
      
      weights.push(1 / k);
    }
    
    return { means, covariances, weights };
  }
  
  // EM 알고리즘 실행
  private runEMAlgorithm(
    vectors: number[][],
    means: number[][],
    covariances: number[][][],
    weights: number[],
    k: number
  ): {
    means: number[][];
    covariances: number[][][];
    weights: number[];
    responsibilities: number[][];
  } {
    const n = vectors.length;
    const d = vectors[0].length;
    
    let currentMeans = means.map(m => [...m]);
    let currentCovariances = covariances.map(c => c.map(row => [...row]));
    let currentWeights = [...weights];
    
    let logLikelihood = -Infinity;
    let iteration = 0;
    
    while (iteration < this.params.maxIterations) {
      // E-step: 책임도 계산
      const responsibilities = this.calculateResponsibilities(vectors, currentMeans, currentCovariances, currentWeights);
      
      // M-step: 파라미터 업데이트
      const newMeans = this.updateMeans(vectors, responsibilities);
      const newCovariances = this.updateCovariances(vectors, responsibilities, newMeans);
      const newWeights = this.updateWeights(responsibilities);
      
      // 수렴 확인
      const newLogLikelihood = this.calculateLogLikelihood(vectors, newMeans, newCovariances, newWeights);
      
      if (Math.abs(newLogLikelihood - logLikelihood) < this.params.tolerance) {
        break;
      }
      
      // 파라미터 업데이트
      currentMeans = newMeans;
      currentCovariances = newCovariances;
      currentWeights = newWeights;
      logLikelihood = newLogLikelihood;
      
      iteration++;
    }
    
    const finalResponsibilities = this.calculateResponsibilities(vectors, currentMeans, currentCovariances, currentWeights);
    
    return {
      means: currentMeans,
      covariances: currentCovariances,
      weights: currentWeights,
      responsibilities: finalResponsibilities
    };
  }
  
  // 책임도 계산 (E-step)
  private calculateResponsibilities(
    vectors: number[][],
    means: number[][],
    covariances: number[][][],
    weights: number[]
  ): number[][] {
    const n = vectors.length;
    const k = means.length;
    const responsibilities: number[][] = Array(n).fill(0).map(() => Array(k).fill(0));
    
    for (let i = 0; i < n; i++) {
      const vector = vectors[i];
      let totalProbability = 0;
      
      // 각 가우시안 성분의 확률 계산
      for (let j = 0; j < k; j++) {
        const probability = weights[j] * this.calculateGaussianProbability(vector, means[j], covariances[j]);
        responsibilities[i][j] = probability;
        totalProbability += probability;
      }
      
      // 정규화
      if (totalProbability > 0) {
        for (let j = 0; j < k; j++) {
          responsibilities[i][j] /= totalProbability;
        }
      }
    }
    
    return responsibilities;
  }
  
  // 가우시안 확률 계산
  private calculateGaussianProbability(
    vector: number[],
    mean: number[],
    covariance: number[][]
  ): number {
    const d = vector.length;
    
    // 간단한 가우시안 확률 계산 (실제로는 더 정교한 계산 필요)
    let distance = 0;
    for (let i = 0; i < d; i++) {
      const diff = vector[i] - mean[i];
      distance += diff * diff;
    }
    
    const variance = this.calculateVariance(covariance);
    const normalization = 1 / Math.sqrt(2 * Math.PI * variance);
    
    return normalization * Math.exp(-distance / (2 * variance));
  }
  
  // 공분산 행렬의 분산 계산
  private calculateVariance(covariance: number[][]): number {
    let sum = 0;
    for (let i = 0; i < covariance.length; i++) {
      sum += covariance[i][i];
    }
    return sum / covariance.length;
  }
  
  // 평균 업데이트 (M-step)
  private updateMeans(vectors: number[][], responsibilities: number[][]): number[][] {
    const n = vectors.length;
    const k = responsibilities[0].length;
    const d = vectors[0].length;
    
    const newMeans: number[][] = Array(k).fill(0).map(() => Array(d).fill(0));
    const clusterSums: number[] = Array(k).fill(0);
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < k; j++) {
        for (let dim = 0; dim < d; dim++) {
          newMeans[j][dim] += responsibilities[i][j] * vectors[i][dim];
        }
        clusterSums[j] += responsibilities[i][j];
      }
    }
    
    // 정규화
    for (let j = 0; j < k; j++) {
      if (clusterSums[j] > 0) {
        for (let dim = 0; dim < d; dim++) {
          newMeans[j][dim] /= clusterSums[j];
        }
      }
    }
    
    return newMeans;
  }
  
  // 공분산 업데이트 (M-step)
  private updateCovariances(
    vectors: number[][],
    responsibilities: number[][],
    means: number[][]
  ): number[][][] {
    const n = vectors.length;
    const k = means.length;
    const d = vectors[0].length;
    
    const newCovariances: number[][][] = Array(k).fill(0).map(() => 
      Array(d).fill(0).map(() => Array(d).fill(0))
    );
    const clusterSums: number[] = Array(k).fill(0);
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < k; j++) {
        const diff = vectors[i].map((val, dim) => val - means[j][dim]);
        
        for (let dim1 = 0; dim1 < d; dim1++) {
          for (let dim2 = 0; dim2 < d; dim2++) {
            newCovariances[j][dim1][dim2] += responsibilities[i][j] * diff[dim1] * diff[dim2];
          }
        }
        
        clusterSums[j] += responsibilities[i][j];
      }
    }
    
    // 정규화 및 정규성 보장
    for (let j = 0; j < k; j++) {
      if (clusterSums[j] > 0) {
        for (let dim1 = 0; dim1 < d; dim1++) {
          for (let dim2 = 0; dim2 < d; dim2++) {
            newCovariances[j][dim1][dim2] /= clusterSums[j];
          }
        }
        
        // 대각선 요소에 작은 값 추가하여 정규성 보장
        for (let dim = 0; dim < d; dim++) {
          newCovariances[j][dim][dim] += 1e-6;
        }
      }
    }
    
    return newCovariances;
  }
  
  // 가중치 업데이트 (M-step)
  private updateWeights(responsibilities: number[][]): number[] {
    const n = responsibilities.length;
    const k = responsibilities[0].length;
    
    const newWeights: number[] = Array(k).fill(0);
    
    for (let j = 0; j < k; j++) {
      for (let i = 0; i < n; i++) {
        newWeights[j] += responsibilities[i][j];
      }
      newWeights[j] /= n;
    }
    
    return newWeights;
  }
  
  // 로그 우도 계산
  private calculateLogLikelihood(
    vectors: number[][],
    means: number[][],
    covariances: number[][][],
    weights: number[]
  ): number {
    const n = vectors.length;
    let logLikelihood = 0;
    
    for (let i = 0; i < n; i++) {
      let pointLikelihood = 0;
      for (let j = 0; j < means.length; j++) {
        pointLikelihood += weights[j] * this.calculateGaussianProbability(vectors[i], means[j], covariances[j]);
      }
      logLikelihood += Math.log(Math.max(pointLikelihood, 1e-10));
    }
    
    return logLikelihood;
  }
  
  // 클러스터 할당
  private assignToClusters(
    vectors: number[][],
    means: number[][],
    covariances: number[][][],
    weights: number[],
    responsibilities: number[][],
    patents: Patent[],
    k: number
  ): GMMCluster[] {
    const clusters: GMMCluster[] = [];
    
    for (let i = 0; i < k; i++) {
      const clusterPatents: Patent[] = [];
      const probabilities: number[] = [];
      
      // 가장 높은 책임도를 가진 특허들을 할당
      for (let j = 0; j < vectors.length; j++) {
        if (responsibilities[j][i] === Math.max(...responsibilities[j])) {
          clusterPatents.push(patents[j]);
          probabilities.push(responsibilities[j][i]);
        }
      }
      
      clusters.push({
        id: `gmm_cluster_${i}`,
        patents: clusterPatents,
        centroid: means[i],
        covariance: covariances[i],
        weight: weights[i],
        probability: probabilities,
        size: clusterPatents.length
      });
    }
    
    return clusters;
  }
  
  // 헬퍼 메서드들
  private getRandomIndices(n: number, k: number): number[] {
    const indices = Array.from({ length: n }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices.slice(0, k);
  }
  
  private assignToNearestMean(vectors: number[][], means: number[][]): number[] {
    const assignments: number[] = [];
    
    for (const vector of vectors) {
      let minDistance = Infinity;
      let bestCluster = 0;
      
      for (let i = 0; i < means.length; i++) {
        const distance = this.euclideanDistance(vector, means[i]);
        if (distance < minDistance) {
          minDistance = distance;
          bestCluster = i;
        }
      }
      
      assignments.push(bestCluster);
    }
    
    return assignments;
  }
  
  private calculateCovariance(vectors: number[][], mean: number[]): number[][] {
    const n = vectors.length;
    const d = mean.length;
    const covariance = Array(d).fill(0).map(() => Array(d).fill(0));
    
    for (const vector of vectors) {
      for (let i = 0; i < d; i++) {
        for (let j = 0; j < d; j++) {
          covariance[i][j] += (vector[i] - mean[i]) * (vector[j] - mean[j]);
        }
      }
    }
    
    for (let i = 0; i < d; i++) {
      for (let j = 0; j < d; j++) {
        covariance[i][j] /= n;
      }
    }
    
    return covariance;
  }
  
  private calculateDistancesToMeans(vectors: number[][], means: number[][]): number[] {
    return vectors.map(vector => {
      let minDistance = Infinity;
      for (const mean of means) {
        const distance = this.euclideanDistance(vector, mean);
        minDistance = Math.min(minDistance, distance);
      }
      return minDistance;
    });
  }
  
  private calculateSelectionProbabilities(distances: number[]): number[] {
    const totalDistance = distances.reduce((sum, d) => sum + d, 0);
    return distances.map(d => d / totalDistance);
  }
  
  private selectNextCenter(probabilities: number[]): number {
    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < probabilities.length; i++) {
      cumulative += probabilities[i];
      if (random <= cumulative) {
        return i;
      }
    }
    
    return probabilities.length - 1;
  }
  
  private euclideanDistance(vec1: number[], vec2: number[]): number {
    let sum = 0;
    for (let i = 0; i < vec1.length; i++) {
      sum += Math.pow(vec1[i] - vec2[i], 2);
    }
    return Math.sqrt(sum);
  }
  
  // 클러스터 품질 평가
  public evaluateClusterQuality(clusters: GMMCluster[]): {
    bicScore: number;
    aicScore: number;
    logLikelihood: number;
    clusterBalance: number;
  } {
    if (clusters.length === 0) {
      return {
        bicScore: 0,
        aicScore: 0,
        logLikelihood: 0,
        clusterBalance: 0
      };
    }
    
    // 간단한 품질 지표
    const sizes = clusters.map(c => c.size);
    const meanSize = sizes.reduce((sum, size) => sum + size, 0) / sizes.length;
    const variance = sizes.reduce((sum, size) => sum + Math.pow(size - meanSize, 2), 0) / sizes.length;
    
    const clusterBalance = 1 / (1 + variance / meanSize);
    const logLikelihood = clusters.reduce((sum, c) => sum + Math.log(c.weight), 0);
    
    // BIC와 AIC 점수 (간단한 버전)
    const n = clusters.reduce((sum, c) => sum + c.size, 0);
    const k = clusters.length;
    const p = k * (clusters[0]?.centroid.length || 0) * 2 + k - 1; // 파라미터 수
    
    const bicScore = logLikelihood - 0.5 * p * Math.log(n);
    const aicScore = logLikelihood - p;
    
    return {
      bicScore,
      aicScore,
      logLikelihood,
      clusterBalance
    };
  }
}

// 기본 GMM 서비스 인스턴스
export const gmmService = new GMMClusteringService({
  nComponents: 5,
  covarianceType: 'full',
  maxIterations: 100,
  tolerance: 1e-4,
  initMethod: 'kmeans++',
  distanceMetric: 'korean'
});
