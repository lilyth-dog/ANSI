// 하이브리드 클러스터링 서비스
import { Patent } from '@/types';
import { koreanTextProcessor } from './korean-text-processor';

// 하이브리드 클러스터 결과
export interface HybridCluster {
  id: string;
  patents: Patent[];
  centroid: number[];
  algorithm: string;
  confidence: number;
  subClusters: any[];
  size: number;
  metadata: Map<string, any>;
}

// 하이브리드 클러스터링 파라미터
export interface HybridParams {
  primaryAlgorithm: string;
  secondaryAlgorithm: string;
  fusionMethod: 'ensemble' | 'cascade' | 'adaptive' | 'weighted';
  confidenceThreshold: number;
  maxIterations: number;
  distanceMetric: 'euclidean' | 'cosine' | 'manhattan' | 'korean';
  ensembleSize: number;
}

// 알고리즘 결과
interface AlgorithmResult {
  algorithm: string;
  clusters: any[];
  quality: number;
  confidence: number;
  executionTime: number;
}

// 하이브리드 클러스터링 서비스
export class HybridClusteringService {
  private params: HybridParams;
  
  constructor(params: HybridParams) {
    this.params = params;
  }
  
  // 메인 클러스터링 실행
  public async performClustering(
    patents: Patent[], 
    targetClusters?: number
  ): Promise<HybridCluster[]> {
    if (patents.length === 0) return [];
    
    const startTime = Date.now();
    
    // 1. 데이터 특성 분석
    const characteristics = await this.analyzeDataCharacteristics(patents);
    
    // 2. 알고리즘 선택 및 실행
    const algorithmResults = await this.runMultipleAlgorithms(patents, targetClusters, characteristics);
    
    // 3. 결과 융합
    const fusedClusters = this.fuseResults(algorithmResults, patents, targetClusters);
    
    // 4. 품질 평가 및 최적화
    const optimizedClusters = this.optimizeClusters(fusedClusters, algorithmResults);
    
    const executionTime = Date.now() - startTime;
    
    console.log(`하이브리드 클러스터링 완료: ${executionTime}ms`);
    
    return optimizedClusters;
  }
  
  // 데이터 특성 분석
  private async analyzeDataCharacteristics(patents: Patent[]): Promise<any> {
    const size = patents.length;
    const texts = patents.map(p => this.extractPatentText(p));
    
    // 차원성 분석
    const uniqueTerms = new Set<string>();
    texts.forEach(text => {
      const morphemes = koreanTextProcessor.analyzeMorphemes(text);
      morphemes.forEach(morpheme => uniqueTerms.add(morpheme));
    });
    
    const dimensionality = uniqueTerms.size;
    
    // 밀도 분석
    const totalTextLength = texts.reduce((sum, text) => sum + text.length, 0);
    const density = totalTextLength / size;
    
    // 노이즈 레벨 분석
    let totalNoise = 0;
    texts.forEach(text => {
      const morphemes = koreanTextProcessor.analyzeMorphemes(text);
      const stopWords = morphemes.filter(m => 
        ['은', '는', '이', '가', '을', '를', '의', '에'].includes(m)
      );
      totalNoise += stopWords.length / morphemes.length;
    });
    const noiseLevel = totalNoise / texts.length;
    
    // 텍스트 유사도 분석
    const similarities = this.calculatePairwiseSimilarities(texts);
    const avgSimilarity = similarities.reduce((sum, sim) => sum + sim, 0) / similarities.length;
    
    return {
      size,
      dimensionality,
      density,
      noiseLevel,
      avgSimilarity,
      complexity: this.calculateComplexity(size, dimensionality, noiseLevel)
    };
  }
  
  // 복잡도 계산
  private calculateComplexity(size: number, dimensionality: number, noiseLevel: number): 'low' | 'medium' | 'high' {
    const sizeScore = size < 1000 ? 1 : size < 10000 ? 2 : 3;
    const dimensionScore = dimensionality < 100 ? 1 : dimensionality < 500 ? 2 : 3;
    const noiseScore = noiseLevel < 0.2 ? 1 : noiseLevel < 0.5 ? 2 : 3;
    
    const totalScore = sizeScore + dimensionScore + noiseScore;
    
    if (totalScore <= 4) return 'low';
    if (totalScore <= 7) return 'medium';
    return 'high';
  }
  
