// 간단한 한국어 처리 테스트
console.log('Korean Text Processing Test');
console.log('==========================');

class KoreanProcessor {
  constructor() {
    this.stopWords = new Set(['은', '는', '이', '가', '을', '를', '의', '에']);
    this.domainDict = new Map();
    this.domainDict.set('AI', ['인공지능', '머신러닝', '딥러닝', '알고리즘']);
    this.domainDict.set('BIO', ['바이오기술', '유전자', '단백질', '세포']);
    this.domainDict.set('ICT', ['네트워크', '클라우드', '보안', 'API']);
  }
  
  analyzeMorphemes(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s가-힣]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 1 && !this.stopWords.has(word));
  }
  
  classifyDomain(text) {
    const morphemes = this.analyzeMorphemes(text);
    let bestDomain = 'UNKNOWN';
    let bestScore = 0;
    
    this.domainDict.forEach((terms, domain) => {
      const score = morphemes.filter(m => terms.includes(m)).length;
      if (score > bestScore) {
        bestScore = score;
        bestDomain = domain;
      }
    });
    
    return { domain: bestDomain, score: bestScore };
  }
  
  calculateSimilarity(text1, text2) {
    const m1 = new Set(this.analyzeMorphemes(text1));
    const m2 = new Set(this.analyzeMorphemes(text2));
    
    const intersection = new Set([...m1].filter(x => m2.has(x)));
    const union = new Set([...m1, ...m2]);
    
    return intersection.size / union.size;
  }
}

// Test
const processor = new KoreanProcessor();

const testTexts = [
  'AI 기반 머신러닝 알고리즘을 활용한 특허 분석 시스템',
  '바이오기술을 활용한 유전자 치료 방법 및 장치',
  '클라우드 기반 마이크로서비스 아키텍처 시스템'
];

console.log('Test Results:');
console.log('=============');

testTexts.forEach((text, i) => {
  const morphemes = processor.analyzeMorphemes(text);
  const classification = processor.classifyDomain(text);
  
  console.log(`\n${i + 1}. Text: ${text}`);
  console.log(`   Morphemes: ${morphemes.slice(0, 5).join(', ')}...`);
  console.log(`   Domain: ${classification.domain} (score: ${classification.score})`);
});

// Similarity test
console.log('\nSimilarity Matrix:');
console.log('==================');
for (let i = 0; i < testTexts.length; i++) {
  for (let j = i + 1; j < testTexts.length; j++) {
    const similarity = processor.calculateSimilarity(testTexts[i], testTexts[j]);
    console.log(`${i + 1} vs ${j + 1}: ${(similarity * 100).toFixed(1)}%`);
  }
}

console.log('\nTest completed successfully!');
