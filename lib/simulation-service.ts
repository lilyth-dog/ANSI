import { Patent, Startup, FundingStage } from '@/types';
import { marketAnalysisService, MarketReport } from './market-analysis';
import { aiAnalysisService } from './ai-analysis';

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  parameters: SimulationParameters;
  results: SimulationResults;
}

export interface SimulationParameters {
  marketEntry: 'early' | 'mid' | 'late';
  fundingLevel: FundingStage;
  teamSize: number;
  technologyMaturity: number; // 1-10
  marketCompetition: number; // 1-10
  regulatoryEnvironment: number; // 1-10
  economicConditions: number; // 1-10
  patentStrength: number; // 1-10
}

export interface SimulationResults {
  successProbability: number;
  timeToMarket: number; // months
  estimatedRevenue: number;
  marketShare: number;
  riskLevel: 'low' | 'medium' | 'high';
  keySuccessFactors: string[];
  majorRisks: string[];
  recommendations: string[];
  financialProjections: FinancialProjection[];
  milestones: Milestone[];
}

export interface FinancialProjection {
  year: number;
  revenue: number;
  costs: number;
  profit: number;
  fundingNeeded: number;
}

export interface Milestone {
  month: number;
  description: string;
  probability: number;
  dependencies: string[];
}

export interface MonteCarloResult {
  iterations: number;
  successRate: number;
  averageRevenue: number;
  revenueDistribution: number[];
  riskMetrics: {
    var95: number; // Value at Risk 95%
    expectedShortfall: number;
    maxLoss: number;
  };
}

export class SimulationService {
  private scenarios: Map<string, SimulationScenario> = new Map();
  private baseScenarios: SimulationScenario[] = [];

  constructor() {
    this.initializeBaseScenarios();
  }

  /**
   * 기본 시나리오 초기화
   */
  private initializeBaseScenarios(): void {
    this.baseScenarios = [
      {
        id: 'conservative',
        name: '보수적 진입',
        description: '안전한 시장 진입을 위한 보수적 전략',
        parameters: {
          marketEntry: 'mid',
          fundingLevel: 'series_a',
          teamSize: 15,
          technologyMaturity: 7,
          marketCompetition: 6,
          regulatoryEnvironment: 7,
          economicConditions: 6,
          patentStrength: 8
        },
        results: {} as SimulationResults
      },
      {
        id: 'aggressive',
        name: '공격적 진입',
        description: '빠른 시장 점유를 위한 공격적 전략',
        parameters: {
          marketEntry: 'early',
          fundingLevel: 'series_c',
          teamSize: 25,
          technologyMaturity: 9,
          marketCompetition: 8,
          regulatoryEnvironment: 6,
          economicConditions: 7,
          patentStrength: 9
        },
        results: {} as SimulationResults
      },
      {
        id: 'balanced',
        name: '균형잡힌 진입',
        description: '리스크와 기회를 균형있게 고려한 전략',
        parameters: {
          marketEntry: 'mid',
          fundingLevel: 'series_b',
          teamSize: 20,
          technologyMaturity: 8,
          marketCompetition: 7,
          regulatoryEnvironment: 7,
          economicConditions: 7,
          patentStrength: 8
        },
        results: {} as SimulationResults
      }
    ];
  }

  /**
   * 시뮬레이션 실행
   */
  async runSimulation(
    patents: Patent[],
    startup: Startup,
    scenarioId?: string
  ): Promise<SimulationResults> {
    try {
      // 1. 시장 분석 수행
      const marketReport = await marketAnalysisService.analyzeMarket(patents, startup);
      
      // 2. 시나리오 선택 또는 생성
      const scenario = scenarioId ? 
        this.baseScenarios.find(s => s.id === scenarioId) :
        this.generateCustomScenario(patents, startup, marketReport);
      
      if (!scenario) {
        throw new Error('유효한 시나리오를 찾을 수 없습니다.');
      }
      
      // 3. 시뮬레이션 실행
      const results = await this.executeSimulation(patents, startup, scenario.parameters, marketReport);
      
      // 4. 시나리오 업데이트
      scenario.results = results;
      this.scenarios.set(scenario.id, scenario);
      
      return results;
    } catch (error) {
      console.error('시뮬레이션 실행 오류:', error);
      return this.getFallbackSimulationResults();
    }
  }