  // 여러 알고리즘 실행
  private async runMultipleAlgorithms(
    patents: Patent[], 
    targetClusters?: number, 
    characteristics?: any
  ): Promise<AlgorithmResult[]> {
    const results: AlgorithmResult[] = [];
    const algorithms = this.selectAlgorithms(characteristics);
    
    for (const algorithm of algorithms) {
      try {
        const startTime = Date.now();
        const clusters = await this.executeAlgorithm(algorithm, patents, targetClusters);
        const executionTime = Date.now() - startTime;
        
        const quality = this.evaluateAlgorithmQuality(clusters, characteristics);
        const confidence = this.calculateConfidence(clusters, characteristics);
        
        results.push({
          algorithm,
          clusters,
          quality,
          confidence,
          executionTime
        });
        
        console.log(`${algorithm} 완료: 품질=${quality.toFixed(3)}, 신뢰도=${confidence.toFixed(3)}, 시간=${executionTime}ms`);
      } catch (error) {
        console.error(`${algorithm} 실행 실패:`, error);
      }
    }
    
    return results;
  }
  
  // 알고리즘 선택
  private selectAlgorithms(characteristics?: any): string[] {
    const algorithms = [this.params.primaryAlgorithm, this.params.secondaryAlgorithm];
    
    // 데이터 특성에 따른 추가 알고리즘 선택
    if (characteristics?.complexity === 'high') {
      algorithms.push('ensemble');
    }
    
    if (characteristics?.size > 5000) {
      algorithms.push('batch');
    }
    
    // 중복 제거
    return [...new Set(algorithms)];
  }
  
  // 알고리즘 실행
  private async executeAlgorithm(algorithm: string, patents: Patent[], targetClusters?: number): Promise<any[]> {
    switch (algorithm) {
      case 'kmeans':
        const { patentClusteringService } = await import('./patent-clustering');
        const kmeansResult = await patentClusteringService.performClustering(patents, targetClusters);
        return kmeansResult.clusters;
        
      case 'dbscan':
        const { dbscanService } = await import('./dbscan-clustering');
        return await dbscanService.performClustering(patents);
        
      case 'hierarchical':
        const { hierarchicalService } = await import('./hierarchical-clustering');
        return await hierarchicalService.performClustering(patents, targetClusters);
        
      case 'gmm':
        const { gmmService } = await import('./gmm-clustering');
        return await gmmService.performClustering(patents, targetClusters);
        
      case 'ensemble':
        return await this.runEnsembleClustering(patents, targetClusters);
        
      case 'batch':
        return await this.runBatchClustering(patents, targetClusters);
        
      default:
        throw new Error(`알 수 없는 알고리즘: ${algorithm}`);
    }
  }
  
  // 앙상블 클러스터링 실행
  private async runEnsembleClustering(patents: Patent[], targetClusters?: number): Promise<any[]> {
    const ensembleSize = this.params.ensembleSize;
    const ensembleResults: any[] = [];
    
    // 여러 번의 K-means 실행
    for (let i = 0; i < ensembleSize; i++) {
      try {
        const { patentClusteringService } = await import('./patent-clustering');
        const result = await patentClusteringService.performClustering(patents, targetClusters);
        ensembleResults.push(result.clusters);
      } catch (error) {
        console.error(`앙상블 ${i} 실행 실패:`, error);
      }
    }
    
    // 앙상블 결과 융합
    return this.fuseEnsembleResults(ensembleResults, patents);
  }
  
  // 배치 클러스터링 실행
  private async runBatchClustering(patents: Patent[], targetClusters?: number): Promise<any[]> {
    const batchSize = 1000;
    const batches: Patent[][] = [];
    
    // 데이터를 배치로 분할
    for (let i = 0; i < patents.length; i += batchSize) {
      batches.push(patents.slice(i, i + batchSize));
    }
    
    const batchResults: any[] = [];
    
    // 각 배치에 대해 클러스터링 실행
    for (const batch of batches) {
      try {
        const { patentClusteringService } = await import('./patent-clustering');
        const result = await patentClusteringService.performClustering(batch, Math.floor(targetClusters! / batches.length));
        batchResults.push(result.clusters);
      } catch (error) {
        console.error('배치 클러스터링 실패:', error);
      }
    }
    
    // 배치 결과 융합
    return this.fuseBatchResults(batchResults, patents, targetClusters);
  }
  
