import { Patent } from '@/types';
import { Matrix } from 'ml-matrix';
// @ts-ignore
import PCA from 'ml-pca';
import { TfIdf } from 'natural';
import { koreanTextProcessor } from './korean-text-processor';

// 고급 텍스트 벡터화를 위한 인터페이스들
interface WordVector {
  word: string;
  vector: number[];
}

interface DocumentVector {
  id: string;
  vector: number[];
  metadata: {
    wordCount: number;
    uniqueWords: number;
    avgWordLength: number;
  };
}

interface ClusteringResult {
  clusters: PatentCluster[];
  pcaResult: PCAResult;
  metrics: {
    silhouetteScore: number;
    inertia: number;
    optimalK: number;
  };
}

interface PatentCluster {
  id: number;
  patents: Patent[];
  centroid: number[];
  keywords: string[];
  similarity: number;
}

interface PCAResult {
  components: number[][];
  explainedVariance: number[];
  reducedVectors: number[][];
}

// 고급 텍스트 벡터화 서비스
export class AdvancedTextVectorizationService {
  private wordVectors: Map<string, number[]> = new Map();
  private vocabulary: Set<string> = new Set();
  private wordFrequencies: Map<string, number> = new Map();
  private tfIdf: TfIdf;
  
  constructor() {
    this.initializeVocabulary();
    this.tfIdf = new TfIdf();
  }

  // 한국어 특허 관련 어휘 초기화
  private initializeVocabulary() {
    const patentTerms = [
      '특허', '발명', '신기술', '혁신', '기술', '제품', '방법', '장치', '시스템',
      '프로세스', '알고리즘', '소프트웨어', '하드웨어', '인터페이스', '데이터',
      '네트워크', '보안', '인증', '암호화', '블록체인', '인공지능', '머신러닝',
      '딥러닝', '자연어처리', '컴퓨터비전', '로봇공학', '바이오기술', '나노기술',
      '재료', '화학', '물리', '전자', '전기', '기계', '건축', '의료', '제약'
    ];
    
    patentTerms.forEach(term => {
      this.vocabulary.add(term);
      this.wordFrequencies.set(term, 0);
    });
  }

  // 1. 고급 TF-IDF (한국어 처리 통합)
  public advancedTfIdf(text: string, documents: string[]): Map<string, number> {
    // 한국어 형태소 분석 및 최적화
    const optimizedText = koreanTextProcessor.optimizePatentText(text);
    
    // TF-IDF 계산을 위한 문서 추가
    this.tfIdf.addDocument(optimizedText);
    documents.forEach(doc => {
      if (doc !== text) {
        const optimizedDoc = koreanTextProcessor.optimizePatentText(doc);
        this.tfIdf.addDocument(optimizedDoc);
      }
    });
    
    const morphemes = koreanTextProcessor.analyzeMorphemes(text);
    const tfIdf = new Map<string, number>();
    
    morphemes.forEach(morpheme => {
      if (this.vocabulary.has(morpheme)) {
        // natural 라이브러리의 TfIdf는 term, documentId 순서
        const score = this.tfIdf.tfidf(morpheme, 0); // 첫 번째 문서 (text)
        const weight = this.getPatentTermWeight(morpheme);
        const koreanWeight = koreanTextProcessor.calculateTechnicalWeight(morpheme);
        tfIdf.set(morpheme, score * weight * koreanWeight);
      }
    });
    
    return tfIdf;
  }

  // 2. Word2Vec 스타일 벡터 (개선된 구현)
  public generateWord2VecStyleVector(text: string, dimension: number = 100): number[] {
    const words = this.preprocessText(text);
    const vector = new Array(dimension).fill(0);
    
    words.forEach(word => {
      const wordVector = this.getWordVector(word, dimension);
      for (let i = 0; i < dimension; i++) {
        vector[i] += wordVector[i];
      }
    });
    
    // 정규화
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    if (magnitude > 0) {
      for (let i = 0; i < dimension; i++) {
        vector[i] /= magnitude;
      }
    }
    
    return vector;
  }

