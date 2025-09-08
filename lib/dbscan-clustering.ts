// DBSCAN 클러스터링 서비스
import { Patent } from '@/types';
import { koreanTextProcessor } from './korean-text-processor';

// DBSCAN 클러스터 결과
export interface DBSCANCluster {
  id: string;
  patents: Patent[];
  centroid: number[];
  density: number;
  noise: boolean;
  borderPoints: Patent[];
  corePoints: Patent[];
}

// DBSCAN 파라미터
export interface DBSCANParams {
  eps: number;
  minPts: number;
  distanceMetric: 'euclidean' | 'cosine' | 'manhattan' | 'korean';
}

// DBSCAN 클러스터링 서비스
export class DBSCANClusteringService {
  private params: DBSCANParams;
  
  constructor(params: DBSCANParams) {
    this.params = params;
  }
  
  // 메인 클러스터링 실행
  public async performClustering(patents: Patent[]): Promise<DBSCANCluster[]> {
    if (patents.length === 0) return [];
    
    // 1. 특허 텍스트를 벡터로 변환
    const vectors = await this.convertPatentsToVectors(patents);
    
    // 2. 거리 행렬 계산
    const distanceMatrix = this.calculateDistanceMatrix(vectors);
    
    // 3. DBSCAN 실행
    const clusters = this.runDBSCAN(vectors, distanceMatrix, patents);
    
    // 4. 클러스터 정보 계산
    return this.calculateClusterInfo(clusters, vectors, patents);
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
    // 간단한 TF-IDF 스타일 벡터 (실제로는 더 정교한 벡터화 사용)
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
  
  // 거리 행렬 계산
  private calculateDistanceMatrix(vectors: number[][]): number[][] {
    const n = vectors.length;
    const matrix: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
    
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const distance = this.calculateDistance(vectors[i], vectors[j]);
        matrix[i][j] = distance;
        matrix[j][i] = distance;
      }
    }
    
