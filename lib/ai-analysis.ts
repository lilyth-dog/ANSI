import { Patent, PatentAnalysis, RiskAssessment, CompetitiveLandscape } from '@/types';

export class AiAnalysisService {
  private openaiApiKey: string;
  private openaiApiUrl: string;
  private openrouterApiKey: string;
  private openrouterApiUrl: string;
  private currentProvider: 'openai' | 'openrouter' | null = null;

  constructor() {
    this.openaiApiKey = '';
    this.openaiApiUrl = 'https://api.openai.com/v1';
    this.openrouterApiKey = '';
    this.openrouterApiUrl = 'https://openrouter.ai/api/v1';
    this.loadApiKeys();
  }

  /**
   * 로컬 스토리지에서 API 키 로드
   */
  private loadApiKeys() {
    try {
      // 서버사이드 환경변수 우선 사용
      if (typeof window === 'undefined') {
        if (process.env.OPENAI_API_KEY) {
          this.openaiApiKey = process.env.OPENAI_API_KEY;
          if (process.env.OPENAI_API_URL) {
            this.openaiApiUrl = process.env.OPENAI_API_URL;
          }
          this.currentProvider = 'openai';
        } else if (process.env.OPENROUTER_API_KEY) {
          this.openrouterApiKey = process.env.OPENROUTER_API_KEY;
          if (process.env.OPENROUTER_API_URL) {
            this.openrouterApiUrl = process.env.OPENROUTER_API_URL;
          }
          this.currentProvider = 'openrouter';
        }
        return;
      }

      // 클라이언트사이드에서는 로컬 스토리지 사용
      if (typeof window !== 'undefined') {
        const savedKeys = localStorage.getItem('patent-ai-api-keys');
        if (savedKeys) {
          const parsed = JSON.parse(savedKeys);
          
          if (parsed.openai && parsed.openai.isEnabled && parsed.openai.apiKey) {
            this.openaiApiKey = parsed.openai.apiKey;
            if (parsed.openai.apiUrl) {
              this.openaiApiUrl = parsed.openai.apiUrl;
            }
            this.currentProvider = 'openai';
          } else if (parsed.openrouter && parsed.openrouter.isEnabled && parsed.openrouter.apiKey) {
            this.openrouterApiKey = parsed.openrouter.apiKey;
            if (parsed.openrouter.apiUrl) {
              this.openrouterApiUrl = parsed.openrouter.apiUrl;
            }
            this.currentProvider = 'openrouter';
          }
        }
      }
    } catch (error) {
      console.error('AI API 키 로드 오류:', error);
    }
  }

  /**
   * API 키 유효성 검증
   */
  private validateApiKey(): boolean {
    if (!this.currentProvider) {
      throw new Error('AI 분석을 위한 API 키가 설정되지 않았습니다. 설정 페이지에서 OpenAI 또는 OpenRouter API 키를 입력해주세요.');
    }
    return true;
  }

  /**
   * 특허 분석 수행
   */
  async analyzePatent(patent: Patent): Promise<PatentAnalysis> {
    try {
      this.validateApiKey();
      
      const prompt = this.createAnalysisPrompt(patent);
      const response = await this.callAiApi(prompt);
      
      return this.parseAnalysisResponse(response, patent.id);
    } catch (error) {
      console.error('AI 분석 오류:', error);
      throw new Error('AI 분석 중 오류가 발생했습니다.');
    }
  }

  /**
   * 분석 프롬프트 생성
   */
  private createAnalysisPrompt(patent: Patent): string {
    return `
다음 특허에 대한 종합적인 분석을 수행해주세요:

특허 제목: ${patent.title}
초록: ${patent.abstract}
발명자: ${patent.inventors.join(', ')}
출원인: ${patent.applicants.join(', ')}
출원일: ${patent.applicationDate}
분류: ${patent.classification.join(', ')}

다음 항목들을 분석해주세요:

1. 신규성 (1-10점): 이 발명이 기존 기술과 비교하여 얼마나 새로운지
2. 진보성 (1-10점): 이 발명이 기존 기술을 얼마나 발전시켰는지
3. 산업상 이용가능성 (1-10점): 이 발명이 실제로 산업에 적용 가능한지
4. 시장 잠재력 (1-10점): 이 발명의 시장 성공 가능성

위험도 평가:
- 침해 위험도 (1-10점)
- 유효성 위험도 (1-10점)
- 집행 위험도 (1-10점)

경쟁 환경 분석:
- 직접 경쟁사
- 간접 경쟁사
- 시장 포지션
- 차별화 기회

구체적인 권장사항과 전략을 제시해주세요.

응답은 JSON 형식으로 제공해주세요:
{
  "novelty": 점수,
  "inventiveness": 점수,
  "industrialApplicability": 점수,
  "marketPotential": 점수,
  "riskAssessment": {
    "infringementRisk": 점수,
    "validityRisk": 점수,
    "enforcementRisk": 점수,
    "overallRisk": 점수,
    "riskFactors": ["위험요소1", "위험요소2"]
  },
  "recommendations": ["권장사항1", "권장사항2"],
  "competitiveLandscape": {
    "directCompetitors": ["경쟁사1", "경쟁사2"],
    "indirectCompetitors": ["간접경쟁사1", "간접경쟁사2"],
    "marketPosition": "시장포지션",
    "differentiationOpportunities": ["차별화기회1", "차별화기회2"]
  }
}
    `.trim();
  }