  // 3. 문맥 기반 벡터 (주변 단어 고려)
  public generateContextualVector(text: string, windowSize: number = 3): number[] {
    const words = this.preprocessText(text);
    const vector = new Array(100).fill(0);
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const contextWords = this.getContextWords(words, i, windowSize);
      
      // 중심 단어와 문맥 단어들의 가중 평균
      const wordVector = this.getWordVector(word, 100);
      const contextVector = this.getContextVector(contextWords, 100);
      
      for (let j = 0; j < 100; j++) {
        vector[j] += wordVector[j] * 0.7 + contextVector[j] * 0.3;
      }
    }
    
    return this.normalizeVector(vector);
  }

  // 4. 의미적 유사도 벡터 (동의어, 유사어 고려)
  public generateSemanticVector(text: string): number[] {
    const words = this.preprocessText(text);
    const semanticGroups = this.groupSemanticWords(words);
    const vector = new Array(100).fill(0);
    
    semanticGroups.forEach(group => {
      const groupVector = this.getSemanticGroupVector(group);
      for (let i = 0; i < 100; i++) {
        vector[i] += groupVector[i];
      }
    });
    
    return this.normalizeVector(vector);
  }

  // 5. 하이브리드 벡터 (여러 방법 결합)
  public generateHybridVector(text: string): number[] {
    const tfIdfVector = this.advancedTfIdf(text, [text]);
    const word2vecVector = this.generateWord2VecStyleVector(text);
    const contextualVector = this.generateContextualVector(text);
    const semanticVector = this.generateSemanticVector(text);
    
    // 가중 평균으로 결합
    const hybridVector = new Array(100).fill(0);
    for (let i = 0; i < 100; i++) {
      hybridVector[i] = 
        word2vecVector[i] * 0.4 +
        contextualVector[i] * 0.3 +
        semanticVector[i] * 0.2 +
        (tfIdfVector.size > 0 ? 0.1 : 0);
    }
    
    return this.normalizeVector(hybridVector);
  }

  // 헬퍼 메서드들 (한국어 처리 통합)
  private preprocessText(text: string): string[] {
    return koreanTextProcessor.analyzeMorphemes(text);
  }

  private getPatentTermWeight(word: string): number {
    const patentTerms = ['특허', '발명', '신기술', '혁신'];
    const technicalTerms = ['알고리즘', '프로세스', '시스템', '인터페이스'];
    
    if (patentTerms.indexOf(word) !== -1) return 2.0;
    if (technicalTerms.indexOf(word) !== -1) return 1.5;
    return 1.0;
  }

  private getWordVector(word: string, dimension: number): number[] {
    if (!this.wordVectors.has(word)) {
      // 랜덤 벡터 생성 (실제로는 사전 훈련된 벡터 사용)
      const vector = Array.from({ length: dimension }, () => 
        (Math.random() - 0.5) * 2
      );
      this.wordVectors.set(word, vector);
    }
    return this.wordVectors.get(word)!;
  }

  private getContextWords(words: string[], centerIndex: number, windowSize: number): string[] {
    const start = Math.max(0, centerIndex - windowSize);
    const end = Math.min(words.length, centerIndex + windowSize + 1);
    return words.slice(start, end).filter((_, i) => i !== centerIndex - start);
  }

  private getContextVector(contextWords: string[], dimension: number): number[] {
    const vector = new Array(dimension).fill(0);
    if (contextWords.length === 0) return vector;
    
    contextWords.forEach(word => {
      const wordVector = this.getWordVector(word, dimension);
      for (let i = 0; i < dimension; i++) {
        vector[i] += wordVector[i];
      }
    });
    
    // 평균 계산
    for (let i = 0; i < dimension; i++) {
      vector[i] /= contextWords.length;
    }
    
    return vector;
  }

  private groupSemanticWords(words: string[]): string[][] {
    const groups: string[][] = [];
    const processed = new Set<string>();
    
    words.forEach(word => {
      if (processed.has(word)) return;
      
      const group = [word];
      processed.add(word);
      
      // 유사한 단어들 찾기 (간단한 유사도)
      words.forEach(otherWord => {
        if (!processed.has(otherWord) && this.calculateWordSimilarity(word, otherWord) > 0.7) {
          group.push(otherWord);
          processed.add(otherWord);
        }
      });
      
      if (group.length > 0) {
        groups.push(group);
      }
    });
    
    return groups;
  }

  private calculateWordSimilarity(word1: string, word2: string): number {
    // 레벤슈타인 거리 기반 유사도
    const distance = this.levenshteinDistance(word1, word2);
    const maxLength = Math.max(word1.length, word2.length);
    return 1 - (distance / maxLength);
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  private getSemanticGroupVector(group: string[]): number[] {
    const vector = new Array(100).fill(0);
    
    group.forEach(word => {
      const wordVector = this.getWordVector(word, 100);
      for (let i = 0; i < 100; i++) {
        vector[i] += wordVector[i];
      }
    });
    
    // 그룹 크기로 정규화
    for (let i = 0; i < 100; i++) {
      vector[i] /= group.length;
    }
    
    return vector;
  }

  private normalizeVector(vector: number[]): number[] {
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    if (magnitude === 0) return vector;
    
    return vector.map(val => val / magnitude);
  }
}

