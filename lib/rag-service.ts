import { Patent } from '@/types';
import { webSearchService, WebSearchResult } from './web-search';
import { kiprisService } from './kipris';
import { aiAnalysisService } from './ai-analysis';

export interface RAGQuery {
  question: string;
  context?: {
    patents?: Patent[];
    webResults?: WebSearchResult[];
    additionalInfo?: string;
  };
  maxTokens?: number;
  temperature?: number;
}

export interface RAGResponse {
  answer: string;
  sources: {
    patents: Patent[];
    webResults: WebSearchResult[];
    confidence: number;
  };
  reasoning: string;
  followUpQuestions: string[];
}

export interface DocumentChunk {
  id: string;
  content: string;
  metadata: {
    source: string;
    type: 'patent' | 'web' | 'manual';
    relevance: number;
    timestamp: string;
  };
  embedding?: number[];
}

export class RAGService {
  private documentStore: DocumentChunk[] = [];
  private maxChunkSize = 1000;
  private overlapSize = 200;

  /**
   * 문서 청킹 및 저장
   */
  async addDocument(content: string, metadata: Omit<DocumentChunk['metadata'], 'timestamp'>): Promise<void> {
    const chunks = this.chunkDocument(content);
    
    chunks.forEach((chunk, index) => {
      this.documentStore.push({
        id: `${metadata.source}_${index}`,
        content: chunk,
        metadata: {
          ...metadata,
          timestamp: new Date().toISOString()
        }
      });
    });
  }

  /**
   * 문서를 청킹으로 분할
   */
  private chunkDocument(content: string): string[] {
    const chunks: string[] = [];
    let start = 0;
    
    while (start < content.length) {
      const end = Math.min(start + this.maxChunkSize, content.length);
      let chunk = content.substring(start, end);
      
      // 문장 경계에서 자르기
      if (end < content.length) {
        const lastPeriod = chunk.lastIndexOf('.');
        const lastNewline = chunk.lastIndexOf('\n');
        const cutPoint = Math.max(lastPeriod, lastNewline);
        
        if (cutPoint > start + this.maxChunkSize * 0.7) {
          chunk = chunk.substring(0, cutPoint + 1);
          start = start + cutPoint + 1;
        } else {
          start = end;
        }
      } else {
        start = end;
      }
      
      if (chunk.trim().length > 0) {
        chunks.push(chunk.trim());
      }
    }
    
    return chunks;
  }

