/**
 * 구독 및 결제 서비스 관리
 * 기본/프리미엄/엔터프라이즈 티어 관리
 */

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    searchesPerMonth: number;
    analysesPerMonth: number;
    apiCallsPerMonth: number;
    storageGB: number;
  };
  isPopular?: boolean;
  description: string;
}

export interface UserSubscription {
  planId: string;
  status: 'active' | 'inactive' | 'cancelled' | 'trial';
  startDate: string;
  endDate?: string;
  trialEndDate?: string;
  usage: {
    searchesThisMonth: number;
    analysesThisMonth: number;
    apiCallsThisMonth: number;
  };
}

export class SubscriptionService {
  private static instance: SubscriptionService;
  private currentSubscription: UserSubscription | null = null;

  private constructor() {
    this.loadSubscription();
  }

  public static getInstance(): SubscriptionService {
    if (!SubscriptionService.instance) {
      SubscriptionService.instance = new SubscriptionService();
    }
    return SubscriptionService.instance;
  }

  // 구독 플랜 정의
  getPlans(): SubscriptionPlan[] {
    return [
      {
        id: 'free',
        name: '기본 플랜',
        price: 0,
        currency: 'KRW',
        interval: 'month',
        description: '특허 검색과 기본 분석을 무료로 체험해보세요',
        features: [
          '월 10회 특허 검색',
          '월 3회 AI 분석',
          '데모 데이터 기반',
          '기본 리포트',
          '커뮤니티 지원'
        ],
        limits: {
          searchesPerMonth: 10,
          analysesPerMonth: 3,
          apiCallsPerMonth: 50,
          storageGB: 0.1
        }
      },
      {
        id: 'premium',
        name: '프리미엄 플랜',
        price: 29000,
        currency: 'KRW',
        interval: 'month',
        description: '실시간 데이터와 전문 AI 분석으로 정확한 인사이트를 얻으세요',
        features: [
          '무제한 특허 검색',
          '무제한 AI 분석',
          '실시간 KIPRIS 데이터',
          '고급 AI 모델 (GPT-4, Claude)',
          '상세 분석 리포트',
          '경쟁사 분석',
          '시장 인사이트',
          '우선 지원',
          'API 접근'
        ],
        limits: {
          searchesPerMonth: -1, // 무제한
          analysesPerMonth: -1,
          apiCallsPerMonth: 10000,
          storageGB: 5
        },
        isPopular: true
      },
      {
        id: 'enterprise',
        name: '엔터프라이즈 플랜',
        price: 0, // 맞춤형 가격
        currency: 'KRW',
        interval: 'month',
        description: '대규모 특허 포트폴리오 관리와 맞춤형 컨설팅',
        features: [
          '모든 프리미엄 기능',
          '대량 데이터 처리',
          '맞춤형 AI 모델',
          '전담 컨설턴트',
          '온프레미스 배포',
          'SLA 보장',
          '24/7 지원',
          '맞춤형 통합'
        ],
        limits: {
          searchesPerMonth: -1,
          analysesPerMonth: -1,
          apiCallsPerMonth: -1,
          storageGB: 100
        }
      }
    ];
  }

