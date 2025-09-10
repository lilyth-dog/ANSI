/**
 * API 설정 관리
 * KIPRIS는 서버사이드 환경변수로, OpenRouter는 사용자 설정으로 관리
 */

export interface ApiConfig {
  kipris: {
    apiKey: string;
    apiUrl: string;
    isEnabled: boolean;
    isManaged: boolean; // 서버에서 관리되는지 여부
  };
  openrouter: {
    apiKey: string;
    apiUrl: string;
    isEnabled: boolean;
    isManaged: boolean;
  };
}

export class ApiConfigManager {
  private static instance: ApiConfigManager;
  private config: ApiConfig;

  private constructor() {
    this.config = this.loadConfig();
  }

  public static getInstance(): ApiConfigManager {
    if (!ApiConfigManager.instance) {
      ApiConfigManager.instance = new ApiConfigManager();
    }
    return ApiConfigManager.instance;
  }

  /**
   * 설정 로드
   */
  private loadConfig(): ApiConfig {
    return {
      kipris: {
        apiKey: process.env.KIPRIS_API_KEY || '',
        apiUrl: process.env.KIPRIS_API_URL || 'https://www.kipris.or.kr/khome/main/base',
        isEnabled: !!process.env.KIPRIS_API_KEY,
        isManaged: true // 서버에서 관리
      },
      openrouter: {
        apiKey: this.loadUserOpenRouterKey(),
        apiUrl: 'https://openrouter.ai/api/v1',
        isEnabled: !!this.loadUserOpenRouterKey(),
        isManaged: false // 사용자가 관리
      }
    };
  }

  /**
   * 사용자 OpenRouter 키 로드
   */
  private loadUserOpenRouterKey(): string {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('user-openrouter-key');
        return saved || '';
      }
    } catch (error) {
      console.error('OpenRouter 키 로드 오류:', error);
    }
    return '';
  }

  /**
   * 사용자 OpenRouter 키 저장
   */
  public saveUserOpenRouterKey(apiKey: string): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('user-openrouter-key', apiKey);
        this.config.openrouter.apiKey = apiKey;
        this.config.openrouter.isEnabled = !!apiKey;
      }
    } catch (error) {
      console.error('OpenRouter 키 저장 오류:', error);
    }
  }

  /**
   * 현재 설정 반환
   */
  public getConfig(): ApiConfig {
    return { ...this.config };
  }

  /**
   * KIPRIS 설정 반환 (읽기 전용)
   */
  public getKiprisConfig() {
    return {
      ...this.config.kipris,
      apiKey: this.config.kipris.isEnabled ? '***설정됨***' : '설정되지 않음'
    };
  }

  /**
   * OpenRouter 설정 반환
   */
  public getOpenRouterConfig() {
    return {
      ...this.config.openrouter,
      apiKey: this.config.openrouter.isEnabled ? '***설정됨***' : '설정되지 않음'
    };
  }

  /**
   * API 키 유효성 검증
   */
  public async validateOpenRouterKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      return response.ok;
    } catch (error) {
      console.error('OpenRouter 키 검증 오류:', error);
      return false;
    }
  }
}

// 싱글톤 인스턴스
export const apiConfigManager = ApiConfigManager.getInstance();
