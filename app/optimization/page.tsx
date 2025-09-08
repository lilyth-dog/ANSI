'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Zap, 
  Database, 
  Network, 
  Settings, 
  TrendingUp, 
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  Clock,
  BarChart3,
  Download,
  Upload,
  RefreshCw,
  Activity,
  HardDrive,
  Wifi,
  Cpu,
  MemoryStick
} from 'lucide-react';
import { OptimizationConfig, OptimizationMetrics, NetworkStats } from '@/types';
import { optimizationManager } from '@/lib/optimization-manager';
import { toast } from 'sonner';

export default function OptimizationPage() {
  const [config, setConfig] = useState<OptimizationConfig>({
    enableCaching: true,
    enableCompression: true,
    enableNetworkOptimization: true,
    cacheTTL: 3600,
    compressionThreshold: 1024,
    batchSize: 10,
    maxConcurrentRequests: 5
  });

  const [metrics, setMetrics] = useState<OptimizationMetrics>({
    cacheHitRate: 0,
    compressionRatio: 0,
    networkEfficiency: 0,
    totalDataSaved: 0,
    responseTimeImprovement: 0,
    costSavings: 0
  });

  const [networkStats, setNetworkStats] = useState<NetworkStats>({
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    totalDataTransferred: 0,
    averageResponseTime: 0,
    cacheHitRate: 0,
    compressionRatio: 0,
    batchEfficiency: 0
  });

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationHistory, setOptimizationHistory] = useState<any[]>([]);

  // 컴포넌트 마운트 시 최적화 설정 및 메트릭 로드
  useEffect(() => {
    loadOptimizationData();
    startMetricsUpdate();
  }, []);

  const loadOptimizationData = async () => {
    try {
      // 실제 구현에서는 최적화 매니저에서 설정 로드
      const savedConfig = localStorage.getItem('patent-ai-optimization-config');
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig));
      }

      // 메트릭 업데이트
      await updateMetrics();
    } catch (error) {
      console.error('최적화 데이터 로드 오류:', error);
    }
  };

  const startMetricsUpdate = () => {
    // 실시간 메트릭 업데이트 (5초마다)
    const interval = setInterval(updateMetrics, 5000);
    return () => clearInterval(interval);
  };

  const updateMetrics = async () => {
    try {
      // 실제 구현에서는 최적화 매니저에서 메트릭 조회
      const mockMetrics: OptimizationMetrics = {
        cacheHitRate: Math.random() * 100,
        compressionRatio: Math.random() * 50 + 30,
        networkEfficiency: Math.random() * 40 + 60,
        totalDataSaved: Math.random() * 1000000 + 500000,
        responseTimeImprovement: Math.random() * 30 + 20,
        costSavings: Math.random() * 100000 + 50000
      };

      const mockNetworkStats: NetworkStats = {
        totalRequests: Math.floor(Math.random() * 1000) + 500,
        successfulRequests: Math.floor(Math.random() * 800) + 400,
        failedRequests: Math.floor(Math.random() * 50) + 10,
        totalDataTransferred: Math.random() * 10000000 + 5000000,
        averageResponseTime: Math.random() * 500 + 200,
        cacheHitRate: Math.random() * 100,
        compressionRatio: Math.random() * 50 + 30,
        batchEfficiency: Math.random() * 40 + 60
      };

      setMetrics(mockMetrics);
      setNetworkStats(mockNetworkStats);
    } catch (error) {
      console.error('메트릭 업데이트 오류:', error);
    }
  };

  const handleConfigChange = (key: keyof OptimizationConfig, value: any) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    localStorage.setItem('patent-ai-optimization-config', JSON.stringify(newConfig));
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    
    try {
      // 실제 구현에서는 최적화 매니저를 통한 최적화 수행
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast.success('최적화가 완료되었습니다!');
      await updateMetrics();
    } catch (error) {
      console.error('최적화 오류:', error);
      toast.error('최적화 중 오류가 발생했습니다.');
    } finally {
      setIsOptimizing(false);
    }
  };

  const exportOptimizationData = () => {
    const data = {
      config,
      metrics,
      networkStats,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `optimization-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getPerformanceColor = (value: number, type: 'positive' | 'negative' = 'positive') => {
    if (type === 'positive') {
      if (value >= 80) return 'text-green-600';
      if (value >= 60) return 'text-yellow-600';
      return 'text-red-600';
    } else {
      if (value <= 20) return 'text-green-600';
      if (value <= 40) return 'text-yellow-600';
      return 'text-red-600';
    }
  };

  const getPerformanceLabel = (value: number, type: 'positive' | 'negative' = 'positive') => {
    if (type === 'positive') {
      if (value >= 80) return '우수';
      if (value >= 60) return '보통';
      return '개선 필요';
    } else {
      if (value <= 20) return '우수';
      if (value <= 40) return '보통';
      return '개선 필요';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-patent">
      <div className="container-patent py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Zap className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">성능 최적화 관리</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            최적화 관리
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            시스템 성능을 최적화하고 데이터 전송 효율성을 향상시켜 사용자 경험을 개선합니다
          </p>
        </div>

        {/* 성능 메트릭 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="card-patent-hover text-center p-6 animate-slide-up" style={{ animationDelay: '0ms' }}>
            <CardContent className="p-0">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <Database className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <p className={`text-3xl font-bold mb-2 ${getPerformanceColor(metrics.cacheHitRate)}`}>
                {metrics.cacheHitRate.toFixed(1)}%
              </p>
              <p className="text-gray-600 mb-2">캐시 적중률</p>
              <Badge className={getPerformanceColor(metrics.cacheHitRate)}>
                {getPerformanceLabel(metrics.cacheHitRate)}
              </Badge>
            </CardContent>
          </Card>

          <Card className="card-patent-hover text-center p-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <CardContent className="p-0">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                  <Download className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <p className={`text-3xl font-bold mb-2 ${getPerformanceColor(metrics.compressionRatio)}`}>
                {metrics.compressionRatio.toFixed(1)}%
              </p>
              <p className="text-gray-600 mb-2">압축률</p>
              <Badge className={getPerformanceColor(metrics.compressionRatio)}>
                {getPerformanceLabel(metrics.compressionRatio)}
              </Badge>
            </CardContent>
          </Card>

          <Card className="card-patent-hover text-center p-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <CardContent className="p-0">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <Network className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <p className={`text-3xl font-bold mb-2 ${getPerformanceColor(metrics.networkEfficiency)}`}>
                {metrics.networkEfficiency.toFixed(1)}%
              </p>
              <p className="text-gray-600 mb-2">네트워크 효율성</p>
              <Badge className={getPerformanceColor(metrics.networkEfficiency)}>
                {getPerformanceLabel(metrics.networkEfficiency)}
              </Badge>
            </CardContent>
          </Card>

          <Card className="card-patent-hover text-center p-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <CardContent className="p-0">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                </div>
              </div>
              <p className={`text-3xl font-bold mb-2 ${getPerformanceColor(metrics.responseTimeImprovement)}`}>
                {metrics.responseTimeImprovement.toFixed(1)}%
              </p>
              <p className="text-gray-600 mb-2">응답 시간 개선</p>
              <Badge className={getPerformanceColor(metrics.responseTimeImprovement)}>
                {getPerformanceLabel(metrics.responseTimeImprovement)}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* 네트워크 통계 */}
        <Card className="card-patent-hover mb-8 animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              네트워크 통계
            </CardTitle>
            <CardDescription>실시간 네트워크 사용량 및 성능 지표</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Wifi className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">총 요청 수</h4>
                <p className="text-2xl font-bold text-blue-600">{networkStats.totalRequests.toLocaleString()}</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">성공률</h4>
                <p className="text-2xl font-bold text-green-600">
                  {((networkStats.successfulRequests / networkStats.totalRequests) * 100).toFixed(1)}%
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <HardDrive className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">전송 데이터</h4>
                <p className="text-2xl font-bold text-purple-600">
                  {(networkStats.totalDataTransferred / 1024 / 1024).toFixed(1)}MB
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">평균 응답 시간</h4>
                <p className="text-2xl font-bold text-orange-600">{networkStats.averageResponseTime.toFixed(0)}ms</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 최적화 설정 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* 캐싱 설정 */}
          <Card className="card-patent-hover animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                캐싱 설정
              </CardTitle>
              <CardDescription>데이터 캐싱을 통한 성능 최적화</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="enableCaching">캐싱 활성화</Label>
                <Switch
                  id="enableCaching"
                  checked={config.enableCaching}
                  onCheckedChange={(checked) => handleConfigChange('enableCaching', checked)}
                />
              </div>

              {config.enableCaching && (
                <>
                  <div className="space-y-3">
                    <Label>캐시 TTL (초)</Label>
                    <div className="px-3">
                      <Slider
                        value={[config.cacheTTL]}
                        onValueChange={(value) => handleConfigChange('cacheTTL', value[0])}
                        max={86400}
                        min={300}
                        step={300}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>5분</span>
                        <span className="font-medium">{Math.floor(config.cacheTTL / 60)}분</span>
                        <span>24시간</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">캐시 성능</span>
                    </div>
                    <Progress value={metrics.cacheHitRate} className="h-2" />
                    <p className="text-xs text-blue-700 mt-1">
                      적중률: {metrics.cacheHitRate.toFixed(1)}%
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* 압축 설정 */}
          <Card className="card-patent-hover animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-primary" />
                압축 설정
              </CardTitle>
              <CardDescription>데이터 압축을 통한 전송량 최적화</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="enableCompression">압축 활성화</Label>
                <Switch
                  id="enableCompression"
                  checked={config.enableCompression}
                  onCheckedChange={(checked) => handleConfigChange('enableCompression', checked)}
                />
              </div>

              {config.enableCompression && (
                <>
                  <div className="space-y-3">
                    <Label>압축 임계값 (바이트)</Label>
                    <div className="px-3">
                      <Slider
                        value={[config.compressionThreshold]}
                        onValueChange={(value) => handleConfigChange('compressionThreshold', value[0])}
                        max={10240}
                        min={512}
                        step={512}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>512B</span>
                        <span className="font-medium">{config.compressionThreshold}B</span>
                        <span>10KB</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-900">압축 효과</span>
                    </div>
                    <Progress value={metrics.compressionRatio} className="h-2" />
                    <p className="text-xs text-green-700 mt-1">
                      압축률: {metrics.compressionRatio.toFixed(1)}%
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* 네트워크 최적화 설정 */}
          <Card className="card-patent-hover animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5 text-primary" />
                네트워크 최적화
              </CardTitle>
              <CardDescription>네트워크 요청 최적화 및 배치 처리</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="enableNetworkOptimization">네트워크 최적화 활성화</Label>
                <Switch
                  id="enableNetworkOptimization"
                  checked={config.enableNetworkOptimization}
                  onCheckedChange={(checked) => handleConfigChange('enableNetworkOptimization', checked)}
                />
              </div>

              {config.enableNetworkOptimization && (
                <>
                  <div className="space-y-3">
                    <Label>배치 크기</Label>
                    <div className="px-3">
                      <Slider
                        value={[config.batchSize]}
                        onValueChange={(value) => handleConfigChange('batchSize', value[0])}
                        max={50}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>1</span>
                        <span className="font-medium">{config.batchSize}</span>
                        <span>50</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>최대 동시 요청 수</Label>
                    <div className="px-3">
                      <Slider
                        value={[config.maxConcurrentRequests]}
                        onValueChange={(value) => handleConfigChange('maxConcurrentRequests', value[0])}
                        max={20}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>1</span>
                        <span className="font-medium">{config.maxConcurrentRequests}</span>
                        <span>20</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-900">네트워크 효율성</span>
                    </div>
                    <Progress value={metrics.networkEfficiency} className="h-2" />
                    <p className="text-xs text-purple-700 mt-1">
                      효율성: {metrics.networkEfficiency.toFixed(1)}%
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* 비용 절약 */}
          <Card className="card-patent-hover animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                비용 절약 효과
              </CardTitle>
              <CardDescription>최적화를 통한 비용 절약 현황</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-3xl font-bold text-green-600 mb-2">
                  {metrics.costSavings.toLocaleString()}원
                </h3>
                <p className="text-gray-600">절약된 비용</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">데이터 절약량</span>
                  <span className="font-medium">
                    {(metrics.totalDataSaved / 1024 / 1024).toFixed(1)}MB
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">응답 시간 개선</span>
                  <span className="font-medium">{metrics.responseTimeImprovement.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">네트워크 효율성</span>
                  <span className="font-medium">{metrics.networkEfficiency.toFixed(1)}%</span>
                </div>
              </div>

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  최적화 설정을 통해 API 호출 비용과 네트워크 사용량을 크게 절약할 수 있습니다.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-4 justify-center mb-8">
          <Button 
            onClick={handleOptimize} 
            disabled={isOptimizing}
            className="btn-primary"
          >
            {isOptimizing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                최적화 중...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                최적화 실행
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            onClick={exportOptimizationData}
            className="btn-outline"
          >
            <Download className="mr-2 h-4 w-4" />
            데이터 내보내기
          </Button>
        </div>

        {/* 최적화 권장사항 */}
        <Card className="card-patent-hover animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              최적화 권장사항
            </CardTitle>
            <CardDescription>현재 설정에 따른 성능 개선 권장사항</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">캐싱 최적화</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      캐시 TTL을 1시간으로 설정하여 데이터 신선도와 성능의 균형을 맞추세요.
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      자주 사용되는 특허 데이터는 더 긴 캐시 시간을 설정하세요.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">네트워크 최적화</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      배치 크기를 10-15개로 설정하여 네트워크 효율성을 높이세요.
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      동시 요청 수를 5개로 제한하여 서버 부하를 줄이세요.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}