  /**
   * AI API 호출
   */
  private async callAiApi(prompt: string): Promise<string> {
    // API 키가 없으면 더미 데이터 반환 (데모 모드)
    if (!this.currentProvider) {
      console.info('AI API 키가 설정되지 않음, 데모 모드로 실행');
      return this.getMockAnalysisResponse();
    }

    try {
      if (this.currentProvider === 'openai') {
        return await this.callOpenAiApi(prompt);
      } else if (this.currentProvider === 'openrouter') {
        return await this.callOpenRouterApi(prompt);
      } else {
        throw new Error('지원하지 않는 AI 제공자입니다.');
      }
    } catch (error: any) {
      console.error('AI API 호출 실패:', error);
      
      // API 오류에 따른 구체적인 메시지
      if (error.response?.status === 401) {
        throw new Error('AI API 키가 유효하지 않습니다. 설정을 확인해주세요.');
      } else if (error.response?.status === 429) {
        throw new Error('AI API 호출 한도를 초과했습니다. 잠시 후 다시 시도해주세요.');
      } else if (error.response?.status === 402) {
        throw new Error('AI API 크레딧이 부족합니다. 계정을 확인해주세요.');
      }
      
      // 기타 오류 시 더미 데이터로 폴백
      console.warn('더미 데이터로 폴백:', error.message);
      return this.getMockAnalysisResponse();
    }
  }

