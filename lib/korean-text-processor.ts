// 한국어 텍스트 처리 서비스
export class KoreanTextProcessor {
  private stopWords: Set<string>;
  private domainDictionary: Map<string, string[]>;
  private synonymDictionary: Map<string, string[]>;
  private technicalTerms: Map<string, number>; // 가중치 포함
  
  constructor() {
    this.initializeStopWords();
    this.initializeDomainDictionary();
    this.initializeSynonymDictionary();
    this.initializeTechnicalTerms();
  }
  
  // 한국어 불용어 초기화
  private initializeStopWords() {
    this.stopWords = new Set([
      // 조사
      '은', '는', '이', '가', '을', '를', '의', '에', '에서', '로', '으로', '와', '과', '도', '만', '부터', '까지',
      // 접속사
      '그리고', '또는', '하지만', '그러나', '따라서', '그래서', '그런데',
      // 대명사
      '이것', '그것', '저것', '이런', '그런', '저런', '어떤', '무엇',
      // 부사
      '매우', '아주', '너무', '정말', '진짜', '거의', '대략', '약',
      // 일반적인 동사/형용사
      '있다', '없다', '하다', '되다', '있다', '없다', '크다', '작다', '좋다', '나쁘다'
    ]);
  }
  
  // 도메인별 전문 용어 사전 초기화
  private initializeDomainDictionary() {
    this.domainDictionary = new Map();
    
    // AI/머신러닝 도메인
    this.domainDictionary.set('AI', [
      '인공지능', '머신러닝', '딥러닝', '신경망', '알고리즘', '데이터마이닝',
      '패턴인식', '자연어처리', '컴퓨터비전', '강화학습', '지도학습', '비지도학습',
      '앙상블', '오버피팅', '언더피팅', '크로스밸리데이션', '하이퍼파라미터'
    ]);
    
    // 바이오/의료 도메인
    this.domainDictionary.set('BIO', [
      '바이오기술', '유전자', '단백질', '세포', '분자', '생화학', '면역학',
      '약물발견', '진단', '치료', '예방', '백신', '항체', '효소', '호르몬',
      '대사', '독성', '약물동태', '임상시험', 'FDA승인'
    ]);
    
    // ICT/통신 도메인
    this.domainDictionary.set('ICT', [
      '정보통신', '네트워크', '프로토콜', '라우팅', '스위칭', '보안', '암호화',
      '인증', '방화벽', '클라우드', '가상화', '컨테이너', '마이크로서비스',
      'API', '웹서비스', '모바일', '5G', 'IoT', '블록체인'
    ]);
    
    // 재료/화학 도메인
    this.domainDictionary.set('MATERIALS', [
      '나노재료', '복합재료', '고분자', '세라믹', '금속', '반도체', '도전체',
      '절연체', '자성체', '광학재료', '바이오재료', '친환경재료', '스마트재료',
      '메타물질', '양자점', '탄소나노튜브', '그래핀'
    ]);
    
    // 에너지 도메인
    this.domainDictionary.set('ENERGY', [
      '태양광', '풍력', '수력', '지열', '바이오매스', '수소', '연료전지',
      '배터리', '에너지저장', '스마트그리드', '전력전자', '전기차', '하이브리드',
      '친환경에너지', '탄소중립', '에너지효율', '에너지관리'
    ]);
  }
  
  // 동의어/유사어 사전 초기화
  private initializeSynonymDictionary() {
    this.synonymDictionary = new Map();
    
    // 기술 관련 동의어
    this.synonymDictionary.set('기술', ['테크놀로지', '기법', '방법', '기술력']);
    this.synonymDictionary.set('발명', ['고안', '창작', '개발', '연구']);
    this.synonymDictionary.set('시스템', ['체계', '구조', '프레임워크', '플랫폼']);
    this.synonymDictionary.set('알고리즘', ['알고리즘', '절차', '순서', '로직']);
    this.synonymDictionary.set('프로세스', ['과정', '절차', '단계', '워크플로우']);
    
    // AI 관련 동의어
    this.synonymDictionary.set('인공지능', ['AI', '인공지능', '지능형']);
    this.synonymDictionary.set('머신러닝', ['ML', '기계학습', '자동학습']);
    this.synonymDictionary.set('딥러닝', ['DL', '심층학습', '심화학습']);
    this.synonymDictionary.set('신경망', ['뉴럴네트워크', '뉴런', '신경']);
    
    // 바이오 관련 동의어
    this.synonymDictionary.set('유전자', ['진', 'DNA', '유전정보']);
    this.synonymDictionary.set('단백질', ['프로테인', '아미노산', '펩타이드']);
    this.synonymDictionary.set('세포', ['셀', '세포질', '세포막']);
  }
  
