// 계층적 클러스터링 서비스
import { Patent } from '@/types';
import { koreanTextProcessor } from './korean-text-processor';

// 계층적 클러스터 결과
export interface HierarchicalCluster {
  id: string;
  patents: Patent[];
  centroid: number[];
  children: HierarchicalCluster[];
  parent: HierarchicalCluster | null;
  level: number;
  distance: number;
  size: number;
}

// 계층적 클러스터링 파라미터
export interface HierarchicalParams {
  method: 'single' | 'complete' | 'average' | 'ward' | 'centroid';
  distance: 'euclidean' | 'cosine' | 'manhattan' | 'korean';
  linkage: 'nearest' | 'furthest' | 'average';
  maxClusters?: number;
}

// 거리 행렬 요소
interface DistanceElement {
  i: number;
  j: number;
  distance: number;
}

// 계층적 클러스터링 서비스
export class HierarchicalClusteringService {
  private params: HierarchicalParams;
  
  constructor(params: HierarchicalParams) {
    this.params = params;
  }
  
  // 메인 클러스터링 실행
  public async performClustering(
    patents: Patent[], 
    targetClusters?: number
  ): Promise<HierarchicalCluster[]> {
    if (patents.length === 0) return [];
    
    // 1. 특허 텍스트를 벡터로 변환
    const vectors = await this.convertPatentsToVectors(patents);
    
    // 2. 거리 행렬 계산
    const distanceMatrix = this.calculateDistanceMatrix(vectors);
    
    // 3. 계층적 클러스터링 실행
    const dendrogram = this.buildDendrogram(vectors, distanceMatrix, patents);
    
    // 4. 목표 클러스터 수에 맞게 자르기
    const clusters = this.cutDendrogram(dendrogram, targetClusters || this.estimateOptimalClusters(patents.length));
    
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
    switch (this.params.distance) {
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
      sum += Math.pow(vec1[i] - vec2[i], 0);
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
    return 1 - cosine;
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
    const cosineDist = this.cosineDistance(vec1, vec2);
    const koreanWeight = 1.2;
    return cosineDist * koreanWeight;
  }
  
  // 덴드로그램 구축
  private buildDendrogram(
    vectors: number[][], 
    distanceMatrix: number[][], 
    patents: Patent[]
  ): HierarchicalCluster {
    const n = vectors.length;
    
    // 초기 클러스터 (각 점을 개별 클러스터로)
    const clusters: HierarchicalCluster[] = [];
    for (let i = 0; i < n; i++) {
      clusters.push({
        id: `cluster_${i}`,
        patents: [patents[i]],
        centroid: vectors[i],
        children: [],
        parent: null,
        level: 0,
        distance: 0,
        size: 1
      });
    }
    
    // 거리 행렬을 1차원 배열로 변환
    const distances: DistanceElement[] = [];
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        distances.push({
          i,
          j,
          distance: distanceMatrix[i][j]
        });
      }
    }
    
    // 거리 순으로 정렬
    distances.sort((a, b) => a.distance - b.distance);
    