    return matrix;
  }
  
  // 두 벡터 간 거리 계산
  private calculateDistance(vec1: number[], vec2: number[]): number {
    switch (this.params.distanceMetric) {
      case 'euclidean':
        return this.euclideanDistance(vec1, vec2);
      case 'cosine':
        return this.cosineDistance(vec1, vec2);
      case 'manhattan':
        return this.manhattanDistance(vec1, vec2);
      case 'korean':
        return this.koreanDistance(vec1, vec2);
      default:
        return this.euclideanDistance(vec1, vec2);
    }
  }
  
  // 유클리드 거리
  private euclideanDistance(vec1: number[], vec2: number[]): number {
    let sum = 0;
    for (let i = 0; i < vec1.length; i++) {
      sum += Math.pow(vec1[i] - vec2[i], 2);
    }
    return Math.sqrt(sum);
  }
  
  // 코사인 거리
  private cosineDistance(vec1: number[], vec2: number[]): number {
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;
    
    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
      norm1 += vec1[i] * vec1[i];
      norm2 += vec2[i] * vec2[i];
    }
    
    norm1 = Math.sqrt(norm1);
    norm2 = Math.sqrt(norm2);
    
    if (norm1 === 0 || norm2 === 0) return 1;
    
    const cosine = dotProduct / (norm1 * norm2);
    return 1 - cosine; // 거리로 변환
  }
  
  // 맨해튼 거리
  private manhattanDistance(vec1: number[], vec2: number[]): number {
    let sum = 0;
    for (let i = 0; i < vec1.length; i++) {
      sum += Math.abs(vec1[i] - vec2[i]);
    }
    return sum;
  }
  
  // 한국어 특화 거리
  private koreanDistance(vec1: number[], vec2: number[]): number {
    // 코사인 거리 + 한국어 가중치
    const cosineDist = this.cosineDistance(vec1, vec2);
    const koreanWeight = 1.2; // 한국어 텍스트에 대한 가중치
    
    return cosineDist * koreanWeight;
  }
  
  // DBSCAN 알고리즘 실행
  private runDBSCAN(vectors: number[][], distanceMatrix: number[][], patents: Patent[]): Map<number, Patent[]> {
    const n = vectors.length;
    const visited = new Array(n).fill(false);
    const clusters = new Map<number, Patent[]>();
    let clusterId = 0;
    
    // 각 점에 대해
    for (let i = 0; i < n; i++) {
      if (visited[i]) continue;
      
      visited[i] = true;
      const neighbors = this.findNeighbors(i, distanceMatrix);
      
      if (neighbors.length < this.params.minPts) {
        // 노이즈 포인트
        if (!clusters.has(-1)) {
          clusters.set(-1, []);
        }
        clusters.get(-1)!.push(patents[i]);
      } else {
        // 새로운 클러스터 시작
        const cluster = [patents[i]];
        this.expandCluster(i, neighbors, visited, cluster, distanceMatrix, patents);
        
        if (cluster.length >= this.params.minPts) {
          clusters.set(clusterId++, cluster);
        } else {
          // 너무 작은 클러스터는 노이즈로 처리
          if (!clusters.has(-1)) {
            clusters.set(-1, []);
          }
          clusters.get(-1)!.push(...cluster);
        }
      }
    }
    
    return clusters;
  }
  
  // 이웃 점 찾기
  private findNeighbors(pointIndex: number, distanceMatrix: number[][]): number[] {
    const neighbors: number[] = [];
    
    for (let i = 0; i < distanceMatrix.length; i++) {
      if (i !== pointIndex && distanceMatrix[pointIndex][i] <= this.params.eps) {
        neighbors.push(i);
      }
    }
    
    return neighbors;
  }
  
  // 클러스터 확장
  private expandCluster(
    pointIndex: number,
    neighbors: number[],
    visited: boolean[],
    cluster: Patent[],
    distanceMatrix: number[][],
    patents: Patent[]
  ): void {
    for (const neighborIndex of neighbors) {
      if (!visited[neighborIndex]) {
        visited[neighborIndex] = true;
        cluster.push(patents[neighborIndex]);
        
        const newNeighbors = this.findNeighbors(neighborIndex, distanceMatrix);
        if (newNeighbors.length >= this.params.minPts) {
          // 새로운 이웃들을 neighbors에 추가
          for (const newNeighbor of newNeighbors) {
            if (!neighbors.includes(newNeighbor)) {
              neighbors.push(newNeighbor);
            }
          }
        }
      }
    }
  }
  
  // 클러스터 정보 계산
  private calculateClusterInfo(
    clusters: Map<number, Patent[]>,
    vectors: number[][],
    patents: Patent[]
  ): DBSCANCluster[] {
    const result: DBSCANCluster[] = [];
    
    for (const [clusterId, clusterPatents] of clusters) {
      if (clusterId === -1) {
        // 노이즈 클러스터
        result.push({
          id: 'noise',
          patents: clusterPatents,
          centroid: this.calculateCentroid(clusterPatents, vectors, patents),
          density: 0,
          noise: true,
          borderPoints: clusterPatents,
          corePoints: []
        });
      } else {
        // 일반 클러스터
        const centroid = this.calculateCentroid(clusterPatents, vectors, patents);
        const density = this.calculateDensity(clusterPatents, vectors, patents, centroid);
        const { corePoints, borderPoints } = this.classifyPoints(clusterPatents, vectors, patents);
        
        result.push({
          id: `cluster_${clusterId}`,
          patents: clusterPatents,
          centroid,
          density,
          noise: false,
          borderPoints,
          corePoints
        });
      }
    }
    
    return result;
  }
  
  // 클러스터 중심점 계산
  private calculateCentroid(clusterPatents: Patent[], vectors: number[][], patents: Patent[]): number[] {
    if (clusterPatents.length === 0) return [];
    
    const clusterIndices = clusterPatents.map(p => patents.indexOf(p));
    const clusterVectors = clusterIndices.map(i => vectors[i]);
    
    const centroid = new Array(clusterVectors[0].length).fill(0);
    
    for (const vector of clusterVectors) {
      for (let i = 0; i < vector.length; i++) {
        centroid[i] += vector[i];
      }
    }
    
    for (let i = 0; i < centroid.length; i++) {
      centroid[i] /= clusterVectors.length;
    }
    
    return centroid;
  }
  
  // 클러스터 밀도 계산
  private calculateDensity(
    clusterPatents: Patent[], 
    vectors: number[][], 
    patents: Patent[], 
    centroid: number[]
  ): number {
    if (clusterPatents.length === 0) return 0;
    
    const clusterIndices = clusterPatents.map(p => patents.indexOf(p));
    const clusterVectors = clusterIndices.map(i => vectors[i]);
    
    let totalDistance = 0;
    for (const vector of clusterVectors) {
      totalDistance += this.euclideanDistance(vector, centroid);
    }
    
    const avgDistance = totalDistance / clusterVectors.length;
    return 1 / (1 + avgDistance); // 밀도 (거리가 가까울수록 높음)
  }
  
  // 핵심점과 경계점 분류
  private classifyPoints(
    clusterPatents: Patent[], 
    vectors: number[][], 
    patents: Patent[]
  ): { corePoints: Patent[]; borderPoints: Patent[] } {
    const corePoints: Patent[] = [];
    const borderPoints: Patent[] = [];
    
    for (const patent of clusterPatents) {
      const patentIndex = patents.indexOf(patent);
      const neighbors = this.findNeighbors(patentIndex, this.calculateDistanceMatrix(vectors));
      
      if (neighbors.length >= this.params.minPts) {
        corePoints.push(patent);
      } else {
        borderPoints.push(patent);
      }
    }
    
    return { corePoints, borderPoints };
  }
  
  // 클러스터 품질 평가
  public evaluateClusterQuality(clusters: DBSCANCluster[]): {
    silhouetteScore: number;
    calinskiHarabaszScore: number;
    daviesBouldinScore: number;
    noiseRatio: number;
  } {
    if (clusters.length === 0) {
      return {
        silhouetteScore: 0,
        calinskiHarabaszScore: 0,
        daviesBouldinScore: 0,
        noiseRatio: 0
      };
    }
    
    const noiseCluster = clusters.find(c => c.noise);
    const noiseRatio = noiseCluster ? noiseCluster.patents.length / this.getTotalPatents(clusters) : 0;
    
    // 간단한 품질 지표 (실제로는 더 정교한 계산 필요)
    const avgClusterSize = clusters.filter(c => !c.noise).reduce((sum, c) => sum + c.patents.length, 0) / Math.max(1, clusters.filter(c => !c.noise).length);
    const sizeVariance = this.calculateSizeVariance(clusters.filter(c => !c.noise));
    
    const silhouetteScore = Math.max(0, 1 - (sizeVariance / avgClusterSize));
    const calinskiHarabaszScore = Math.max(0, avgClusterSize / (1 + sizeVariance));
    const daviesBouldinScore = Math.max(0, 1 / (1 + avgClusterSize));
    
    return {
      silhouetteScore,
      calinskiHarabaszScore,
      daviesBouldinScore,
      noiseRatio
    };
  }
  
  // 헬퍼 메서드들
  private getTotalPatents(clusters: DBSCANCluster[]): number {
    return clusters.reduce((sum, c) => sum + c.patents.length, 0);
  }
  
  private calculateSizeVariance(clusters: DBSCANCluster[]): number {
    if (clusters.length === 0) return 0;
    
    const sizes = clusters.map(c => c.patents.length);
    const mean = sizes.reduce((sum, size) => sum + size, 0) / sizes.length;
    const variance = sizes.reduce((sum, size) => sum + Math.pow(size - mean, 2), 0) / sizes.length;
    
    return variance;
  }
  
  // 파라미터 최적화
  public optimizeParameters(patents: Patent[]): Promise<DBSCANParams> {
    return new Promise((resolve) => {
      // 간단한 파라미터 최적화 (실제로는 k-distance 그래프 분석 사용)
      const estimatedEps = 0.3;
      const estimatedMinPts = Math.max(3, Math.floor(patents.length * 0.01));
      
      resolve({
        eps: estimatedEps,
        minPts: estimatedMinPts,
        distanceMetric: 'korean'
      });
    });
  }
}

// 기본 DBSCAN 서비스 인스턴스
export const dbscanService = new DBSCANClusteringService({
  eps: 0.3,
  minPts: 5,
  distanceMetric: 'korean'
});