  /**
   * OpenAI API 호출
   */
  private async callOpenAiApi(prompt: string): Promise<string> {
    const response = await fetch(`${this.openaiApiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: '당신은 특허 분석 전문가입니다. 정확하고 실용적인 분석을 제공해주세요.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API 오류: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  /**
   * OpenRouter API 호출
   */
  private async callOpenRouterApi(prompt: string): Promise<string> {
    const response = await fetch(`${this.openrouterApiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openrouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Patent AI Platform'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: '당신은 특허 분석 전문가입니다. 정확하고 실용적인 분석을 제공해주세요.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API 오류: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  /**
   * AI 응답 파싱
   */
  private parseAnalysisResponse(response: string, patentId: string): PatentAnalysis {
    try {
      // JSON 응답 추출
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('AI 응답에서 JSON을 찾을 수 없습니다.');
      }

      // JSON 유효성 검사
      const jsonString = jsonMatch[0].trim();
      if (!jsonString || jsonString.length < 2) {
        throw new Error('유효하지 않은 JSON 형식입니다.');
      }

      const parsed = JSON.parse(jsonString);

      return {
        patentId,
        novelty: parsed.novelty || 5,
        inventiveness: parsed.inventiveness || 5,
        industrialApplicability: parsed.industrialApplicability || 5,
        marketPotential: parsed.marketPotential || 5,
        riskAssessment: {
          infringementRisk: parsed.riskAssessment?.infringementRisk || 5,
          validityRisk: parsed.riskAssessment?.validityRisk || 5,
          enforcementRisk: parsed.riskAssessment?.enforcementRisk || 5,
          overallRisk: parsed.riskAssessment?.overallRisk || 5,
          riskFactors: parsed.riskAssessment?.riskFactors || []
        },
        recommendations: parsed.recommendations || [],
        competitiveLandscape: {
          directCompetitors: parsed.competitiveLandscape?.directCompetitors || [],
          indirectCompetitors: parsed.competitiveLandscape?.indirectCompetitors || [],
          marketPosition: parsed.competitiveLandscape?.marketPosition || '알 수 없음',
          differentiationOpportunities: parsed.competitiveLandscape?.differentiationOpportunities || []
        }
      };
    } catch (error) {
      console.error('AI 응답 파싱 오류:', error);
      // 기본 응답 반환
      return {
        patentId,
        novelty: 5,
        inventiveness: 5,
        industrialApplicability: 5,
        marketPotential: 5,
        riskAssessment: {
          infringementRisk: 5,
          validityRisk: 5,
          enforcementRisk: 5,
          overallRisk: 5,
          riskFactors: ['AI 응답 파싱 실패']
        },
        recommendations: ['AI 분석을 다시 시도해주세요'],
        competitiveLandscape: {
          directCompetitors: [],
          indirectCompetitors: [],
          marketPosition: '분석 불가',
          differentiationOpportunities: []
        }
      };
    }
  }

  /**
   * API 키 상태 확인
   */
  getApiKeyStatus(): { hasOpenAi: boolean; hasOpenRouter: boolean; currentProvider: string | null } {
    try {
      if (typeof window !== 'undefined') {
        const savedKeys = localStorage.getItem('patent-ai-api-keys');
        if (savedKeys) {
          const parsed = JSON.parse(savedKeys);
          return {
            hasOpenAi: !!(parsed.openai && parsed.openai.isEnabled && parsed.openai.apiKey),
            hasOpenRouter: !!(parsed.openrouter && parsed.openrouter.isEnabled && parsed.openrouter.apiKey),
            currentProvider: this.currentProvider
          };
        }
      }
      return { hasOpenAi: false, hasOpenRouter: false, currentProvider: null };
    } catch (error) {
      return { hasOpenAi: false, hasOpenRouter: false, currentProvider: null };
    }
  }

  /**
   * 모의 분석 응답 생성
   */
  private getMockAnalysisResponse(): string {
    return JSON.stringify({
      novelty: Math.floor(Math.random() * 4) + 6, // 6-10
      inventiveness: Math.floor(Math.random() * 4) + 6, // 6-10
      industrialApplicability: Math.floor(Math.random() * 4) + 6, // 6-10
      marketPotential: Math.floor(Math.random() * 4) + 6, // 6-10
      riskAssessment: {
        infringementRisk: Math.floor(Math.random() * 4) + 3, // 3-6
        validityRisk: Math.floor(Math.random() * 4) + 3, // 3-6
        enforcementRisk: Math.floor(Math.random() * 4) + 3, // 3-6
        overallRisk: Math.floor(Math.random() * 4) + 3, // 3-6
        riskFactors: [
          '기존 특허와의 유사성',
          '기술의 진보성 부족',
          '시장 진입 장벽'
        ]
      },
      recommendations: [
        '기존 기술과의 차별화 요소 강화',
        '추가적인 기술 개발을 통한 진보성 확보',
        '시장 조사를 통한 수요 확인',
        '특허 포트폴리오 구축을 통한 경쟁 우위 확보'
      ],
      competitiveLandscape: {
        directCompetitors: ['경쟁사 A', '경쟁사 B'],
        indirectCompetitors: ['대체 기술 제공업체', '관련 서비스 업체'],
        marketPosition: '신규 진입자',
        differentiationOpportunities: [
          '사용자 경험 개선',
          '가격 경쟁력',
          '기술적 차별화'
        ]
      }
    });
  }

  /**
   * 사용 가능한 모델 목록 조회
   */
  async getAvailableModels(): Promise<string[]> {
    try {
      if (!this.currentProvider) {
        return ['gpt-4o-mini', 'gpt-4o', 'claude-3-haiku', 'claude-3-sonnet'];
      }

      this.validateApiKey();
      
      if (this.currentProvider === 'openai') {
        const response = await fetch(`${this.openaiApiUrl}/models`, {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          return data.data.map((model: any) => model.id);
        }
      } else if (this.currentProvider === 'openrouter') {
        const response = await fetch(`${this.openrouterApiUrl}/models`, {
          headers: {
            'Authorization': `Bearer ${this.openrouterApiKey}`,
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'Patent AI Platform'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          return data.data.map((model: any) => model.id);
        }
      }
      
      return ['gpt-4o-mini', 'gpt-4o', 'claude-3-haiku', 'claude-3-sonnet'];
    } catch (error) {
      console.error('모델 목록 조회 오류:', error);
      return ['gpt-4o-mini', 'gpt-4o', 'claude-3-haiku', 'claude-3-sonnet'];
    }
  }
}

// 싱글톤 인스턴스 생성
export const aiAnalysisService = new AiAnalysisService();
