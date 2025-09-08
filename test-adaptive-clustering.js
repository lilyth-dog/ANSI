// 적응형 클러스터링 시스템 테스트
console.log('🚀 적응형 클러스터링 시스템 테스트 시작...\n');

// 테스트용 특허 데이터 생성
function createTestPatents(count = 50) {
  const patents = [];
  const domains = ['AI', 'BIO', 'ICT', 'Materials', 'Energy'];
  const technologies = [
    '머신러닝', '딥러닝', '자연어처리', '컴퓨터비전', '강화학습',
    '유전자편집', '단백질분석', '세포배양', '약물발견', '진단기술',
    '5G통신', '블록체인', '클라우드컴퓨팅', '사이버보안', 'IoT',
    '나노소재', '바이오소재', '에너지저장', '태양광', '수소연료'
  ];
  
  for (let i = 0; i < count; i++) {
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const tech = technologies[Math.floor(Math.random() * technologies.length)];
    
    patents.push({
      id: `patent_${i + 1}`,
      title: `${domain} 분야의 ${tech} 기술`,
      abstract: `${domain} 기술을 활용한 ${tech} 시스템 및 방법에 관한 특허입니다.`,
      description: `본 발명은 ${domain} 분야에서 ${tech}를 구현하는 혁신적인 방법을 제시합니다.`,
      claims: [`${tech} 처리 방법`, `${domain} 기반 시스템`],
      inventors: [`발명자${i + 1}`],
      applicants: [`출원인${i + 1}`],
      domain: domain,
      technology: tech
    });
  }
  
  return patents;
}

// 데이터 특성 분석 테스트
function testDataAnalysis(patents) {
  console.log('📊 데이터 특성 분석 테스트...');
  
  const size = patents.length;
  const texts = patents.map(p => [p.title, p.abstract, p.description].join(' '));
  
  // 차원성 분석
  const uniqueTerms = new Set();
  texts.forEach(text => {
    const words = text.split(/\s+/);
    words.forEach(word => uniqueTerms.add(word));
  });
  
  const dimensionality = uniqueTerms.size;
  
  // 밀도 분석
  const totalTextLength = texts.reduce((sum, text) => sum + text.length, 0);
  const density = totalTextLength / size;
  
  // 노이즈 레벨 분석
  const stopWords = ['은', '는', '이', '가', '을', '를', '의', '에', '및', '또는'];
  let totalNoise = 0;
  texts.forEach(text => {
    const words = text.split(/\s+/);
    const stopWordCount = words.filter(word => stopWords.includes(word)).length;
    totalNoise += stopWordCount / words.length;
  });
  const noiseLevel = totalNoise / texts.length;
  
  // 도메인 복잡도
  const domainCounts = {};
  patents.forEach(patent => {
    domainCounts[patent.domain] = (domainCounts[patent.domain] || 0) + 1;
  });
  const uniqueDomains = Object.keys(domainCounts).length;
  const domainComplexity = uniqueDomains <= 2 ? 'low' : uniqueDomains <= 4 ? 'medium' : 'high';
  
  console.log(`  📈 데이터 크기: ${size}`);
  console.log(`  🔢 차원성: ${dimensionality}`);
  console.log(`  📝 밀도: ${density.toFixed(2)}`);
  console.log(`  🗑️ 노이즈 레벨: ${noiseLevel.toFixed(3)}`);
  console.log(`  🌐 도메인 복잡도: ${domainComplexity} (${uniqueDomains}개 도메인)`);
  
  return {
    size,
    dimensionality,
    density,
    noiseLevel,
    domainComplexity,
    uniqueDomains
  };
}