  /**
   * 맞춤형 시나리오 생성
   */
  private generateCustomScenario(
    patents: Patent[],
    startup: Startup,
    marketReport: MarketReport
  ): SimulationScenario {
    // 특허 강도 계산
    const patentStrength = this.calculatePatentStrength(patents);
    
    // 시장 경쟁도 계산
    const marketCompetition = this.calculateMarketCompetition(marketReport);
    
    // 기술 성숙도 계산
    const technologyMaturity = this.calculateTechnologyMaturity(patents);
    
    return {
      id: 'custom_' + Date.now(),
      name: '맞춤형 시나리오',
      description: `${startup.name}을 위한 맞춤형 시장 진입 시나리오`,
      parameters: {
        marketEntry: this.determineMarketEntry(patentStrength, marketCompetition),
        fundingLevel: startup.fundingStage,
        teamSize: startup.teamSize,
        technologyMaturity,
        marketCompetition,
        regulatoryEnvironment: 7, // 기본값
        economicConditions: 7, // 기본값
        patentStrength
      },
      results: {} as SimulationResults
    };
  }

  /**
   * 특허 강도 계산
   */
  private calculatePatentStrength(patents: Patent[]): number {
    if (patents.length === 0) return 1;
    
    let score = 0;
    
    // 특허 수량
    score += Math.min(patents.length * 0.5, 3);
    
    // 특허 품질 (등록된 특허)
    const grantedPatents = patents.filter(p => p.status === 'granted');
    score += (grantedPatents.length / patents.length) * 2;
    
    // 기술 다양성
    const uniqueClassifications = new Set(patents.flatMap(p => p.classification));
    score += Math.min(uniqueClassifications.size * 0.3, 2);
    
    // 최신성
    const recentPatents = patents.filter(p => {
      const year = parseInt(p.applicationDate.split('-')[0]);
      return year >= 2020;
    });
    score += (recentPatents.length / patents.length) * 2;
    
    return Math.min(Math.max(score, 1), 10);
  }

  /**
   * 시장 경쟁도 계산
   */
  private calculateMarketCompetition(marketReport: MarketReport): number {
    const directCompetitors = marketReport.competitiveAnalysis.directCompetitors.length;
    const marketShare = marketReport.competitiveAnalysis.directCompetitors.reduce((sum, c) => sum + c.marketShare, 0);
    
    let score = 5; // 기본값
    
    if (directCompetitors > 10) score += 3;
    else if (directCompetitors > 5) score += 2;
    else if (directCompetitors > 2) score += 1;
    
    if (marketShare > 80) score += 2;
    else if (marketShare > 60) score += 1;
    
    return Math.min(Math.max(score, 1), 10);
  }

  /**
   * 기술 성숙도 계산
   */
  private calculateTechnologyMaturity(patents: Patent[]): number {
    if (patents.length === 0) return 1;
    
    let score = 5; // 기본값
    
    // 특허 연도별 분포
    const yearCount: { [key: number]: number } = {};
    patents.forEach(patent => {
      const year = parseInt(patent.applicationDate.split('-')[0]);
      yearCount[year] = (yearCount[year] || 0) + 1;
    });
    
    const recentYears = Object.keys(yearCount).filter(year => parseInt(year) >= 2020);
    if (recentYears.length > 0) {
      score += Math.min(recentYears.length, 3);
    }
    
    // 기술 분류 다양성
    const classifications = new Set(patents.flatMap(p => p.classification));
    if (classifications.size > 5) score += 2;
    
    return Math.min(Math.max(score, 1), 10);
  }

  /**
   * 시장 진입 시점 결정
   */
  private determineMarketEntry(patentStrength: number, marketCompetition: number): 'early' | 'mid' | 'late' {
    const totalScore = patentStrength + (11 - marketCompetition); // 경쟁도는 낮을수록 좋음
    
    if (totalScore >= 16) return 'early';
    if (totalScore >= 12) return 'mid';
    return 'late';
  }

