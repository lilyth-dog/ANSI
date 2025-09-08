// 적응형 클러스터링 시스템
import { Patent } from '@/types';
import { koreanTextProcessor } from './korean-text-processor';

// 데이터 특성 분석 결과
export interface DataCharacteristics {
  size: number;
  dimensionality: number;
  density: number;
  noiseLevel: number;
  clusterShape: 'spherical' | 'elongated' | 'irregular' | 'mixed';
  distribution: 'uniform' | 'clustered' | 'sparse' | 'mixed';
  domainComplexity: 'low' | 'medium' | 'high';
  textSimilarity: number;
  recommendedAlgorithms: string[];
  algorithmWeights: Map<string, number>;
}

// 클러스터링 알고리즘 선택 전략
export interface ClusteringStrategy {
  primaryAlgorithm: string;
  fallbackAlgorithms: string[];
  parameters: Map<string, any>;
  expectedPerformance: {
    accuracy: number;
    speed: number;
    scalability: number;
    interpretability: number;
  };
}

// 적응형 클러스터링 서비스
export class AdaptiveClusteringService {
  private dataAnalyzer: DataAnalyzer;
  private algorithmSelector: AlgorithmSelector;
  private performancePredictor: PerformancePredictor;
  
  constructor() {
    this.dataAnalyzer = new DataAnalyzer();
    this.algorithmSelector = new AlgorithmSelector();
    this.performancePredictor = new PerformancePredictor();
  }
  
  // 메인 클러스터링 실행 (적응형)
  public async performAdaptiveClustering(
    patents: Patent[], 
    targetClusters?: number
  ): Promise<{
    clusters: any[];
    strategy: ClusteringStrategy;
    characteristics: DataCharacteristics;
    performance: any;
  }> {
    // 1. 데이터 특성 분석
    const characteristics = await this.dataAnalyzer.analyzeData(patents);
    
    // 2. 최적 알고리즘 선택
    const strategy = this.algorithmSelector.selectOptimalStrategy(characteristics, targetClusters);
    
    // 3. 성능 예측
    const predictedPerformance = this.performancePredictor.predictPerformance(characteristics, strategy);
    
    // 4. 선택된 알고리즘으로 클러스터링 실행
    const clusters = await this.executeClustering(patents, strategy, targetClusters);
    
    // 5. 실제 성능 측정
    const actualPerformance = await this.measurePerformance(clusters, characteristics);
    
    return {
      clusters,
      strategy,
      characteristics,
      performance: {
        predicted: predictedPerformance,
        actual: actualPerformance
      }
    };
  }
  
  // 선택된 알고리즘 실행
  private async executeClustering(
    patents: Patent[], 
    strategy: ClusteringStrategy, 
    targetClusters?: number
  ): Promise<any[]> {
    const algorithm = strategy.primaryAlgorithm;
    const params = strategy.parameters;
    
    switch (algorithm) {
      case 'kmeans':
        return this.executeKMeans(patents, params, targetClusters);
      case 'dbscan':
        return this.executeDBSCAN(patents, params);
      case 'hierarchical':
        return this.executeHierarchical(patents, params, targetClusters);
      case 'gmm':
        return this.executeGMM(patents, params, targetClusters);
      case 'hybrid':
        return this.executeHybrid(patents, params, targetClusters);
      default:
        throw new Error(`알 수 없는 알고리즘: ${algorithm}`);
    }
  }
  
  // K-means 실행
  private async executeKMeans(patents: Patent[], params: Map<string, any>, k?: number): Promise<any[]> {
    // 기존 K-means 구현 사용
    const { patentClusteringService } = await import('./patent-clustering');
    const result = await patentClusteringService.performClustering(patents, k);
    return result.clusters;
  }
  
  // DBSCAN 실행
  private async executeDBSCAN(patents: Patent[], params: Map<string, any>): Promise<any[]> {
    const { dbscanService } = await import('./dbscan-clustering');
    return await dbscanService.performClustering(patents, params);
  }
  
  // 계층적 클러스터링 실행
  private async executeHierarchical(patents: Patent[], params: Map<string, any>, k?: number): Promise<any[]> {
    const { hierarchicalService } = await import('./hierarchical-clustering');
    return await hierarchicalService.performClustering(patents, params, k);
  }
  