// 알고리즘 선택 테스트
function testAlgorithmSelection(characteristics) {
  console.log('\n🎯 알고리즘 선택 테스트...');
  
  // K-means 점수 계산
  let kmeansScore = 0;
  if (characteristics.size < 1000) kmeansScore += 0.3;
  else if (characteristics.size < 10000) kmeansScore += 0.2;
  else kmeansScore += 0.1;
  
  if (characteristics.dimensionality < 100) kmeansScore += 0.2;
  else if (characteristics.dimensionality < 500) kmeansScore += 0.1;
  
  if (characteristics.noiseLevel < 0.3) kmeansScore += 0.3;
  else if (characteristics.noiseLevel < 0.6) kmeansScore += 0.2;
  else kmeansScore += 0.1;
  
  // DBSCAN 점수 계산
  let dbscanScore = 0;
  if (characteristics.noiseLevel > 0.3) dbscanScore += 0.3;
  else if (characteristics.noiseLevel > 0.1) dbscanScore += 0.2;
  
  if (characteristics.density > 0.5) dbscanScore += 0.2;
  
  if (characteristics.size < 5000) dbscanScore += 0.2;
  
  // 계층적 클러스터링 점수 계산
  let hierarchicalScore = 0;
  if (characteristics.size < 500) hierarchicalScore += 0.4;
  else if (characteristics.size < 2000) hierarchicalScore += 0.2;
  
  if (characteristics.domainComplexity === 'high') hierarchicalScore += 0.3;
  
  if (characteristics.dimensionality < 200) hierarchicalScore += 0.1;
  
  // GMM 점수 계산
  let gmmScore = 0;
  if (characteristics.domainComplexity === 'high') gmmScore += 0.3;
  
  if (characteristics.size < 3000) gmmScore += 0.2;
  
  if (characteristics.dimensionality < 300) gmmScore += 0.2;
  
  // 하이브리드 점수 계산
  let hybridScore = 0;
  if (characteristics.domainComplexity === 'high') hybridScore += 0.3;
  if (characteristics.size > 5000) hybridScore += 0.2;
  if (characteristics.dimensionality > 500) hybridScore += 0.1;
  
  const scores = {
    kmeans: Math.min(kmeansScore, 1.0),
    dbscan: Math.min(dbscanScore, 1.0),
    hierarchical: Math.min(hierarchicalScore, 1.0),
    gmm: Math.min(gmmScore, 1.0),
    hybrid: Math.min(hybridScore, 1.0)
  };
  
  console.log('  📊 알고리즘별 적합성 점수:');
  Object.entries(scores).forEach(([algorithm, score]) => {
    const stars = '⭐'.repeat(Math.floor(score * 5));
    console.log(`    ${algorithm.padEnd(12)}: ${score.toFixed(3)} ${stars}`);
  });
  
  // 최적 알고리즘 선택
  const bestAlgorithm = Object.entries(scores).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  console.log(`\n  🏆 추천 알고리즘: ${bestAlgorithm.toUpperCase()}`);
  
  return { scores, bestAlgorithm };
}

// 파라미터 최적화 테스트
function testParameterOptimization(characteristics, algorithm) {
  console.log(`\n⚙️ ${algorithm.toUpperCase()} 파라미터 최적화 테스트...`);
  
  let params = {};
  
  switch (algorithm) {
    case 'kmeans':
      const k = Math.max(3, Math.floor(characteristics.size / 100));
      params = {
        k: k,
        initialization: 'kmeans++',
        maxIterations: Math.min(200, characteristics.size / 10),
        convergenceThreshold: 0.0001
      };
      break;
      
    case 'dbscan':
      params = {
        eps: 0.1 + (characteristics.noiseLevel * 0.3),
        minPts: Math.max(3, Math.floor(characteristics.size * 0.01)),
        distanceMetric: 'korean'
      };
      break;
      
    case 'hierarchical':
      const targetK = Math.max(3, Math.floor(characteristics.size / 100));
      params = {
        method: 'ward',
        distance: 'korean',
        linkage: 'average',
        maxClusters: targetK
      };
      break;
      
    case 'gmm':
      const components = Math.max(3, Math.floor(characteristics.size / 100));
      params = {
        nComponents: components,
        covarianceType: 'full',
        maxIterations: 100,
        tolerance: 1e-4,
        initMethod: 'kmeans++'
      };
      break;
      
    case 'hybrid':
      params = {
        primaryAlgorithm: 'kmeans',
        secondaryAlgorithm: 'dbscan',
        fusionMethod: 'adaptive',
        confidenceThreshold: 0.6,
        ensembleSize: 5
      };
      break;
  }
  
  console.log('  🔧 최적화된 파라미터:');
  Object.entries(params).forEach(([key, value]) => {
    console.log(`    ${key.padEnd(20)}: ${value}`);
  });
  
  return params;
}