  /**
   * 시뮬레이션 실행
   */
  private async executeSimulation(
    patents: Patent[],
    startup: Startup,
    parameters: SimulationParameters,
    marketReport: MarketReport
  ): Promise<SimulationResults> {
    // 1. 성공 확률 계산
    const successProbability = this.calculateSuccessProbability(parameters, marketReport);
    
    // 2. 시장 진입 시간 계산
    const timeToMarket = this.calculateTimeToMarket(parameters, patents);
    
    // 3. 예상 매출 계산
    const estimatedRevenue = this.calculateEstimatedRevenue(parameters, marketReport);
    
    // 4. 시장 점유율 계산
    const marketShare = this.calculateMarketShare(parameters, marketReport);
    
    // 5. 리스크 레벨 결정
    const riskLevel = this.determineRiskLevel(parameters, marketReport);
    
    // 6. 핵심 성공 요인 분석
    const keySuccessFactors = this.analyzeKeySuccessFactors(parameters, patents);
    
    // 7. 주요 리스크 분석
    const majorRisks = this.analyzeMajorRisks(parameters, marketReport);
    
    // 8. 권장사항 생성
    const recommendations = this.generateRecommendations(parameters, marketReport, patents);
    
    // 9. 재무 예측
    const financialProjections = this.generateFinancialProjections(parameters, estimatedRevenue, timeToMarket);
    
    // 10. 마일스톤 생성
    const milestones = this.generateMilestones(parameters, timeToMarket);
    
    return {
      successProbability,
      timeToMarket,
      estimatedRevenue,
      marketShare,
      riskLevel,
      keySuccessFactors,
      majorRisks,
      recommendations,
      financialProjections,
      milestones
    };
  }

  /**
   * 성공 확률 계산
   */
  private calculateSuccessProbability(parameters: SimulationParameters, marketReport: MarketReport): number {
    let probability = 50; // 기본값
    
    // 특허 강도
    probability += (parameters.patentStrength - 5) * 5;
    
    // 기술 성숙도
    probability += (parameters.technologyMaturity - 5) * 3;
    
    // 시장 경쟁도 (낮을수록 좋음)
    probability += (11 - parameters.marketCompetition) * 4;
    
    // 자금 수준
    const fundingMultiplier = {
      'idea': 0.8,
      'seed': 0.9,
      'series_a': 1.0,
      'series_b': 1.1,
      'series_c': 1.2,
      'ipo': 1.3
    };
    probability *= fundingMultiplier[parameters.fundingLevel] || 1.0;
    
    // 규제 환경
    probability += (parameters.regulatoryEnvironment - 5) * 2;
    
    // 경제 상황
    probability += (parameters.economicConditions - 5) * 2;
    
    return Math.min(Math.max(probability, 5), 95);
  }

  /**
   * 시장 진입 시간 계산
   */
  private calculateTimeToMarket(parameters: SimulationParameters, patents: Patent[]): number {
    let baseTime = 18; // 기본 18개월
    
    // 기술 성숙도에 따른 조정
    if (parameters.technologyMaturity >= 8) baseTime -= 3;
    else if (parameters.technologyMaturity <= 3) baseTime += 6;
    
    // 특허 강도에 따른 조정
    if (parameters.patentStrength >= 8) baseTime -= 2;
    else if (parameters.patentStrength <= 3) baseTime += 4;
    
    // 자금 수준에 따른 조정
    if (parameters.fundingLevel === 'series_c' || parameters.fundingLevel === 'ipo') baseTime -= 3;
    else if (parameters.fundingLevel === 'idea' || parameters.fundingLevel === 'seed') baseTime += 6;
    
    // 팀 규모에 따른 조정
    if (parameters.teamSize >= 20) baseTime -= 2;
    else if (parameters.teamSize <= 5) baseTime += 4;
    
    return Math.max(baseTime, 6); // 최소 6개월
  }

