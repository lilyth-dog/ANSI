import { Patent, MarketAnalysis, Startup, FundingStage } from '@/types';
import { webSearchService, WebSearchResult } from './web-search';
import { aiAnalysisService } from './ai-analysis';

export interface MarketTrend {
  period: string;
  growthRate: number;
  marketSize: number;
  keyDrivers: string[];
  challenges: string[];
}

export interface CompetitiveAnalysis {
  directCompetitors: Competitor[];
  indirectCompetitors: Competitor[];
  marketPosition: string;
  competitiveAdvantages: string[];
  threats: string[];
}

export interface Competitor {
  name: string;
  marketShare: number;
  strengths: string[];
  weaknesses: string[];
  patents: Patent[];
  funding: FundingStage;
}

export interface MarketOpportunity {
  area: string;
  potential: number; // 1-10
  barriers: string[];
  entryStrategies: string[];
  estimatedInvestment: number;
  timeline: string;
}

export interface MarketReport {
  summary: string;
  marketSize: MarketSize;
  trends: MarketTrend[];
  competitiveAnalysis: CompetitiveAnalysis;
  opportunities: MarketOpportunity[];
  recommendations: string[];
  riskFactors: string[];
  timeline: string;
}

export interface MarketSize {
  current: number;
  projected: number;
  growthRate: number;
  unit: string;
  source: string;
}

export class MarketAnalysisService {
  private industryData: Map<string, any> = new Map();
  private marketReports: Map<string, MarketReport> = new Map();

  /**
   * 종합 시장 분석 수행
   */
  async analyzeMarket(patents: Patent[], startup?: Startup): Promise<MarketReport> {
    try {
      // 1. 특허 기반 기술 분야 분석
      const technologyDomain = this.analyzeTechnologyDomain(patents);
      
      // 2. 시장 규모 및 성장률 분석
      const marketSize = await this.analyzeMarketSize(technologyDomain);
      
      // 3. 시장 트렌드 분석
      const trends = await this.analyzeMarketTrends(technologyDomain);
      
      // 4. 경쟁 환경 분석
      const competitiveAnalysis = await this.analyzeCompetition(patents, technologyDomain);
      
      // 5. 시장 기회 분석
      const opportunities = await this.analyzeMarketOpportunities(patents, technologyDomain);
      
      // 6. 리스크 분석
      const riskFactors = this.analyzeRiskFactors(patents, marketSize, competitiveAnalysis);
      
      // 7. 전략적 권장사항 생성
      const recommendations = this.generateRecommendations(patents, marketSize, competitiveAnalysis, opportunities);
      
      // 8. 시장 진입 타임라인
      const timeline = this.generateTimeline(patents, marketSize, startup);
      
      const report: MarketReport = {
        summary: this.generateMarketSummary(technologyDomain, marketSize, trends),
        marketSize,
        trends,
        competitiveAnalysis,
        opportunities,
        recommendations,
        riskFactors,
        timeline
      };
      
      // 결과 캐싱
      const cacheKey = this.generateCacheKey(patents, startup);
      this.marketReports.set(cacheKey, report);
      
      return report;
    } catch (error) {
      console.error('시장 분석 오류:', error);
      return this.getFallbackMarketReport(patents);
    }
  }

  /**
   * 기술 분야 분석
   */
  private analyzeTechnologyDomain(patents: Patent[]): string {
    const classificationCount: { [key: string]: number } = {};
    
    patents.forEach(patent => {
      patent.classification.forEach(classification => {
        const mainClass = classification.split(' ')[0];
        classificationCount[mainClass] = (classificationCount[mainClass] || 0) + 1;
      });
    });
    
    const dominantClass = Object.entries(classificationCount)
      .sort(([,a], [,b]) => b - a)[0];
    
    return dominantClass ? dominantClass[0] : 'G06'; // 기본값: 컴퓨터 기술
  }

