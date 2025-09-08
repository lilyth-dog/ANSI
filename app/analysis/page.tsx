'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  Search, 
  Brain, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Shield,
  Users,
  BarChart3,
  Sparkles,
  ArrowRight,
  Download,
  RefreshCw
} from 'lucide-react';
import { Patent, PatentAnalysis, RiskAssessment } from '@/types';
import { aiAnalysisService } from '@/lib/ai-analysis';
import { storageService } from '@/lib/storage';
import { toast } from 'sonner';

export default function AnalysisPage() {
  const [selectedPatent, setSelectedPatent] = useState<Patent | null>(null);
  const [analysisResult, setAnalysisResult] = useState<PatentAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisHistory, setAnalysisHistory] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Patent[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // 컴포넌트 마운트 시 분석 히스토리 로드
  useEffect(() => {
    loadAnalysisHistory();
  }, []);

  const loadAnalysisHistory = async () => {
    try {
      await storageService.init();
      const history = await storageService.getAllPatentAnalysis();
      setAnalysisHistory(history);
    } catch (error) {
      console.error('분석 히스토리 로드 오류:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // 실제 구현에서는 KIPRIS API 호출
    setTimeout(() => {
      const mockResults: Patent[] = [
        {
          id: 'KR1020240012345',
          title: 'AI 기반 감정 분석 시스템 및 방법',
          abstract: '본 발명은 음성 데이터를 분석하여 사용자의 감정 상태를 실시간으로 파악하는 AI 기반 감정 분석 시스템에 관한 것이다.',
          inventors: ['김철수', '이영희'],
          applicants: ['테크스타트업 주식회사'],
          applicationDate: '2024-01-15',
          publicationDate: '2024-03-20',
          status: 'published' as any,
          classification: ['G06N 3/08', 'G10L 25/63'],
          claims: ['청구항 1: 음성 데이터를 수신하는 단계...'],
          description: '상세한 기술 설명...',
          drawings: ['도면1', '도면2'],
          legalStatus: 'active',
          citations: ['KR1020230056789'],
          familyPatents: ['US20240012345']
        },
        {
          id: 'KR1020240012346',
          title: '블록체인 기반 특허 관리 시스템',
          abstract: '특허 정보를 블록체인에 저장하여 위변조를 방지하고 투명성을 확보하는 시스템이다.',
          inventors: ['박민수'],
          applicants: ['블록체인테크 주식회사'],
          applicationDate: '2024-01-20',
          publicationDate: '2024-03-25',
          status: 'pending' as any,
          classification: ['G06Q 50/18', 'H04L 9/32'],
          claims: ['청구항 1: 블록체인 노드를 구성하는 단계...'],
          description: '상세한 기술 설명...',
          drawings: ['도면1'],
          legalStatus: 'active',
          citations: [],
          familyPatents: []
        }
      ];
      
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1000);
  };

  const handleAnalyze = async (patent: Patent) => {
    setIsAnalyzing(true);
    setSelectedPatent(patent);
    
    try {
      // AI 분석 서비스 호출
      const analysis = await aiAnalysisService.analyzePatent(patent);
      setAnalysisResult(analysis);
      
      // 분석 결과 저장
      await storageService.savePatentAnalysis(analysis);
      await loadAnalysisHistory();
      
      toast.success('AI 분석이 완료되었습니다!');
    } catch (error) {
      console.error('AI 분석 오류:', error);
      toast.error('AI 분석 중 오류가 발생했습니다.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return '우수';
    if (score >= 6) return '보통';
    return '개선 필요';
  };

  const getRiskLevel = (risk: number) => {
    if (risk <= 3) return { level: '낮음', color: 'text-green-600', bg: 'bg-green-100' };
    if (risk <= 6) return { level: '보통', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { level: '높음', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const exportAnalysis = () => {
    if (!analysisResult || !selectedPatent) return;
    
    const data = {
      patent: selectedPatent,
      analysis: analysisResult,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patent-analysis-${selectedPatent.id}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-patent">
      <div className="container-patent py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Brain className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">AI 기반 특허 분석</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            특허 분석
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AI 기술을 활용하여 특허의 신규성, 진보성, 산업상 이용가능성을 종합적으로 분석합니다
          </p>
        </div>

        {/* 검색 섹션 */}
        <Card className="card-patent-hover mb-8 animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              특허 검색
            </CardTitle>
            <CardDescription>분석할 특허를 검색하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Input
                placeholder="특허명, 발명자, 출원인 등으로 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={isSearching} className="btn-primary">
                {isSearching ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    검색 중...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    검색
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 검색 결과 */}
        {searchResults.length > 0 && (
          <Card className="card-patent mb-8 animate-fade-in">
            <CardHeader>
              <CardTitle>검색 결과 ({searchResults.length}건)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {searchResults.map((patent) => (
                  <div key={patent.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{patent.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{patent.abstract}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>발명자: {patent.inventors.join(', ')}</span>
                          <span>출원인: {patent.applicants.join(', ')}</span>
                          <span>출원일: {patent.applicationDate}</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleAnalyze(patent)}
                        disabled={isAnalyzing}
                        className="btn-primary ml-4"
                      >
                        {isAnalyzing && selectedPatent?.id === patent.id ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            분석 중...
                          </>
                        ) : (
                          <>
                            <Brain className="mr-2 h-4 w-4" />
                            AI 분석
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 분석 결과 */}
        {analysisResult && selectedPatent && (
          <div className="space-y-8 animate-fade-in">
            {/* 분석 개요 */}
            <Card className="card-patent-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  분석 결과
                </CardTitle>
                <CardDescription>특허: {selectedPatent.title}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Target className="h-8 w-8 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">신규성</h4>
                    <div className={`text-3xl font-bold mb-2 ${getScoreColor(analysisResult.novelty)}`}>
                      {analysisResult.novelty}/10
                    </div>
                    <Badge className={getScoreColor(analysisResult.novelty)}>
                      {getScoreLabel(analysisResult.novelty)}
                    </Badge>
                    <Progress value={analysisResult.novelty * 10} className="mt-2" />
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">진보성</h4>
                    <div className={`text-3xl font-bold mb-2 ${getScoreColor(analysisResult.inventiveness)}`}>
                      {analysisResult.inventiveness}/10
                    </div>
                    <Badge className={getScoreColor(analysisResult.inventiveness)}>
                      {getScoreLabel(analysisResult.inventiveness)}
                    </Badge>
                    <Progress value={analysisResult.inventiveness * 10} className="mt-2" />
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <BarChart3 className="h-8 w-8 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">산업상 이용가능성</h4>
                    <div className={`text-3xl font-bold mb-2 ${getScoreColor(analysisResult.industrialApplicability)}`}>
                      {analysisResult.industrialApplicability}/10
                    </div>
                    <Badge className={getScoreColor(analysisResult.industrialApplicability)}>
                      {getScoreLabel(analysisResult.industrialApplicability)}
                    </Badge>
                    <Progress value={analysisResult.industrialApplicability * 10} className="mt-2" />
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Users className="h-8 w-8 text-orange-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">시장 잠재력</h4>
                    <div className={`text-3xl font-bold mb-2 ${getScoreColor(analysisResult.marketPotential)}`}>
                      {analysisResult.marketPotential}/10
                    </div>
                    <Badge className={getScoreColor(analysisResult.marketPotential)}>
                      {getScoreLabel(analysisResult.marketPotential)}
                    </Badge>
                    <Progress value={analysisResult.marketPotential * 10} className="mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 위험도 평가 */}
            <Card className="card-patent-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  위험도 평가
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-900 mb-3">침해 위험도</h4>
                    <div className={`text-2xl font-bold mb-2 ${getRiskLevel(analysisResult.riskAssessment.infringementRisk).color}`}>
                      {analysisResult.riskAssessment.infringementRisk}/10
                    </div>
                    <Badge className={`${getRiskLevel(analysisResult.riskAssessment.infringementRisk).bg} ${getRiskLevel(analysisResult.riskAssessment.infringementRisk).color}`}>
                      {getRiskLevel(analysisResult.riskAssessment.infringementRisk).level}
                    </Badge>
                  </div>

                  <div className="text-center">
                    <h4 className="font-semibold text-gray-900 mb-3">유효성 위험도</h4>
                    <div className={`text-2xl font-bold mb-2 ${getRiskLevel(analysisResult.riskAssessment.validityRisk).color}`}>
                      {analysisResult.riskAssessment.validityRisk}/10
                    </div>
                    <Badge className={`${getRiskLevel(analysisResult.riskAssessment.validityRisk).bg} ${getRiskLevel(analysisResult.riskAssessment.validityRisk).color}`}>
                      {getRiskLevel(analysisResult.riskAssessment.validityRisk).level}
                    </Badge>
                  </div>

                  <div className="text-center">
                    <h4 className="font-semibold text-gray-900 mb-3">집행 위험도</h4>
                    <div className={`text-2xl font-bold mb-2 ${getRiskLevel(analysisResult.riskAssessment.enforcementRisk).color}`}>
                      {analysisResult.riskAssessment.enforcementRisk}/10
                    </div>
                    <Badge className={`${getRiskLevel(analysisResult.riskAssessment.enforcementRisk).bg} ${getRiskLevel(analysisResult.riskAssessment.enforcementRisk).color}`}>
                      {getRiskLevel(analysisResult.riskAssessment.enforcementRisk).level}
                    </Badge>
                  </div>

                  <div className="text-center">
                    <h4 className="font-semibold text-gray-900 mb-3">종합 위험도</h4>
                    <div className={`text-2xl font-bold mb-2 ${getRiskLevel(analysisResult.riskAssessment.overallRisk).color}`}>
                      {analysisResult.riskAssessment.overallRisk}/10
                    </div>
                    <Badge className={`${getRiskLevel(analysisResult.riskAssessment.overallRisk).bg} ${getRiskLevel(analysisResult.riskAssessment.overallRisk).color}`}>
                      {getRiskLevel(analysisResult.riskAssessment.overallRisk).level}
                    </Badge>
                  </div>
                </div>

                {analysisResult.riskAssessment.riskFactors.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">주요 위험 요소</h4>
                    <div className="space-y-2">
                      {analysisResult.riskAssessment.riskFactors.map((factor, index) => (
                        <Alert key={index}>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>{factor}</AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 권장사항 */}
            <Card className="card-patent-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  권장사항
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisResult.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 경쟁 환경 분석 */}
            <Card className="card-patent-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  경쟁 환경 분석
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">직접 경쟁사</h4>
                    <div className="space-y-2">
                      {analysisResult.competitiveLandscape.directCompetitors.length > 0 ? (
                        analysisResult.competitiveLandscape.directCompetitors.map((competitor, index) => (
                          <Badge key={index} variant="secondary" className="mr-2 mb-2">
                            {competitor}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-gray-500">직접 경쟁사가 없습니다.</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">간접 경쟁사</h4>
                    <div className="space-y-2">
                      {analysisResult.competitiveLandscape.indirectCompetitors.length > 0 ? (
                        analysisResult.competitiveLandscape.indirectCompetitors.map((competitor, index) => (
                          <Badge key={index} variant="outline" className="mr-2 mb-2">
                            {competitor}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-gray-500">간접 경쟁사가 없습니다.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3">시장 포지션</h4>
                  <p className="text-gray-700">{analysisResult.competitiveLandscape.marketPosition}</p>
                </div>

                {analysisResult.competitiveLandscape.differentiationOpportunities.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">차별화 기회</h4>
                    <div className="space-y-2">
                      {analysisResult.competitiveLandscape.differentiationOpportunities.map((opportunity, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                          <Sparkles className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700">{opportunity}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 액션 버튼 */}
            <div className="flex gap-4 justify-center">
              <Button onClick={exportAnalysis} className="btn-primary">
                <Download className="mr-2 h-4 w-4" />
                분석 결과 내보내기
              </Button>
              <Button variant="outline" onClick={() => setAnalysisResult(null)} className="btn-outline">
                <ArrowRight className="mr-2 h-4 w-4" />
                새 분석 시작
              </Button>
            </div>
          </div>
        )}

        {/* 분석 히스토리 */}
        {analysisHistory.length > 0 && (
          <Card className="card-patent mt-12 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                분석 히스토리
              </CardTitle>
              <CardDescription>이전에 수행한 AI 분석 결과들</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisHistory.slice(0, 5).map((history) => (
                  <div key={history.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">특허 ID: {history.patentId}</h4>
                      <Badge variant="secondary">
                        {new Date(history.timestamp).toLocaleDateString()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">신규성:</span>
                        <span className="ml-2 font-medium">{history.novelty}/10</span>
                      </div>
                      <div>
                        <span className="text-gray-600">진보성:</span>
                        <span className="ml-2 font-medium">{history.inventiveness}/10</span>
                      </div>
                      <div>
                        <span className="text-gray-600">이용가능성:</span>
                        <span className="ml-2 font-medium">{history.industrialApplicability}/10</span>
                      </div>
                      <div>
                        <span className="text-gray-600">시장 잠재력:</span>
                        <span className="ml-2 font-medium">{history.marketPotential}/10</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 분석 안내 */}
        {!analysisResult && searchResults.length === 0 && (
          <Card className="text-center py-16 animate-fade-in">
            <CardContent>
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI 특허 분석을 시작하세요</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                위의 검색 폼을 사용하여 특허를 검색하고, AI 기반 종합 분석을 수행해보세요.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