  // 앙상블 결과 융합
  private fuseEnsembleResults(ensembleResults: any[][], patents: Patent[]): any[] {
    if (ensembleResults.length === 0) return [];
    
    // 각 특허에 대한 클러스터 할당 빈도 계산
    const assignmentCounts = new Map<number, Map<number, number>>();
    
    ensembleResults.forEach((clusters, ensembleIndex) => {
      clusters.forEach((cluster, clusterIndex) => {
        cluster.patents.forEach((patent: Patent) => {
          const patentIndex = patents.indexOf(patent);
          if (patentIndex !== -1) {
            if (!assignmentCounts.has(patentIndex)) {
              assignmentCounts.set(patentIndex, new Map());
            }
            const counts = assignmentCounts.get(patentIndex)!;
            counts.set(clusterIndex, (counts.get(clusterIndex) || 0) + 1);
          }
        });
      });
    });
    
    // 가장 빈번한 할당을 기반으로 최종 클러스터 생성
    const finalClusters: any[] = [];
    const usedPatents = new Set<number>();
    
    assignmentCounts.forEach((counts, patentIndex) => {
      if (usedPatents.has(patentIndex)) return;
      
      const maxCluster = Array.from(counts.entries()).reduce((a, b) => a[1] > b[1] ? a : b)[0];
      
      // 해당 클러스터에 할당된 특허들 찾기
      const clusterPatents: Patent[] = [];
      assignmentCounts.forEach((counts2, patentIndex2) => {
        if (counts2.get(maxCluster) === Math.max(...Array.from(counts2.values()))) {
          clusterPatents.push(patents[patentIndex2]);
          usedPatents.add(patentIndex2);
        }
      });
      
      if (clusterPatents.length > 0) {
        finalClusters.push({
          id: `ensemble_cluster_${finalClusters.length}`,
          patents: clusterPatents,
          centroid: this.calculateCentroid(clusterPatents),
          size: clusterPatents.length
        });
      }
    });
    
    return finalClusters;
  }
  
  // 배치 결과 융합
  private fuseBatchResults(batchResults: any[][], patents: Patent[], targetClusters?: number): any[] {
    if (batchResults.length === 0) return [];
    
    // 모든 배치 결과를 하나로 합치기
    const allClusters = batchResults.flat();
    
    // 유사한 클러스터들을 병합
    const mergedClusters = this.mergeSimilarClusters(allClusters, targetClusters);
    
    return mergedClusters;
  }
  
  // 유사한 클러스터 병합
  private mergeSimilarClusters(clusters: any[], targetClusters?: number): any[] {
    if (clusters.length <= (targetClusters || 1)) return clusters;
    
    const merged: any[] = [];
    const used = new Set<number>();
    
    for (let i = 0; i < clusters.length; i++) {
      if (used.has(i)) continue;
      
      const currentCluster = clusters[i];
      const similarClusters = [currentCluster];
      used.add(i);
      
      // 유사한 클러스터 찾기
      for (let j = i + 1; j < clusters.length; j++) {
        if (used.has(j)) continue;
        
        const similarity = this.calculateClusterSimilarity(currentCluster, clusters[j]);
        if (similarity > 0.7) { // 유사도 임계값
          similarClusters.push(clusters[j]);
          used.add(j);
        }
      }
      
      // 유사한 클러스터들을 병합
      const mergedCluster = this.mergeClusters(similarClusters);
      merged.push(mergedCluster);
    }
    
    return merged;
  }
  
  // 클러스터 유사도 계산
  private calculateClusterSimilarity(cluster1: any, cluster2: any): number {
    const patents1 = new Set(cluster1.patents.map((p: Patent) => p.id || p.title));
    const patents2 = new Set(cluster2.patents.map((p: Patent) => p.id || p.title));
    
    const intersection = new Set([...patents1].filter(x => patents2.has(x)));
    const union = new Set([...patents1, ...patents2]);
    
    return intersection.size / union.size;
  }
  