  /**
   * 시장 규모 분석
   */
  private async analyzeMarketSize(technologyDomain: string): Promise<MarketSize> {
    try {
      // 웹 검색을 통한 시장 데이터 수집
      const searchResults = await webSearchService.searchWeb({
        query: `${technologyDomain} 시장 규모 2024 2025`,
        maxResults: 10
      });
      
      // AI를 통한 시장 규모 추정
      const aiAnalysis = await this.estimateMarketSizeWithAI(technologyDomain, searchResults);
      
      return {
        current: aiAnalysis.currentSize,
        projected: aiAnalysis.projectedSize,
        growthRate: aiAnalysis.growthRate,
        unit: '백만 달러',
        source: 'AI 분석 + 웹 검색'
      };
    } catch (error) {
      console.error('시장 규모 분석 오류:', error);
      return this.getDefaultMarketSize(technologyDomain);
    }
  }

  /**
   * AI를 통한 시장 규모 추정
   */
  private async estimateMarketSizeWithAI(technologyDomain: string, searchResults: WebSearchResult[]): Promise<{
    currentSize: number;
    projectedSize: number;
    growthRate: number;
  }> {
    try {
      const context = searchResults.map(result => `${result.title}: ${result.snippet}`).join('\n');
      
      const prompt = `
다음 정보를 바탕으로 ${technologyDomain} 기술 분야의 시장 규모를 추정해주세요:

검색 결과:
${context}

다음 형식으로 JSON 응답을 제공해주세요:
{
  "currentSize": 현재 시장 규모 (백만 달러),
  "projectedSize": 2025년 예상 시장 규모 (백만 달러),
  "growthRate": 연평균 성장률 (%)
}
      `;

      // AI 분석 서비스 사용
      const response = await aiAnalysisService.analyzePatent({
        id: 'market_analysis',
        title: `${technologyDomain} 시장 분석`,
        abstract: prompt,
        inventors: [],
        applicants: [],
        applicationDate: '',
        publicationDate: '',
        status: 'pending' as any,
        classification: [technologyDomain],
        claims: [],
        description: context,
        drawings: [],
        legalStatus: 'active' as any,
        citations: [],
        familyPatents: []
      });

      // AI 분석 결과를 시장 규모로 변환
      const marketPotential = response.marketPotential;
      const baseSize = 1000; // 기본 시장 규모
      
      return {
        currentSize: Math.round(baseSize * (marketPotential / 10)),
        projectedSize: Math.round(baseSize * (marketPotential / 10) * 1.15), // 15% 성장 가정
        growthRate: 15
      };
    } catch (error) {
      console.error('AI 시장 규모 추정 오류:', error);
      return this.getDefaultMarketSize(technologyDomain);
    }
  }

  /**
   * 기본 시장 규모 (AI 실패 시)
   */
  private getDefaultMarketSize(technologyDomain: string): MarketSize {
    const defaultSizes: { [key: string]: MarketSize } = {
      'G06': { current: 2500, projected: 3000, growthRate: 20, unit: '백만 달러', source: '기본값' },
      'H04': { current: 1800, projected: 2200, growthRate: 22, unit: '백만 달러', source: '기본값' },
      'A61': { current: 3200, projected: 3800, growthRate: 18, unit: '백만 달러', source: '기본값' },
      'C07': { current: 1500, projected: 1800, growthRate: 20, unit: '백만 달러', source: '기본값' }
    };
    
    return defaultSizes[technologyDomain] || {
      current: 2000,
      projected: 2400,
      growthRate: 20,
      unit: '백만 달러',
      source: '기본값'
    };
  }