    // 계층적 클러스터링 실행
    let currentLevel = 1;
    while (clusters.length > 1) {
      // 가장 가까운 두 클러스터 찾기
      const minDistance = distances[0];
      let cluster1Index = -1;
      let cluster2Index = -1;
      
      // 해당 거리를 가진 클러스터 쌍 찾기
      for (let i = 0; i < clusters.length; i++) {
        for (let j = i + 1; j < clusters.length; j++) {
          const cluster1 = clusters[i];
          const cluster2 = clusters[j];
          
          // 두 클러스터 간의 최소 거리 계산
          let minDist = Infinity;
          for (const patent1 of cluster1.patents) {
            for (const patent2 of cluster2.patents) {
              const idx1 = patents.indexOf(patent1);
              const idx2 = patents.indexOf(patent2);
              if (idx1 !== -1 && idx2 !== -1) {
                minDist = Math.min(minDist, distanceMatrix[idx1][idx2]);
              }
            }
          }
          
          if (Math.abs(minDist - minDistance.distance) < 1e-10) {
            cluster1Index = i;
            cluster2Index = j;
            break;
          }
        }
        if (cluster1Index !== -1) break;
      }
      
      if (cluster1Index === -1 || cluster2Index === -1) {
        // 더 이상 병합할 수 없음
        break;
      }
      
      // 두 클러스터 병합
      const cluster1 = clusters[cluster1Index];
      const cluster2 = clusters[cluster2Index];
      
      const mergedCluster: HierarchicalCluster = {
        id: `cluster_${currentLevel}`,
        patents: [...cluster1.patents, ...cluster2.patents],
        centroid: this.calculateCentroid([cluster1, cluster2]),
        children: [cluster1, cluster2],
        parent: null,
        level: currentLevel,
        distance: minDistance.distance,
        size: cluster1.size + cluster2.size
      };
      
      // 부모-자식 관계 설정
      cluster1.parent = mergedCluster;
      cluster2.parent = mergedCluster;
      
      // 기존 클러스터 제거하고 병합된 클러스터 추가
      clusters.splice(Math.max(cluster1Index, cluster2Index), 1);
      clusters.splice(Math.min(cluster1Index, cluster2Index), 1);
      clusters.push(mergedCluster);
      
      // 거리 행렬 업데이트 (간단한 버전)
      this.updateDistanceMatrix(distances, cluster1Index, cluster2Index, clusters.length - 1);
      
      currentLevel++;
    }
    