  /**
   * 예상 매출 계산
   */
  private calculateEstimatedRevenue(parameters: SimulationParameters, marketReport: MarketReport): number {
    const baseRevenue = marketReport.marketSize.current * 0.01; // 시장의 1% 점유 시
    
    let multiplier = 1.0;
    
    // 특허 강도
    multiplier *= (parameters.patentStrength / 5);
    
    // 기술 성숙도
    multiplier *= (parameters.technologyMaturity / 5);
    
    // 시장 진입 시점
    const entryMultiplier = {
      'early': 1.5,
      'mid': 1.0,
      'late': 0.7
    };
    multiplier *= entryMultiplier[parameters.marketEntry];
    
    // 자금 수준
    const fundingMultiplier = {
      'idea': 0.3,
      'seed': 0.5,
      'series_a': 0.8,
      'series_b': 1.0,
      'series_c': 1.3,
      'ipo': 1.5
    };
    multiplier *= fundingMultiplier[parameters.fundingLevel] || 1.0;
    
    return Math.round(baseRevenue * multiplier);
  }

  /**
   * 시장 점유율 계산
   */
  private calculateMarketShare(parameters: SimulationParameters, marketReport: MarketReport): number {
    let baseShare = 2.0; // 기본 2%
    
    // 특허 강도
    baseShare += (parameters.patentStrength - 5) * 0.5;
    
    // 기술 성숙도
    baseShare += (parameters.technologyMaturity - 5) * 0.3;
    
    // 시장 진입 시점
    if (parameters.marketEntry === 'early') baseShare += 1.0;
    else if (parameters.marketEntry === 'late') baseShare -= 0.5;
    
    // 경쟁사 수에 따른 조정
    const competitorCount = marketReport.competitiveAnalysis.directCompetitors.length;
    if (competitorCount > 10) baseShare *= 0.7;
    else if (competitorCount > 5) baseShare *= 0.85;
    
    return Math.min(Math.max(baseShare, 0.1), 15); // 0.1% ~ 15%
  }

  /**
   * 리스크 레벨 결정
   */
  private determineRiskLevel(parameters: SimulationParameters, marketReport: MarketReport): 'low' | 'medium' | 'high' {
    let riskScore = 0;
    
    // 특허 강도 (낮을수록 위험)
    riskScore += (11 - parameters.patentStrength) * 2;
    
    // 기술 성숙도 (낮을수록 위험)
    riskScore += (11 - parameters.technologyMaturity) * 2;
    
    // 시장 경쟁도 (높을수록 위험)
    riskScore += parameters.marketCompetition * 1.5;
    
    // 규제 환경 (낮을수록 위험)
    riskScore += (11 - parameters.regulatoryEnvironment) * 1.5;
    
    // 경제 상황 (낮을수록 위험)
    riskScore += (11 - parameters.economicConditions) * 1.5;
    
    if (riskScore <= 15) return 'low';
    if (riskScore <= 30) return 'medium';
    return 'high';
  }

  /**
   * 핵심 성공 요인 분석
   */
  private analyzeKeySuccessFactors(parameters: SimulationParameters, patents: Patent[]): string[] {
    const factors: string[] = [];
    
    if (parameters.patentStrength >= 8) {
      factors.push('강력한 특허 포트폴리오');
    }
    
    if (parameters.technologyMaturity >= 8) {
      factors.push('높은 기술 성숙도');
    }
    
    if (parameters.fundingLevel === 'series_c' || parameters.fundingLevel === 'ipo') {
      factors.push('충분한 자금 확보');
    }
    
    if (parameters.teamSize >= 20) {
      factors.push('적정 규모의 팀');
    }
    
    if (parameters.marketEntry === 'early') {
      factors.push('선도적 시장 진입');
    }
    
    if (factors.length === 0) {
      factors.push('기본적인 기술 역량');
    }
    
    return factors;
  }