// 특허 클러스터링 서비스 (고급 벡터화 사용)
export class PatentClusteringService {
  private vectorizationService = new AdvancedTextVectorizationService();
  private patentStore = new Map<string, Patent>();

  // 특허를 고급 벡터로 변환
  public async patentsToVectors(patents: Patent[]): Promise<DocumentVector[]> {
    const vectors: DocumentVector[] = [];
    
    patents.forEach(patent => {
      this.patentStore.set(patent.id, patent);
      
      const text = this.extractPatentText(patent);
      const vector = this.vectorizationService.generateHybridVector(text);
      
      vectors.push({
        id: patent.id,
        vector,
        metadata: {
          wordCount: text.split(/\s+/).length,
          uniqueWords: new Set(text.split(/\s+/)).size,
          avgWordLength: text.split(/\s+/).reduce((sum, word) => sum + word.length, 0) / text.split(/\s+/).length
        }
      });
    });
    
    return vectors;
  }

  // 코사인 유사도 계산
  public calculateCosineSimilarity(vec1: number[], vec2: number[]): number {
    if (vec1.length !== vec2.length) return 0;
    
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;
    
    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
      norm1 += vec1[i] * vec1[i];
      norm2 += vec2[i] * vec2[i];
    }
    
    if (norm1 === 0 || norm2 === 0) return 0;
    
    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }

  // PCA 차원 축소 (ml-pca 라이브러리 사용)
  public performPCA(vectors: number[][], dimensions: number = 2): PCAResult {
    if (vectors.length === 0) {
      return {
        components: [],
        explainedVariance: [],
        reducedVectors: []
      };
    }

    try {
      // Matrix 객체로 변환
      const matrix = new Matrix(vectors);
      
      // PCA 수행
      const pca = new PCA(matrix);
      
      // 차원 축소
      const reducedMatrix = pca.predict(matrix, { nComponents: dimensions });
      
      return {
        components: pca.getLoadings().to2DArray(),
        explainedVariance: pca.getExplainedVariance(),
        reducedVectors: reducedMatrix.to2DArray()
      };
    } catch (error) {
      console.warn('PCA 계산 실패, 간단한 구현으로 대체:', error);
      return this.simplePCA(vectors, dimensions);
    }
  }

  // 간단한 PCA 구현 (fallback)
  private simplePCA(vectors: number[][], dimensions: number = 2): PCAResult {
    const n = vectors.length;
    const m = vectors[0].length;
    
    // 평균 계산
    const mean = new Array(m).fill(0);
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        mean[i] += vectors[j][i];
      }
      mean[i] /= n;
    }
    
    // 공분산 행렬 계산
    const covariance = Array(m).fill(0).map(() => Array(m).fill(0));
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < m; j++) {
        for (let k = 0; k < n; k++) {
          covariance[i][j] += (vectors[k][i] - mean[i]) * (vectors[k][j] - mean[j]);
        }
        covariance[i][j] /= (n - 1);
      }
    }
    
    // 고유값 분해 (간단한 근사)
    const eigenvalues = this.powerIteration(covariance, dimensions);
    const eigenvectors = this.computeEigenvectors(covariance, eigenvalues);
    
    // 차원 축소
    const reducedVectors = vectors.map(vector => {
      const reduced = new Array(dimensions).fill(0);
      for (let i = 0; i < dimensions; i++) {
        for (let j = 0; j < m; j++) {
          reduced[i] += (vector[j] - mean[j]) * eigenvectors[j][i];
        }
      }
      return reduced;
    });
    
    return {
      components: eigenvectors,
      explainedVariance: eigenvalues,
      reducedVectors
    };
  }

  // K-means 클러스터링 (K-means++ 초기화 사용)
  public performKMeansClustering(vectors: number[][], k: number): PatentCluster[] {
    if (vectors.length === 0) return [];
    
    // K-means++ 초기화로 안정적인 중심점 선택
    const centroids = this.initializeCentroidsPlus(vectors, k);
    const clusters: PatentCluster[] = [];
    
    let iterations = 0;
    const maxIterations = 200; // 반복 횟수 증가
    const convergenceThreshold = 0.0001; // 수렴 임계값 개선
    
    while (iterations < maxIterations) {
      // 클러스터 초기화
      clusters.length = 0;
      for (let i = 0; i < k; i++) {
        clusters.push({
          id: i,
          patents: [],
          centroid: [...centroids[i]],
          keywords: [],
          similarity: 0
        });
      }
      
      // 각 벡터를 가장 가까운 클러스터에 할당
      vectors.forEach((vector, index) => {
        let minDistance = Infinity;
        let bestCluster = 0;
        
        for (let i = 0; i < k; i++) {
          const distance = this.euclideanDistance(vector, centroids[i]);
          if (distance < minDistance) {
            minDistance = distance;
            bestCluster = i;
          }
        }
        
        const patent = this.patentStore.get(index.toString());
        if (patent) {
          clusters[bestCluster].patents.push(patent);
        }
      });
      
      // 새로운 중심점 계산
      let centroidsChanged = false;
      for (let i = 0; i < k; i++) {
        if (clusters[i].patents.length === 0) continue;
        
        const newCentroid = this.calculateCentroid(
          clusters[i].patents.map(p => vectors[parseInt(p.id)])
        );
        
        if (this.euclideanDistance(newCentroid, centroids[i]) > convergenceThreshold) {
          centroidsChanged = true;
          centroids[i] = newCentroid;
          clusters[i].centroid = [...newCentroid];
        }
      }
      
      if (!centroidsChanged) break;
      iterations++;
    }
    
    // 클러스터 정보 완성
    clusters.forEach(cluster => {
      cluster.keywords = this.extractClusterKeywords(cluster.patents);
      cluster.similarity = this.calculateClusterSimilarity(cluster);
    });
    
    return clusters.filter(cluster => cluster.patents.length > 0);
  }

  // 실루엣 점수 계산
  public calculateSilhouetteScore(vectors: number[][], clusters: PatentCluster[]): number {
    if (clusters.length === 0) return 0;
    
    let totalScore = 0;
    let totalPoints = 0;
    
    vectors.forEach((vector, index) => {
      const cluster = clusters.find(c => 
        c.patents.some(p => p.id === index.toString())
      );
      
      if (!cluster) return;
      
      // 같은 클러스터 내 평균 거리 (a)
      const intraClusterDistance = this.calculateAverageDistance(
        vector, 
        cluster.patents.map(p => vectors[parseInt(p.id)])
      );
      
      // 다른 클러스터와의 최소 평균 거리 (b)
      let minInterClusterDistance = Infinity;
      clusters.forEach(otherCluster => {
        if (otherCluster.id === cluster.id) return;
        
        const distance = this.calculateAverageDistance(
          vector,
          otherCluster.patents.map(p => vectors[parseInt(p.id)])
        );
        
        if (distance < minInterClusterDistance) {
          minInterClusterDistance = distance;
        }
      });
      
      if (minInterClusterDistance === Infinity) return;
      
      const silhouette = (minInterClusterDistance - intraClusterDistance) / 
                        Math.max(intraClusterDistance, minInterClusterDistance);
      
      totalScore += silhouette;
      totalPoints++;
    });
    
    return totalPoints > 0 ? totalScore / totalPoints : 0;
  }

  // 최적 K 찾기
  public findOptimalK(vectors: number[][], maxK: number = 10): number {
    let bestK = 2;
    let bestScore = -1;
    
    for (let k = 2; k <= Math.min(maxK, Math.floor(vectors.length / 2)); k++) {
      const clusters = this.performKMeansClustering(vectors, k);
      const score = this.calculateSilhouetteScore(vectors, clusters);
      
      if (score > bestScore) {
        bestScore = score;
        bestK = k;
      }
    }
    
    return bestK;
  }

  // 통합 클러스터링 실행
  public async performClustering(patents: Patent[], k?: number): Promise<ClusteringResult> {
    const vectors = await this.patentsToVectors(patents);
    
    if (vectors.length === 0) {
      return {
        clusters: [],
        pcaResult: { components: [], explainedVariance: [], reducedVectors: [] },
        metrics: { silhouetteScore: 0, inertia: 0, optimalK: 0 }
      };
    }
    
    const optimalK = k || this.findOptimalK(vectors.map(v => v.vector));
    const clusters = this.performKMeansClustering(vectors.map(v => v.vector), optimalK);
    const pcaResult = this.performPCA(vectors.map(v => v.vector), 2);
    const silhouetteScore = this.calculateSilhouetteScore(vectors.map(v => v.vector), clusters);
    
    return {
      clusters,
      pcaResult,
      metrics: {
        silhouetteScore,
        inertia: this.calculateInertia(vectors.map(v => v.vector), clusters),
        optimalK
      }
    };
  }

  // 대용량 데이터 배치 처리 (메모리 효율성 향상)
  public async performClusteringWithBatching(
    patents: Patent[], 
    k?: number, 
    batchSize: number = 1000
  ): Promise<ClusteringResult> {
    if (patents.length <= batchSize) {
      return this.performClustering(patents, k);
    }
    
    console.log(`대용량 데이터 감지: ${patents.length}개 특허, 배치 크기: ${batchSize}`);
    
    const startTime = Date.now();
    const allVectors: number[][] = [];
    const patentMap = new Map<string, Patent>();
    
    // 배치별로 벡터 생성 (메모리 효율성)
    for (let i = 0; i < patents.length; i += batchSize) {
      const batch = patents.slice(i, i + batchSize);
      console.log(`배치 처리 중: ${i + 1}-${Math.min(i + batchSize, patents.length)}/${patents.length}`);
      
      const batchVectors = await this.patentsToVectors(batch);
      allVectors.push(...batchVectors.map(v => v.vector));
      
      // 특허 정보 저장
      batch.forEach(patent => {
        patentMap.set(patent.id, patent);
      });
      
      // 메모리 정리 (Node.js 환경에서만)
      if (typeof global !== 'undefined' && global.gc) {
        global.gc();
      }
    }
    
    console.log(`벡터 생성 완료: ${allVectors.length}개, 소요시간: ${Date.now() - startTime}ms`);
    
    // 클러스터링 수행
    const optimalK = k || this.findOptimalK(allVectors);
    const clusters = this.performKMeansClustering(allVectors, optimalK);
    
    // 클러스터에 특허 정보 연결
    clusters.forEach(cluster => {
      cluster.patents = cluster.patents.map(p => patentMap.get(p.id) || p);
    });
    
    const pcaResult = this.performPCA(allVectors, 2);
    const silhouetteScore = this.calculateSilhouetteScore(allVectors, clusters);
    
    return {
      clusters,
      pcaResult,
      metrics: {
        silhouetteScore,
        inertia: this.calculateInertia(allVectors, clusters),
        optimalK
      }
    };
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

  // 기존 랜덤 초기화 (fallback용)
  private initializeCentroids(vectors: number[][], k: number): number[][] {
    const centroids: number[][] = [];
    const usedIndices = new Set<number>();
    
    while (centroids.length < k) {
      const index = Math.floor(Math.random() * vectors.length);
      if (!usedIndices.has(index)) {
        usedIndices.add(index);
        centroids.push([...vectors[index]]);
      }
    }
    
    return centroids;
  }

  // K-means++ 초기화 (안정적인 중심점 선택)
  private initializeCentroidsPlus(vectors: number[][], k: number): number[][] {
    if (vectors.length === 0) return [];
    
    const centroids: number[][] = [];
    const usedIndices = new Set<number>();
    
    // 첫 번째 중심점 랜덤 선택
    const firstIndex = Math.floor(Math.random() * vectors.length);
    centroids.push([...vectors[firstIndex]]);
    usedIndices.add(firstIndex);
    
    // 나머지 중심점은 기존 중심점과 멀리 떨어진 점 선택
    while (centroids.length < k) {
      let maxDistance = 0;
      let bestIndex = 0;
      
      vectors.forEach((vector, index) => {
        if (usedIndices.has(index)) return;
        
        // 기존 중심점들과의 최소 거리 계산
        let minDistance = Infinity;
        centroids.forEach(centroid => {
          const distance = this.euclideanDistance(vector, centroid);
          if (distance < minDistance) minDistance = distance;
        });
        
        // 가장 멀리 떨어진 점 선택 (K-means++ 핵심)
        if (minDistance > maxDistance) {
          maxDistance = minDistance;
          bestIndex = index;
        }
      });
      
      centroids.push([...vectors[bestIndex]]);
      usedIndices.add(bestIndex);
    }
    
    return centroids;
  }

  private euclideanDistance(vec1: number[], vec2: number[]): number {
    let sum = 0;
    for (let i = 0; i < vec1.length; i++) {
      sum += Math.pow(vec1[i] - vec2[i], 2);
    }
    return Math.sqrt(sum);
  }

  private calculateCentroid(vectors: number[][]): number[] {
    if (vectors.length === 0) return [];
    
    const dimension = vectors[0].length;
    const centroid = new Array(dimension).fill(0);
    
    vectors.forEach(vector => {
      for (let i = 0; i < dimension; i++) {
        centroid[i] += vector[i];
      }
    });
    
    for (let i = 0; i < dimension; i++) {
      centroid[i] /= vectors.length;
    }
    
    return centroid;
  }

  private extractClusterKeywords(patents: Patent[]): string[] {
    const wordFreq = new Map<string, number>();
    
    patents.forEach(patent => {
      const text = this.extractPatentText(patent);
      const words = text.split(/\s+/).filter(word => word.length > 2);
      
      words.forEach(word => {
        wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
      });
    });
    
    return Array.from(wordFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);
  }

  private calculateClusterSimilarity(cluster: PatentCluster): number {
    if (cluster.patents.length < 2) return 1;
    
    let totalSimilarity = 0;
    let comparisons = 0;
    
    for (let i = 0; i < cluster.patents.length; i++) {
      for (let j = i + 1; j < cluster.patents.length; j++) {
        const text1 = this.extractPatentText(cluster.patents[i]);
        const text2 = this.extractPatentText(cluster.patents[j]);
        
        const vector1 = this.vectorizationService.generateHybridVector(text1);
        const vector2 = this.vectorizationService.generateHybridVector(text2);
        
        totalSimilarity += this.calculateCosineSimilarity(vector1, vector2);
        comparisons++;
      }
    }
    
    return comparisons > 0 ? totalSimilarity / comparisons : 0;
  }

  private calculateAverageDistance(vector: number[], vectors: number[][]): number {
    if (vectors.length === 0) return 0;
    
    const totalDistance = vectors.reduce((sum, v) => sum + this.euclideanDistance(vector, v), 0);
    return totalDistance / vectors.length;
  }

  private calculateInertia(vectors: number[][], clusters: PatentCluster[]): number {
    let inertia = 0;
    
    clusters.forEach(cluster => {
      cluster.patents.forEach(patent => {
        const vector = vectors[parseInt(patent.id)];
        if (vector) {
          inertia += Math.pow(this.euclideanDistance(vector, cluster.centroid), 2);
        }
      });
    });
    
    return inertia;
  }

  private powerIteration(matrix: number[][], iterations: number): number[] {
    const n = matrix.length;
    const eigenvalues: number[] = [];
    
    for (let iter = 0; iter < iterations; iter++) {
      let vector = Array(n).fill(0).map(() => Math.random());
      let eigenvalue = 0;
      
      for (let i = 0; i < 10; i++) {
        const newVector = Array(n).fill(0);
        for (let j = 0; j < n; j++) {
          for (let k = 0; k < n; k++) {
            newVector[j] += matrix[j][k] * vector[k];
          }
        }
        
        eigenvalue = Math.sqrt(newVector.reduce((sum, val) => sum + val * val, 0));
        vector = newVector.map(val => val / eigenvalue);
      }
      
      eigenvalues.push(eigenvalue);
    }
    
    return eigenvalues;
  }

  private computeEigenvectors(matrix: number[][], eigenvalues: number[]): number[][] {
    const n = matrix.length;
    const eigenvectors: number[][] = [];
    
    eigenvalues.forEach(eigenvalue => {
      const eigenvector = Array(n).fill(0).map(() => Math.random());
      
      // 간단한 반복법으로 고유벡터 계산
      for (let iter = 0; iter < 20; iter++) {
        const newVector = Array(n).fill(0);
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < n; j++) {
            newVector[i] += matrix[i][j] * eigenvector[j];
          }
        }
        
        const norm = Math.sqrt(newVector.reduce((sum, val) => sum + val * val, 0));
        for (let i = 0; i < n; i++) {
          eigenvector[i] = newVector[i] / norm;
        }
      }
      
      eigenvectors.push([...eigenvector]);
    });
    
    return eigenvectors;
  }

  public findPatentById(id: string): Patent | undefined {
    return this.patentStore.get(id);
  }

  // 성능 모니터링 및 통계
  public getPerformanceStats(): {
    totalPatents: number;
    averageVectorDimension: number;
    memoryUsage: string;
    processingTime: number;
  } {
    const totalPatents = this.patentStore.size;
    const averageVectorDimension = this.patentStore.size > 0 ? 100 : 0; // 현재 고정 100차원
    
    // 메모리 사용량 추정 (Node.js 환경에서만)
    let memoryUsage = 'N/A';
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const mem = process.memoryUsage();
      memoryUsage = `${Math.round(mem.heapUsed / 1024 / 1024)}MB`;
    }
    
    return {
      totalPatents,
      averageVectorDimension,
      memoryUsage,
      processingTime: Date.now()
    };
  }

  // 벡터 차원 동적 조정 (메모리 최적화)
  private calculateOptimalDimension(textLength: number): number {
    // 텍스트 길이에 따라 차원 조정
    if (textLength < 100) return 50;
    if (textLength < 500) return 75;
    if (textLength < 1000) return 100;
    return 150; // 최대 차원 제한
  }
}

// 싱글톤 인스턴스 생성
export const patentClusteringService = new PatentClusteringService();
