'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Crown, Zap, Star, Users, Building } from 'lucide-react';
import { subscriptionService, SubscriptionPlan } from '@/lib/subscription-service';
import { BrandVoice } from '@/lib/brand-voice';

export default function PricingPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<string>('free');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setPlans(subscriptionService.getPlans());
    const subscription = subscriptionService.getCurrentSubscription();
    if (subscription) {
      setCurrentPlan(subscription.planId);
    }
  }, []);

  const handleUpgrade = async (planId: string) => {
    if (planId === currentPlan) return;
    
    setIsLoading(true);
    try {
      const success = await subscriptionService.upgradePlan(planId);
      if (success) {
        setCurrentPlan(planId);
        // 성공 메시지 표시
        alert('업그레이드가 완료되었습니다!');
      } else {
        alert('업그레이드 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('업그레이드 오류:', error);
      alert('업그레이드 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return '무료';
    return `월 ${price.toLocaleString()}원`;
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free':
        return <Star className="h-6 w-6" />;
      case 'premium':
        return <Crown className="h-6 w-6" />;
      case 'enterprise':
        return <Building className="h-6 w-6" />;
      default:
        return <Star className="h-6 w-6" />;
    }
  };

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case 'free':
        return 'border-gray-200';
      case 'premium':
        return 'border-purple-500 ring-2 ring-purple-200';
      case 'enterprise':
        return 'border-blue-500';
      default:
        return 'border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-patent">
      <div className="container-patent py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Zap className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">프리미엄 플랜</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            맞춤형 플랜을 선택하세요
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            스타트업의 성장 단계에 맞는 특허 분석 서비스를 제공합니다
          </p>
        </div>

        {/* 브랜드 메시지 */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800 font-medium">
              💡 기술 설정이 어려우신가요? 걱정하지 마세요!
            </p>
            <p className="text-blue-600 text-sm mt-1">
              복잡한 API 설정 없이 바로 전문적인 특허 분석을 받아보세요
            </p>
          </div>
        </div>

        {/* 플랜 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative transition-all duration-300 hover:shadow-lg ${getPlanColor(plan.id)} ${
                plan.isPopular ? 'scale-105' : ''
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-purple-600 text-white px-3 py-1">
                    <Crown className="h-3 w-3 mr-1" />
                    인기 플랜
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full ${
                    plan.id === 'premium' ? 'bg-purple-100 text-purple-600' :
                    plan.id === 'enterprise' ? 'bg-blue-100 text-blue-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {getPlanIcon(plan.id)}
                  </div>
                </div>
                
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-lg">
                  {plan.description}
                </CardDescription>
                
                <div className="mt-4">
                  <div className="text-3xl font-bold text-gray-900">
                    {formatPrice(plan.price)}
                  </div>
                  {plan.price > 0 && (
                    <div className="text-sm text-gray-500">
                      {plan.interval === 'month' ? '월간' : '연간'} 결제
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* 기능 목록 */}
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* 사용량 제한 */}
                {plan.id === 'free' && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">사용량 제한</h4>
                    <div className="space-y-1 text-xs text-gray-600">
                      <div>• 월 {plan.limits.searchesPerMonth}회 특허 검색</div>
                      <div>• 월 {plan.limits.analysesPerMonth}회 AI 분석</div>
                      <div>• 데모 데이터 기반</div>
                    </div>
                  </div>
                )}

                {/* CTA 버튼 */}
                <div className="pt-4">
                  {plan.id === currentPlan ? (
                    <Button 
                      disabled 
                      className="w-full"
                      variant="outline"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      현재 플랜
                    </Button>
                  ) : plan.id === 'enterprise' ? (
                    <Button 
                      className="w-full"
                      variant="outline"
                      onClick={() => window.location.href = '/contact'}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      문의하기
                    </Button>
                  ) : (
                    <Button 
                      className={`w-full ${
                        plan.id === 'premium' ? 'bg-purple-600 hover:bg-purple-700' : ''
                      }`}
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        '처리 중...'
                      ) : (
                        <>
                          {plan.id === 'premium' ? (
                            <Crown className="mr-2 h-4 w-4" />
                          ) : (
                            <Star className="mr-2 h-4 w-4" />
                          )}
                          {plan.price === 0 ? '무료로 시작' : '업그레이드'}
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 추가 정보 */}
        <div className="mt-16 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              왜 PatentAI를 선택해야 할까요?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">간편한 설정</h3>
                <p className="text-gray-600 text-sm">
                  복잡한 API 설정 없이 바로 시작할 수 있습니다
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">전문적 분석</h3>
                <p className="text-gray-600 text-sm">
                  AI가 제공하는 전문가 수준의 특허 분석
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">맞춤형 지원</h3>
                <p className="text-gray-600 text-sm">
                  스타트업의 성장 단계별 맞춤 가이드
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            자주 묻는 질문
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                API 키 설정이 어려운데 어떻게 해야 하나요?
              </h3>
              <p className="text-gray-600 text-sm">
                걱정하지 마세요! 프리미엄 플랜에서는 복잡한 API 설정 없이 바로 전문적인 분석을 받을 수 있습니다. 
                저희가 모든 기술적 설정을 처리해드립니다.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                언제든 플랜을 변경할 수 있나요?
              </h3>
              <p className="text-gray-600 text-sm">
                네, 언제든지 플랜을 변경하실 수 있습니다. 업그레이드는 즉시 적용되며, 
                다운그레이드는 다음 결제 주기부터 적용됩니다.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                무료 플랜으로도 충분한가요?
              </h3>
              <p className="text-gray-600 text-sm">
                무료 플랜으로도 기본적인 특허 검색과 분석을 체험할 수 있습니다. 
                하지만 더 정확하고 상세한 분석이 필요하시다면 프리미엄 플랜을 추천드립니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