  /**
   * 주요 리스크 분석
   */
  private analyzeMajorRisks(parameters: SimulationParameters, marketReport: MarketReport): string[] {
    const risks: string[] = [];
    
    if (parameters.patentStrength <= 4) {
      risks.push('특허 포트폴리오 부족');
    }
    
    if (parameters.technologyMaturity <= 4) {
      risks.push('기술 성숙도 부족');
    }
    
    if (parameters.marketCompetition >= 8) {
      risks.push('높은 시장 경쟁도');
    }
    
    if (parameters.regulatoryEnvironment <= 4) {
      risks.push('불안정한 규제 환경');
    }
    
    if (parameters.fundingLevel === 'idea' || parameters.fundingLevel === 'seed') {
      risks.push('자금 부족');
    }
    
    if (risks.length === 0) {
      risks.push('일반적인 시장 위험');
    }
    
    return risks;
  }

  /**
   * 권장사항 생성
   */
  private generateRecommendations(
    parameters: SimulationParameters,
    marketReport: MarketReport,
    patents: Patent[]
  ): string[] {
    const recommendations: string[] = [];
    
    if (parameters.patentStrength <= 6) {
      recommendations.push('특허 포트폴리오 강화를 위한 추가 출원');
    }
    
    if (parameters.technologyMaturity <= 6) {
      recommendations.push('기술 성숙도 향상을 위한 R&D 투자');
    }
    
    if (parameters.marketCompetition >= 8) {
      recommendations.push('차별화 전략을 통한 경쟁 우위 확보');
    }
    
    if (parameters.fundingLevel === 'idea' || parameters.fundingLevel === 'seed') {
      recommendations.push('시리즈 A 투자 유치를 위한 비즈니스 모델 검증');
    }
    
    if (parameters.teamSize <= 10) {
      recommendations.push('핵심 인력 영입을 통한 팀 역량 강화');
    }
    
    recommendations.push('지속적인 시장 모니터링 및 전략 조정');
    
    return recommendations;
  }

  /**
   * 재무 예측 생성
   */
  private generateFinancialProjections(
    parameters: SimulationParameters,
    estimatedRevenue: number,
    timeToMarket: number
  ): FinancialProjection[] {
    const projections: FinancialProjection[] = [];
    const currentYear = new Date().getFullYear();
    
    for (let year = 0; year < 5; year++) {
      const targetYear = currentYear + year;
      const monthsFromStart = year * 12;
      
      let revenue = 0;
      let costs = 0;
      
      if (monthsFromStart >= timeToMarket) {
        const monthsInMarket = monthsFromStart - timeToMarket + 1;
        revenue = (estimatedRevenue / 12) * Math.min(monthsInMarket, 12);
      }
      
      // 비용 계산 (팀 규모, 기술 개발 등)
      costs = parameters.teamSize * 10000 * 12; // 월 1만 달러 가정
      if (year === 0) costs *= 0.5; // 첫 해는 절반
      
      const profit = revenue - costs;
      const fundingNeeded = profit < 0 ? Math.abs(profit) : 0;
      
      projections.push({
        year: targetYear,
        revenue: Math.round(revenue),
        costs: Math.round(costs),
        profit: Math.round(profit),
        fundingNeeded: Math.round(fundingNeeded)
      });
    }
    
    return projections;
  }

  /**
   * 마일스톤 생성
   */
  private generateMilestones(parameters: SimulationParameters, timeToMarket: number): Milestone[] {
    const milestones: Milestone[] = [];
    
    // 기술 개발 단계
    milestones.push({
      month: Math.round(timeToMarket * 0.3),
      description: '핵심 기술 개발 완료',
      probability: 0.8,
      dependencies: ['팀 구성', '초기 자금 확보']
    });
    
    // 특허 출원
    milestones.push({
      month: Math.round(timeToMarket * 0.5),
      description: '주요 특허 출원 완료',
      probability: 0.9,
      dependencies: ['기술 개발 완료']
    });
    
    // MVP 개발
    milestones.push({
      month: Math.round(timeToMarket * 0.7),
      description: 'MVP 개발 및 테스트',
      probability: 0.7,
      dependencies: ['기술 개발 완료', '특허 출원']
    });
    
    // 시장 진입
    milestones.push({
      month: timeToMarket,
      description: '시장 진입 및 첫 고객 확보',
      probability: 0.6,
      dependencies: ['MVP 개발 완료', '마케팅 전략 수립']
    });
    
    // 시장 확장
    milestones.push({
      month: Math.round(timeToMarket * 1.5),
      description: '시장 확장 및 수익성 달성',
      probability: 0.5,
      dependencies: ['시장 진입 성공', '고객 피드백 반영']
    });
    
    return milestones;
  }