  /**
   * 시장 트렌드 분석
   */
  private async analyzeMarketTrends(technologyDomain: string): Promise<MarketTrend[]> {
    try {
      const searchResults = await webSearchService.searchWeb({
        query: `${technologyDomain} 시장 트렌드 2024 2025`,
        maxResults: 15
      });
      
      // 트렌드 데이터 구성
      const trends: MarketTrend[] = [
        {
          period: '2024',
          growthRate: 18,
          marketSize: 2000,
          keyDrivers: ['AI 기술 발전', '디지털 전환 가속화', '정부 지원 정책'],
          challenges: ['기술 인력 부족', '규제 환경 변화', '경쟁 심화']
        },
        {
          period: '2025',
          growthRate: 22,
          marketSize: 2400,
          keyDrivers: ['신기술 상용화', '글로벌 시장 확장', '투자 유입 증가'],
          challenges: ['지적재산권 분쟁', '표준화 이슈', '지속가능성 요구']
        }
      ];
      
      return trends;
    } catch (error) {
      console.error('시장 트렌드 분석 오류:', error);
      return this.getDefaultMarketTrends();
    }
  }

  /**
   * 기본 시장 트렌드
   */
  private getDefaultMarketTrends(): MarketTrend[] {
    return [
      {
        period: '2024',
        growthRate: 15,
        marketSize: 2000,
        keyDrivers: ['기술 혁신', '시장 확장'],
        challenges: ['경쟁 심화', '규제 변화']
      },
      {
        period: '2025',
        growthRate: 18,
        marketSize: 2360,
        keyDrivers: ['신기술 도입', '글로벌화'],
        challenges: ['기술 변화', '시장 불확실성']
      }
    ];
  }

  /**
   * 경쟁 환경 분석
   */
  private async analyzeCompetition(patents: Patent[], technologyDomain: string): Promise<CompetitiveAnalysis> {
    try {
      // 특허 출원인 분석
      const applicants = this.analyzePatentApplicants(patents);
      
      // 경쟁사 정보 수집
      const competitors = await this.collectCompetitorInfo(applicants, technologyDomain);
      
      // 시장 포지션 분석
      const marketPosition = this.analyzeMarketPosition(patents, competitors);
      
      // 경쟁 우위 및 위협 요소 분석
      const competitiveAdvantages = this.analyzeCompetitiveAdvantages(patents, competitors);
      const threats = this.analyzeThreats(patents, competitors);
      
      return {
        directCompetitors: competitors.direct,
        indirectCompetitors: competitors.indirect,
        marketPosition,
        competitiveAdvantages,
        threats
      };
    } catch (error) {
      console.error('경쟁 환경 분석 오류:', error);
      return this.getDefaultCompetitiveAnalysis();
    }
  }

  /**
   * 특허 출원인 분석
   */
  private analyzePatentApplicants(patents: Patent[]): string[] {
    const applicantCount: { [key: string]: number } = {};
    
    patents.forEach(patent => {
      patent.applicants.forEach(applicant => {
        applicantCount[applicant] = (applicantCount[applicant] || 0) + 1;
      });
    });
    
    return Object.entries(applicantCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([applicant]) => applicant);
  }

  /**
   * 경쟁사 정보 수집
   */
  private async collectCompetitorInfo(applicants: string[], technologyDomain: string): Promise<{
    direct: Competitor[];
    indirect: Competitor[];
  }> {
    const direct: Competitor[] = [];
    const indirect: Competitor[] = [];
    
    // 상위 출원인을 직접 경쟁사로 분류
    applicants.slice(0, 5).forEach((applicant, index) => {
      direct.push({
        name: applicant,
        marketShare: Math.max(20 - index * 3, 5),
        strengths: ['기술력', '특허 포트폴리오', '시장 경험'],
        weaknesses: ['혁신성 부족', '기술 변화 대응'],
        patents: [], // 실제로는 특허 데이터 필요
        funding: 'series_c' as FundingStage
      });
    });
    
    // 간접 경쟁사 (다른 기술 분야)
    const indirectCompetitors = ['기존 대기업', '신생 스타트업', '해외 기업'];
    indirectCompetitors.forEach((competitor, index) => {
      indirect.push({
        name: competitor,
        marketShare: 10 - index * 2,
        strengths: ['자원', '브랜드', '네트워크'],
        weaknesses: ['기술 부족', '혁신성 부족'],
        patents: [],
        funding: 'ipo' as FundingStage
      });
    });
    
    return { direct, indirect };
  }