  // 클러스터 병합
  private mergeClusters(clusters: any[]): any {
    const allPatents = clusters.flatMap((c: any) => c.patents);
    const centroid = this.calculateCentroid(allPatents);
    
    return {
      id: `merged_cluster_${Date.now()}`,
      patents: allPatents,
      centroid,
      size: allPatents.length,
      subClusters: clusters
    };
  }
  
  // 결과 융합
  private fuseResults(
    algorithmResults: AlgorithmResult[], 
    patents: Patent[], 
    targetClusters?: number
  ): HybridCluster[] {
    if (algorithmResults.length === 0) return [];
    
    switch (this.params.fusionMethod) {
      case 'ensemble':
        return this.fuseEnsemble(algorithmResults, patents, targetClusters);
      case 'cascade':
        return this.fuseCascade(algorithmResults, patents, targetClusters);
      case 'adaptive':
        return this.fuseAdaptive(algorithmResults, patents, targetClusters);
      case 'weighted':
        return this.fuseWeighted(algorithmResults, patents, targetClusters);
      default:
        return this.fuseWeighted(algorithmResults, patents, targetClusters);
    }
  }
  
  // 앙상블 융합
  private fuseEnsemble(algorithmResults: AlgorithmResult[], patents: Patent[], targetClusters?: number): HybridCluster[] {
    // 모든 알고리즘의 결과를 수집
    const allAssignments = new Map<number, Map<string, number>>();
    
    algorithmResults.forEach(result => {
      result.clusters.forEach((cluster, clusterIndex) => {
        cluster.patents.forEach((patent: Patent) => {
          const patentIndex = patents.indexOf(patent);
          if (patentIndex !== -1) {
            if (!allAssignments.has(patentIndex)) {
              allAssignments.set(patentIndex, new Map());
            }
            const assignments = allAssignments.get(patentIndex)!;
            const key = `${result.algorithm}_${clusterIndex}`;
            assignments.set(key, (assignments.get(key) || 0) + result.confidence);
          }
        });
      });
    });
    
    // 가장 높은 신뢰도를 가진 할당을 기반으로 클러스터 생성
    return this.createClustersFromAssignments(allAssignments, patents, algorithmResults);
  }
  
  // 캐스케이드 융합
  private fuseCascade(algorithmResults: AlgorithmResult[], patents: Patent[], targetClusters?: number): HybridCluster[] {
    // 품질 순으로 정렬
    const sortedResults = algorithmResults.sort((a, b) => b.quality - a.quality);
    
    // 가장 좋은 결과를 기본으로 사용
    const primaryResult = sortedResults[0];
    const primaryClusters = primaryResult.clusters;
    
    // 다른 알고리즘의 결과로 보완
    const enhancedClusters = this.enhanceWithSecondaryResults(primaryClusters, sortedResults.slice(1), patents);
    
    return this.convertToHybridClusters(enhancedClusters, primaryResult.algorithm, primaryResult.confidence);
  }
  
  // 적응형 융합
  private fuseAdaptive(algorithmResults: AlgorithmResult[], patents: Patent[], targetClusters?: number): HybridCluster[] {
    // 데이터 특성에 따라 융합 방법 선택
    const characteristics = this.analyzeDataCharacteristics(patents);
    
    if (characteristics.complexity === 'high') {
      return this.fuseEnsemble(algorithmResults, patents, targetClusters);
    } else if (characteristics.size > 5000) {
      return this.fuseCascade(algorithmResults, patents, targetClusters);
    } else {
      return this.fuseWeighted(algorithmResults, patents, targetClusters);
    }
  }
  
  // 가중치 융합
  private fuseWeighted(algorithmResults: AlgorithmResult[], patents: Patent[], targetClusters?: number): HybridCluster[] {
    // 신뢰도 기반 가중치 계산
    const totalConfidence = algorithmResults.reduce((sum, r) => sum + r.confidence, 0);
    const weights = algorithmResults.map(r => r.confidence / totalConfidence);
    
    // 가중 평균 기반 클러스터 생성
    const weightedClusters = this.createWeightedClusters(algorithmResults, weights, patents);
    
    return this.convertToHybridClusters(weightedClusters, 'weighted', 
      algorithmResults.reduce((sum, r) => sum + r.confidence, 0) / algorithmResults.length);
  }
  
