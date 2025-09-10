/**
 * PatentAI 브랜드 보이스 및 메시징 시스템
 * 비전공자도 쉽게 이해할 수 있는 친근하고 전문적인 톤
 */

export interface BrandMessage {
  title: string;
  description: string;
  cta?: string;
  icon?: string;
  tone: 'friendly' | 'professional' | 'encouraging' | 'informative';
}

export class BrandVoice {
  // 브랜드 톤앤매너
  static readonly TONE = {
    friendly: '친근하고 이해하기 쉬운',
    professional: '전문적이지만 접근하기 쉬운',
    encouraging: '격려하고 동기부여하는',
    informative: '명확하고 유용한 정보 제공'
  };

  // API 설정 관련 메시지
  static getApiSetupMessages(): BrandMessage[] {
    return [
      {
        title: "🔧 기술 설정이 어려우신가요?",
        description: "API 키 설정은 복잡할 수 있어요. 걱정하지 마세요! 기본 기능으로도 충분히 특허 분석을 체험할 수 있습니다.",
        tone: 'friendly'
      },
      {
        title: "💡 더 정확한 분석을 원하신다면",
        description: "프리미엄 플랜을 통해 전문 AI 분석을 받아보세요. 복잡한 설정 없이 바로 이용 가능합니다.",
        cta: "프리미엄 플랜 알아보기",
        tone: 'encouraging'
      },
      {
        title: "🎯 지금도 충분히 유용해요",
        description: "현재 데모 데이터로도 특허의 기본적인 정보와 분석을 확인할 수 있습니다. 먼저 체험해보세요!",
        tone: 'encouraging'
      }
    ];
  }

  // 서비스 티어 관련 메시지
  static getServiceTierMessages(): BrandMessage[] {
    return [
      {
        title: "🆓 기본 플랜 - 무료",
        description: "특허 검색과 기본 분석을 무료로 체험해보세요. 스타트업의 첫 걸음을 도와드립니다.",
        tone: 'friendly'
      },
      {
        title: "⭐ 프리미엄 플랜 - 월 29,000원",
        description: "실시간 특허 데이터와 전문 AI 분석으로 정확한 비즈니스 인사이트를 얻으세요.",
        cta: "프리미엄 시작하기",
        tone: 'professional'
      },
      {
        title: "🚀 엔터프라이즈 플랜 - 맞춤형",
        description: "대규모 특허 포트폴리오 관리와 맞춤형 컨설팅을 제공합니다.",
        cta: "문의하기",
        tone: 'professional'
      }
    ];
  }

  // 기능 설명 메시지
  static getFeatureMessages(): BrandMessage[] {
    return [
      {
        title: "🔍 스마트 특허 검색",
        description: "복잡한 검색어 없이도 비즈니스 아이디어만 입력하면 관련 특허를 찾아드려요.",
        tone: 'friendly'
      },
      {
        title: "🧠 AI 특허 분석",
        description: "전문가 수준의 특허 분석을 AI가 몇 초 만에 제공합니다. 특허 지식이 없어도 쉽게 이해할 수 있어요.",
        tone: 'informative'
      },
      {
        title: "📊 시장 인사이트",
        description: "경쟁사 분석과 시장 기회를 한눈에 파악할 수 있습니다. 데이터 기반 의사결정을 도와드려요.",
        tone: 'professional'
      },
      {
        title: "💼 비즈니스 컨설팅",
        description: "특허 전략부터 투자 유치까지, 스타트업의 성장 단계별 맞춤 가이드를 제공합니다.",
        tone: 'encouraging'
      }
    ];
  }

  // 온보딩 메시지
  static getOnboardingMessages(): BrandMessage[] {
    return [
      {
        title: "👋 PatentAI에 오신 것을 환영합니다!",
        description: "특허가 어렵다고 생각하셨나요? 저희가 쉽게 만들어드릴게요. 3분이면 첫 분석을 시작할 수 있습니다.",
        tone: 'friendly'
      },
      {
        title: "🎯 무엇을 도와드릴까요?",
        description: "새로운 아이디어의 특허 가능성을 확인하거나, 경쟁사 분석이 필요하신가요? 무엇이든 도와드립니다.",
        tone: 'encouraging'
      },
      {
        title: "💡 시작하기 전에",
        description: "기본 기능은 무료로 이용할 수 있어요. 더 정확한 분석이 필요하시면 언제든 프리미엄으로 업그레이드하세요.",
        tone: 'informative'
      }
    ];
  }

  // 에러 메시지
  static getErrorMessage(type: string): BrandMessage {
    const messages = {
      api_error: {
        title: "😅 잠시 문제가 있었네요",
        description: "서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요. 계속 문제가 있다면 고객지원팀에 연락해주세요.",
        tone: 'friendly'
      },
      network_error: {
        title: "🌐 인터넷 연결을 확인해주세요",
        description: "네트워크 연결에 문제가 있는 것 같아요. 인터넷 연결을 확인하고 다시 시도해주세요.",
        tone: 'informative'
      },
      rate_limit: {
        title: "⏰ 잠시만 기다려주세요",
        description: "너무 많은 요청을 보내셨네요. 1분 후에 다시 시도해주세요. 프리미엄 플랜에서는 더 빠른 처리가 가능합니다.",
        tone: 'friendly'
      }
    };

    return messages[type as keyof typeof messages] || messages.api_error;
  }

  // 성공 메시지
  static getSuccessMessage(type: string): BrandMessage {
    const messages = {
      analysis_complete: {
        title: "🎉 분석이 완료되었습니다!",
        description: "AI가 특허를 분석했어요. 결과를 확인하고 비즈니스에 활용해보세요.",
        tone: 'encouraging'
      },
      search_complete: {
        title: "🔍 검색 결과를 찾았어요!",
        description: "관련 특허들을 찾았습니다. 더 자세한 분석이 필요하시면 AI 분석을 이용해보세요.",
        tone: 'friendly'
      },
      upgrade_success: {
        title: "⭐ 프리미엄으로 업그레이드 완료!",
        description: "이제 더 정확하고 빠른 분석을 받을 수 있습니다. 프리미엄 기능을 체험해보세요.",
        tone: 'encouraging'
      }
    };

    return messages[type as keyof typeof messages] || messages.analysis_complete;
  }

  // CTA (Call to Action) 메시지
  static getCTAMessages(): BrandMessage[] {
    return [
      {
        title: "🚀 지금 시작해보세요",
        description: "무료로 시작해서 필요할 때 업그레이드하세요. 첫 분석은 3분이면 완료됩니다.",
        cta: "무료로 시작하기",
        tone: 'encouraging'
      },
      {
        title: "💎 프리미엄의 차이를 느껴보세요",
        description: "실시간 데이터와 전문 AI 분석으로 더 정확한 인사이트를 얻으세요.",
        cta: "프리미엄 체험하기",
        tone: 'professional'
      },
      {
        title: "📞 도움이 필요하신가요?",
        description: "특허나 서비스 이용에 대해 궁금한 점이 있으시면 언제든 문의해주세요.",
        cta: "고객지원 문의",
        tone: 'friendly'
      }
    ];
  }
}

export const brandVoice = new BrandVoice();