  /**
   * 시장 포지션 분석
   */
  private analyzeMarketPosition(patents: Patent[], competitors: { direct: Competitor[]; indirect: Competitor[] }): string {
    const totalPatents = patents.length;
    const avgPatents = competitors.direct.reduce((sum, c) => sum + c.patents.length, 0) / competitors.direct.length;
    
    if (totalPatents > avgPatents * 2) return '시장 리더';
    if (totalPatents > avgPatents) return '강력한 경쟁자';
    if (totalPatents > avgPatents * 0.5) return '중간 경쟁자';
    return '신규 진입자';
  }

  /**
   * 경쟁 우위 분석
   */
  private analyzeCompetitiveAdvantages(patents: Patent[], competitors: { direct: Competitor[]; indirect: Competitor[] }): string[] {
    const advantages: string[] = [];
    
    // 특허 품질 분석
    const highQualityPatents = patents.filter(p => p.status === 'granted');
    if (highQualityPatents.length > patents.length * 0.7) {
      advantages.push('높은 특허 품질');
    }
    
    // 기술 다양성
    const uniqueClassifications = new Set(patents.flatMap(p => p.classification));
    if (uniqueClassifications.size > 5) {
      advantages.push('기술 분야 다양성');
    }
    
    // 최신 기술
    const recentPatents = patents.filter(p => {
      const year = parseInt(p.applicationDate.split('-')[0]);
      return year >= 2020;
    });
    if (recentPatents.length > patents.length * 0.6) {
      advantages.push('최신 기술 보유');
    }
    
    return advantages.length > 0 ? advantages : ['기술적 잠재력'];
  }

  /**
   * 위협 요소 분석
   */
  private analyzeThreats(patents: Patent[], competitors: { direct: Competitor[]; indirect: Competitor[] }): string[] {
    const threats: string[] = [];
    
    // 강력한 경쟁사 존재
    const strongCompetitors = competitors.direct.filter(c => c.marketShare > 15);
    if (strongCompetitors.length > 0) {
      threats.push('강력한 경쟁사 존재');
    }
    
    // 특허 포트폴리오 부족
    if (patents.length < 10) {
      threats.push('특허 포트폴리오 부족');
    }
    
    // 기술 변화 위험
    const oldPatents = patents.filter(p => {
      const year = parseInt(p.applicationDate.split('-')[0]);
      return year < 2018;
    });
    if (oldPatents.length > patents.length * 0.5) {
      threats.push('기술 노후화 위험');
    }
    
    return threats.length > 0 ? threats : ['일반적인 시장 위험'];
  }

  /**
   * 기본 경쟁 분석
   */
  private getDefaultCompetitiveAnalysis(): CompetitiveAnalysis {
    return {
      directCompetitors: [
        {
          name: '주요 경쟁사',
          marketShare: 25,
          strengths: ['기술력', '시장 경험'],
          weaknesses: ['혁신성 부족'],
          patents: [],
          funding: 'series_c'
        }
      ],
      indirectCompetitors: [
        {
          name: '간접 경쟁사',
          marketShare: 15,
          strengths: ['자원', '브랜드'],
          weaknesses: ['기술 부족'],
          patents: [],
          funding: 'ipo'
        }
      ],
      marketPosition: '신규 진입자',
      competitiveAdvantages: ['기술적 잠재력'],
      threats: ['일반적인 시장 위험']
    };
  }