  // 보조 결과로 보완
  private enhanceWithSecondaryResults(
    primaryClusters: any[], 
    secondaryResults: AlgorithmResult[], 
    patents: Patent[]
  ): any[] {
    const enhanced = [...primaryClusters];
    
    secondaryResults.forEach(result => {
      result.clusters.forEach(secondaryCluster => {
        // 1차 클러스터와 유사한 보조 클러스터 찾기
        const bestMatch = this.findBestMatchingCluster(secondaryCluster, enhanced);
        
        if (bestMatch) {
          // 유사한 특허들을 추가
          const newPatents = secondaryCluster.patents.filter((p: Patent) => 
            !bestMatch.patents.some((existing: Patent) => 
              existing.id === p.id || existing.title === p.title
            )
          );
          
          bestMatch.patents.push(...newPatents);
          bestMatch.size = bestMatch.patents.length;
        }
      });
    });
    
    return enhanced;
  }
  
  // 최적 매칭 클러스터 찾기
  private findBestMatchingCluster(targetCluster: any, existingClusters: any[]): any | null {
    let bestMatch: any = null;
    let bestSimilarity = 0;
    
    existingClusters.forEach(cluster => {
      const similarity = this.calculateClusterSimilarity(targetCluster, cluster);
      if (similarity > bestSimilarity && similarity > 0.3) {
        bestSimilarity = similarity;
        bestMatch = cluster;
      }
    });
    
    return bestMatch;
  }
  
  // 가중 클러스터 생성
  private createWeightedClusters(
    algorithmResults: AlgorithmResult[], 
    weights: number[], 
    patents: Patent[]
  ): any[] {
    // 간단한 가중 평균 기반 클러스터 생성
    const weightedClusters: any[] = [];
    
    // 각 알고리즘의 결과를 가중치로 조합
    algorithmResults.forEach((result, index) => {
      const weight = weights[index];
      
      result.clusters.forEach((cluster, clusterIndex) => {
        const weightedCluster = {
          ...cluster,
          id: `weighted_${result.algorithm}_${clusterIndex}`,
          weight,
          algorithm: result.algorithm
        };
        
        weightedClusters.push(weightedCluster);
      });
    });
    
    return weightedClusters;
  }
  
  // 할당에서 클러스터 생성
  private createClustersFromAssignments(
    assignments: Map<number, Map<string, number>>, 
    patents: Patent[], 
    algorithmResults: AlgorithmResult[]
  ): HybridCluster[] {
    const clusters: HybridCluster[] = [];
    const usedPatents = new Set<number>();
    
    assignments.forEach((clusterAssignments, patentIndex) => {
      if (usedPatents.has(patentIndex)) return;
      
      // 가장 높은 신뢰도를 가진 클러스터 찾기
      const bestAssignment = Array.from(clusterAssignments.entries())
        .reduce((a, b) => a[1] > b[1] ? a : b);
      
      const [clusterKey, confidence] = bestAssignment;
      const [algorithm, clusterIndex] = clusterKey.split('_');
      
      // 해당 클러스터에 할당된 특허들 찾기
      const clusterPatents: Patent[] = [];
      assignments.forEach((assignments2, patentIndex2) => {
        if (assignments2.get(clusterKey) === confidence) {
          clusterPatents.push(patents[patentIndex2]);
          usedPatents.add(patentIndex2);
        }
      });
      
      if (clusterPatents.length > 0) {
        const algorithmResult = algorithmResults.find(r => r.algorithm === algorithm);
        
        clusters.push({
          id: `hybrid_${algorithm}_${clusterIndex}`,
          patents: clusterPatents,
          centroid: this.calculateCentroid(clusterPatents),
          algorithm,
          confidence: algorithmResult?.confidence || confidence,
          subClusters: [],
          size: clusterPatents.length,
          metadata: new Map([
            ['fusionMethod', 'ensemble'],
            ['primaryAlgorithm', algorithm],
            ['confidence', confidence]
          ])
        });
      }
    });
    
    return clusters;
  }
  
