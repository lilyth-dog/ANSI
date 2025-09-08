import { Patent, PatentAnalysis, ConsultingReport, SearchHistory, UserSettings } from '@/types';

export class LocalStorageService {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'PatentAI';
  private readonly DB_VERSION = 1;

  /**
   * IndexedDB 초기화
   */
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
      
      request.onerror = () => {
        console.error('IndexedDB 초기화 오류:', request.error);
        reject(request.error);
      };
      
      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB 초기화 완료');
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        console.log('IndexedDB 스키마 업그레이드 중...');
        
        // 검색 히스토리 저장소
        if (!db.objectStoreNames.contains('searchHistory')) {
          const searchStore = db.createObjectStore('searchHistory', { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          searchStore.createIndex('timestamp', 'timestamp', { unique: false });
          searchStore.createIndex('query', 'query', { unique: false });
        }
        
        // 특허 분석 결과 저장소
        if (!db.objectStoreNames.contains('patentAnalysis')) {
          const analysisStore = db.createObjectStore('patentAnalysis', { 
            keyPath: 'id' 
          });
          analysisStore.createIndex('patentId', 'patentId', { unique: false });
          analysisStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
        
        // 컨설팅 리포트 저장소
        if (!db.objectStoreNames.contains('consultingReports')) {
          const reportStore = db.createObjectStore('consultingReports', { 
            keyPath: 'id' 
          });
          reportStore.createIndex('startupId', 'startupId', { unique: false });
          reportStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
        
        // 사용자 설정 저장소
        if (!db.objectStoreNames.contains('userSettings')) {
          const settingsStore = db.createObjectStore('userSettings', { 
            keyPath: 'userId' 
          });
        }
        
        // 즐겨찾기 특허 저장소
        if (!db.objectStoreNames.contains('favoritePatents')) {
          const favoriteStore = db.createObjectStore('favoritePatents', { 
            keyPath: 'id' 
          });
          favoriteStore.createIndex('patentId', 'patentId', { unique: true });
          favoriteStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
        
        console.log('IndexedDB 스키마 업그레이드 완료');
      };
    });
  }

  /**
   * 검색 히스토리 저장
   */
  async saveSearchHistory(query: string, results: Patent[], resultCount: number): Promise<void> {
    if (!this.db) {
      await this.init();
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['searchHistory'], 'readwrite');
      const store = transaction.objectStore('searchHistory');
      
      const searchRecord: SearchHistory = {
        id: Date.now().toString(),
        query,
        results: results.slice(0, 10), // 최근 10개 결과만 저장
        resultCount,
        timestamp: new Date().toISOString()
      };
      
      const request = store.add(searchRecord);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 검색 히스토리 조회
   */
  async getSearchHistory(limit: number = 20): Promise<SearchHistory[]> {
    if (!this.db) {
      await this.init();
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['searchHistory'], 'readonly');
      const store = transaction.objectStore('searchHistory');
      const index = store.index('timestamp');
      
      const request = index.openCursor(null, 'prev');
      const history: SearchHistory[] = [];
      
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor && history.length < limit) {
          history.push(cursor.value);
          cursor.continue();
        } else {
          resolve(history);
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 특허 분석 결과 저장
   */
  async savePatentAnalysis(analysis: PatentAnalysis): Promise<void> {
    if (!this.db) {
      await this.init();
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['patentAnalysis'], 'readwrite');
      const store = transaction.objectStore('patentAnalysis');
      
      const analysisRecord = {
        id: `analysis_${Date.now()}`,
        ...analysis,
        timestamp: new Date().toISOString()
      };
      
      const request = store.put(analysisRecord);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 특허 분석 결과 조회
   */
  async getPatentAnalysis(patentId: string): Promise<PatentAnalysis | null> {
    if (!this.db) {
      await this.init();
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['patentAnalysis'], 'readonly');
      const store = transaction.objectStore('patentAnalysis');
      const index = store.index('patentId');
      
      const request = index.get(patentId);
      
      request.onsuccess = () => {
        const result = request.result;
        if (result && result.length > 0) {
          // 가장 최근 분석 결과 반환
          const latest = result.sort((a: any, b: any) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )[0];
          resolve(latest);
        } else {
          resolve(null);
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 컨설팅 리포트 저장
   */
  async saveConsultingReport(report: ConsultingReport): Promise<void> {
    if (!this.db) {
      await this.init();
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['consultingReports'], 'readwrite');
      const store = transaction.objectStore('consultingReports');
      
      const reportRecord = {
        id: report.id,
        startupId: report.startupId,
        report,
        timestamp: new Date().toISOString()
      };
      
      const request = store.put(reportRecord);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 컨설팅 리포트 조회
   */
  async getConsultingReports(limit: number = 20): Promise<any[]> {
    if (!this.db) {
      await this.init();
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['consultingReports'], 'readonly');
      const store = transaction.objectStore('consultingReports');
      const index = store.index('timestamp');
      
      const request = index.openCursor(null, 'prev');
      const reports: any[] = [];
      
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor && reports.length < limit) {
          reports.push(cursor.value);
          cursor.continue();
        } else {
          resolve(reports);
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 즐겨찾기 특허 추가
   */
  async addFavoritePatent(patent: Patent): Promise<void> {
    if (!this.db) {
      await this.init();
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['favoritePatents'], 'readwrite');
      const store = transaction.objectStore('favoritePatents');
      
      const favoriteRecord = {
        id: `favorite_${Date.now()}`,
        patentId: patent.id,
        patent,
        timestamp: new Date().toISOString()
      };
      
      const request = store.put(favoriteRecord);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 즐겨찾기 특허 제거
   */
  async removeFavoritePatent(patentId: string): Promise<void> {
    if (!this.db) {
      await this.init();
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['favoritePatents'], 'readwrite');
      const store = transaction.objectStore('favoritePatents');
      const index = store.index('patentId');
      
      const request = index.getKey(patentId);
      
      request.onsuccess = () => {
        const key = request.result;
        if (key) {
          const deleteRequest = store.delete(key);
          deleteRequest.onsuccess = () => resolve();
          deleteRequest.onerror = () => reject(deleteRequest.error);
        } else {
          resolve();
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 즐겨찾기 특허 목록 조회
   */
  async getFavoritePatents(): Promise<Patent[]> {
    if (!this.db) {
      await this.init();
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['favoritePatents'], 'readonly');
      const store = transaction.objectStore('favoritePatents');
      const index = store.index('timestamp');
      
      const request = index.openCursor(null, 'prev');
      const favorites: Patent[] = [];
      
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          favorites.push(cursor.value.patent);
          cursor.continue();
        } else {
          resolve(favorites);
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 사용자 설정 저장
   */
  async saveUserSettings(settings: UserSettings): Promise<void> {
    if (!this.db) {
      await this.init();
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['userSettings'], 'readwrite');
      const store = transaction.objectStore('userSettings');
      
      const request = store.put(settings);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 사용자 설정 조회
   */
  async getUserSettings(userId: string): Promise<UserSettings | null> {
    if (!this.db) {
      await this.init();
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['userSettings'], 'readonly');
      const store = transaction.objectStore('userSettings');
      
      const request = store.get(userId);
      
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 데이터 내보내기 (JSON 파일)
   */
  async exportData(): Promise<string> {
    if (!this.db) {
      await this.init();
    }
    
    const data = {
      searchHistory: await this.getSearchHistory(1000),
      patentAnalysis: await this.getAllPatentAnalysis(),
      consultingReports: await this.getConsultingReports(1000),
      favoritePatents: await this.getFavoritePatents(),
      exportDate: new Date().toISOString()
    };
    
    return JSON.stringify(data, null, 2);
  }

  /**
   * 모든 특허 분석 결과 조회
   */
  private async getAllPatentAnalysis(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['patentAnalysis'], 'readonly');
      const store = transaction.objectStore('patentAnalysis');
      
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 데이터베이스 초기화 (개발용)
   */
  async clearAllData(): Promise<void> {
    if (!this.db) {
      await this.init();
    }
    
    const stores = ['searchHistory', 'patentAnalysis', 'consultingReports', 'favoritePatents', 'userSettings'];
    
    for (const storeName of stores) {
      await new Promise<void>((resolve, reject) => {
        const transaction = this.db!.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
    
    console.log('모든 데이터가 초기화되었습니다.');
  }

  /**
   * 데이터베이스 상태 확인
   */
  async getDatabaseInfo(): Promise<any> {
    if (!this.db) {
      await this.init();
    }
    
    const stores = ['searchHistory', 'patentAnalysis', 'consultingReports', 'favoritePatents', 'userSettings'];
    const info: any = {};
    
    for (const storeName of stores) {
      const count = await new Promise<number>((resolve, reject) => {
        const transaction = this.db!.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.count();
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      
      info[storeName] = count;
    }
    
    return {
      databaseName: this.DB_NAME,
      version: this.DB_VERSION,
      storeCounts: info,
      totalSize: await this.getDatabaseSize()
    };
  }

  /**
   * 데이터베이스 크기 추정
   */
  private async getDatabaseSize(): Promise<string> {
    // IndexedDB는 정확한 크기를 제공하지 않으므로 추정치 반환
    return '추정 불가 (IndexedDB 제한)';
  }
}

// 싱글톤 인스턴스 생성
export const storageService = new LocalStorageService();