    return clusters[0];
  }
  
  // 클러스터 중심점 계산
  private calculateCentroid(clusters: HierarchicalCluster[]): number[] {
    if (clusters.length === 0) return [];
    
    const allVectors = clusters.flatMap(c => c.centroid);
    const vectorSize = allVectors[0]?.length || 0;
    
    if (vectorSize === 0) return [];
    
    const centroid = new Array(vectorSize).fill(0);
    
    for (const vector of allVectors) {
      for (let i = 0; i < vector.length; i++) {
        centroid[i] += vector[i];
      }
    }
    
    for (let i = 0; i < centroid.length; i++) {
      centroid[i] /= allVectors.length;
    }
    
    return centroid;
  }
  
  // 거리 행렬 업데이트 (간단한 버전)
  private updateDistanceMatrix(
    distances: DistanceElement[], 
    index1: number, 
    index2: number, 
    newIndex: number
  ): void {
    // 실제 구현에서는 더 정교한 거리 업데이트 필요
    // 여기서는 간단히 처리
    distances.splice(0, 1); // 가장 작은 거리 제거
  }
  
  // 덴드로그램을 목표 클러스터 수에 맞게 자르기
  private cutDendrogram(
    dendrogram: HierarchicalCluster, 
    targetClusters: number
  ): HierarchicalCluster[] {
    const clusters: HierarchicalCluster[] = [];
    
    // 목표 클러스터 수에 도달할 때까지 분할
    this.splitCluster(dendrogram, targetClusters, clusters);
    
    return clusters;
  }
  
  // 클러스터 분할
  private splitCluster(
    cluster: HierarchicalCluster, 
    targetClusters: number, 
    result: HierarchicalCluster[]
  ): void {
    if (result.length >= targetClusters) {
      result.push(cluster);
      return;
    }
    
    if (cluster.children.length === 0) {
      result.push(cluster);
      return;
    }
    
    // 가장 큰 거리를 가진 자식부터 분할
    const sortedChildren = [...cluster.children].sort((a, b) => b.distance - a.distance);
    
    for (const child of sortedChildren) {
      if (result.length < targetClusters) {
        this.splitCluster(child, targetClusters, result);
      } else {
        result.push(child);
      }
    }
  }
  
  // 최적 클러스터 수 추정
  private estimateOptimalClusters(dataSize: number): number {
    // 간단한 추정 (실제로는 엘보우 메서드나 실루엣 분석 사용)
    if (dataSize < 100) return Math.max(2, Math.floor(dataSize / 20));
    if (dataSize < 1000) return Math.max(3, Math.floor(dataSize / 100));
    if (dataSize < 10000) return Math.max(5, Math.floor(dataSize / 1000));
    return Math.max(8, Math.floor(dataSize / 5000));
  }
  
  // 클러스터 품질 평가
  public evaluateClusterQuality(clusters: HierarchicalCluster[]): {
    copheneticCorrelation: number;
    dendrogramHeight: number;
    clusterBalance: number;
    interpretability: number;
  } {
    if (clusters.length === 0) {
      return {
        copheneticCorrelation: 0,
        dendrogramHeight: 0,
        clusterBalance: 0,
        interpretability: 0
      };
    }
    
    // 간단한 품질 지표
    const sizes = clusters.map(c => c.size);
    const meanSize = sizes.reduce((sum, size) => sum + size, 0) / sizes.length;
    const variance = sizes.reduce((sum, size) => sum + Math.pow(size - meanSize, 2), 0) / sizes.length;
    
    const clusterBalance = 1 / (1 + variance / meanSize);
    const dendrogramHeight = Math.max(...clusters.map(c => c.distance));
    const copheneticCorrelation = Math.max(0, 1 - (variance / meanSize));
    const interpretability = Math.min(1.0, clusters.length / 10); // 클러스터 수가 적을수록 해석 가능
    
    return {
      copheneticCorrelation,
      dendrogramHeight,
      clusterBalance,
      interpretability
    };
  }
  
  // 클러스터 시각화 데이터 생성
  public generateVisualizationData(clusters: HierarchicalCluster[]): {
    nodes: any[];
    links: any[];
    hierarchy: any;
  } {
    const nodes: any[] = [];
    const links: any[] = [];
    
    // 노드 생성
    const addNode = (cluster: HierarchicalCluster, parentId?: string) => {
      const node = {
        id: cluster.id,
        name: cluster.id,
        size: cluster.size,
        level: cluster.level,
        distance: cluster.distance,
        patents: cluster.patents.length
      };
      
      nodes.push(node);
      
      if (parentId) {
        links.push({
          source: parentId,
          target: cluster.id,
          distance: cluster.distance
        });
      }
      
      // 자식 노드들 추가
      cluster.children.forEach(child => addNode(child, cluster.id));
    };
    
    // 루트 클러스터부터 시작
    if (clusters.length > 0) {
      const rootCluster = this.findRootCluster(clusters[0]);
      addNode(rootCluster);
    }
    
    // 계층 구조 생성
    const hierarchy = this.buildHierarchy(clusters);
    
    return { nodes, links, hierarchy };
  }
  
  // 루트 클러스터 찾기
  private findRootCluster(cluster: HierarchicalCluster): HierarchicalCluster {
    let current = cluster;
    while (current.parent) {
      current = current.parent;
    }
    return current;
  }
  
  // 계층 구조 구축
  private buildHierarchy(clusters: HierarchicalCluster[]): any {
    if (clusters.length === 0) return null;
    
    const rootCluster = this.findRootCluster(clusters[0]);
    
    const buildNode = (cluster: HierarchicalCluster): any => {
      return {
        name: cluster.id,
        children: cluster.children.map(buildNode),
        size: cluster.size,
        level: cluster.level,
        distance: cluster.distance
      };
    };
    
    return buildNode(rootCluster);
  }
  
  // 클러스터 정보 요약
  public getClusterSummary(clusters: HierarchicalCluster[]): {
    totalClusters: number;
    totalPatents: number;
    averageClusterSize: number;
    sizeDistribution: Map<string, number>;
    levelDistribution: Map<number, number>;
  } {
    const totalClusters = clusters.length;
    const totalPatents = clusters.reduce((sum, c) => sum + c.patents.length, 0);
    const averageClusterSize = totalPatents / totalClusters;
    
    const sizeDistribution = new Map<string, number>();
    const levelDistribution = new Map<number, number>();
    
    clusters.forEach(cluster => {
      // 크기 분포
      const sizeKey = cluster.size <= 5 ? 'small' : cluster.size <= 20 ? 'medium' : 'large';
      sizeDistribution.set(sizeKey, (sizeDistribution.get(sizeKey) || 0) + 1);
      
      // 레벨 분포
      levelDistribution.set(cluster.level, (levelDistribution.get(cluster.level) || 0) + 1);
    });
    
    return {
      totalClusters,
      totalPatents,
      averageClusterSize,
      sizeDistribution,
      levelDistribution
    };
  }
}

// 기본 계층적 클러스터링 서비스 인스턴스
export const hierarchicalService = new HierarchicalClusteringService({
  method: 'ward',
  distance: 'korean',
  linkage: 'average'
});
