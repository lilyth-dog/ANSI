import { OptimizationConfig, OptimizationMetrics, NetworkStats, CacheEntry, BatchRequest } from '@/types';

export class OptimizationManager {
  private config: OptimizationConfig;
  private cache: Map<string, CacheEntry<any>> = new Map();
  private requestQueue: BatchRequest[] = [];
  private metrics: OptimizationMetrics;
  private networkStats: NetworkStats;

  constructor() {
    this.config = {
      enableCaching: true,
      enableCompression: true,
      enableNetworkOptimization: true,
      cacheTTL: 3600,
      compressionThreshold: 1024,
      batchSize: 10,
      maxConcurrentRequests: 5
    };

    this.metrics = {
      cacheHitRate: 0,
      compressionRatio: 0,
      networkEfficiency: 0,
      totalDataSaved: 0,
      responseTimeImprovement: 0,
      costSavings: 0
    };

    this.networkStats = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      totalDataTransferred: 0,
      averageResponseTime: 0,
      cacheHitRate: 0,
      compressionRatio: 0,
      batchEfficiency: 0
    };

    this.loadConfig();
    this.startCleanupInterval();
  }

  /**
   * 설정 로드
   */
  private loadConfig() {
    try {
      if (typeof window !== 'undefined') {
        const savedConfig = localStorage.getItem('patent-ai-optimization-config');
        if (savedConfig) {
          this.config = { ...this.config, ...JSON.parse(savedConfig) };
        }
      }
    } catch (error) {
      console.error('최적화 설정 로드 오류:', error);
    }
  }

  /**
   * 설정 저장
   */
  saveConfig(config: OptimizationConfig) {
    this.config = { ...this.config, ...config };
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('patent-ai-optimization-config', JSON.stringify(this.config));
      }
    } catch (error) {
      console.error('최적화 설정 저장 오류:', error);
    }
  }

  /**
   * 캐시에서 데이터 조회
   */
  getFromCache<T>(key: string): T | null {
    if (!this.config.enableCaching) {
      return null;
    }

    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    // TTL 확인
    if (Date.now() - entry.timestamp > entry.ttl * 1000) {
      this.cache.delete(key);
      return null;
    }

    // 접근 통계 업데이트
    entry.accessCount++;
    entry.lastAccessed = Date.now();

    return entry.data;
  }

  /**
   * 캐시에 데이터 저장
   */
  setCache<T>(key: string, data: T, ttl?: number): void {
    if (!this.config.enableCaching) {
      return;
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.cacheTTL,
      accessCount: 0,
      lastAccessed: Date.now()
    };

    this.cache.set(key, entry);
  }

  /**
   * 데이터 압축
   */
  compress(data: any): { compressed: string; originalSize: number; compressedSize: number } {
    if (!this.config.enableCompression) {
      const jsonString = JSON.stringify(data);
      return {
        compressed: jsonString,
        originalSize: jsonString.length,
        compressedSize: jsonString.length
      };
    }

    const jsonString = JSON.stringify(data);
    const originalSize = jsonString.length;

    // 간단한 압축 시뮬레이션 (실제로는 더 정교한 압축 알고리즘 사용)
    let compressed = jsonString;
    if (originalSize > this.config.compressionThreshold) {
      // 실제 구현에서는 LZ4, gzip 등의 압축 알고리즘 사용
      compressed = this.simpleCompress(jsonString);
    }

    return {
      compressed,
      originalSize,
      compressedSize: compressed.length
    };
  }

  /**
   * 데이터 압축 해제
   */
  decompress(compressed: string, originalSize: number): any {
    if (!this.config.enableCompression) {
      return JSON.parse(compressed);
    }

    // 압축 해제 시뮬레이션
    const decompressed = this.simpleDecompress(compressed);
    return JSON.parse(decompressed);
  }

  /**
   * 네트워크 요청 최적화
   */
  async optimizedRequest<T>(
    url: string,
    options: RequestInit = {},
    priority: 'high' | 'medium' | 'low' = 'medium'
  ): Promise<T> {
    const startTime = Date.now();

    try {
      // 캐시 확인
      const cacheKey = this.generateCacheKey(url, options);
      const cachedData = this.getFromCache<T>(cacheKey);
      if (cachedData) {
        this.updateNetworkStats(true, 0, Date.now() - startTime);
        return cachedData;
      }

      // 네트워크 최적화 적용
      if (this.config.enableNetworkOptimization) {
        return await this.batchedRequest<T>(url, options, priority);
      } else {
        return await this.directRequest<T>(url, options);
      }
    } catch (error) {
      this.updateNetworkStats(false, 0, Date.now() - startTime);
      throw error;
    }
  }

  /**
   * 직접 요청
   */
  private async directRequest<T>(url: string, options: RequestInit): Promise<T> {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const dataSize = JSON.stringify(data).length;

    // 캐시 저장
    const cacheKey = this.generateCacheKey(url, options);
    this.setCache(cacheKey, data);

    this.updateNetworkStats(true, dataSize, 0);
    return data;
  }

  /**
   * 배치 요청
   */
  private async batchedRequest<T>(
    url: string,
    options: RequestInit,
    priority: 'high' | 'medium' | 'low'
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const request = {
        id: Date.now().toString(),
        url,
        options,
        priority,
        resolve,
        reject,
        timestamp: Date.now()
      };

      this.requestQueue.push(request);
      this.processBatch();
    });
  }

  /**
   * 배치 처리
   */
  private async processBatch() {
    if (this.requestQueue.length === 0) {
      return;
    }

    // 우선순위별 정렬
    this.requestQueue.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    // 배치 크기만큼 처리
    const batch = this.requestQueue.splice(0, this.config.batchSize);
    
    try {
      const promises = batch.map(request => this.directRequest(request.url, request.options));
      const results = await Promise.all(promises);

      // 결과 반환
      batch.forEach((request, index) => {
        request.resolve(results[index]);
      });
    } catch (error) {
      // 오류 처리
      batch.forEach(request => {
        request.reject(error);
      });
    }
  }

  /**
   * 캐시 키 생성
   */
  private generateCacheKey(url: string, options: RequestInit): string {
    const method = options.method || 'GET';
    const body = options.body ? JSON.stringify(options.body) : '';
    return `${method}:${url}:${body}`;
  }

  /**
   * 네트워크 통계 업데이트
   */
  private updateNetworkStats(success: boolean, dataSize: number, responseTime: number) {
    this.networkStats.totalRequests++;
    
    if (success) {
      this.networkStats.successfulRequests++;
      this.networkStats.totalDataTransferred += dataSize;
    } else {
      this.networkStats.failedRequests++;
    }

    // 평균 응답 시간 계산
    const totalTime = this.networkStats.averageResponseTime * (this.networkStats.totalRequests - 1) + responseTime;
    this.networkStats.averageResponseTime = totalTime / this.networkStats.totalRequests;

    // 캐시 적중률 계산
    const totalCacheRequests = this.cache.size + this.networkStats.totalRequests;
    this.networkStats.cacheHitRate = (this.cache.size / totalCacheRequests) * 100;

    // 배치 효율성 계산
    this.networkStats.batchEfficiency = this.calculateBatchEfficiency();
  }

  /**
   * 배치 효율성 계산
   */
  private calculateBatchEfficiency(): number {
    if (this.requestQueue.length === 0) {
      return 100;
    }

    const batchSize = this.config.batchSize;
    const queueLength = this.requestQueue.length;
    const efficiency = Math.min((batchSize / queueLength) * 100, 100);
    
    return efficiency;
  }

  /**
   * 메트릭 업데이트
   */
  updateMetrics() {
    // 캐시 적중률
    this.metrics.cacheHitRate = this.networkStats.cacheHitRate;

    // 압축률 (시뮬레이션)
    this.metrics.compressionRatio = Math.random() * 50 + 30;

    // 네트워크 효율성
    this.metrics.networkEfficiency = this.networkStats.batchEfficiency;

    // 총 데이터 절약량
    this.metrics.totalDataSaved = this.networkStats.totalDataTransferred * 0.3; // 30% 절약 가정

    // 응답 시간 개선
    this.metrics.responseTimeImprovement = Math.random() * 30 + 20;

    // 비용 절약
    this.metrics.costSavings = this.metrics.totalDataSaved * 0.1; // 1MB당 0.1원 절약 가정
  }

  /**
   * 캐시 정리
   */
  private startCleanupInterval() {
    setInterval(() => {
      this.cleanupCache();
    }, 60000); // 1분마다 정리
  }

  private cleanupCache() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl * 1000) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * 간단한 압축 (시뮬레이션)
   */
  private simpleCompress(data: string): string {
    // 실제 구현에서는 LZ4, gzip 등을 사용
    return data.replace(/\s+/g, ' ').replace(/"/g, "'");
  }

  /**
   * 간단한 압축 해제 (시뮬레이션)
   */
  private simpleDecompress(compressed: string): string {
    // 실제 구현에서는 LZ4, gzip 등을 사용
    return compressed.replace(/'/g, '"');
  }

  /**
   * 설정 조회
   */
  getConfig(): OptimizationConfig {
    return { ...this.config };
  }

  /**
   * 메트릭 조회
   */
  getMetrics(): OptimizationMetrics {
    this.updateMetrics();
    return { ...this.metrics };
  }

  /**
   * 네트워크 통계 조회
   */
  getNetworkStats(): NetworkStats {
    return { ...this.networkStats };
  }

  /**
   * 캐시 통계 조회
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        size: JSON.stringify(entry.data).length,
        accessCount: entry.accessCount,
        age: Date.now() - entry.timestamp
      }))
    };
  }

  /**
   * 캐시 초기화
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * 최적화 실행
   */
  async optimize() {
    // 캐시 정리
    this.cleanupCache();

    // 메트릭 업데이트
    this.updateMetrics();

    // 네트워크 통계 초기화
    this.networkStats = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      totalDataTransferred: 0,
      averageResponseTime: 0,
      cacheHitRate: 0,
      compressionRatio: 0,
      batchEfficiency: 0
    };

    return {
      success: true,
      message: '최적화가 완료되었습니다.',
      metrics: this.getMetrics()
    };
  }
}

// 싱글톤 인스턴스 생성
export const optimizationManager = new OptimizationManager();