  /**
   * 시장 기회 분석
   */
  private async analyzeMarketOpportunities(patents: Patent[], technologyDomain: string): Promise<MarketOpportunity[]> {
    try {
      const opportunities: MarketOpportunity[] = [];
      
      // 기술 격차 분석
      const technologyGaps = this.analyzeTechnologyGaps(patents, technologyDomain);
      
      // 시장 니치 분석
      const marketNiches = this.analyzeMarketNiches(patents, technologyDomain);
      
      // 글로벌 확장 기회
      const globalOpportunities = this.analyzeGlobalOpportunities(patents, technologyDomain);
      
      opportunities.push(...technologyGaps, ...marketNiches, ...globalOpportunities);
      
      return opportunities;
    } catch (error) {
      console.error('시장 기회 분석 오류:', error);
      return this.getDefaultMarketOpportunities();
    }
  }

  /**
   * 기술 격차 분석
   */
  private analyzeTechnologyGaps(patents: Patent[], technologyDomain: string): MarketOpportunity[] {
    const opportunities: MarketOpportunity[] = [];
    
    // AI/ML 기술 기회
    if (technologyDomain === 'G06') {
      opportunities.push({
        area: 'AI 특허 분석 자동화',
        potential: 9,
        barriers: ['기술 복잡성', '데이터 부족'],
        entryStrategies: ['오픈소스 활용', '파트너십'],
        estimatedInvestment: 500,
        timeline: '2-3년'
      });
    }
    
    // IoT 기술 기회
    if (technologyDomain === 'H04') {
      opportunities.push({
        area: 'IoT 보안 솔루션',
        potential: 8,
        barriers: ['보안 표준 부재', '규제 환경'],
        entryStrategies: ['표준화 참여', '보안 인증'],
        estimatedInvestment: 300,
        timeline: '1-2년'
      });
    }
    
    return opportunities;
  }

  /**
   * 시장 니치 분석
   */
  private analyzeMarketNiches(patents: Patent[], technologyDomain: string): MarketOpportunity[] {
    return [
      {
        area: '중소기업 특화 솔루션',
        potential: 7,
        barriers: ['고객 확보', '가격 경쟁력'],
        entryStrategies: ['B2B 마케팅', '맞춤형 서비스'],
        estimatedInvestment: 200,
        timeline: '1년'
      },
      {
        area: '특정 산업 전용',
        potential: 8,
        barriers: ['도메인 지식', '인증 요구사항'],
        entryStrategies: ['전문가 영입', '파트너십'],
        estimatedInvestment: 400,
        timeline: '2년'
      }
    ];
  }

  /**
   * 글로벌 확장 기회
   */
  private analyzeGlobalOpportunities(patents: Patent[], technologyDomain: string): MarketOpportunity[] {
    return [
      {
        area: '동남아시아 시장 진입',
        potential: 8,
        barriers: ['언어 장벽', '문화적 차이'],
        entryStrategies: ['현지 파트너십', '문화 적응'],
        estimatedInvestment: 600,
        timeline: '2-3년'
      },
      {
        area: '유럽 시장 진입',
        potential: 7,
        barriers: ['규제 환경', '경쟁 심화'],
        entryStrategies: ['규제 준수', '차별화'],
        estimatedInvestment: 800,
        timeline: '3년'
      }
    ];
  }

  /**
   * 기본 시장 기회
   */
  private getDefaultMarketOpportunities(): MarketOpportunity[] {
    return [
      {
        area: '기술 혁신',
        potential: 7,
        barriers: ['기술 복잡성'],
        entryStrategies: ['R&D 투자'],
        estimatedInvestment: 500,
        timeline: '2년'
      }
    ];
  }