  // GMM 실행
  private async executeGMM(patents: Patent[], params: Map<string, any>, k?: number): Promise<any[]> {
    const { gmmService } = await import('./gmm-clustering');
    return await gmmService.performClustering(patents, params, k);
  }
  
  // 하이브리드 클러스터링 실행
  private async executeHybrid(patents: Patent[], params: Map<string, any>, k?: number): Promise<any[]> {
    const { hybridService } = await import('./hybrid-clustering');
    return await hybridService.performClustering(patents, params, k);
  }
  
  // 성능 측정
  private async measurePerformance(clusters: any[], characteristics: DataCharacteristics): Promise<any> {
    return {
      clusterCount: clusters.length,
      averageClusterSize: clusters.reduce((sum, c) => sum + c.patents.length, 0) / clusters.length,
      clusterQuality: this.calculateClusterQuality(clusters),
      processingTime: Date.now() - characteristics.analysisStartTime
    };
  }
  
  // 클러스터 품질 계산
  private calculateClusterQuality(clusters: any[]): number {
    // 간단한 품질 지표 (실제로는 더 복잡한 메트릭 사용)
    const sizes = clusters.map(c => c.patents.length);
    const meanSize = sizes.reduce((sum, size) => sum + size, 0) / sizes.length;
    const variance = sizes.reduce((sum, size) => sum + Math.pow(size - meanSize, 2), 0) / sizes.length;
    
    // 크기 균등성 (낮을수록 좋음)
    const sizeUniformity = 1 / (1 + variance / meanSize);
    
    return sizeUniformity;
  }
}

// 데이터 특성 분석기
class DataAnalyzer {
  // 데이터 특성 종합 분석
  public async analyzeData(patents: Patent[]): Promise<DataCharacteristics> {
    const startTime = Date.now();
    
    // 기본 특성
    const size = patents.length;
    const dimensionality = await this.analyzeDimensionality(patents);
    const density = this.analyzeDensity(patents);
    const noiseLevel = await this.analyzeNoiseLevel(patents);
    
    // 클러스터 형태 분석
    const clusterShape = await this.analyzeClusterShape(patents);
    const distribution = this.analyzeDistribution(patents);
    
    // 도메인 복잡도
    const domainComplexity = this.analyzeDomainComplexity(patents);
    
    // 텍스트 유사도
    const textSimilarity = await this.analyzeTextSimilarity(patents);
    
    return {
      size,
      dimensionality,
      density,
      noiseLevel,
      clusterShape,
      distribution,
      domainComplexity,
      textSimilarity,
      recommendedAlgorithms: [],
      algorithmWeights: new Map(),
      analysisStartTime: startTime
    };
  }
  
  // 차원성 분석
  private async analyzeDimensionality(patents: Patent[]): Promise<number> {
    const texts = patents.map(p => this.extractPatentText(p));
    const uniqueTerms = new Set<string>();
    
    texts.forEach(text => {
      const morphemes = koreanTextProcessor.analyzeMorphemes(text);
      morphemes.forEach(morpheme => uniqueTerms.add(morpheme));
    });
    
    return uniqueTerms.size;
  }
  
  // 밀도 분석
  private analyzeDensity(patents: Patent[]): number {
    // 간단한 밀도 계산 (실제로는 공간 밀도 계산)
    const totalTextLength = patents.reduce((sum, p) => 
      sum + this.extractPatentText(p).length, 0
    );
    
    return totalTextLength / patents.length;
  }
  
  // 노이즈 레벨 분석
  private async analyzeNoiseLevel(patents: Patent[]): Promise<number> {
    const texts = patents.map(p => this.extractPatentText(p));
    let totalNoise = 0;
    
    texts.forEach(text => {
      const morphemes = koreanTextProcessor.analyzeMorphemes(text);
      const stopWords = morphemes.filter(m => 
        ['은', '는', '이', '가', '을', '를', '의', '에'].includes(m)
      );
      totalNoise += stopWords.length / morphemes.length;
    });
    
    return totalNoise / texts.length;
  }
  
