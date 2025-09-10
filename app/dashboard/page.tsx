'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  TrendingUp, 
  Shield, 
  Users, 
  FileText, 
  BarChart3, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Database,
  Download,
  Sparkles,
  ArrowRight,
  Zap,
  Globe,
  Award
} from 'lucide-react';
import Link from 'next/link';
import { storageService } from '@/lib/storage';
import { SearchHistory, PatentAnalysis } from '@/types';

export default function DashboardPage() {
  const [recentSearches, setRecentSearches] = useState<SearchHistory[]>([]);
  const [recentAnalysis, setRecentAnalysis] = useState<any[]>([]);
  const [quickStats, setQuickStats] = useState({
    totalSearches: 0,
    totalAnalysis: 0,
    pendingAnalysis: 0,
    completedReports: 0
  });
  const [databaseInfo, setDatabaseInfo] = useState<any>(null);

  // 컴포넌트 마운트 시 로컬 스토리지에서 데이터 로드
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      await storageService.init();
      
      // 검색 히스토리 및 분석 결과 로드
      const [searches, analysis, reports, dbInfo] = await Promise.all([
        storageService.getSearchHistory(10),
        storageService.getPatentAnalysis(''), // 모든 분석 결과 조회
        storageService.getConsultingReports(10),
        storageService.getDatabaseInfo()
      ]);

      setRecentSearches(searches);
      setRecentAnalysis(analysis);
      setDatabaseInfo(dbInfo);

      // 통계 계산
      setQuickStats({
        totalSearches: searches.length,
        totalAnalysis: analysis.length,
        pendingAnalysis: 0, // 현재는 모든 분석이 완료된 것으로 가정
        completedReports: reports.length
      });

    } catch (error) {
      console.error('대시보드 데이터 로드 오류:', error);
    }
  };

  const exportAllData = async () => {
    try {
      const data = await storageService.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `patent-ai-data-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('데이터 내보내기 오류:', error);
    }
  };

  const clearAllData = async () => {
    if (confirm('모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      try {
        await storageService.clearAllData();
        await loadDashboardData(); // 데이터 새로고침
        alert('모든 데이터가 삭제되었습니다.');
      } catch (error) {
        console.error('데이터 삭제 오류:', error);
        alert('데이터 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="badge-status granted"><CheckCircle className="h-3 w-3 mr-1" />완료</Badge>;
      case 'in_progress':
        return <Badge className="badge-status pending"><Clock className="h-3 w-3 mr-1" />진행중</Badge>;
      case 'pending':
        return <Badge className="badge-status pending"><AlertTriangle className="h-3 w-3 mr-1" />대기</Badge>;
      default:
        return <Badge variant="secondary">알 수 없음</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-patent">
      <div className="container-patent py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">AI 기반 특허 컨설팅</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            대시보드
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            나의 특허 분석 활동과 개인화된 인사이트를 확인하세요
          </p>
        </div>

        {/* 개인 데이터 현황 */}
        {databaseInfo && (
          <Card className="card-patent-hover mb-8 animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                나의 데이터 현황
              </CardTitle>
              <CardDescription>개인적으로 저장된 검색 기록과 분석 결과</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Search className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{databaseInfo.storeCounts.searchHistory || 0}</p>
                  <p className="text-sm text-gray-600">검색 기록</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-green-600">{databaseInfo.storeCounts.patentAnalysis || 0}</p>
                  <p className="text-sm text-gray-600">분석 결과</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <FileText className="h-8 w-8 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-purple-600">{databaseInfo.storeCounts.consultingReports || 0}</p>
                  <p className="text-sm text-gray-600">컨설팅 리포트</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Target className="h-8 w-8 text-orange-600" />
                  </div>
                  <p className="text-2xl font-bold text-orange-600">{databaseInfo.storeCounts.favoritePatents || 0}</p>
                  <p className="text-sm text-gray-600">즐겨찾기</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Users className="h-8 w-8 text-gray-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-600">{databaseInfo.storeCounts.userSettings || 0}</p>
                  <p className="text-sm text-gray-600">사용자 설정</p>
                </div>
              </div>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" size="sm" onClick={exportAllData} className="btn-outline">
                  <Download className="h-4 w-4 mr-2" />
                  전체 데이터 내보내기
                </Button>
                <Button variant="outline" size="sm" onClick={clearAllData} className="btn-outline text-destructive hover:text-destructive hover:bg-destructive/10">
                  모든 데이터 삭제
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid-patent-4 mb-12">
          <Card className="card-patent-hover text-center p-6 animate-slide-up" style={{ animationDelay: '0ms' }}>
            <CardContent className="p-0">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{quickStats.totalSearches.toLocaleString()}</p>
              <p className="text-gray-600">총 검색 수</p>
            </CardContent>
          </Card>

          <Card className="card-patent-hover text-center p-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <CardContent className="p-0">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{quickStats.totalAnalysis}</p>
              <p className="text-gray-600">총 분석 수</p>
            </CardContent>
          </Card>

          <Card className="card-patent-hover text-center p-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <CardContent className="p-0">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-warning/20 rounded-2xl flex items-center justify-center">
                  <Clock className="h-8 w-8 text-warning" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{quickStats.pendingAnalysis}</p>
              <p className="text-gray-600">대기 중인 분석</p>
            </CardContent>
          </Card>

          <Card className="card-patent-hover text-center p-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <CardContent className="p-0">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <FileText className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{quickStats.completedReports}</p>
              <p className="text-gray-600">완료된 리포트</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid-patent-3 mb-12">
          <Card className="card-patent-hover cursor-pointer group animate-scale-in" style={{ animationDelay: '0ms' }}>
            <Link href="/patents/search">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Search className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">특허 검색</h3>
                <p className="text-gray-600 mb-4">KIPRIS API를 활용한 특허 정보 검색</p>
                <div className="flex items-center justify-center text-primary font-medium">
                  시작하기 <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="card-patent-hover cursor-pointer group animate-scale-in" style={{ animationDelay: '150ms' }}>
            <Link href="/analysis/new">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">AI 분석</h3>
                <p className="text-gray-600 mb-4">OpenRouter 기반 특허 분석 및 평가</p>
                <div className="flex items-center justify-center text-primary font-medium">
                  시작하기 <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="card-patent-hover cursor-pointer group animate-scale-in" style={{ animationDelay: '300ms' }}>
            <Link href="/consulting/new">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">컨설팅</h3>
                <p className="text-gray-600 mb-4">스타트업 맞춤형 특허 전략</p>
                <div className="flex items-center justify-center text-primary font-medium">
                  시작하기 <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Searches */}
          <Card className="card-patent animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                최근 검색
              </CardTitle>
              <CardDescription>사용자가 최근에 검색한 특허 키워드</CardDescription>
            </CardHeader>
            <CardContent>
              {recentSearches && recentSearches.length > 0 ? (
                <div className="space-y-4">
                  {recentSearches.map((search) => (
                    <div key={search.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div>
                        <p className="font-medium text-gray-900">{search.query}</p>
                        <p className="text-sm text-gray-500">{new Date(search.timestamp).toLocaleDateString()}</p>
                      </div>
                      <Badge variant="secondary">{search.resultCount}건</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  아직 검색 기록이 없습니다
                </div>
              )}
              <div className="mt-6">
                <Link href="/patents/search">
                  <Button variant="outline" className="w-full btn-outline">전체 검색 기록 보기</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Analysis */}
          <Card className="card-patent animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                최근 분석
              </CardTitle>
              <CardDescription>AI 기반 특허 분석 현황</CardDescription>
            </CardHeader>
            <CardContent>
              {recentAnalysis && recentAnalysis.length > 0 ? (
                <div className="space-y-4">
                  {recentAnalysis.slice(0, 3).map((analysis) => (
                    <div key={analysis.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900 text-clamp-1">특허 ID: {analysis.patentId}</h4>
                        {getStatusBadge('completed')}
                      </div>
                      
                      <div className="space-y-3">
                        <div className="analysis-score">
                          <span className="analysis-score-label">신규성</span>
                          <span className="analysis-score-value">{analysis.novelty}/100</span>
                        </div>
                        <Progress value={analysis.novelty} className="h-2" />
                        
                        <div className="analysis-score">
                          <span className="analysis-score-label">진보성</span>
                          <span className="analysis-score-value">{analysis.inventiveness}/100</span>
                        </div>
                        <Progress value={analysis.inventiveness} className="h-2" />
                        
                        <div className="analysis-score">
                          <span className="analysis-score-label">시장 잠재력</span>
                          <span className="analysis-score-value">{analysis.marketPotential}/100</span>
                        </div>
                        <Progress value={analysis.marketPotential} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  아직 분석 결과가 없습니다
                </div>
              )}
              <div className="mt-6">
                <Link href="/analysis">
                  <Button variant="outline" className="w-full btn-outline">전체 분석 보기</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Market Insights */}
        <Card className="card-patent-hover mt-12 animate-fade-in">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              시장 인사이트
            </CardTitle>
            <CardDescription>AI 분석을 통한 시장 동향 및 기회 요소</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid-patent-3">
              <div className="text-center p-6 bg-blue-50 rounded-2xl">
                <Target className="h-10 w-10 text-blue-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">AI/ML 기술</h4>
                <p className="text-sm text-gray-600 mb-3">높은 성장률과 투자 유치</p>
                <Badge className="bg-blue-100 text-blue-800">+25% 성장</Badge>
              </div>
              
              <div className="text-center p-6 bg-green-50 rounded-2xl">
                <Shield className="h-10 w-10 text-green-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">보안 기술</h4>
                <p className="text-sm text-gray-600 mb-3">지속적인 수요 증가</p>
                <Badge className="bg-green-100 text-green-800">+18% 성장</Badge>
              </div>
              
              <div className="text-center p-6 bg-purple-50 rounded-2xl">
                <TrendingUp className="h-10 w-10 text-purple-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">IoT 플랫폼</h4>
                <p className="text-sm text-gray-600 mb-3">연결성 중심의 혁신</p>
                <Badge className="bg-purple-100 text-purple-800">+22% 성장</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