// 성능 예측 테스트
function testPerformancePrediction(characteristics, algorithm, params) {
  console.log(`\n📈 ${algorithm.toUpperCase()} 성능 예측 테스트...`);
  
  // 기본 성능 지표
  const basePerformance = {
    kmeans: { accuracy: 0.8, speed: 0.9, scalability: 0.8, interpretability: 0.7 },
    dbscan: { accuracy: 0.7, speed: 0.6, scalability: 0.5, interpretability: 0.6 },
    hierarchical: { accuracy: 0.8, speed: 0.4, scalability: 0.3, interpretability: 0.9 },
    gmm: { accuracy: 0.8, speed: 0.5, scalability: 0.4, interpretability: 0.6 },
    hybrid: { accuracy: 0.9, speed: 0.6, scalability: 0.7, interpretability: 0.7 }
  };
  
  const base = basePerformance[algorithm] || basePerformance.kmeans;
  
  // 데이터 특성에 따른 조정
  const sizeAdjustment = characteristics.size < 1000 ? 0.1 : characteristics.size < 10000 ? 0 : -0.1;
  const dimensionAdjustment = characteristics.dimensionality < 100 ? 0.1 : characteristics.dimensionality < 500 ? 0 : -0.1;
  const noiseAdjustment = -characteristics.noiseLevel * 0.3;
  
  const predictedPerformance = {
    accuracy: Math.min(1.0, base.accuracy * (1 + sizeAdjustment + dimensionAdjustment + noiseAdjustment)),
    speed: Math.max(0.1, base.speed * (1 + sizeAdjustment + dimensionAdjustment)),
    scalability: Math.max(0.1, base.scalability * (1 + sizeAdjustment + dimensionAdjustment)),
    interpretability: Math.min(1.0, base.interpretability * (1 + sizeAdjustment))
  };
  
  console.log('  🎯 예측 성능:');
  Object.entries(predictedPerformance).forEach(([metric, value]) => {
    const stars = '⭐'.repeat(Math.floor(value * 5));
    console.log(`    ${metric.padEnd(15)}: ${value.toFixed(3)} ${stars}`);
  });
  
  // 처리 시간 예측
  const baseTime = { kmeans: 100, dbscan: 200, hierarchical: 500, gmm: 300, hybrid: 400 }[algorithm] || 100;
  const sizeFactor = Math.pow(characteristics.size / 1000, 1.5);
  const dimensionFactor = Math.pow(characteristics.dimensionality / 100, 1.2);
  const estimatedTime = baseTime * sizeFactor * dimensionFactor;
  
  console.log(`\n  ⏱️ 예상 처리 시간: ${estimatedTime.toFixed(0)}ms`);
  
  return { predictedPerformance, estimatedTime };
}

// 메인 테스트 실행
function runAdaptiveClusteringTest() {
  console.log('🎯 적응형 클러스터링 시스템 종합 테스트\n');
  
  // 1. 테스트 데이터 생성
  console.log('1️⃣ 테스트 특허 데이터 생성...');
  const patents = createTestPatents(100);
  console.log(`   ✅ ${patents.length}개의 테스트 특허 생성 완료\n`);
  
  // 2. 데이터 특성 분석
  console.log('2️⃣ 데이터 특성 분석...');
  const characteristics = testDataAnalysis(patents);
  console.log('   ✅ 데이터 특성 분석 완료\n');
  
  // 3. 알고리즘 선택
  console.log('3️⃣ 최적 알고리즘 선택...');
  const { scores, bestAlgorithm } = testAlgorithmSelection(characteristics);
  console.log('   ✅ 알고리즘 선택 완료\n');
  
  // 4. 파라미터 최적화
  console.log('4️⃣ 파라미터 최적화...');
  const params = testParameterOptimization(characteristics, bestAlgorithm);
  console.log('   ✅ 파라미터 최적화 완료\n');
  
  // 5. 성능 예측
  console.log('5️⃣ 성능 예측...');
  const { predictedPerformance, estimatedTime } = testPerformancePrediction(characteristics, bestAlgorithm, params);
  console.log('   ✅ 성능 예측 완료\n');
  
  // 6. 결과 요약
  console.log('🎉 적응형 클러스터링 시스템 테스트 완료!\n');
  console.log('📋 최종 결과 요약:');
  console.log(`   🎯 선택된 알고리즘: ${bestAlgorithm.toUpperCase()}`);
  console.log(`   ⏱️ 예상 처리 시간: ${estimatedTime.toFixed(0)}ms`);
  console.log(`   🎯 예상 정확도: ${(predictedPerformance.accuracy * 100).toFixed(1)}%`);
  console.log(`   🚀 예상 속도: ${(predictedPerformance.speed * 100).toFixed(1)}%`);
  console.log(`   📊 예상 확장성: ${(predictedPerformance.scalability * 100).toFixed(1)}%`);
  console.log(`   🔍 예상 해석가능성: ${(predictedPerformance.interpretability * 100).toFixed(1)}%`);
  
  // 7. 데이터 특성별 권장사항
  console.log('\n💡 데이터 특성별 권장사항:');
  if (characteristics.size > 5000) {
    console.log('   📊 대용량 데이터: 배치 처리 및 하이브리드 알고리즘 권장');
  }
  if (characteristics.dimensionality > 500) {
    console.log('   🔢 고차원 데이터: 차원 축소 및 특성 선택 권장');
  }
  if (characteristics.noiseLevel > 0.5) {
    console.log('   🗑️ 높은 노이즈: DBSCAN 또는 노이즈 필터링 권장');
  }
  if (characteristics.domainComplexity === 'high') {
    console.log('   🌐 복잡한 도메인: 계층적 클러스터링 또는 하이브리드 권장');
  }
}

// 테스트 실행
try {
  runAdaptiveClusteringTest();
} catch (error) {
  console.error('❌ 테스트 실행 중 오류 발생:', error);
}

