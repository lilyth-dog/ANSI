'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  Building, 
  Target, 
  TrendingUp, 
  Shield, 
  FileText, 
  CheckCircle,
  Clock,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Download,
  RefreshCw,
  BarChart3,
  Lightbulb,
  MapPin,
  Calendar,
  Brain
} from 'lucide-react';
import { Startup, ConsultingReport, PatentStrategy, MarketAnalysis, RiskMitigation } from '@/types';
import { storageService } from '@/lib/storage';
import { toast } from 'sonner';

export default function ConsultingPage() {
  const [startupInfo, setStartupInfo] = useState<Partial<Startup>>({
    name: '',
    industry: '',
    description: '',
    foundedDate: '',
    teamSize: 0,
    fundingStage: 'idea' as any,
    businessModel: '',
    targetMarket: '',
    competitors: [],
    patents: []
  });
  
  const [consultingReport, setConsultingReport] = useState<ConsultingReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [consultingHistory, setConsultingHistory] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // 컴포넌트 마운트 시 컨설팅 히스토리 로드
  useEffect(() => {
    loadConsultingHistory();
  }, []);

  const loadConsultingHistory = async () => {
    try {
      await storageService.init();
      const history = await storageService.getConsultingReports(10);
      setConsultingHistory(history);
    } catch (error) {
      console.error('컨설팅 히스토리 로드 오류:', error);
    }
  };

  const validateForm = useCallback(() => {
    const errors: { [key: string]: string } = {};
    
    if (!startupInfo.name?.trim()) errors.name = '회사명을 입력해주세요';
    if (!startupInfo.industry?.trim()) errors.industry = '산업 분야를 선택해주세요';
    if (!startupInfo.description?.trim()) errors.description = '사업 설명을 입력해주세요';
    if (!startupInfo.businessModel?.trim()) errors.businessModel = '비즈니스 모델을 입력해주세요';
    if (!startupInfo.targetMarket?.trim()) errors.targetMarket = '타겟 시장을 입력해주세요';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [startupInfo]);

  const handleInputChange = (field: string, value: any) => {
    setStartupInfo(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleGenerateReport = async () => {
    if (!validateForm()) {
      toast.error('필수 정보를 모두 입력해주세요.');
      return;
    }

    setIsGenerating(true);
    
    try {
      // 실제 구현에서는 AI 서비스를 통해 컨설팅 리포트 생성
      const report = await generateMockConsultingReport();
      setConsultingReport(report);
      
      // 리포트 저장
      await storageService.saveConsultingReport(report);
      await loadConsultingHistory();
      
      toast.success('컨설팅 리포트가 생성되었습니다!');
    } catch (error) {
      console.error('컨설팅 리포트 생성 오류:', error);
      toast.error('컨설팅 리포트 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockConsultingReport = async (): Promise<ConsultingReport> => {
    // 실제 구현에서는 AI 분석 서비스를 통해 리포트 생성
    return new Promise((resolve) => {
      setTimeout(() => {
        const report: ConsultingReport = {
          id: `report_${Date.now()}`,
          startupId: `startup_${Date.now()}`,
          createdAt: new Date().toISOString(),
          executiveSummary: `${startupInfo.name}은 ${startupInfo.industry} 분야의 혁신적인 스타트업으로, ${startupInfo.businessModel} 비즈니스 모델을 통해 ${startupInfo.targetMarket} 시장에 진출하고 있습니다. 특허 전략을 통한 경쟁 우위 확보가 필요합니다.`,
          marketAnalysis: {
            marketSize: 1000000000,
            growthRate: 15.5,
            barriers: ['높은 진입 장벽', '기존 업체와의 경쟁', '규제 환경'],
            opportunities: ['신기술 도입', '새로운 시장 창출', '파트너십 기회'],
            threats: ['경쟁사 진입', '기술 변화', '경제 불안정'],
            competitiveAdvantage: ['혁신적인 기술', '강력한 팀', '시장 이해도']
          },
          patentStrategy: {
            filingStrategy: '핵심 기술 중심의 특허 포트폴리오 구축',
            geographicCoverage: ['한국', '미국', '중국', '유럽'],
            technologyFocus: [startupInfo.industry || '기술 분야'],
            budgetEstimate: 50000000,
            priorityAreas: ['핵심 기술', '사용자 인터페이스', '데이터 처리']
          },
          riskMitigation: {
            risks: [
              {
                type: '특허 침해 위험',
                probability: 0.3,
                impact: 0.8,
                description: '기존 특허와의 충돌 가능성'
              },
              {
                type: '경쟁사 특허 출원',
                probability: 0.6,
                impact: 0.6,
                description: '경쟁사가 유사한 기술로 특허 출원'
              }
            ],
            mitigationStrategies: [
              '특허 조사 강화',
              '차별화된 기술 개발',
              '특허 포트폴리오 구축'
            ],
            contingencyPlans: [
              '라이선싱 협상',
              '기술 우회 개발',
              '특허 무효화 소송'
            ]
          },
          recommendations: [
            {
              category: '특허 전략',
              title: '핵심 기술 특허 출원',
              description: '회사의 핵심 기술에 대한 특허를 우선적으로 출원하여 경쟁 우위를 확보하세요.',
              priority: 'high' as any,
              estimatedCost: 20000000,
              timeline: '3-6개월'
            },
            {
              category: '시장 분석',
              title: '경쟁사 특허 현황 조사',
              description: '주요 경쟁사의 특허 현황을 분석하여 특허 공백을 찾아내세요.',
              priority: 'high' as any,
              estimatedCost: 10000000,
              timeline: '1-2개월'
            },
            {
              category: '리스크 관리',
              title: '특허 침해 위험 평가',
              description: '기존 특허와의 충돌 가능성을 사전에 평가하고 대응 방안을 수립하세요.',
              priority: 'medium' as any,
              estimatedCost: 15000000,
              timeline: '2-3개월'
            }
          ],
          timeline: [
            {
              phase: '1단계: 특허 조사 및 분석',
              duration: '1-2개월',
              milestones: ['경쟁사 특허 조사', '기술 현황 분석', '특허 공백 파악'],
              deliverables: ['특허 조사 보고서', '기술 분석 보고서']
            },
            {
              phase: '2단계: 특허 전략 수립',
              duration: '2-3개월',
              milestones: ['특허 전략 수립', '출원 우선순위 결정', '예산 계획 수립'],
              deliverables: ['특허 전략 문서', '출원 계획서']
            },
            {
              phase: '3단계: 특허 출원 및 관리',
              duration: '6-12개월',
              milestones: ['특허 출원', '심사 대응', '특허 등록'],
              deliverables: ['특허 출원서', '등록 특허']
            }
          ]
        };
        resolve(report);
      }, 3000);
    });
  };

  const exportReport = () => {
    if (!consultingReport) return;
    
    const data = {
      startupInfo,
      report: consultingReport,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `consulting-report-${startupInfo.name}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return '높음';
      case 'medium': return '보통';
      case 'low': return '낮음';
      default: return '알 수 없음';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-patent">
      <div className="container-patent py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Users className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">스타트업 특허 컨설팅</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            특허 컨설팅
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            스타트업의 성공적인 시장 진입을 위한 맞춤형 특허 전략 컨설팅을 제공합니다
          </p>
        </div>

        {/* 진행 단계 표시 */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step < currentStep ? 'bg-primary' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 space-x-16">
            <span className={`text-sm ${currentStep >= 1 ? 'text-primary font-medium' : 'text-gray-500'}`}>
              스타트업 정보 입력
            </span>
            <span className={`text-sm ${currentStep >= 2 ? 'text-primary font-medium' : 'text-gray-500'}`}>
              AI 분석 수행
            </span>
            <span className={`text-sm ${currentStep >= 3 ? 'text-primary font-medium' : 'text-gray-500'}`}>
              컨설팅 리포트 생성
            </span>
          </div>
        </div>

        {/* 스타트업 정보 입력 폼 */}
        {currentStep === 1 && (
          <Card className="card-patent-hover mb-8 animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                스타트업 정보
              </CardTitle>
              <CardDescription>컨설팅을 위해 스타트업의 기본 정보를 입력해주세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">회사명 *</Label>
                  <Input
                    id="name"
                    value={startupInfo.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="회사명을 입력하세요"
                    className={formErrors.name ? 'border-red-500' : ''}
                  />
                  {formErrors.name && <p className="text-sm text-red-500">{formErrors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">산업 분야 *</Label>
                  <Select value={startupInfo.industry || ''} onValueChange={(value) => handleInputChange('industry', value)}>
                    <SelectTrigger className={formErrors.industry ? 'border-red-500' : ''}>
                      <SelectValue placeholder="산업 분야를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ai">인공지능</SelectItem>
                      <SelectItem value="blockchain">블록체인</SelectItem>
                      <SelectItem value="fintech">핀테크</SelectItem>
                      <SelectItem value="healthcare">헬스케어</SelectItem>
                      <SelectItem value="ecommerce">이커머스</SelectItem>
                      <SelectItem value="edtech">에듀테크</SelectItem>
                      <SelectItem value="cleantech">클린테크</SelectItem>
                      <SelectItem value="biotech">바이오테크</SelectItem>
                      <SelectItem value="other">기타</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.industry && <p className="text-sm text-red-500">{formErrors.industry}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="foundedDate">설립일</Label>
                  <Input
                    id="foundedDate"
                    type="date"
                    value={startupInfo.foundedDate || ''}
                    onChange={(e) => handleInputChange('foundedDate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teamSize">팀 규모</Label>
                  <Input
                    id="teamSize"
                    type="number"
                    value={startupInfo.teamSize || ''}
                    onChange={(e) => handleInputChange('teamSize', parseInt(e.target.value) || 0)}
                    placeholder="팀원 수"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fundingStage">투자 단계</Label>
                  <Select value={startupInfo.fundingStage || ''} onValueChange={(value) => handleInputChange('fundingStage', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="투자 단계를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="idea">아이디어 단계</SelectItem>
                      <SelectItem value="seed">시드 투자</SelectItem>
                      <SelectItem value="series_a">시리즈 A</SelectItem>
                      <SelectItem value="series_b">시리즈 B</SelectItem>
                      <SelectItem value="series_c">시리즈 C</SelectItem>
                      <SelectItem value="ipo">IPO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">사업 설명 *</Label>
                <Textarea
                  id="description"
                  value={startupInfo.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="스타트업의 사업 내용과 비전을 설명해주세요"
                  className={formErrors.description ? 'border-red-500' : ''}
                  rows={4}
                />
                {formErrors.description && <p className="text-sm text-red-500">{formErrors.description}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessModel">비즈니스 모델 *</Label>
                <Textarea
                  id="businessModel"
                  value={startupInfo.businessModel || ''}
                  onChange={(e) => handleInputChange('businessModel', e.target.value)}
                  placeholder="수익 모델과 비즈니스 전략을 설명해주세요"
                  className={formErrors.businessModel ? 'border-red-500' : ''}
                  rows={3}
                />
                {formErrors.businessModel && <p className="text-sm text-red-500">{formErrors.businessModel}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetMarket">타겟 시장 *</Label>
                <Textarea
                  id="targetMarket"
                  value={startupInfo.targetMarket || ''}
                  onChange={(e) => handleInputChange('targetMarket', e.target.value)}
                  placeholder="목표 시장과 고객층을 설명해주세요"
                  className={formErrors.targetMarket ? 'border-red-500' : ''}
                  rows={3}
                />
                {formErrors.targetMarket && <p className="text-sm text-red-500">{formErrors.targetMarket}</p>}
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={() => setCurrentStep(2)} 
                  className="btn-primary"
                  disabled={!startupInfo.name || !startupInfo.industry || !startupInfo.description || !startupInfo.businessModel || !startupInfo.targetMarket}
                >
                  다음 단계
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI 분석 수행 */}
        {currentStep === 2 && (
          <Card className="card-patent-hover mb-8 animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                AI 분석 수행
              </CardTitle>
              <CardDescription>입력된 정보를 바탕으로 AI가 종합적인 분석을 수행합니다</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-12">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="h-12 w-12 text-primary animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI 분석 준비 완료</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                입력하신 스타트업 정보를 바탕으로 시장 분석, 특허 전략, 리스크 평가를 수행할 준비가 되었습니다.
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep(1)}
                  className="btn-outline"
                >
                  이전 단계
                </Button>
                <Button 
                  onClick={() => {
                    setCurrentStep(3);
                    handleGenerateReport();
                  }}
                  className="btn-primary"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  AI 분석 시작
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 컨설팅 리포트 생성 */}
        {currentStep === 3 && (
          <div className="space-y-8 animate-fade-in">
            {isGenerating ? (
              <Card className="card-patent-hover">
                <CardContent className="text-center py-16">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <RefreshCw className="h-12 w-12 text-primary animate-spin" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">AI 분석 진행 중...</h3>
                  <p className="text-gray-600 mb-6">종합적인 특허 컨설팅 리포트를 생성하고 있습니다.</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                  </div>
                  <p className="text-sm text-gray-500">예상 소요 시간: 2-3분</p>
                </CardContent>
              </Card>
            ) : consultingReport ? (
              <>
                {/* 실행 요약 */}
                <Card className="card-patent-hover">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      실행 요약
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{consultingReport.executiveSummary}</p>
                  </CardContent>
                </Card>

                {/* 시장 분석 */}
                <Card className="card-patent-hover">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      시장 분석
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                          <TrendingUp className="h-8 w-8 text-blue-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">시장 규모</h4>
                        <p className="text-2xl font-bold text-blue-600">
                          {(consultingReport.marketAnalysis.marketSize / 1000000000).toFixed(1)}B
                        </p>
                      </div>

                      <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                          <Target className="h-8 w-8 text-green-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">성장률</h4>
                        <p className="text-2xl font-bold text-green-600">
                          {consultingReport.marketAnalysis.growthRate}%
                        </p>
                      </div>

                      <div className="text-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                          <Lightbulb className="h-8 w-8 text-purple-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">기회 요소</h4>
                        <p className="text-2xl font-bold text-purple-600">
                          {consultingReport.marketAnalysis.opportunities.length}개
                        </p>
                      </div>

                      <div className="text-center">
                        <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                          <AlertTriangle className="h-8 w-8 text-orange-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">위험 요소</h4>
                        <p className="text-2xl font-bold text-orange-600">
                          {consultingReport.marketAnalysis.threats.length}개
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">기회 요소</h4>
                        <div className="space-y-2">
                          {consultingReport.marketAnalysis.opportunities.map((opportunity, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <p className="text-gray-700">{opportunity}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">위험 요소</h4>
                        <div className="space-y-2">
                          {consultingReport.marketAnalysis.threats.map((threat, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                              <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                              <p className="text-gray-700">{threat}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 특허 전략 */}
                <Card className="card-patent-hover">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      특허 전략
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">출원 전략</h4>
                        <p className="text-gray-700">{consultingReport.patentStrategy.filingStrategy}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">지역별 출원 계획</h4>
                        <div className="flex flex-wrap gap-2">
                          {consultingReport.patentStrategy.geographicCoverage.map((region, index) => (
                            <Badge key={index} variant="secondary">{region}</Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">기술 분야</h4>
                        <div className="flex flex-wrap gap-2">
                          {consultingReport.patentStrategy.technologyFocus.map((tech, index) => (
                            <Badge key={index} variant="outline">{tech}</Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">예상 예산</h4>
                        <p className="text-2xl font-bold text-primary">
                          {consultingReport.patentStrategy.budgetEstimate.toLocaleString()}원
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 권장사항 */}
                <Card className="card-patent-hover">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      권장사항
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {consultingReport.recommendations.map((recommendation, index) => (
                        <div key={index} className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">{recommendation.title}</h4>
                              <Badge className={getPriorityColor(recommendation.priority)}>
                                {getPriorityLabel(recommendation.priority)}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">예상 비용</p>
                              <p className="font-semibold text-gray-900">
                                {recommendation.estimatedCost.toLocaleString()}원
                              </p>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-4">{recommendation.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{recommendation.timeline}</span>
                            </div>
                            <Badge variant="outline">{recommendation.category}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* 액션 버튼 */}
                <div className="flex gap-4 justify-center">
                  <Button onClick={exportReport} className="btn-primary">
                    <Download className="mr-2 h-4 w-4" />
                    리포트 내보내기
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setCurrentStep(1);
                      setConsultingReport(null);
                      setStartupInfo({
                        name: '',
                        industry: '',
                        description: '',
                        foundedDate: '',
                        teamSize: 0,
                        fundingStage: 'idea' as any,
                        businessModel: '',
                        targetMarket: '',
                        competitors: [],
                        patents: []
                      });
                    }}
                    className="btn-outline"
                  >
                    <ArrowRight className="mr-2 h-4 w-4" />
                    새 컨설팅 시작
                  </Button>
                </div>
              </>
            ) : null}
          </div>
        )}

        {/* 컨설팅 히스토리 */}
        {consultingHistory.length > 0 && (
          <Card className="card-patent mt-12 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                컨설팅 히스토리
              </CardTitle>
              <CardDescription>이전에 생성된 컨설팅 리포트들</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {consultingHistory.slice(0, 5).map((history) => (
                  <div key={history.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">스타트업 ID: {history.startupId}</h4>
                      <Badge variant="secondary">
                        {new Date(history.timestamp).toLocaleDateString()}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {history.report?.executiveSummary?.substring(0, 100)}...
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>권장사항: {history.report?.recommendations?.length || 0}개</span>
                      <span>예상 예산: {history.report?.patentStrategy?.budgetEstimate?.toLocaleString() || 0}원</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
