export interface NetworkRequest {
  id: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  priority: 'high' | 'medium' | 'low';
  retryCount: number;
  maxRetries: number;
  timeout: number;
  timestamp: number;
}

export interface BatchRequest {
  id: string;
  requests: NetworkRequest[];
  maxBatchSize: number;
  timeout: number;
  timestamp: number;
}

export interface NetworkStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  totalDataTransferred: number;
  averageResponseTime: number;
  cacheHitRate: number;
  compressionRatio: number;
  batchEfficiency: number;
}

export class NetworkOptimizer {
  private requestQueue: NetworkRequest[] = [];
  private batchQueue: BatchRequest[] = [];
  private activeRequests = new Map<string, NetworkRequest>();
  private stats: NetworkStats = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    totalDataTransferred: 0,
    averageResponseTime: 0,
    cacheHitRate: 0,
    compressionRatio: 1,
    batchEfficiency: 0
  };

  private batchTimeout = 1000; // 1초
  private maxBatchSize = 10;
  private maxConcurrentRequests = 5;

  constructor() {
    this.startBatchProcessor();
  }

  // 특허 검색 요청 최적화
  async optimizedPatentSearch(query: string, options: any = {}): Promise<any> {
    const request: NetworkRequest = {
      id: `patent_search_${Date.now()}`,
      url: '/api/patents/search',
      method: 'POST',
      body: { query, ...options },
      priority: 'medium',
      retryCount: 0,
      maxRetries: 3,
      timeout: 30000,
      timestamp: Date.now()
    };

    return this.executeRequest(request);
  }

  // 특허 상세 정보 요청 최적화
  async optimizedPatentDetail(patentId: string): Promise<any> {
    const request: NetworkRequest = {
      id: `patent_detail_${patentId}`,
      url: `/api/patents/${patentId}`,
      method: 'GET',
      priority: 'high',
      retryCount: 0,
      maxRetries: 3,
      timeout: 15000,
      timestamp: Date.now()
    };

    return this.executeRequest(request);
  }

  // 웹 검색 요청 최적화
  async optimizedWebSearch(query: string, sources: string[] = []): Promise<any> {
    const request: NetworkRequest = {
      id: `web_search_${Date.now()}`,
      url: '/api/web-search',
      method: 'POST',
      body: { query, sources },
      priority: 'low',
      retryCount: 0,
      maxRetries: 2,
      timeout: 20000,
      timestamp: Date.now()
    };

    return this.executeRequest(request);
  }

  // 시장 분석 요청 최적화
  async optimizedMarketAnalysis(patentIds: string[], options: any = {}): Promise<any> {
    const request: NetworkRequest = {
      id: `market_analysis_${Date.now()}`,
      url: '/api/market-analysis',
      method: 'POST',
      body: { patentIds, ...options },
      priority: 'medium',
      retryCount: 0,
      maxRetries: 3,
      timeout: 45000,
      timestamp: Date.now()
    };

    return this.executeRequest(request);
  }

  // 시뮬레이션 요청 최적화
  async optimizedSimulation(params: any): Promise<any> {
    const request: NetworkRequest = {
      id: `simulation_${Date.now()}`,
      url: '/api/simulation',
      method: 'POST',
      body: params,
      priority: 'low',
      retryCount: 0,
      maxRetries: 2,
      timeout: 60000,
      timestamp: Date.now()
    };

    return this.executeRequest(request);
  }

  // 배치 요청 생성
  createBatch(requests: NetworkRequest[]): BatchRequest {
    const batch: BatchRequest = {
      id: `batch_${Date.now()}`,
      requests,
      maxBatchSize: this.maxBatchSize,
      timeout: this.batchTimeout,
      timestamp: Date.now()
    };

    this.batchQueue.push(batch);
    return batch;
  }

  // 요청 실행
  private async executeRequest(request: NetworkRequest): Promise<any> {
    // 우선순위에 따른 큐 추가
    this.addToQueue(request);

    // 배치 처리 가능한지 확인
    if (this.canBatch(request)) {
      return this.processBatchRequest(request);
    }

    // 즉시 실행
    return this.processSingleRequest(request);
  }

  // 큐에 요청 추가
  private addToQueue(request: NetworkRequest): void {
    const index = this.requestQueue.findIndex(r => r.priority === request.priority);
    
    if (index === -1) {
      this.requestQueue.push(request);
    } else {
      this.requestQueue.splice(index, 0, request);
    }
  }

  // 배치 처리 가능 여부 확인
  private canBatch(request: NetworkRequest): boolean {
    return request.priority === 'low' && 
           request.method === 'GET' && 
           this.requestQueue.length >= this.maxBatchSize;
  }

  // 배치 요청 처리
  private async processBatchRequest(request: NetworkRequest): Promise<any> {
    return new Promise((resolve, reject) => {
      // 배치 완료 대기
      const checkBatch = () => {
        const batch = this.batchQueue.find(b => 
          b.requests.some(r => r.id === request.id)
        );

        if (batch && batch.requests.length >= this.maxBatchSize) {
          this.executeBatch(batch).then(resolve).catch(reject);
        } else {
          setTimeout(checkBatch, 100);
        }
      };

      checkBatch();
    });
  }

  // 단일 요청 처리
  private async processSingleRequest(request: NetworkRequest): Promise<any> {
    if (this.activeRequests.size >= this.maxConcurrentRequests) {
      // 대기
      await this.waitForSlot();
    }

    this.activeRequests.set(request.id, request);
    
    try {
      const result = await this.makeRequest(request);
      this.updateStats(request, result, true);
      return result;
    } catch (error) {
      this.updateStats(request, null, false);
      
      if (request.retryCount < request.maxRetries) {
        request.retryCount++;
        return this.retryRequest(request);
      }
      
      throw error;
    } finally {
      this.activeRequests.delete(request.id);
    }
  }

  // 배치 실행
  private async executeBatch(batch: BatchRequest): Promise<any[]> {
    const results: any[] = [];
    
    for (const request of batch.requests) {
      try {
        const result = await this.makeRequest(request);
        results.push(result);
        this.updateStats(request, result, true);
      } catch (error) {
        results.push({ error: error.message });
        this.updateStats(request, null, false);
      }
    }

    // 배치 큐에서 제거
    const index = this.batchQueue.findIndex(b => b.id === batch.id);
    if (index !== -1) {
      this.batchQueue.splice(index, 1);
    }

    return results;
  }

  // 실제 HTTP 요청
  private async makeRequest(request: NetworkRequest): Promise<any> {
    const startTime = Date.now();
    
    const response = await fetch(request.url, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        ...request.headers
      },
      body: request.body ? JSON.stringify(request.body) : undefined,
      signal: AbortSignal.timeout(request.timeout)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const responseTime = Date.now() - startTime;
    
    // 응답 시간 통계 업데이트
    this.updateResponseTime(responseTime);
    
    return data;
  }

  // 요청 재시도
  private async retryRequest(request: NetworkRequest): Promise<any> {
    const delay = Math.pow(2, request.retryCount) * 1000; // 지수 백오프
    await new Promise(resolve => setTimeout(resolve, delay));
    
    return this.processSingleRequest(request);
  }

  // 슬롯 대기
  private async waitForSlot(): Promise<void> {
    return new Promise(resolve => {
      const check = () => {
        if (this.activeRequests.size < this.maxConcurrentRequests) {
          resolve();
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  }

  // 배치 프로세서 시작
  private startBatchProcessor(): void {
    setInterval(() => {
      this.processBatchQueue();
    }, this.batchTimeout);
  }

  // 배치 큐 처리
  private processBatchQueue(): void {
    const now = Date.now();
    
    for (let i = this.batchQueue.length - 1; i >= 0; i--) {
      const batch = this.batchQueue[i];
      
      if (now - batch.timestamp > batch.timeout || 
          batch.requests.length >= batch.maxBatchSize) {
        this.executeBatch(batch);
      }
    }
  }

  // 통계 업데이트
  private updateStats(request: NetworkRequest, result: any, success: boolean): void {
    this.stats.totalRequests++;
    
    if (success) {
      this.stats.successfulRequests++;
      if (result && typeof result === 'object') {
        this.stats.totalDataTransferred += JSON.stringify(result).length;
      }
    } else {
      this.stats.failedRequests++;
    }
  }

  // 응답 시간 업데이트
  private updateResponseTime(responseTime: number): void {
    const total = this.stats.averageResponseTime * (this.stats.successfulRequests - 1) + responseTime;
    this.stats.averageResponseTime = total / this.stats.successfulRequests;
  }

  // 네트워크 통계 반환
  getNetworkStats(): NetworkStats {
    return { ...this.stats };
  }

  // 캐시 히트율 업데이트
  updateCacheHitRate(hitRate: number): void {
    this.stats.cacheHitRate = hitRate;
  }

  // 압축 비율 업데이트
  updateCompressionRatio(ratio: number): void {
    this.stats.compressionRatio = ratio;
  }

  // 배치 효율성 업데이트
  updateBatchEfficiency(efficiency: number): void {
    this.stats.batchEfficiency = efficiency;
  }

  // 설정 업데이트
  updateConfig(config: {
    batchTimeout?: number;
    maxBatchSize?: number;
    maxConcurrentRequests?: number;
  }): void {
    if (config.batchTimeout) this.batchTimeout = config.batchTimeout;
    if (config.maxBatchSize) this.maxBatchSize = config.maxBatchSize;
    if (config.maxConcurrentRequests) this.maxConcurrentRequests = config.maxConcurrentRequests;
  }

  // 큐 상태 확인
  getQueueStatus(): {
    pending: number;
    active: number;
    batches: number;
  } {
    return {
      pending: this.requestQueue.length,
      active: this.activeRequests.size,
      batches: this.batchQueue.length
    };
  }

  // 큐 정리
  clearQueue(): void {
    this.requestQueue = [];
    this.batchQueue = [];
  }

  // 서비스 종료
  destroy(): void {
    this.clearQueue();
    this.activeRequests.clear();
  }
}

// 싱글톤 인스턴스
export const networkOptimizer = new NetworkOptimizer();