  /**
   * 몬테카를로 시뮬레이션
   */
  async runMonteCarloSimulation(
    patents: Patent[],
    startup: Startup,
    iterations: number = 1000
  ): Promise<MonteCarloResult> {
    const results: number[] = [];
    
    for (let i = 0; i < iterations; i++) {
      // 랜덤 파라미터 생성
      const randomParams: SimulationParameters = {
        marketEntry: ['early', 'mid', 'late'][Math.floor(Math.random() * 3)] as any,
        fundingLevel: ['seed', 'series_a', 'series_b', 'series_c'][Math.floor(Math.random() * 4)] as any,
        teamSize: Math.floor(Math.random() * 30) + 5,
        technologyMaturity: Math.random() * 10 + 1,
        marketCompetition: Math.random() * 10 + 1,
        regulatoryEnvironment: Math.random() * 10 + 1,
        economicConditions: Math.random() * 10 + 1,
        patentStrength: Math.random() * 10 + 1
      };
      
      // 시뮬레이션 실행
      const marketReport = await marketAnalysisService.analyzeMarket(patents, startup);
      const simulationResult = await this.executeSimulation(patents, startup, randomParams, marketReport);
      
      results.push(simulationResult.estimatedRevenue);
    }
    
    // 결과 분석
    const sortedResults = results.sort((a, b) => a - b);
    const averageRevenue = results.reduce((sum, r) => sum + r, 0) / results.length;
    const successRate = results.filter(r => r > 0).length / results.length;
    
    // VaR 계산
    const var95Index = Math.floor(iterations * 0.05);
    const var95 = sortedResults[var95Index];
    
    // Expected Shortfall 계산
    const tailResults = sortedResults.slice(0, var95Index);
    const expectedShortfall = tailResults.reduce((sum, r) => sum + r, 0) / tailResults.length;
    
    return {
      iterations,
      successRate,
      averageRevenue: Math.round(averageRevenue),
      revenueDistribution: sortedResults,
      riskMetrics: {
        var95: Math.round(var95),
        expectedShortfall: Math.round(expectedShortfall),
        maxLoss: Math.round(sortedResults[0])
      }
    };
  }

  /**
   * 시나리오 비교
   */
  compareScenarios(scenarioIds: string[]): SimulationScenario[] {
    return scenarioIds
      .map(id => this.scenarios.get(id))
      .filter(scenario => scenario !== undefined) as SimulationScenario[];
  }

  /**
   * 시나리오 저장
   */
  saveScenario(scenario: SimulationScenario): void {
    this.scenarios.set(scenario.id, scenario);
  }

  /**
   * 시나리오 삭제
   */
  deleteScenario(scenarioId: string): boolean {
    return this.scenarios.delete(scenarioId);
  }

  /**
   * 모든 시나리오 조회
   */
  getAllScenarios(): SimulationScenario[] {
    return Array.from(this.scenarios.values());
  }

  /**
   * 폴백 시뮬레이션 결과
   */
  private getFallbackSimulationResults(): SimulationResults {
    return {
      successProbability: 50,
      timeToMarket: 18,
      estimatedRevenue: 1000000,
      marketShare: 2.0,
      riskLevel: 'medium',
      keySuccessFactors: ['기본적인 기술 역량'],
      majorRisks: ['일반적인 시장 위험'],
      recommendations: ['기본 전략 수립', '시장 조사 수행'],
      financialProjections: [
        {
          year: new Date().getFullYear(),
          revenue: 0,
          costs: 500000,
          profit: -500000,
          fundingNeeded: 500000
        }
      ],
      milestones: [
        {
          month: 6,
          description: '기본 기술 개발',
          probability: 0.7,
          dependencies: ['팀 구성']
        }
      ]
    };
  }
}

// 싱글톤 인스턴스 생성
export const simulationService = new SimulationService();