  // 기술 용어 가중치 초기화
  private initializeTechnicalTerms() {
    this.technicalTerms = new Map();
    
    // 핵심 기술 용어 (높은 가중치)
    this.technicalTerms.set('특허', 3.0);
    this.technicalTerms.set('발명', 3.0);
    this.technicalTerms.set('신기술', 2.5);
    this.technicalTerms.set('혁신', 2.5);
    
    // AI/ML 관련 (높은 가중치)
    this.technicalTerms.set('인공지능', 2.5);
    this.technicalTerms.set('머신러닝', 2.5);
    this.technicalTerms.set('딥러닝', 2.5);
    this.technicalTerms.set('신경망', 2.0);
    
    // 일반 기술 용어 (중간 가중치)
    this.technicalTerms.set('알고리즘', 2.0);
    this.technicalTerms.set('프로세스', 2.0);
    this.technicalTerms.set('시스템', 2.0);
    this.technicalTerms.set('인터페이스', 1.5);
    
    // 도메인별 전문 용어들
    this.domainDictionary.forEach((terms, domain) => {
      terms.forEach(term => {
        this.technicalTerms.set(term, 2.0);
      });
    });
  }
  
  // 한국어 형태소 분석 (간단한 구현)
  public analyzeMorphemes(text: string): string[] {
    // 1. 기본 전처리
    let processedText = this.preprocessText(text);
    
    // 2. 어간 추출 (간단한 규칙 기반)
    const morphemes = this.extractStems(processedText);
    
    // 3. 불용어 제거
    const filteredMorphemes = morphemes.filter(morpheme => 
      !this.stopWords.has(morpheme) && morpheme.length > 1
    );
    
    // 4. 동의어 정규화
    const normalizedMorphemes = this.normalizeSynonyms(filteredMorphemes);
    
    return normalizedMorphemes;
  }
  
