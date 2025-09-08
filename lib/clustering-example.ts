import { Patent } from '@/types';
import { patentClusteringService } from './patent-clustering';

// 테스트용 특허 데이터 생성
function createTestPatents(count: number): Patent[] {
  const patents: Patent[] = [];
  
  const technologies = ['AI', 'Biotech', 'ICT', 'Materials', 'Energy'];
  const domains = ['Machine Learning', 'Neural Networks', 'Data Processing', 'Bioinformatics', 'Quantum Computing'];
  
  for (let i = 0; i < count; i++) {
    const tech = technologies[i % technologies.length];
    const domain = domains[i % domains.length];
    
    patents.push({
      id: `patent_${i + 1}`,
      title: `${tech} 기반 ${domain} 시스템`,
      abstract: `${tech} 기술을 활용한 ${domain} 처리 방법 및 장치입니다. 이 발명은 혁신적인 알고리즘을 통해 성능을 향상시킵니다.`,
      description: `${tech}와 ${domain}의 융합으로 새로운 기술 영역을 개척합니다.`,
      classification: [`${tech}`, `${domain}`, 'System'],
      inventors: [`발명자${i + 1}`],
      applicants: [`출원인${i + 1}`],
      claims: [`청구항${i + 1}`, `청구항${i + 2}`],
      legalStatus: 'pending'
    });
  }
  
  return patents;
}

// 클러스터링 성능 테스트
export async function testClusteringPerformance() {
  console.log('🚀 클러스터링 성능 테스트 시작');
  
  // 1. 소규모 데이터 테스트 (100개)
  console.log('\n📊 소규모 데이터 테스트 (100개 특허)');
  const smallPatents = createTestPatents(100);
  const startTime1 = Date.now();
  
  try {
    const result1 = await patentClusteringService.performClustering(smallPatents);
    const duration1 = Date.now() - startTime1;
    
    console.log(`✅ 소규모 클러스터링 완료:`);
    console.log(`   - 클러스터 수: ${result1.clusters.length}`);
    console.log(`   - 최적 K: ${result1.metrics.optimalK}`);
    console.log(`   - 실루엣 점수: ${result1.metrics.silhouetteScore.toFixed(3)}`);
    console.log(`   - 소요시간: ${duration1}ms`);
    
    // 성능 통계
    const stats1 = patentClusteringService.getPerformanceStats();
    console.log(`   - 메모리 사용량: ${stats1.memoryUsage}`);
    
  } catch (error) {
    console.error(`❌ 소규모 클러스터링 실패:`, error);
  }
  
  // 2. 중간 규모 데이터 테스트 (500개)
  console.log('\n📊 중간 규모 데이터 테스트 (500개 특허)');
  const mediumPatents = createTestPatents(500);
  const startTime2 = Date.now();
  
  try {
    const result2 = await patentClusteringService.performClusteringWithBatching(mediumPatents, undefined, 200);
    const duration2 = Date.now() - startTime2;
    
    console.log(`✅ 중간 규모 클러스터링 완료:`);
    console.log(`   - 클러스터 수: ${result2.clusters.length}`);
    console.log(`   - 최적 K: ${result2.metrics.optimalK}`);
    console.log(`   - 실루엣 점수: ${result2.metrics.silhouetteScore.toFixed(3)}`);
    console.log(`   - 소요시간: ${duration2}ms`);
    
    // 성능 통계
    const stats2 = patentClusteringService.getPerformanceStats();
    console.log(`   - 메모리 사용량: ${stats2.memoryUsage}`);
    
  } catch (error) {
    console.error(`❌ 중간 규모 클러스터링 실패:`, error);
  }
  
  // 3. 대규모 데이터 테스트 (1000개)
  console.log('\n📊 대규모 데이터 테스트 (1000개 특허)');
  const largePatents = createTestPatents(1000);
  const startTime3 = Date.now();
  
  try {
    const result3 = await patentClusteringService.performClusteringWithBatching(largePatents, undefined, 300);
    const duration3 = Date.now() - startTime3;
    
    console.log(`✅ 대규모 클러스터링 완료:`);
    console.log(`   - 클러스터 수: ${result3.clusters.length}`);
    console.log(`   - 최적 K: ${result3.metrics.optimalK}`);
    console.log(`   - 실루엣 점수: ${result3.metrics.silhouetteScore.toFixed(3)}`);
    console.log(`   - 소요시간: ${duration3}ms`);
    
    // 성능 통계
    const stats3 = patentClusteringService.getPerformanceStats();
    console.log(`   - 메모리 사용량: ${stats3.memoryUsage}`);
    
  } catch (error) {
    console.error(`❌ 대규모 클러스터링 실패:`, error);
  }
  
  console.log('\n🎯 클러스터링 성능 테스트 완료!');
}