  // 현재 구독 정보 로드
  private loadSubscription(): void {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('patent-ai-subscription');
        if (saved) {
          this.currentSubscription = JSON.parse(saved);
        } else {
          // 기본적으로 무료 플랜
          this.currentSubscription = {
            planId: 'free',
            status: 'active',
            startDate: new Date().toISOString(),
            usage: {
              searchesThisMonth: 0,
              analysesThisMonth: 0,
              apiCallsThisMonth: 0
            }
          };
          this.saveSubscription();
        }
      }
    } catch (error) {
      console.error('구독 정보 로드 오류:', error);
      this.currentSubscription = {
        planId: 'free',
        status: 'active',
        startDate: new Date().toISOString(),
        usage: {
          searchesThisMonth: 0,
          analysesThisMonth: 0,
          apiCallsThisMonth: 0
        }
      };
    }
  }

  // 구독 정보 저장
  private saveSubscription(): void {
    try {
      if (typeof window !== 'undefined' && this.currentSubscription) {
        localStorage.setItem('patent-ai-subscription', JSON.stringify(this.currentSubscription));
      }
    } catch (error) {
      console.error('구독 정보 저장 오류:', error);
    }
  }

  // 현재 구독 정보 반환
  getCurrentSubscription(): UserSubscription | null {
    return this.currentSubscription;
  }

  // 현재 플랜 정보 반환
  getCurrentPlan(): SubscriptionPlan | null {
    if (!this.currentSubscription) return null;
    return this.getPlans().find(plan => plan.id === this.currentSubscription!.planId) || null;
  }

  // 사용량 확인
  canPerformAction(action: 'search' | 'analysis' | 'apiCall'): boolean {
    if (!this.currentSubscription) return false;
    
    const plan = this.getCurrentPlan();
    if (!plan) return false;

    const limits = plan.limits;
    const usage = this.currentSubscription.usage;

    switch (action) {
      case 'search':
        return limits.searchesPerMonth === -1 || usage.searchesThisMonth < limits.searchesPerMonth;
      case 'analysis':
        return limits.analysesPerMonth === -1 || usage.analysesThisMonth < limits.analysesPerMonth;
      case 'apiCall':
        return limits.apiCallsPerMonth === -1 || usage.apiCallsThisMonth < limits.apiCallsPerMonth;
      default:
        return false;
    }
  }

  // 사용량 증가
  incrementUsage(action: 'search' | 'analysis' | 'apiCall'): void {
    if (!this.currentSubscription) return;

    switch (action) {
      case 'search':
        this.currentSubscription.usage.searchesThisMonth++;
        break;
      case 'analysis':
        this.currentSubscription.usage.analysesThisMonth++;
        break;
      case 'apiCall':
        this.currentSubscription.usage.apiCallsThisMonth++;
        break;
    }

    this.saveSubscription();
  }

  // 플랜 업그레이드
  upgradePlan(planId: string): Promise<boolean> {
    return new Promise((resolve) => {
      // 실제 결제 시스템 연동 시 여기에 결제 로직 구현
      console.log(`플랜 업그레이드: ${planId}`);
      
      // 시뮬레이션: 성공적으로 업그레이드
      setTimeout(() => {
        if (this.currentSubscription) {
          this.currentSubscription.planId = planId;
          this.currentSubscription.status = 'active';
          this.saveSubscription();
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    });
  }

  // 사용량 리셋 (월별)
  resetMonthlyUsage(): void {
    if (this.currentSubscription) {
      this.currentSubscription.usage = {
        searchesThisMonth: 0,
        analysesThisMonth: 0,
        apiCallsThisMonth: 0
      };
      this.saveSubscription();
    }
  }

  // 남은 사용량 반환
  getRemainingUsage(): { searches: number; analyses: number; apiCalls: number } {
    if (!this.currentSubscription) {
      return { searches: 0, analyses: 0, apiCalls: 0 };
    }

    const plan = this.getCurrentPlan();
    if (!plan) {
      return { searches: 0, analyses: 0, apiCalls: 0 };
    }

    const limits = plan.limits;
    const usage = this.currentSubscription.usage;

    return {
      searches: limits.searchesPerMonth === -1 ? -1 : Math.max(0, limits.searchesPerMonth - usage.searchesThisMonth),
      analyses: limits.analysesPerMonth === -1 ? -1 : Math.max(0, limits.analysesPerMonth - usage.analysesThisMonth),
      apiCalls: limits.apiCallsPerMonth === -1 ? -1 : Math.max(0, limits.apiCallsPerMonth - usage.apiCallsThisMonth)
    };
  }

  // 프리미엄 기능 사용 가능 여부
  hasPremiumFeature(feature: string): boolean {
    const plan = this.getCurrentPlan();
    if (!plan) return false;

    return plan.features.includes(feature);
  }

  // 결제 페이지 URL 생성
  getPaymentUrl(planId: string): string {
    // 실제 결제 시스템 연동 시 여기에 결제 URL 생성
    return `/payment?plan=${planId}`;
  }
}

// 싱글톤 인스턴스
export const subscriptionService = SubscriptionService.getInstance();
