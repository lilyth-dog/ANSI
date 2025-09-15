/**
 * 특허 초안 생성 AI 서비스
 * Patently의 Onardo AI 스타일 구현
 */

import OpenAI from 'openai';

export interface PatentDraftInput {
  title: string;
  abstract: string;
  claims: string;
  inventors: string[];
  applicant: string;
}

export interface PatentDraftOutput {
  draft: string;
  partsList: string[];
  confidence: number;
  figures: string[];
}

export class PatentDraftService {
  private openai: OpenAI | null = null;

  constructor() {
    // 클라이언트 사이드에서만 OpenAI 초기화
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
      });
    }
  }

  /**
   * 특허 초안 생성
   */
  async generateDraft(input: PatentDraftInput): Promise<PatentDraftOutput> {
    try {
      if (!this.openai) {
        // OpenAI API가 없는 경우 모의 데이터 반환
        return this.generateMockDraft(input);
      }

      const prompt = this.buildPrompt(input);

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini', // 비용 효율적인 모델 사용
        messages: [
          {
            role: 'system',
            content: `당신은 특허 전문 변호사로서, 한국 특허법에 따라 정확하고 완전한 특허 명세서를 작성하는 Onardo AI입니다.
다음 지침을 엄격히 따르세요:
1. 한국 특허청(KIPO) 양식에 맞는 명세서 작성
2. 청구항을 기반으로 한 정확한 기술적 내용
3. 산업상 이용가능성을 포함
4. 도면 설명 및 상세한 설명 포함
5. 특허법상 요구되는 모든 섹션 포함`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3, // 일관된 출력 위해 낮은 temperature
        max_tokens: 4000
      });

      const draft = response.choices[0]?.message?.content || '';

      // Parts list 추출
      const partsList = this.extractPartsFromClaims(input.claims);

      // 도면 제안
      const figures = this.generateFigures(input.claims);

      // 신뢰도 계산 (간단한 휴리스틱)
      const confidence = this.calculateConfidence(draft, input);

      return {
        draft,
        partsList,
        figures,
        confidence
      };

    } catch (error) {
      console.error('AI 초안 생성 오류:', error);
      // 오류 발생 시 모의 데이터 반환
      return this.generateMockDraft(input);
    }
  }

  /**
   * AI 프롬프트 구성
   */
  private buildPrompt(input: PatentDraftInput): string {
    return `다음 정보를 바탕으로 한국 특허 명세서를 작성해주세요:

제목: ${input.title}
초록: ${input.abstract}
발명자: ${input.inventors.join(', ')}
출원인: ${input.applicant}

청구항:
${input.claims}

요구사항:
1. 특허법 제42조에 따른 명세서 양식 준수
2. 초록, 청구항, 도면 설명, 발명의 상세한 설명 포함
3. 기술 분야, 배경 기술, 발명의 내용, 산업상 이용가능성 포함
4. 한국어로 작성 (기술 용어는 영어 병기)
5. 전문적이고 정확한 내용
6. 특허 등록 가능성이 높은 양식`;
  }

  /**
   * 청구항에서 Parts 추출 (NLP 기반)
   */
  private extractPartsFromClaims(claims: string): string[] {
    const parts: string[] = [];
    const lines = claims.split(/[;\n]/).map(line => line.trim());

    // 한국어 패턴 매칭
    const patterns = [
      /(.*?)하는\s*(\w+)/g,  // "~하는 ~" 패턴
      /(.*?)를\s*포함하는\s*(\w+)/g,  // "~를 포함하는 ~" 패턴
      /(.*?)부;/g,  // "~부;" 패턴
      /(.*?)유닛;/g,  // "~유닛;" 패턴
      /(.*?)장치;/g,  // "~장치;" 패턴
      /(.*?)시스템;/g  // "~시스템;" 패턴
    ];

    lines.forEach(line => {
      patterns.forEach(pattern => {
        const matches = line.match(pattern);
        if (matches) {
          matches.forEach(match => {
            // 패턴에서 핵심 부품명 추출
            let part = match.replace(/하는|를 포함하는|;$/, '').trim();

            // 불필요한 단어 제거
            part = part.replace(/^(상기|상술한|적어도 하나의?|적어도 하나 이상의?)\s*/, '');

            if (part.length > 1 && !parts.includes(part)) {
              parts.push(part);
            }
          });
        }
      });
    });

    // 중복 제거 및 정렬
    return [...new Set(parts)].slice(0, 10); // 최대 10개로 제한
  }

  /**
   * 도면 자동 생성 제안
   */
  private generateFigures(claims: string): string[] {
    const figures: string[] = [];
    const claimsText = claims.toLowerCase();

    // 기본 도면들
    figures.push('시스템 전체 구성도');

    // 청구항 분석을 통한 도면 제안
    if (claimsText.includes('처리') || claimsText.includes('분석') || claimsText.includes('계산')) {
      figures.push('처리 흐름도');
    }

    if (claimsText.includes('저장') || claimsText.includes('데이터베이스') || claimsText.includes('메모리')) {
      figures.push('데이터 저장 구조도');
    }

    if (claimsText.includes('통신') || claimsText.includes('네트워크') || claimsText.includes('연결')) {
      figures.push('통신 구성도');
    }

    if (claimsText.includes('사용자') || claimsText.includes('인터페이스') || claimsText.includes('화면')) {
      figures.push('사용자 인터페이스 화면');
    }

    if (claimsText.includes('알고리즘') || claimsText.includes('방법') || claimsText.includes('단계')) {
      figures.push('알고리즘 플로우차트');
    }

    return figures.slice(0, 6); // 최대 6개 도면으로 제한
  }

  /**
   * AI 신뢰도 계산
   */
  private calculateConfidence(draft: string, input: PatentDraftInput): number {
    let score = 70; // 기본 점수

    // 길이 기반 점수
    if (draft.length > 2000) score += 10;
    if (draft.length > 4000) score += 5;

    // 구조적 완전성 점수
    const sections = ['초록', '기술 분야', '배경 기술', '발명의 내용', '도면 설명', '상세한 설명'];
    const foundSections = sections.filter(section =>
      draft.toLowerCase().includes(section.toLowerCase())
    );
    score += foundSections.length * 2;

    // 청구항 일치도 점수
    const claimsCount = input.claims.split('청구항').length - 1;
    const draftClaimsCount = (draft.match(/청구항\s+\d+/g) || []).length;
    if (draftClaimsCount >= claimsCount) score += 10;

    return Math.min(score, 95); // 최대 95점
  }

  /**
   * 모의 데이터 생성 (OpenAI API 없을 때 사용)
   */
  private generateMockDraft(input: PatentDraftInput): PatentDraftOutput {
    const draft = `# ${input.title}

## 초록 (Abstract)

${input.abstract}

본 발명은 최신 기술을 활용하여 혁신적인 솔루션을 제공하는 시스템에 관한 것이다.

## 기술 분야 (Technical Field)

본 발명은 [기술 분야]에 관한 것으로, 특히 [세부 분야]에 관한 것이다.

## 배경 기술 (Background Art)

종래의 [관련 기술]들은 다음과 같은 문제점을 가지고 있었다:
- 문제점 1
- 문제점 2

본 발명은 이러한 문제점을 해결하기 위해 개발되었다.

## 발명의 내용 (Disclosure)

${input.claims}

## 도면의 간단한 설명 (Brief Description of Drawings)

도면 1은 본 발명의 전체 시스템 구성도이다.
도면 2는 주요 구성요소의 상세도이다.

## 발명의 상세한 설명 (Detailed Description)

### [0010] 시스템 개요
본 발명의 시스템은 크게 다음과 같은 구성요소로 이루어진다.

${input.claims.split('청구항').slice(1).map((claim, index) =>
  `### [00${20 + index * 10}] 청구항 ${index + 1}의 상세 설명\n${claim.trim()}에 대해 상세히 설명하면 다음과 같다.`
).join('\n\n')}

## 산업상 이용 가능성 (Industrial Applicability)

본 발명은 [산업 분야]에서 다음과 같이 활용될 수 있다:
- 활용 사례 1
- 활용 사례 2`;

    const partsList = this.extractPartsFromClaims(input.claims);
    const figures = this.generateFigures(input.claims);

    return {
      draft,
      partsList,
      figures,
      confidence: 75
    };
  }
}

// 싱글톤 인스턴스
export const patentDraftService = new PatentDraftService();