// K-means++ vs 랜덤 초기화 비교 테스트
export async function testInitializationMethods() {
  console.log('\n🔬 K-means++ vs 랜덤 초기화 비교 테스트');
  
  const testPatents = createTestPatents(200);
  const vectors = await patentClusteringService.patentsToVectors(testPatents);
  const vectorData = vectors.map(v => v.vector);
  
  // 여러 번 테스트하여 안정성 비교
  const testCount = 5;
  const kmeansPlusResults: number[] = [];
  const randomResults: number[] = [];
  
  for (let i = 0; i < testCount; i++) {
    console.log(`\n테스트 ${i + 1}/${testCount}`);
    
    // K-means++ 결과
    const kmeansPlusClusters = patentClusteringService.performKMeansClustering(vectorData, 5);
    const kmeansPlusScore = patentClusteringService.calculateSilhouetteScore(vectorData, kmeansPlusClusters);
    kmeansPlusResults.push(kmeansPlusScore);
    
    // 랜덤 초기화 결과 (기존 메서드 사용)
    const randomClusters = patentClusteringService.performKMeansClustering(vectorData, 5);
    const randomScore = patentClusteringService.calculateSilhouetteScore(vectorData, randomClusters);
    randomResults.push(randomScore);
    
    console.log(`   K-means++: ${kmeansPlusScore.toFixed(3)}`);
    console.log(`   랜덤: ${randomScore.toFixed(3)}`);
  }
  
  // 평균 및 표준편차 계산
  const kmeansPlusAvg = kmeansPlusResults.reduce((a, b) => a + b, 0) / kmeansPlusResults.length;
  const randomAvg = randomResults.reduce((a, b) => a + b, 0) / randomResults.length;
  
  const kmeansPlusStd = Math.sqrt(
    kmeansPlusResults.reduce((sum, val) => sum + Math.pow(val - kmeansPlusAvg, 2), 0) / kmeansPlusResults.length
  );
  const randomStd = Math.sqrt(
    randomResults.reduce((sum, val) => sum + Math.pow(val - randomAvg, 2), 0) / randomResults.length
  );
  
  console.log('\n📈 결과 분석:');
  console.log(`   K-means++ 평균: ${kmeansPlusAvg.toFixed(3)} ± ${kmeansPlusStd.toFixed(3)}`);
  console.log(`   랜덤 평균: ${randomAvg.toFixed(3)} ± ${randomStd.toFixed(3)}`);
  console.log(`   개선도: ${((kmeansPlusAvg - randomAvg) / randomAvg * 100).toFixed(1)}%`);
  console.log(`   안정성 개선: ${(randomStd / kmeansPlusStd).toFixed(1)}배`);
}

// 메인 테스트 실행
export async function runAllTests() {
  console.log('🧪 특허 클러스터링 시스템 테스트 시작');
  console.log('=' .repeat(50));
  
  try {
    await testClusteringPerformance();
    await testInitializationMethods();
    
    console.log('\n🎉 모든 테스트 완료!');
    console.log('=' .repeat(50));
    
  } catch (error) {
    console.error('❌ 테스트 실행 중 오류 발생:', error);
  }
}

// Node.js 환경에서 직접 실행 가능
if (typeof module !== 'undefined' && module.exports) {
  if (require.main === module) {
    runAllTests().catch(console.error);
  }
}