  // 클러스터 형태 분석
  private async analyzeClusterShape(patents: Patent[]): Promise<'spherical' | 'elongated' | 'irregular' | 'mixed'> {
    // 간단한 형태 분석 (실제로는 PCA나 기하학적 분석 사용)
    const texts = patents.map(p => this.extractPatentText(p));
    const similarities = this.calculatePairwiseSimilarities(texts);
    
    const avgSimilarity = similarities.reduce((sum, sim) => sum + sim, 0) / similarities.length;
    
    if (avgSimilarity > 0.7) return 'spherical';
    if (avgSimilarity > 0.4) return 'elongated';
    if (avgSimilarity > 0.2) return 'irregular';
    return 'mixed';
  }
  
  // 분포 분석
  private analyzeDistribution(patents: Patent[]): 'uniform' | 'clustered' | 'sparse' | 'mixed' {
    // 간단한 분포 분석
    const texts = patents.map(p => this.extractPatentText(p));
    const similarities = this.calculatePairwiseSimilarities(texts);
    
    const variance = this.calculateVariance(similarities);
    const mean = similarities.reduce((sum, sim) => sum + sim, 0) / similarities.length;
    
    if (variance < 0.1) return 'uniform';
    if (variance > 0.3) return 'clustered';
    if (mean < 0.3) return 'sparse';
    return 'mixed';
  }
  
  // 도메인 복잡도 분석
  private analyzeDomainComplexity(patents: Patent[]): 'low' | 'medium' | 'high' {
    const texts = patents.map(p => this.extractPatentText(p));
    const domainKeywords = new Map<string, number>();
    
    texts.forEach(text => {
      const domains = koreanTextProcessor.extractDomainKeywords(text);
      domains.forEach((keywords, domain) => {
        domainKeywords.set(domain, (domainKeywords.get(domain) || 0) + keywords.length);
      });
    });
    
    const totalKeywords = Array.from(domainKeywords.values()).reduce((sum, count) => sum + count, 0);
    const uniqueDomains = domainKeywords.size;
    
    if (totalKeywords < 50 && uniqueDomains < 3) return 'low';
    if (totalKeywords < 150 && uniqueDomains < 5) return 'medium';
    return 'high';
  }
  
  // 텍스트 유사도 분석
  private async analyzeTextSimilarity(patents: Patent[]): Promise<number> {
    const texts = patents.map(p => this.extractPatentText(p));
    const similarities = this.calculatePairwiseSimilarities(texts);
    
    return similarities.reduce((sum, sim) => sum + sim, 0) / similarities.length;
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
  
  private calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return variance;
  }
}

// 알고리즘 선택기
class AlgorithmSelector {
  // 최적 알고리즘 선택
  public selectOptimalStrategy(
    characteristics: DataCharacteristics, 
    targetClusters?: number
  ): ClusteringStrategy {
    const algorithmScores = this.calculateAlgorithmScores(characteristics);
    const primaryAlgorithm = this.selectPrimaryAlgorithm(algorithmScores);
    const fallbackAlgorithms = this.selectFallbackAlgorithms(algorithmScores, primaryAlgorithm);
    const parameters = this.optimizeParameters(characteristics, primaryAlgorithm, targetClusters);
    
    return {
      primaryAlgorithm,
      fallbackAlgorithms,
      parameters,
      expectedPerformance: this.predictPerformance(characteristics, primaryAlgorithm)
    };
  }
  
  // 알고리즘별 점수 계산
  private calculateAlgorithmScores(characteristics: DataCharacteristics): Map<string, number> {
    const scores = new Map<string, number>();
    
    // K-means 점수
    scores.set('kmeans', this.calculateKMeansScore(characteristics));
    
    // DBSCAN 점수
    scores.set('dbscan', this.calculateDBSCANScore(characteristics));
    
    // 계층적 클러스터링 점수
    scores.set('hierarchical', this.calculateHierarchicalScore(characteristics));
    
    // GMM 점수
    scores.set('gmm', this.calculateGMMScore(characteristics));
    
    // 하이브리드 점수
    scores.set('hybrid', this.calculateHybridScore(characteristics));
    
    return scores;
  }
  