  // 하이브리드 클러스터로 변환
  private convertToHybridClusters(clusters: any[], algorithm: string, confidence: number): HybridCluster[] {
    return clusters.map((cluster, index) => ({
      id: `hybrid_${algorithm}_${index}`,
      patents: cluster.patents,
      centroid: cluster.centroid,
      algorithm,
      confidence,
      subClusters: cluster.subClusters || [],
      size: cluster.size,
      metadata: new Map([
        ['fusionMethod', 'cascade'],
        ['primaryAlgorithm', algorithm],
        ['confidence', confidence]
      ])
    }));
  }
  
  // 클러스터 최적화
  private optimizeClusters(clusters: HybridCluster[], algorithmResults: AlgorithmResult[]): HybridCluster[] {
    // 품질이 낮은 클러스터 제거
    const qualityThreshold = this.params.confidenceThreshold;
    const filteredClusters = clusters.filter(c => c.confidence >= qualityThreshold);
    
    // 너무 작은 클러스터 병합
    const minSize = 3;
    const smallClusters = filteredClusters.filter(c => c.size < minSize);
    const largeClusters = filteredClusters.filter(c => c.size >= minSize);
    
    if (smallClusters.length > 0) {
      // 작은 클러스터들을 가장 유사한 큰 클러스터에 병합
      smallClusters.forEach(smallCluster => {
        const bestMatch = this.findBestMatchingCluster(smallCluster, largeClusters);
        if (bestMatch) {
          bestMatch.patents.push(...smallCluster.patents);
          bestMatch.size = bestMatch.patents.length;
        }
      });
    }
    
    return largeClusters;
  }
  
  // 알고리즘 품질 평가
  private evaluateAlgorithmQuality(clusters: any[], characteristics?: any): number {
    if (clusters.length === 0) return 0;
    
    // 간단한 품질 지표
    const sizes = clusters.map(c => c.patents?.length || c.size || 0);
    const meanSize = sizes.reduce((sum, size) => sum + size, 0) / sizes.length;
    const variance = sizes.reduce((sum, size) => sum + Math.pow(size - meanSize, 2), 0) / sizes.length;
    
    // 크기 균등성
    const sizeUniformity = 1 / (1 + variance / meanSize);
    
    // 클러스터 수 적절성
    const optimalClusters = characteristics?.size < 1000 ? 3 : characteristics?.size < 10000 ? 5 : 8;
    const clusterCountScore = 1 / (1 + Math.abs(clusters.length - optimalClusters));
    
    return (sizeUniformity + clusterCountScore) / 2;
  }
  
  // 신뢰도 계산
  private calculateConfidence(clusters: any[], characteristics?: any): number {
    if (clusters.length === 0) return 0;
    
    // 데이터 특성에 따른 신뢰도 조정
    let baseConfidence = 0.7;
    
    if (characteristics?.complexity === 'low') baseConfidence += 0.1;
    if (characteristics?.complexity === 'high') baseConfidence -= 0.1;
    
    if (characteristics?.size < 1000) baseConfidence += 0.1;
    if (characteristics?.size > 10000) baseConfidence -= 0.1;
    
    return Math.max(0.1, Math.min(1.0, baseConfidence));
  }
  
  // 헬퍼 메서드들
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
  
  private calculatePairwiseSimilarities(texts: string[]): number[] {
    const similarities: number[] = [];
    
    for (let i = 0; i < texts.length; i++) {
      for (let j = i + 1; j < texts.length; j++) {
        const similarity = koreanTextProcessor.calculateKoreanSimilarity(texts[i], texts[j]);
        similarities.push(similarity);
      }
    }
    
    return similarities;
  }
  
  private calculateCentroid(patents: Patent[]): number[] {
    if (patents.length === 0) return [];
    
    // 간단한 중심점 계산 (실제로는 벡터 기반 계산 필요)
    return [0, 0, 0]; // 플레이스홀더
  }
}

// 기본 하이브리드 클러스터링 서비스 인스턴스
export const hybridService = new HybridClusteringService({
  primaryAlgorithm: 'kmeans',
  secondaryAlgorithm: 'dbscan',
  fusionMethod: 'adaptive',
  confidenceThreshold: 0.6,
  maxIterations: 100,
  distanceMetric: 'korean',
  ensembleSize: 5
});
