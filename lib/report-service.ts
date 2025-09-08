import { Patent } from '@/types';
import { patentClusteringService } from './patent-clustering';
import { marketAnalysisService } from './market-analysis';
import { simulationService } from './simulation-service';
import { aiAnalysisService } from './ai-analysis';

export interface ComprehensiveReport {
  executiveSummary: {
    overview: string;
    keyFindings: string[];
    recommendations: string[];
  };
  patentAnalysis: {
    totalPatents: number;
    technologyDistribution: { [key: string]: number };
    innovationScore: number;
  };
  clusteringResults: {
    clusters: number;
    similarityMatrix: number[][];
  };
  marketAnalysis: {
    marketSize: number;
    growthRate: number;
    opportunities: string[];
  };
  simulation: {
    successProbability: number;
    timeToMarket: number;
    estimatedRevenue: number;
  };
  metadata: {
    generatedAt: Date;
    analysisDuration: number;
  };
}

export class ComprehensiveReportService {
  
  public async generateReport(patents: Patent[]): Promise<ComprehensiveReport> {
    const startTime = Date.now();
    
    try {
      // 1. 특허 분석
      const patentAnalysis = this.analyzePatents(patents);
      
      // 2. 클러스터링 분석
      const clusteringResults = await this.analyzeClustering(patents);
      
      // 3. 시장 분석
      const marketAnalysis = await this.analyzeMarket(patents);
      
      // 4. 시뮬레이션
      const simulation = await this.analyzeSimulation(patents);
      
      // 5. 실행 요약
      const executiveSummary = this.generateExecutiveSummary(
        patentAnalysis,
        clusteringResults,
        marketAnalysis,
        simulation
      );
      
      const analysisDuration = Date.now() - startTime;
      
      return {
        executiveSummary,
        patentAnalysis,
        clusteringResults,
        marketAnalysis,
        simulation,
        metadata: {
          generatedAt: new Date(),
          analysisDuration
        }
      };
      
    } catch (error) {
      console.error('리포트 생성 실패:', error);
      throw new Error(`리포트 생성 중 오류가 발생했습니다: ${error}`);
    }
  }

  private analyzePatents(patents: Patent[]) {
    const technologyDistribution: { [key: string]: number } = {};
    
    patents.forEach(patent => {
      patent.classification?.forEach(classification => {
        const mainClass = classification.split(' ')[0];
        technologyDistribution[mainClass] = (technologyDistribution[mainClass] || 0) + 1;
      });
    });
    
    const innovationScore = this.calculateInnovationScore(patents);
    
    return {
      totalPatents: patents.length,
      technologyDistribution,
      innovationScore
    };
  }

  private async analyzeClustering(patents: Patent[]) {
    if (patents.length < 2) {
      return {
        clusters: 1,
        similarityMatrix: [[1]]
      };
    }
    
    try {
      const result = await patentClusteringService.performClustering(patents);
      return {
        clusters: result.clusters.length,
        similarityMatrix: this.createSimilarityMatrix(result.clusters)
      };
    } catch (error) {
      console.warn('클러스터링 분석 실패:', error);
      return {
        clusters: Math.min(3, patents.length),
        similarityMatrix: this.createDefaultSimilarityMatrix(patents.length)
      };
    }
  }

  private async analyzeMarket(patents: Patent[]) {
    try {
      const marketReport = await marketAnalysisService.analyzeMarket(patents, 'global');
      return {
        marketSize: marketReport.marketSize.currentSize,
        growthRate: marketReport.marketSize.growthRate,
        opportunities: marketReport.opportunities.map((o: any) => o.opportunity)
      };
    } catch (error) {
      console.warn('시장 분석 실패:', error);
      return {
        marketSize: 1000000000,
        growthRate: 0.1,
        opportunities: ['신기술 시장 진입', '기존 시장 확장']
      };
    }
  }

  private async analyzeSimulation(patents: Patent[]) {
    try {
      const simulationResult = await simulationService.generateSimulation(patents, 5);
      const scenario = simulationResult.scenarios[0];
      return {
        successProbability: scenario.successProbability,
        timeToMarket: scenario.timeToMarket,
        estimatedRevenue: scenario.estimatedRevenue
      };
    } catch (error) {
      console.warn('시뮬레이션 분석 실패:', error);
      return {
        successProbability: 0.6,
        timeToMarket: 24,
        estimatedRevenue: 100000000
      };
    }
  }

  private generateExecutiveSummary(
    patentAnalysis: any,
    clusteringResults: any,
    marketAnalysis: any,
    simulation: any
  ) {
    const overview = `본 리포트는 ${patentAnalysis.totalPatents}개의 특허를 종합 분석한 결과입니다. 
    기술 혁신성 점수는 ${patentAnalysis.innovationScore.toFixed(2)}이며, 
    ${clusteringResults.clusters}개의 기술 클러스터를 통해 전략적 방향성을 제시합니다.`;
    
    const keyFindings = [
      `총 ${patentAnalysis.totalPatents}개의 특허로 구성된 포트폴리오`,
      `전체 혁신성 점수: ${patentAnalysis.innovationScore.toFixed(2)}`,
      `${clusteringResults.clusters}개의 기술 클러스터로 그룹화`,
      `시장 성장률: ${(marketAnalysis.growthRate * 100).toFixed(1)}%`,
      `시뮬레이션 성공률: ${(simulation.successProbability * 100).toFixed(1)}%`
    ];
    
    const recommendations = [
      '혁신성 향상을 위한 지속적인 R&D 투자 필요',
      '기술 융합을 통한 새로운 시장 기회 창출',
      '고성장 시장 진입을 위한 신속한 실행 필요'
    ];
    
    return { overview, keyFindings, recommendations };
  }

  private calculateInnovationScore(patents: Patent[]): number {
    let score = 0.5; // 기본 점수
    
    patents.forEach(patent => {
      // 기술 분류 다양성
      score += (patent.classification?.length || 0) * 0.02;
      
      // 출원인 수
      score += (patent.applicants?.length || 0) * 0.01;
      
      // 발명자 수
      score += (patent.inventors?.length || 0) * 0.01;
      
      // 청구항 수
      score += (patent.claims?.length || 0) * 0.005;
    });
    
    return Math.min(score, 1.0); // 최대 1.0점
  }

  private createSimilarityMatrix(clusters: any[]): number[][] {
    const matrix: number[][] = [];
    clusters.forEach((cluster1, i) => {
      matrix[i] = [];
      clusters.forEach((cluster2, j) => {
        if (i === j) {
          matrix[i][j] = 1;
        } else {
          matrix[i][j] = this.calculateClusterSimilarity(cluster1, cluster2);
        }
      });
    });
    return matrix;
  }

  private calculateClusterSimilarity(cluster1: any, cluster2: any): number {
    const keywords1 = new Set(cluster1.keywords || []);
    const keywords2 = new Set(cluster2.keywords || []);
    
    const intersection = new Set(Array.from(keywords1).filter(x => keywords2.has(x)));
    const union = new Set([...Array.from(keywords1), ...Array.from(keywords2)]);
    
    return intersection.size / union.size;
  }

  private createDefaultSimilarityMatrix(size: number): number[][] {
    const matrix: number[][] = [];
    for (let i = 0; i < size; i++) {
      matrix[i] = [];
      for (let j = 0; j < size; j++) {
        matrix[i][j] = i === j ? 1 : 0.5;
      }
    }
    return matrix;
  }
}

// 싱글톤 인스턴스 생성
export const comprehensiveReportService = new ComprehensiveReportService();