  // K-means 적합성 점수
  private calculateKMeansScore(characteristics: DataCharacteristics): number {
    let score = 0;
    
    // 크기 적합성
    if (characteristics.size < 1000) score += 0.3;
    else if (characteristics.size < 10000) score += 0.2;
    else score += 0.1;
    
    // 차원 적합성
    if (characteristics.dimensionality < 100) score += 0.2;
    else if (characteristics.dimensionality < 500) score += 0.1;
    
    // 형태 적합성
    if (characteristics.clusterShape === 'spherical') score += 0.3;
    else if (characteristics.clusterShape === 'elongated') score += 0.2;
    else score += 0.1;
    
    // 분포 적합성
    if (characteristics.distribution === 'clustered') score += 0.2;
    else if (characteristics.distribution === 'uniform') score += 0.1;
    
    return Math.min(score, 1.0);
  }
  
  // DBSCAN 적합성 점수
  private calculateDBSCANScore(characteristics: DataCharacteristics): number {
    let score = 0;
    
    // 노이즈 레벨 적합성
    if (characteristics.noiseLevel > 0.3) score += 0.3;
    else if (characteristics.noiseLevel > 0.1) score += 0.2;
    
    // 형태 적합성
    if (characteristics.clusterShape === 'irregular') score += 0.3;
    else if (characteristics.clusterShape === 'mixed') score += 0.2;
    
    // 밀도 적합성
    if (characteristics.density > 0.5) score += 0.2;
    
    // 크기 적합성
    if (characteristics.size < 5000) score += 0.2;
    
    return Math.min(score, 1.0);
  }
  
  // 계층적 클러스터링 적합성 점수
  private calculateHierarchicalScore(characteristics: DataCharacteristics): number {
    let score = 0;
    
    // 크기 적합성 (계층적은 작은 데이터에 적합)
    if (characteristics.size < 500) score += 0.4;
    else if (characteristics.size < 2000) score += 0.2;
    
    // 해석 가능성 요구
    if (characteristics.domainComplexity === 'high') score += 0.3;
    
    // 형태 적합성
    if (characteristics.clusterShape === 'mixed') score += 0.2;
    
    // 차원 적합성
    if (characteristics.dimensionality < 200) score += 0.1;
    
    return Math.min(score, 1.0);
  }
  
  // GMM 적합성 점수
  private calculateGMMScore(characteristics: DataCharacteristics): number {
    let score = 0;
    
    // 확률적 모델링 요구
    if (characteristics.domainComplexity === 'high') score += 0.3;
    
    // 형태 적합성
    if (characteristics.clusterShape === 'spherical') score += 0.3;
    else if (characteristics.clusterShape === 'elongated') score += 0.2;
    
    // 크기 적합성
    if (characteristics.size < 3000) score += 0.2;
    
    // 차원 적합성
    if (characteristics.dimensionality < 300) score += 0.2;
    
    return Math.min(score, 1.0);
  }
  
  // 하이브리드 적합성 점수
  private calculateHybridScore(characteristics: DataCharacteristics): number {
    let score = 0;
    
    // 복잡한 데이터
    if (characteristics.domainComplexity === 'high') score += 0.3;
    if (characteristics.clusterShape === 'mixed') score += 0.2;
    if (characteristics.distribution === 'mixed') score += 0.2;
    
    // 대용량 데이터
    if (characteristics.size > 5000) score += 0.2;
    
    // 높은 차원
    if (characteristics.dimensionality > 500) score += 0.1;
    
    return Math.min(score, 1.0);
  }
  
  // 주요 알고리즘 선택
  private selectPrimaryAlgorithm(scores: Map<string, number>): string {
    let bestAlgorithm = '';
    let bestScore = -1;
    
    scores.forEach((score, algorithm) => {
      if (score > bestScore) {
        bestScore = score;
        bestAlgorithm = algorithm;
      }
    });
    
    return bestAlgorithm;
  }
  
  // 대체 알고리즘 선택
  private selectFallbackAlgorithms(scores: Map<string, number>, primary: string): string[] {
    const sortedAlgorithms = Array.from(scores.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([algorithm]) => algorithm)
      .filter(algorithm => algorithm !== primary);
    
    return sortedAlgorithms.slice(0, 2);
  }
  
