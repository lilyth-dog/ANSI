// 한국어 처리 기능 테스트
console.log('🇰🇷 한국어 텍스트 처리 시스템 테스트 시작');
console.log('='.repeat(50));

// 가상의 한국어 텍스트 처리기 (실제 구현과 유사)
class KoreanTextProcessor {
  constructor() {
    this.initializeStopWords();
    this.initializeDomainDictionary();
    this.initializeSynonymDictionary();
    this.initializeTechnicalTerms();
  }
  
  // 한국어 불용어 초기화
  initializeStopWords() {
    this.stopWords = new Set([
      '은', '는', '이', '가', '을', '를', '의', '에', '에서', '로', '으로', '와', '과', '도', '만',
      '그리고', '또는', '하지만', '그러나', '따라서', '그래서', '그런데',
      '이것', '그것', '저것', '이런', '그런', '저런', '어떤', '무엇',
      '매우', '아주', '너무', '정말', '진짜', '거의', '대략', '약',
      '있다', '없다', '하다', '되다', '크다', '작다', '좋다', '나쁘다'
    ]);
  }
  
  // 도메인별 전문 용어 사전 초기화
  initializeDomainDictionary() {
    this.domainDictionary = new Map();
    
    // AI/머신러닝 도메인
    this.domainDictionary.set('AI', [
      '인공지능', '머신러닝', '딥러닝', '신경망', '알고리즘', '데이터마이닝',
      '패턴인식', '자연어처리', '컴퓨터비전', '강화학습', '지도학습', '비지도학습'
    ]);
    
    // 바이오/의료 도메인
    this.domainDictionary.set('BIO', [
      '바이오기술', '유전자', '단백질', '세포', '분자', '생화학', '면역학',
      '약물발견', '진단', '치료', '예방', '백신', '항체', '효소', '호르몬'
    ]);
    
    // ICT/통신 도메인
    this.domainDictionary.set('ICT', [
      '정보통신', '네트워크', '프로토콜', '라우팅', '스위칭', '보안', '암호화',
      '인증', '방화벽', '클라우드', '가상화', '컨테이너', '마이크로서비스'
    ]);
  }
  
  // 동의어/유사어 사전 초기화
  initializeSynonymDictionary() {
    this.synonymDictionary = new Map();
    
    this.synonymDictionary.set('기술', ['테크놀로지', '기법', '방법', '기술력']);
    this.synonymDictionary.set('발명', ['고안', '창작', '개발', '연구']);
    this.synonymDictionary.set('시스템', ['체계', '구조', '프레임워크', '플랫폼']);
    this.synonymDictionary.set('알고리즘', ['알고리즘', '절차', '순서', '로직']);
    this.synonymDictionary.set('프로세스', ['과정', '절차', '단계', '워크플로우']);
    
    this.synonymDictionary.set('인공지능', ['AI', '인공지능', '지능형']);
    this.synonymDictionary.set('머신러닝', ['ML', '기계학습', '자동학습']);
    this.synonymDictionary.set('딥러닝', ['DL', '심층학습', '심화학습']);
    this.synonymDictionary.set('신경망', ['뉴럴네트워크', '뉴런', '신경']);
  }
  
  // 기술 용어 가중치 초기화
  initializeTechnicalTerms() {
    this.technicalTerms = new Map();
    
    this.technicalTerms.set('특허', 3.0);
    this.technicalTerms.set('발명', 3.0);
    this.technicalTerms.set('신기술', 2.5);
    this.technicalTerms.set('혁신', 2.5);
    this.technicalTerms.set('인공지능', 2.5);
    this.technicalTerms.set('머신러닝', 2.5);
    this.technicalTerms.set('딥러닝', 2.5);
    this.technicalTerms.set('신경망', 2.0);
    this.technicalTerms.set('알고리즘', 2.0);
    this.technicalTerms.set('프로세스', 2.0);
    this.technicalTerms.set('시스템', 2.0);
  }
  
