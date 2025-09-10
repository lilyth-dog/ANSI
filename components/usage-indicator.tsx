'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Zap, 
  Search, 
  Brain, 
  Crown, 
  ArrowUp,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { subscriptionService } from '@/lib/subscription-service';
import { BrandVoice } from '@/lib/brand-voice';

export function UsageIndicator() {
  const [subscription, setSubscription] = useState(subscriptionService.getCurrentSubscription());
  const [plan, setPlan] = useState(subscriptionService.getCurrentPlan());
  const [remainingUsage, setRemainingUsage] = useState(subscriptionService.getRemainingUsage());

  useEffect(() => {
    // 실시간 업데이트를 위한 상태 동기화
    const updateUsage = () => {
      setSubscription(subscriptionService.getCurrentSubscription());
      setPlan(subscriptionService.getCurrentPlan());
      setRemainingUsage(subscriptionService.getRemainingUsage());
    };

    updateUsage();
    // 1분마다 사용량 업데이트
    const interval = setInterval(updateUsage, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!subscription || !plan) {
    return null;
  }

  const isFreePlan = plan.id === 'free';
  const isPremiumPlan = plan.id === 'premium';
  const isEnterprisePlan = plan.id === 'enterprise';

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0; // 무제한
    return Math.min(100, (used / limit) * 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getUsageMessage = () => {
    if (isPremiumPlan || isEnterprisePlan) {
      return {
        title: "⭐ 프리미엄 플랜",
        description: "무제한으로 모든 기능을 이용하실 수 있습니다.",
        icon: <Crown className="h-4 w-4" />,
        color: "text-purple-600"
      };
    }

    const searchPercentage = getUsagePercentage(subscription.usage.searchesThisMonth, plan.limits.searchesPerMonth);
    const analysisPercentage = getUsagePercentage(subscription.usage.analysesThisMonth, plan.limits.analysesPerMonth);

    if (searchPercentage >= 90 || analysisPercentage >= 90) {
      return {
        title: "⚠️ 사용량이 거의 다 찼어요",
        description: "프리미엄으로 업그레이드하면 무제한으로 이용할 수 있습니다.",
        icon: <AlertTriangle className="h-4 w-4" />,
        color: "text-red-600"
      };
    }

    return {
      title: "🆓 기본 플랜",
      description: "무료로 특허 분석을 체험해보세요.",
      icon: <CheckCircle className="h-4 w-4" />,
      color: "text-green-600"
    };
  };

  const usageMessage = getUsageMessage();

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          {usageMessage.icon}
          <span className={usageMessage.color}>{usageMessage.title}</span>
        </CardTitle>
        <CardDescription>{usageMessage.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* 사용량 표시 (무료 플랜만) */}
        {isFreePlan && (
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <span>특허 검색</span>
                </div>
                <span className="font-medium">
                  {subscription.usage.searchesThisMonth} / {plan.limits.searchesPerMonth}
                </span>
              </div>
              <Progress 
                value={getUsagePercentage(subscription.usage.searchesThisMonth, plan.limits.searchesPerMonth)}
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  <span>AI 분석</span>
                </div>
                <span className="font-medium">
                  {subscription.usage.analysesThisMonth} / {plan.limits.analysesPerMonth}
                </span>
              </div>
              <Progress 
                value={getUsagePercentage(subscription.usage.analysesThisMonth, plan.limits.analysesPerMonth)}
                className="h-2"
              />
            </div>
          </div>
        )}

        {/* 프리미엄 업그레이드 CTA */}
        {isFreePlan && (
          <Alert>
            <Zap className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p>더 많은 분석이 필요하신가요?</p>
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => window.location.href = '/pricing'}
                >
                  <Crown className="mr-2 h-4 w-4" />
                  프리미엄으로 업그레이드
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* 프리미엄 플랜 혜택 */}
        {(isPremiumPlan || isEnterprisePlan) && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>무제한 특허 검색</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>무제한 AI 분석</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>실시간 특허 데이터</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>고급 AI 모델</span>
            </div>
          </div>
        )}

        {/* 월별 리셋 정보 */}
        <div className="text-xs text-gray-500 text-center">
          사용량은 매월 1일에 초기화됩니다
        </div>
      </CardContent>
    </Card>
  );
}

export default UsageIndicator;