  // 파라미터 최적화
  private optimizeParameters(
    characteristics: DataCharacteristics, 
    algorithm: string, 
    targetClusters?: number
  ): Map<string, any> {
    const params = new Map<string, any>();
    
    switch (algorithm) {
      case 'kmeans':
        params.set('k', targetClusters || this.estimateOptimalK(characteristics));
        params.set('initialization', 'kmeans++');
        params.set('maxIterations', Math.min(200, characteristics.size / 10));
        break;
        
      case 'dbscan':
        params.set('eps', this.estimateDBSCANEps(characteristics));
        params.set('minPts', Math.max(3, Math.floor(characteristics.size * 0.01)));
        break;
        
      case 'hierarchical':
        params.set('method', 'ward');
        params.set('distance', 'euclidean');
        params.set('k', targetClusters || this.estimateOptimalK(characteristics));
        break;
        
      case 'gmm':
        params.set('nComponents', targetClusters || this.estimateOptimalK(characteristics));
        params.set('covarianceType', 'full');
        params.set('maxIterations', 100);
        break;
        
      case 'hybrid':
        params.set('primaryAlgorithm', 'kmeans');
        params.set('secondaryAlgorithm', 'dbscan');
        params.set('k', targetClusters || this.estimateOptimalK(characteristics));
        break;
    }
    
    return params;
  }
  
  // 최적 K 추정
  private estimateOptimalK(characteristics: DataCharacteristics): number {
    // 간단한 추정 (실제로는 엘보우 메서드나 실루엣 분석 사용)
    const size = characteristics.size;
    if (size < 100) return Math.max(2, Math.floor(size / 20));
    if (size < 1000) return Math.max(3, Math.floor(size / 100));
    if (size < 10000) return Math.max(5, Math.floor(size / 1000));
    return Math.max(8, Math.floor(size / 5000));
  }
  
  // DBSCAN eps 추정
  private estimateDBSCANEps(characteristics: DataCharacteristics): number {
    // 간단한 추정 (실제로는 k-distance 그래프 분석 사용)
    return 0.1 + (characteristics.noiseLevel * 0.3);
  }
  
  // 성능 예측
  private predictPerformance(
    characteristics: DataCharacteristics, 
    algorithm: string
  ): { accuracy: number; speed: number; scalability: number; interpretability: number } {
    const basePerformance = this.getBasePerformance(algorithm);
    
    // 데이터 특성에 따른 조정
    const sizeAdjustment = this.calculateSizeAdjustment(characteristics.size, algorithm);
    const dimensionAdjustment = this.calculateDimensionAdjustment(characteristics.dimensionality, algorithm);
    
    return {
      accuracy: Math.min(1.0, basePerformance.accuracy * (1 + sizeAdjustment.accuracy) * (1 + dimensionAdjustment.accuracy)),
      speed: Math.max(0.1, basePerformance.speed * (1 + sizeAdjustment.speed) * (1 + dimensionAdjustment.speed)),
      scalability: Math.max(0.1, basePerformance.scalability * (1 + sizeAdjustment.scalability) * (1 + dimensionAdjustment.scalability)),
      interpretability: Math.min(1.0, basePerformance.interpretability * (1 + sizeAdjustment.interpretability) * (1 + dimensionAdjustment.interpretability))
    };
  }
  
  // 기본 성능 지표
  private getBasePerformance(algorithm: string): { accuracy: number; speed: number; scalability: number; interpretability: number } {
    const performances = {
      kmeans: { accuracy: 0.8, speed: 0.9, scalability: 0.8, interpretability: 0.7 },
      dbscan: { accuracy: 0.7, speed: 0.6, scalability: 0.5, interpretability: 0.6 },
      hierarchical: { accuracy: 0.8, speed: 0.4, scalability: 0.3, interpretability: 0.9 },
      gmm: { accuracy: 0.8, speed: 0.5, scalability: 0.4, interpretability: 0.6 },
      hybrid: { accuracy: 0.9, speed: 0.6, scalability: 0.7, interpretability: 0.7 }
    };
    
    return performances[algorithm as keyof typeof performances] || performances.kmeans;
  }
  
