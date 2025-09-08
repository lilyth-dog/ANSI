import { Patent, WebSearchResult, MarketReport, SimulationResults } from '../types';

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
  accessCount: number;
  lastAccessed: number;
}

export interface CacheConfig {
  maxSize: number; // Maximum number of entries
  defaultTTL: number; // Default time to live in milliseconds
  cleanupInterval: number; // Cleanup interval in milliseconds
  compressionEnabled: boolean;
  offlineMode: boolean;
}

export class CacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private config: CacheConfig;
  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: 1000,
      defaultTTL: 24 * 60 * 60 * 1000, // 24 hours
      cleanupInterval: 60 * 60 * 1000, // 1 hour
      compressionEnabled: true,
      offlineMode: false,
      ...config
    };

    this.startCleanupTimer();
    this.loadFromStorage();
  }

  // 특허 검색 결과 캐싱
  async cachePatentSearch(query: string, results: Patent[]): Promise<void> {
    const key = `patent_search:${this.hashString(query)}`;
    await this.set(key, results, this.config.defaultTTL);
  }

  // 특허 상세 정보 캐싱
  async cachePatentDetail(patentId: string, patent: Patent): Promise<void> {
    const key = `patent_detail:${patentId}`;
    await this.set(key, patent, this.config.defaultTTL * 2); // 상세 정보는 더 오래 캐싱
  }

  // 웹 검색 결과 캐싱
  async cacheWebSearch(query: string, results: WebSearchResult[]): Promise<void> {
    const key = `web_search:${this.hashString(query)}`;
    await this.set(key, results, this.config.defaultTTL / 2); // 웹 검색은 짧게 캐싱
  }

  // 시장 분석 결과 캐싱
  async cacheMarketAnalysis(query: string, report: MarketReport): Promise<void> {
    const key = `market_analysis:${this.hashString(query)}`;
    await this.set(key, report, this.config.defaultTTL * 3); // 시장 분석은 더 오래 캐싱
  }

  // 시뮬레이션 결과 캐싱
  async cacheSimulationResults(params: string, results: SimulationResults): Promise<void> {
    const key = `simulation:${this.hashString(params)}`;
    await this.set(key, results, this.config.defaultTTL * 4); // 시뮬레이션은 가장 오래 캐싱
  }

  // 캐시에서 데이터 검색
  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // TTL 확인
    if (Date.now() > entry.timestamp + entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    // 접근 통계 업데이트
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    
    return entry.data;
  }

  // 캐시에 데이터 저장
  async set<T>(key: string, data: T, ttl?: number): Promise<void> {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.defaultTTL,
      accessCount: 1,
      lastAccessed: Date.now()
    };

    // 압축 적용
    if (this.config.compressionEnabled) {
      entry.data = this.compressData(data);
    }

    this.cache.set(key, entry);

    // 캐시 크기 제한 확인
    if (this.cache.size > this.config.maxSize) {
      this.evictLeastUsed();
    }

    // 로컬 스토리지에 저장
    this.saveToStorage();
  }

  // 특허 검색 결과 가져오기 (캐시 우선)
  async getCachedPatentSearch(query: string): Promise<Patent[] | null> {
    const key = `patent_search:${this.hashString(query)}`;
    return await this.get<Patent[]>(key);
  }

  // 특허 상세 정보 가져오기 (캐시 우선)
  async getCachedPatentDetail(patentId: string): Promise<Patent | null> {
    const key = `patent_detail:${patentId}`;
    return await this.get<Patent>(key);
  }

  // 웹 검색 결과 가져오기 (캐시 우선)
  async getCachedWebSearch(query: string): Promise<WebSearchResult[] | null> {
    const key = `web_search:${this.hashString(query)}`;
    return await this.get<WebSearchResult[]>(key);
  }

  // 시장 분석 결과 가져오기 (캐시 우선)
  async getCachedMarketAnalysis(query: string): Promise<MarketReport | null> {
    const key = `market_analysis:${this.hashString(query)}`;
    return await this.get<MarketReport>(key);
  }

  // 시뮬레이션 결과 가져오기 (캐시 우선)
  async getCachedSimulationResults(params: string): Promise<SimulationResults | null> {
    const key = `simulation:${this.hashString(params)}`;
    return await this.get<SimulationResults>(key);
  }

  // 캐시 히트율 계산
  getCacheHitRate(): number {
    const totalAccesses = Array.from(this.cache.values())
      .reduce((sum, entry) => sum + entry.accessCount, 0);
    
    return totalAccesses > 0 ? totalAccesses / this.cache.size : 0;
  }

  // 캐시 통계
  getCacheStats() {
    const totalSize = Array.from(this.cache.values())
      .reduce((sum, entry) => sum + JSON.stringify(entry.data).length, 0);
    
    return {
      totalEntries: this.cache.size,
      totalSize: this.formatBytes(totalSize),
      hitRate: this.getCacheHitRate(),
      oldestEntry: Math.min(...Array.from(this.cache.values()).map(e => e.timestamp)),
      newestEntry: Math.max(...Array.from(this.cache.values()).map(e => e.timestamp))
    };
  }

  // 오프라인 모드 설정
  setOfflineMode(enabled: boolean): void {
    this.config.offlineMode = enabled;
  }

  // 오프라인 모드 확인
  isOfflineMode(): boolean {
    return this.config.offlineMode;
  }

  // 캐시 정리
  clearCache(): void {
    this.cache.clear();
    this.saveToStorage();
  }

  // 특정 키 삭제
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.saveToStorage();
    }
    return deleted;
  }

  // 만료된 항목 정리
  private cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.timestamp + entry.ttl) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach(key => this.cache.delete(key));
    
    if (expiredKeys.length > 0) {
      this.saveToStorage();
    }
  }

  // 가장 적게 사용된 항목 제거
  private evictLeastUsed(): void {
    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => a[1].accessCount - b[1].accessCount);
    
    // 가장 적게 사용된 10% 제거
    const toRemove = Math.ceil(entries.length * 0.1);
    for (let i = 0; i < toRemove; i++) {
      this.cache.delete(entries[i][0]);
    }
  }

  // 정리 타이머 시작
  private startCleanupTimer(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);
  }

  // 로컬 스토리지에 저장
  private saveToStorage(): void {
    try {
      const data = Array.from(this.cache.entries());
      localStorage.setItem('patent_cache', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save cache to localStorage:', error);
    }
  }

  // 로컬 스토리지에서 로드
  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem('patent_cache');
      if (data && data.trim()) {
        // JSON 유효성 검사
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          this.cache = new Map(parsed);
        } else {
          console.warn('Invalid cache format, clearing cache');
          localStorage.removeItem('patent_cache');
        }
      }
    } catch (error) {
      console.warn('Failed to load cache from localStorage:', error);
      // 손상된 캐시 데이터 제거
      localStorage.removeItem('patent_cache');
    }
  }

  // 문자열 해시 생성
  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  }

  // 데이터 압축 (간단한 압축)
  private compressData<T>(data: T): T {
    if (this.config.compressionEnabled && typeof data === 'string') {
      // 간단한 문자열 압축
      return data.replace(/\s+/g, ' ').trim() as any;
    }
    return data;
  }

  // 바이트 단위 포맷팅
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // 서비스 종료
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    this.saveToStorage();
  }
}

// 싱글톤 인스턴스
export const cacheService = new CacheService();