  /**
   * 관련 문서 검색
   */
  async searchRelevantDocuments(query: string, limit: number = 5): Promise<DocumentChunk[]> {
    // 간단한 키워드 기반 검색 (실제로는 임베딩 기반 검색 사용)
    const queryWords = query.toLowerCase().split(/\s+/);
    
    const scoredChunks = this.documentStore.map(chunk => {
      let score = 0;
      const contentLower = chunk.content.toLowerCase();
      
      queryWords.forEach(word => {
        const wordCount = (contentLower.match(new RegExp(word, 'g')) || []).length;
        score += wordCount * 2;
        
        // 특허 관련 키워드 가중치
        if (['특허', 'patent', '발명', 'invention', '기술', 'technology'].includes(word)) {
          score += 3;
        }
      });
      
      return { chunk, score };
    });
    
    return scoredChunks
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.chunk);
  }

  /**
   * RAG 질의응답 수행
   */
  async query(query: RAGQuery): Promise<RAGResponse> {
    try {
      // 1. 관련 문서 검색
      const relevantDocs = await this.searchRelevantDocuments(query.question);
      
      // 2. 컨텍스트 구성
      const context = this.buildContext(query, relevantDocs);
      
      // 3. AI를 통한 답변 생성
      const aiResponse = await this.generateAIResponse(query.question, context);
      
      // 4. 응답 구성
      return {
        answer: aiResponse.answer,
        sources: {
          patents: query.context?.patents || [],
          webResults: query.context?.webResults || [],
          confidence: aiResponse.confidence
        },
        reasoning: aiResponse.reasoning,
        followUpQuestions: aiResponse.followUpQuestions
      };
    } catch (error) {
      console.error('RAG 질의응답 오류:', error);
      return this.getFallbackResponse(query);
    }
  }

  /**
   * 컨텍스트 구성
   */
  private buildContext(query: RAGQuery, relevantDocs: DocumentChunk[]): string {
    let context = '';
    
    // 관련 문서 내용 추가
    relevantDocs.forEach((doc, index) => {
      context += `[문서 ${index + 1}]\n${doc.content}\n\n`;
    });
    
    // 특허 정보 추가
    if (query.context?.patents) {
      query.context.patents.forEach((patent, index) => {
        context += `[특허 ${index + 1}]\n제목: ${patent.title}\n초록: ${patent.abstract}\n\n`;
      });
    }
    
    // 웹 검색 결과 추가
    if (query.context?.webResults) {
      query.context.webResults.forEach((result, index) => {
        context += `[웹 결과 ${index + 1}]\n제목: ${result.title}\n내용: ${result.snippet}\n\n`;
      });
    }
    
    // 추가 정보 추가
    if (query.context?.additionalInfo) {
      context += `[추가 정보]\n${query.context.additionalInfo}\n\n`;
    }
    
    return context;
  }

  /**
   * AI 응답 생성
   */
  private async generateAIResponse(question: string, context: string): Promise<{
    answer: string;
    confidence: number;
    reasoning: string;
    followUpQuestions: string[];
  }> {
    try {
      const prompt = `
다음 컨텍스트를 바탕으로 질문에 답변해주세요:

컨텍스트:
${context}

질문: ${question}

다음 형식으로 답변해주세요:
1. 답변: 질문에 대한 명확하고 구체적인 답변
2. 근거: 답변의 근거가 되는 정보
3. 추가 질문: 사용자가 더 물어볼 수 있는 관련 질문 3개

답변은 한국어로 작성하고, 특허 관련 전문 용어를 사용하세요.
      `;

      const response = await aiAnalysisService.analyzePatent({
        id: 'rag_query',
        title: question,
        abstract: context,
        inventors: [],
        applicants: [],
        applicationDate: '',
        publicationDate: '',
        status: 'pending' as any,
        classification: [],
        claims: [],
        description: context,
        drawings: [],
        legalStatus: 'active' as any,
        citations: [],
        familyPatents: []
      });

      // AI 분석 결과를 RAG 응답으로 변환
      return {
        answer: `특허 분석 결과를 바탕으로 답변드리겠습니다. ${response.recommendations.join(' ')}`,
        confidence: 0.8,
        reasoning: `AI 분석을 통해 특허의 신규성(${response.novelty}/10), 진보성(${response.inventiveness}/10), 시장 잠재력(${response.marketPotential}/10)을 평가했습니다.`,
        followUpQuestions: [
          '이 기술의 특허 출원 전략은 어떻게 수립해야 할까요?',
          '경쟁사 분석을 통해 어떤 인사이트를 얻을 수 있을까요?',
          '시장 진입 시 고려해야 할 위험 요소는 무엇인가요?'
        ]
      };
    } catch (error) {
      console.error('AI 응답 생성 오류:', error);
      return {
        answer: 'AI 분석 서비스를 사용할 수 없어 기본 답변을 제공합니다.',
        confidence: 0.5,
        reasoning: 'AI 서비스 연결 실패로 인한 기본 응답',
        followUpQuestions: [
          '더 자세한 정보를 원하시나요?',
          '다른 관점에서 분석해보시겠어요?',
          '추가 질문이 있으시면 말씀해주세요.'
        ]
      };
    }
  }

  /**
   * 폴백 응답 (오류 시)
   */
  private getFallbackResponse(query: RAGQuery): RAGResponse {
    return {
      answer: '죄송합니다. 현재 질문에 대한 답변을 생성할 수 없습니다. 잠시 후 다시 시도해주세요.',
      sources: {
        patents: [],
        webResults: [],
        confidence: 0
      },
      reasoning: '서비스 오류로 인한 기본 응답',
      followUpQuestions: [
        '질문을 다시 한 번 확인해주세요',
        '다른 키워드로 검색해보세요',
        '고객 지원팀에 문의해주세요'
      ]
    };
  }

  /**
   * 특허 기반 RAG 질의
   */
  async queryWithPatents(question: string, patentIds: string[]): Promise<RAGResponse> {
    try {
      // 특허 정보 조회
      const patents = await Promise.all(
        patentIds.map(id => kiprisService.getPatentDetail(id))
      );
      
      // 웹 검색으로 보완 정보 수집
      const webResults = await webSearchService.searchWeb({
        query: `${question} ${patents.map(p => p.title).join(' ')}`,
        maxResults: 5
      });
      
      return await this.query({
        question,
        context: {
          patents,
          webResults,
          additionalInfo: `질문: ${question}\n관련 특허: ${patents.length}개`
        }
      });
    } catch (error) {
      console.error('특허 기반 RAG 질의 오류:', error);
      return this.getFallbackResponse({ question });
    }
  }

  /**
   * 문서 저장소 상태 확인
   */
  getDocumentStoreStatus(): { totalChunks: number; totalSize: number } {
    const totalSize = this.documentStore.reduce((sum, doc) => sum + doc.content.length, 0);
    return {
      totalChunks: this.documentStore.length,
      totalSize
    };
  }

  /**
   * 문서 저장소 초기화
   */
  clearDocumentStore(): void {
    this.documentStore = [];
  }

  /**
   * 특정 소스의 문서 제거
   */
  removeDocumentsBySource(source: string): void {
    this.documentStore = this.documentStore.filter(doc => doc.metadata.source !== source);
  }
}

// 싱글톤 인스턴스 생성
export const ragService = new RAGService();