  // 크기별 조정 계수
  private calculateSizeAdjustment(size: number, algorithm: string): { accuracy: number; speed: number; scalability: number; interpretability: number } {
    if (size < 100) return { accuracy: 0.1, speed: 0.2, scalability: 0.1, interpretability: 0.1 };
    if (size < 1000) return { accuracy: 0, speed: 0, scalability: 0, interpretability: 0 };
    if (size < 10000) return { accuracy: -0.1, speed: -0.2, scalability: -0.1, interpretability: -0.1 };
    return { accuracy: -0.2, speed: -0.4, scalability: -0.3, interpretability: -0.2 };
  }
  
  // 차원별 조정 계수
  private calculateDimensionAdjustment(dimensions: number, algorithm: string): { accuracy: number; speed: number; scalability: number; interpretability: number } {
    if (dimensions < 100) return { accuracy: 0.1, speed: 0.2, scalability: 0.1, interpretability: 0.1 };
    if (dimensions < 500) return { accuracy: 0, speed: 0, scalability: 0, interpretability: 0 };
    if (dimensions < 1000) return { accuracy: -0.1, speed: -0.3, scalability: -0.2, interpretability: -0.1 };
    return { accuracy: -0.2, speed: -0.5, scalability: -0.4, interpretability: -0.2 };
  }
}

// 성능 예측기
class PerformancePredictor {
  // 성능 예측
  public predictPerformance(
    characteristics: DataCharacteristics, 
    strategy: ClusteringStrategy
  ): any {
    // 실제 구현에서는 더 정교한 예측 모델 사용
    return {
      estimatedTime: this.estimateProcessingTime(characteristics, strategy),
      estimatedMemory: this.estimateMemoryUsage(characteristics, strategy),
      estimatedAccuracy: this.estimateAccuracy(characteristics, strategy)
    };
  }
  
  // 처리 시간 예측
  private estimateProcessingTime(characteristics: DataCharacteristics, strategy: ClusteringStrategy): number {
    const baseTime = this.getBaseProcessingTime(strategy.primaryAlgorithm);
    const sizeFactor = Math.pow(characteristics.size / 1000, 1.5);
    const dimensionFactor = Math.pow(characteristics.dimensionality / 100, 1.2);
    
    return baseTime * sizeFactor * dimensionFactor;
  }
  
  // 메모리 사용량 예측
  private estimateMemoryUsage(characteristics: DataCharacteristics, strategy: ClusteringStrategy): number {
    const baseMemory = this.getBaseMemoryUsage(strategy.primaryAlgorithm);
    const sizeFactor = characteristics.size / 1000;
    const dimensionFactor = characteristics.dimensionality / 100;
    
    return baseMemory * sizeFactor * dimensionFactor;
  }
  
  // 정확도 예측
  private estimateAccuracy(characteristics: DataCharacteristics, strategy: ClusteringStrategy): number {
    const baseAccuracy = this.getBaseAccuracy(strategy.primaryAlgorithm);
    const noisePenalty = characteristics.noiseLevel * 0.3;
    const complexityBonus = characteristics.domainComplexity === 'high' ? 0.1 : 0;
    
    return Math.max(0.1, Math.min(1.0, baseAccuracy - noisePenalty + complexityBonus));
  }
  
  // 기본 처리 시간 (ms)
  private getBaseProcessingTime(algorithm: string): number {
    const times = {
      kmeans: 100,
      dbscan: 200,
      hierarchical: 500,
      gmm: 300,
      hybrid: 400
    };
    
    return times[algorithm as keyof typeof times] || times.kmeans;
  }
  
  // 기본 메모리 사용량 (MB)
  private getBaseMemoryUsage(algorithm: string): number {
    const memories = {
      kmeans: 50,
      dbscan: 80,
      hierarchical: 120,
      gmm: 100,
      hybrid: 150
    };
    
    return memories[algorithm as keyof typeof memories] || memories.kmeans;
  }
  
  // 기본 정확도
  private getBaseAccuracy(algorithm: string): number {
    const accuracies = {
      kmeans: 0.8,
      dbscan: 0.7,
      hierarchical: 0.8,
      gmm: 0.8,
      hybrid: 0.9
    };
    
    return accuracies[algorithm as keyof typeof accuracies] || accuracies.kmeans;
  }
}

// 싱글톤 인스턴스
export const adaptiveClusteringService = new AdaptiveClusteringService();