  // 텍스트 전처리
  private preprocessText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s가-힣]/g, ' ') // 한글, 영문, 숫자만 유지
      .replace(/\s+/g, ' ') // 연속된 공백을 하나로
      .trim();
  }
  
  // 어간 추출 (간단한 규칙 기반)
  private extractStems(text: string): string[] {
    const words = text.split(/\s+/);
    const stems: string[] = [];
    
    words.forEach(word => {
      if (word.length < 2) return;
      
      // 한국어 어미 제거 (간단한 규칙)
      let stem = this.removeKoreanEndings(word);
      
      // 영문 어미 제거
      stem = this.removeEnglishEndings(stem);
      
      if (stem.length >= 2) {
        stems.push(stem);
      }
    });
    
    return stems;
  }
  
  // 한국어 어미 제거
  private removeKoreanEndings(word: string): string {
    // 간단한 어미 제거 규칙
    const endings = [
      '하다', '되다', '있다', '없다', '크다', '작다', '좋다', '나쁘다',
      '습니다', '니다', '습니다', '니다', '어요', '아요', '어서', '아서',
      '으면', '으면', '도록', '하게', '스럽게', '답게'
    ];
    
    let stem = word;
    endings.forEach(ending => {
      if (stem.endsWith(ending)) {
        stem = stem.slice(0, -ending.length);
      }
    });
    
    return stem;
  }
  
  // 영문 어미 제거
  private removeEnglishEndings(word: string): string {
    // 간단한 영문 어미 제거 규칙
    const endings = [
      'ing', 'ed', 'er', 'est', 'ly', 'tion', 'sion', 'ment', 'ness',
      'able', 'ible', 'ful', 'less', 'ous', 'ive', 'al', 'ic', 'ical'
    ];
    
    let stem = word;
    endings.forEach(ending => {
      if (stem.endsWith(ending)) {
        stem = stem.slice(0, -ending.length);
      }
    });
    
    return stem;
  }
  
  // 동의어 정규화
  private normalizeSynonyms(morphemes: string[]): string[] {
    return morphemes.map(morpheme => {
      // 동의어 사전에서 찾기
      for (const [standard, synonyms] of this.synonymDictionary) {
        if (synonyms.includes(morpheme)) {
          return standard;
        }
      }
      return morpheme;
    });
  }
  
  // 도메인별 키워드 추출
  public extractDomainKeywords(text: string): Map<string, string[]> {
    const morphemes = this.analyzeMorphemes(text);
    const domainKeywords = new Map<string, string[]>();
    
    this.domainDictionary.forEach((terms, domain) => {
      const foundTerms = morphemes.filter(morpheme => 
        terms.includes(morpheme)
      );
      
      if (foundTerms.length > 0) {
        domainKeywords.set(domain, foundTerms);
      }
    });
    
    return domainKeywords;
  }
  
  // 기술 용어 가중치 계산
  public calculateTechnicalWeight(term: string): number {
    return this.technicalTerms.get(term) || 1.0;
  }
  
  // 텍스트 유사도 계산 (한국어 특화)
  public calculateKoreanSimilarity(text1: string, text2: string): number {
    const morphemes1 = this.analyzeMorphemes(text1);
    const morphemes2 = this.analyzeMorphemes(text2);
    
    // 형태소 기반 Jaccard 유사도
    const set1 = new Set(morphemes1);
    const set2 = new Set(morphemes2);
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    const jaccardSimilarity = intersection.size / union.size;
    
    // 도메인 키워드 유사도
    const domainKeywords1 = this.extractDomainKeywords(text1);
    const domainKeywords2 = this.extractDomainKeywords(text2);
    
    let domainSimilarity = 0;
    let domainCount = 0;
    
    domainKeywords1.forEach((keywords1, domain) => {
      const keywords2 = domainKeywords2.get(domain);
      if (keywords2) {
        const domainSet1 = new Set(keywords1);
        const domainSet2 = new Set(keywords2);
        const domainIntersection = new Set([...domainSet1].filter(x => domainSet2.has(x)));
        const domainUnion = new Set([...domainSet1, ...domainSet2]);
        
        domainSimilarity += domainIntersection.size / domainUnion.size;
        domainCount++;
      }
    });
    
    const averageDomainSimilarity = domainCount > 0 ? domainSimilarity / domainCount : 0;
    
    // 가중 평균 (형태소 70%, 도메인 30%)
    return jaccardSimilarity * 0.7 + averageDomainSimilarity * 0.3;
  }
  
  // 특허 텍스트 최적화
  public optimizePatentText(text: string): string {
    const morphemes = this.analyzeMorphemes(text);
    
    // 기술 용어 강조
    const enhancedMorphemes = morphemes.map(morpheme => {
      const weight = this.calculateTechnicalWeight(morpheme);
      if (weight > 1.5) {
        return `${morpheme}(${weight})`;
      }
      return morpheme;
    });
    
    return enhancedMorphemes.join(' ');
  }
  
  // 도메인 분류
  public classifyDomain(text: string): { domain: string; confidence: number } {
    const domainKeywords = this.extractDomainKeywords(text);
    
    let bestDomain = 'UNKNOWN';
    let bestScore = 0;
    
    domainKeywords.forEach((keywords, domain) => {
      const score = keywords.length;
      if (score > bestScore) {
        bestScore = score;
        bestDomain = domain;
      }
    });
    
    const confidence = bestScore / Math.max(...Array.from(domainKeywords.values()).map(k => k.length), 1);
    
    return {
      domain: bestDomain,
      confidence: Math.min(confidence, 1.0)
    };
  }
}

// 싱글톤 인스턴스
export const koreanTextProcessor = new KoreanTextProcessor();