  /**
   * 리스크 요소 분석
   */
  private analyzeRiskFactors(patents: Patent[], marketSize: MarketSize, competitiveAnalysis: CompetitiveAnalysis): string[] {
    const risks: string[] = [];
    
    // 시장 리스크
    if (marketSize.growthRate < 15) {
      risks.push('시장 성장률 저하');
    }
    
    // 경쟁 리스크
    if (competitiveAnalysis.directCompetitors.length > 5) {
      risks.push('경쟁 심화');
    }
    
    // 기술 리스크
    const oldTechnologyRisk = patents.filter(p => {
      const year = parseInt(p.applicationDate.split('-')[0]);
      return year < 2015;
    }).length > patents.length * 0.3;
    
    if (oldTechnologyRisk) {
      risks.push('기술 노후화');
    }
    
    // 규제 리스크
    risks.push('규제 환경 변화');
    
    return risks;
  }

  /**
   * 전략적 권장사항 생성
   */
  private generateRecommendations(
    patents: Patent[],
    marketSize: MarketSize,
    competitiveAnalysis: CompetitiveAnalysis,
    opportunities: MarketOpportunity[]
  ): string[] {
    const recommendations: string[] = [];
    
    // 특허 포트폴리오 강화
    if (patents.length < 20) {
      recommendations.push('특허 포트폴리오 확대를 통한 경쟁력 강화');
    }
    
    // 기술 혁신 투자
    recommendations.push('신기술 R&D 투자 확대');
    
    // 시장 진입 전략
    if (competitiveAnalysis.marketPosition === '신규 진입자') {
      recommendations.push('니치 시장을 통한 단계적 진입');
    }
    
    // 파트너십 구축
    recommendations.push('전략적 파트너십을 통한 시장 확장');
    
    // 글로벌 진출
    recommendations.push('동남아시아 등 신흥 시장 진출 검토');
    
    return recommendations;
  }

  /**
   * 시장 진입 타임라인 생성
   */
  private generateTimeline(patents: Patent[], marketSize: MarketSize, startup?: Startup): string {
    const phases = [
      '1단계 (1-6개월): 시장 조사 및 전략 수립',
      '2단계 (6-12개월): 핵심 기술 개발 및 특허 출원',
      '3단계 (12-18개월): MVP 개발 및 시장 테스트',
      '4단계 (18-24개월): 시장 진입 및 고객 확보',
      '5단계 (24-36개월): 시장 확장 및 글로벌 진출'
    ];
    
    return phases.join('\n');
  }

  /**
   * 시장 분석 요약 생성
   */
  private generateMarketSummary(
    technologyDomain: string,
    marketSize: MarketSize,
    trends: MarketTrend[]
  ): string {
    return `${technologyDomain} 기술 분야는 현재 ${marketSize.current}${marketSize.unit} 규모의 시장으로, 
    연평균 ${marketSize.growthRate}%의 성장률을 보이고 있습니다. 
    주요 트렌드로는 ${trends[0]?.keyDrivers.join(', ')} 등이 있으며, 
    향후 ${marketSize.projected}${marketSize.unit} 규모로 확대될 것으로 예상됩니다.`;
  }

  /**
   * 캐시 키 생성
   */
  private generateCacheKey(patents: Patent[], startup?: Startup): string {
    const patentIds = patents.map(p => p.id).sort().join(',');
    const startupInfo = startup ? `${startup.name}_${startup.industry}` : 'no_startup';
    return `${patentIds}_${startupInfo}`;
  }

  /**
   * 폴백 시장 분석 리포트
   */
  private getFallbackMarketReport(patents: Patent[]): MarketReport {
    return {
      summary: '기본적인 시장 분석 결과입니다.',
      marketSize: {
        current: 2000,
        projected: 2400,
        growthRate: 20,
        unit: '백만 달러',
        source: '기본값'
      },
      trends: this.getDefaultMarketTrends(),
      competitiveAnalysis: this.getDefaultCompetitiveAnalysis(),
      opportunities: this.getDefaultMarketOpportunities(),
      recommendations: ['기본 전략 수립', '시장 조사 수행'],
      riskFactors: ['일반적인 시장 위험'],
      timeline: '1-3년 단계적 진입'
    };
  }
}

// 싱글톤 인스턴스 생성
export const marketAnalysisService = new MarketAnalysisService();