  // 한국어 형태소 분석
  analyzeMorphemes(text) {
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
  preprocessText(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s가-힣]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  // 어간 추출
  extractStems(text) {
    const words = text.split(/\s+/);
    const stems = [];
    
    words.forEach(word => {
      if (word.length < 2) return;
      
      // 한국어 어미 제거
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
  removeKoreanEndings(word) {
    const endings = [
      '하다', '되다', '있다', '없다', '크다', '작다', '좋다', '나쁘다',
      '습니다', '니다', '어요', '아요', '어서', '아서', '으면', '도록', '하게'
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
  removeEnglishEndings(word) {
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
  normalizeSynonyms(morphemes) {
    return morphemes.map(morpheme => {
      for (const [standard, synonyms] of this.synonymDictionary) {
        if (synonyms.includes(morpheme)) {
          return standard;
        }
      }
      return morpheme;
    });
  }
  
  // 도메인별 키워드 추출
  extractDomainKeywords(text) {
    const morphemes = this.analyzeMorphemes(text);
    const domainKeywords = new Map();
    
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
  calculateTechnicalWeight(term) {
    return this.technicalTerms.get(term) || 1.0;
  }
  
  // 텍스트 유사도 계산 (한국어 특화)
  calculateKoreanSimilarity(text1, text2) {
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
  optimizePatentText(text) {
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
  classifyDomain(text) {
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

// 테스트 실행
function runKoreanProcessingTests() {
  console.log('🧪 한국어 처리 기능 테스트 시작');
  
  const processor = new KoreanTextProcessor();
  
  // 테스트용 특허 텍스트들
  const testTexts = [
    {
      title: 'AI 기반 머신러닝 알고리즘을 활용한 특허 분석 시스템',
      abstract: '인공지능과 딥러닝 기술을 사용하여 특허 문서의 유사도를 분석하고 클러스터링하는 혁신적인 방법입니다.',
      domain: 'AI'
    },
    {
      title: '바이오기술을 활용한 유전자 치료 방법 및 장치',
      abstract: '유전자 편집 기술과 단백질 분석을 통해 새로운 치료 방법을 개발하는 발명입니다.',
      domain: 'BIO'
    },
    {
      title: '클라우드 기반 마이크로서비스 아키텍처 시스템',
      abstract: '클라우드 컴퓨팅과 컨테이너 기술을 활용한 확장 가능한 시스템 구조입니다.',
      domain: 'ICT'
    }
  ];
  
  console.log('\n📝 테스트 텍스트:');
  testTexts.forEach((text, i) => {
    console.log(`\n${i + 1}. ${text.title}`);
    console.log(`   요약: ${text.abstract}`);
    console.log(`   예상 도메인: ${text.domain}`);
  });
  
  // 1. 형태소 분석 테스트
  console.log('\n🔬 형태소 분석 테스트:');
  testTexts.forEach((text, i) => {
    const morphemes = processor.analyzeMorphemes(text.title + ' ' + text.abstract);
    console.log(`\n${i + 1}. 형태소 (${morphemes.length}개):`);
    console.log(`   ${morphemes.slice(0, 10).join(', ')}${morphemes.length > 10 ? '...' : ''}`);
  });
  
  // 2. 도메인 분류 테스트
  console.log('\n🏷️ 도메인 분류 테스트:');
  testTexts.forEach((text, i) => {
    const classification = processor.classifyDomain(text.title + ' ' + text.abstract);
    console.log(`\n${i + 1}. 분류 결과:`);
    console.log(`   예상: ${text.domain}`);
    console.log(`   실제: ${classification.domain}`);
    console.log(`   신뢰도: ${(classification.confidence * 100).toFixed(1)}%`);
  });
  
  // 3. 텍스트 최적화 테스트
  console.log('\n⚡ 텍스트 최적화 테스트:');
  testTexts.forEach((text, i) => {
    const optimized = processor.optimizePatentText(text.title + ' ' + text.abstract);
    console.log(`\n${i + 1}. 최적화 결과:`);
    console.log(`   원본: ${text.title}`);
    console.log(`   최적화: ${optimized.substring(0, 100)}...`);
  });
  
  // 4. 유사도 계산 테스트
  console.log('\n📊 텍스트 유사도 테스트:');
  for (let i = 0; i < testTexts.length; i++) {
    for (let j = i + 1; j < testTexts.length; j++) {
      const text1 = testTexts[i].title + ' ' + testTexts[i].abstract;
      const text2 = testTexts[j].title + ' ' + testTexts[j].abstract;
      const similarity = processor.calculateKoreanSimilarity(text1, text2);
      
      console.log(`\n${i + 1} ↔ ${j + 1} 유사도:`);
      console.log(`   ${testTexts[i].domain} vs ${testTexts[j].domain}: ${(similarity * 100).toFixed(1)}%`);
    }
  }
  
  // 5. 성능 테스트
  console.log('\n⚡ 성능 테스트:');
  const longText = '인공지능 기반 머신러닝 알고리즘을 활용한 특허 분석 시스템은 딥러닝과 자연어처리 기술을 사용하여 특허 문서의 유사도를 분석하고 클러스터링하는 혁신적인 방법입니다. 이 시스템은 컴퓨터비전과 패턴인식 기술을 결합하여 높은 정확도를 달성합니다.';
  
  const startTime = Date.now();
  for (let i = 0; i < 100; i++) {
    processor.analyzeMorphemes(longText);
  }
  const endTime = Date.now();
  
  console.log(`   100회 형태소 분석 소요시간: ${endTime - startTime}ms`);
  console.log(`   평균 처리시간: ${((endTime - startTime) / 100).toFixed(2)}ms`);
  
  console.log('\n🎉 한국어 처리 기능 테스트 완료!');
  console.log('='.repeat(50));
}

// 테스트 실행
runKoreanProcessingTests();
