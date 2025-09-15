'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Key, 
  Database, 
  Brain, 
  CheckCircle, 
  AlertCircle, 
  Save,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  Shield,
  Zap,
  Sparkles,
  ArrowRight,
  Lock,
  Globe,
  Settings,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface ApiKeys {
  kipris: {
    apiKey: string;
    apiUrl: string;
    isEnabled: boolean;
  };
  openai: {
    apiKey: string;
    apiUrl: string;
    isEnabled: boolean;
  };
  openrouter: {
    apiKey: string;
    apiUrl: string;
    isEnabled: boolean;
  };
}

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    kipris: {
      apiKey: '',
      apiUrl: 'https://www.kipris.or.kr/khome/main/base',
      isEnabled: true
    },
    openai: {
      apiKey: '',
      apiUrl: 'https://api.openai.com/v1',
      isEnabled: false
    },
    openrouter: {
      apiKey: '',
      apiUrl: 'https://openrouter.ai/api/v1',
      isEnabled: false
    }
  });

  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({
    kipris: false,
    openai: false,
    openrouter: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // 컴포넌트 마운트 시 저장된 API 키 로드
  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = () => {
    try {
      const savedKeys = localStorage.getItem('patent-ai-api-keys');
      if (savedKeys) {
        const parsed = JSON.parse(savedKeys);
        setApiKeys(parsed);
      }
    } catch (error) {
      console.error('API 키 로드 오류:', error);
    }
  };

  const handleApiKeyChange = (service: keyof ApiKeys, field: string, value: string | boolean) => {
    setApiKeys(prev => ({
      ...prev,
      [service]: {
        ...prev[service],
        [field]: value
      }
    }));
  };

  const toggleKeyVisibility = (service: string) => {
    setShowKeys(prev => ({
      ...prev,
      [service]: !prev[service]
    }));
  };

  const copyToClipboard = (text: string, service: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${service} API 키가 클립보드에 복사되었습니다.`);
  };

  const saveApiKeys = async () => {
    setIsLoading(true);
    setSaveStatus('saving');
    
    try {
      // API 키 유효성 검증
      const validationResults = await validateApiKeys();
      
      if (validationResults.every(result => result.valid)) {
        localStorage.setItem('patent-ai-api-keys', JSON.stringify(apiKeys));
        setSaveStatus('saved');
        toast.success('API 키가 성공적으로 저장되었습니다!');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        setSaveStatus('error');
        const failedServices = validationResults
          .filter(result => !result.valid)
          .map(result => result.service)
          .join(', ');
        toast.error(`다음 서비스의 API 키 검증에 실패했습니다: ${failedServices}`);
      }
    } catch (error) {
      console.error('API 키 저장 오류:', error);
      setSaveStatus('error');
      toast.error('API 키 저장 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateApiKeys = async (): Promise<Array<{ service: string; valid: boolean }>> => {
    const results = [];

    // KIPRIS API 키 검증
    if (apiKeys.kipris.isEnabled && apiKeys.kipris.apiKey) {
      try {
        const response = await fetch('/api/validate-kipris', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ apiKey: apiKeys.kipris.apiKey })
        });
        const isValid = response.ok;
        results.push({ service: 'KIPRIS', valid: isValid });
      } catch (error) {
        results.push({ service: 'KIPRIS', valid: false });
      }
    } else if (apiKeys.kipris.isEnabled) {
      results.push({ service: 'KIPRIS', valid: false });
    }

    // OpenAI API 키 검증
    if (apiKeys.openai.isEnabled && apiKeys.openai.apiKey) {
      try {
        const response = await fetch('/api/validate-openai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ apiKey: apiKeys.openai.apiKey })
        });
        const isValid = response.ok;
        results.push({ service: 'OpenAI', valid: isValid });
      } catch (error) {
        results.push({ service: 'OpenAI', valid: false });
      }
    }

    // OpenRouter API 키 검증
    if (apiKeys.openrouter.isEnabled && apiKeys.openrouter.apiKey) {
      try {
        const response = await fetch('/api/validate-openrouter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ apiKey: apiKeys.openrouter.apiKey })
        });
        const isValid = response.ok;
        results.push({ service: 'OpenRouter', valid: isValid });
      } catch (error) {
        results.push({ service: 'OpenRouter', valid: false });
      }
    }

    return results;
  };

  const getSaveButtonText = () => {
    switch (saveStatus) {
      case 'saving':
        return '저장 중...';
      case 'saved':
        return '저장됨!';
      case 'error':
        return '저장 실패';
      default:
        return 'API 키 저장';
    }
  };

  const getSaveButtonVariant = () => {
    switch (saveStatus) {
      case 'saved':
        return 'default';
      case 'error':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getServiceStatus = (service: keyof ApiKeys) => {
    const serviceData = apiKeys[service];
    if (!serviceData.isEnabled) return 'disabled';
    if (!serviceData.apiKey) return 'no-key';
    return 'ready';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'no-key':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'disabled':
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ready':
        return '사용 가능';
      case 'no-key':
        return 'API 키 필요';
      case 'disabled':
        return '비활성화됨';
      default:
        return '알 수 없음';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="border-b border-gray-100 bg-white">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Key className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">API 설정</span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              API 키 관리
            </h1>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              특허 분석 서비스의 핵심인 <span className="font-semibold text-blue-600">KIPRIS API</span>와 
              <span className="font-semibold text-gray-700"> AI 분석 서비스</span>를 연결하여<br />
              정확하고 신뢰할 수 있는 특허 분석을 수행하세요
            </p>

            {/* Connection Status */}
            <div className="flex items-center gap-8 mt-8">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  getServiceStatus('kipris') === 'ready' ? 'bg-green-500' : 
                  getServiceStatus('kipris') === 'no-key' ? 'bg-yellow-500' : 'bg-gray-300'
                }`}></div>
                <span className="text-sm font-medium text-gray-700">KIPRIS 연결</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  getServiceStatus('kipris') === 'ready' ? 'bg-green-100 text-green-700' : 
                  getServiceStatus('kipris') === 'no-key' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {getServiceStatus('kipris') === 'ready' ? '연결됨' : 
                   getServiceStatus('kipris') === 'no-key' ? '키 필요' : '비활성'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  getServiceStatus('openai') === 'ready' || getServiceStatus('openrouter') === 'ready' ? 'bg-green-500' : 
                  getServiceStatus('openai') === 'no-key' || getServiceStatus('openrouter') === 'no-key' ? 'bg-yellow-500' : 'bg-gray-300'
                }`}></div>
                <span className="text-sm font-medium text-gray-700">AI 분석</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  getServiceStatus('openai') === 'ready' || getServiceStatus('openrouter') === 'ready' ? 'bg-green-100 text-green-700' : 
                  getServiceStatus('openai') === 'no-key' || getServiceStatus('openrouter') === 'no-key' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {getServiceStatus('openai') === 'ready' || getServiceStatus('openrouter') === 'ready' ? '연결됨' : 
                   getServiceStatus('openai') === 'no-key' || getServiceStatus('openrouter') === 'no-key' ? '키 필요' : '비활성'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Action Bar */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-600">API 설정 관리</span>
            </div>
            <div className="h-4 w-px bg-gray-200"></div>
            <span className="text-sm text-gray-500">
              {Object.values(apiKeys).filter(service => service.isEnabled).length}개 서비스 활성화
            </span>
          </div>
          
          <Button 
            onClick={saveApiKeys} 
            disabled={isLoading}
            variant={getSaveButtonVariant()}
            className={`flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
              saveStatus === 'saved' 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : saveStatus === 'error'
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {saveStatus === 'saving' ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                저장 중...
              </>
            ) : saveStatus === 'saved' ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                저장 완료
              </>
            ) : saveStatus === 'error' ? (
              <>
                <XCircle className="h-4 w-4" />
                저장 실패
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                설정 저장
              </>
            )}
          </Button>
        </div>

        {/* API Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* KIPRIS API 설정 */}
          <Card className="border border-gray-200 bg-white hover:border-gray-300 transition-all duration-200">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100">
                    <Database className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg font-semibold text-gray-900">KIPRIS API</CardTitle>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">필수</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">한국특허정보원 공식 API</p>
                    <CardDescription className="text-sm text-gray-500 leading-relaxed">
                      특허 검색 및 분석을 위한 핵심 데이터 소스
                    </CardDescription>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  getServiceStatus('kipris') === 'ready' ? 'bg-green-100 text-green-700' :
                  getServiceStatus('kipris') === 'no-key' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {getServiceStatus('kipris') === 'ready' ? '연결됨' : 
                   getServiceStatus('kipris') === 'no-key' ? '키 필요' : '비활성'}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {/* Toggle Switch */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                      <Shield className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-900">서비스 활성화</Label>
                      <p className="text-xs text-gray-500">KIPRIS API 사용 여부</p>
                    </div>
                  </div>
                  <Switch
                    checked={apiKeys.kipris.isEnabled}
                    onCheckedChange={(checked) => handleApiKeyChange('kipris', 'isEnabled', checked)}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </div>

                {apiKeys.kipris.isEnabled && (
                  <div className="space-y-4 pt-2">
                    <Separator className="bg-gray-100" />
                    
                    {/* API Key Input */}
                    <div className="space-y-2">
                      <Label htmlFor="kipris-api-key" className="text-sm font-medium text-gray-900">
                        API 키
                      </Label>
                      <div className="relative">
                        <Input
                          id="kipris-api-key"
                          type={showKeys.kipris ? 'text' : 'password'}
                          value={apiKeys.kipris.apiKey}
                          onChange={(e) => handleApiKeyChange('kipris', 'apiKey', e.target.value)}
                          placeholder="KIPRIS API 키를 입력하세요"
                          className="pr-20 bg-white border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleKeyVisibility('kipris')}
                            className="h-7 w-7 p-0 hover:bg-gray-100"
                          >
                            {showKeys.kipris ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(apiKeys.kipris.apiKey, 'KIPRIS')}
                            className="h-7 w-7 p-0 hover:bg-gray-100"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* API URL Input */}
                    <div className="space-y-2">
                      <Label htmlFor="kipris-api-url" className="text-sm font-medium text-gray-900">
                        API URL
                      </Label>
                      <Input
                        id="kipris-api-url"
                        value={apiKeys.kipris.apiUrl}
                        onChange={(e) => handleApiKeyChange('kipris', 'apiUrl', e.target.value)}
                        placeholder="KIPRIS API URL"
                        className="bg-white border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                      />
                    </div>

                    {/* Info Alert */}
                    <Alert className="border-blue-100 bg-blue-50/50">
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800 text-sm">
                        <strong>API 키 발급:</strong> 한국특허정보원에서 발급받을 수 있습니다.
                        <a 
                          href="https://www.kipris.or.kr" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium ml-1"
                        >
                          방문하기 <ExternalLink className="h-3 w-3" />
                        </a>
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </div>
            </CardContent>
        </Card>

          {/* OpenAI API 설정 */}
          <Card className="border border-gray-200 bg-white hover:border-gray-300 transition-all duration-200">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center border border-green-100">
                    <Brain className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg font-semibold text-gray-900">OpenAI API</CardTitle>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">선택</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">GPT 모델 기반 AI 분석</p>
                    <CardDescription className="text-sm text-gray-500 leading-relaxed">
                      고급 AI 특허 분석 및 인사이트 제공
                    </CardDescription>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  getServiceStatus('openai') === 'ready' ? 'bg-green-100 text-green-700' :
                  getServiceStatus('openai') === 'no-key' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {getServiceStatus('openai') === 'ready' ? '연결됨' : 
                   getServiceStatus('openai') === 'no-key' ? '키 필요' : '비활성'}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {/* Toggle Switch */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                      <Zap className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-900">서비스 활성화</Label>
                      <p className="text-xs text-gray-500">OpenAI API 사용 여부</p>
                    </div>
                  </div>
                  <Switch
                    checked={apiKeys.openai.isEnabled}
                    onCheckedChange={(checked) => handleApiKeyChange('openai', 'isEnabled', checked)}
                    className="data-[state=checked]:bg-green-600"
                  />
                </div>

                {apiKeys.openai.isEnabled && (
                  <div className="space-y-4 pt-2">
                    <Separator className="bg-gray-100" />
                    
                    {/* API Key Input */}
                    <div className="space-y-2">
                      <Label htmlFor="openai-api-key" className="text-sm font-medium text-gray-900">
                        API 키
                      </Label>
                      <div className="relative">
                        <Input
                          id="openai-api-key"
                          type={showKeys.openai ? 'text' : 'password'}
                          value={apiKeys.openai.apiKey}
                          onChange={(e) => handleApiKeyChange('openai', 'apiKey', e.target.value)}
                          placeholder="OpenAI API 키를 입력하세요"
                          className="pr-20 bg-white border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500/20"
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleKeyVisibility('openai')}
                            className="h-7 w-7 p-0 hover:bg-gray-100"
                          >
                            {showKeys.openai ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(apiKeys.openai.apiKey, 'OpenAI')}
                            className="h-7 w-7 p-0 hover:bg-gray-100"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* API URL Input */}
                    <div className="space-y-2">
                      <Label htmlFor="openai-api-url" className="text-sm font-medium text-gray-900">
                        API URL
                      </Label>
                      <Input
                        id="openai-api-url"
                        value={apiKeys.openai.apiUrl}
                        onChange={(e) => handleApiKeyChange('openai', 'apiUrl', e.target.value)}
                        placeholder="OpenAI API URL"
                        className="bg-white border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500/20"
                      />
                    </div>

                    {/* Info Alert */}
                    <Alert className="border-green-100 bg-green-50/50">
                      <AlertCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800 text-sm">
                        <strong>API 키 발급:</strong> OpenAI 플랫폼에서 발급받을 수 있습니다.
                        <a 
                          href="https://platform.openai.com" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-green-600 hover:text-green-700 font-medium ml-1"
                        >
                          방문하기 <ExternalLink className="h-3 w-3" />
                        </a>
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* OpenRouter API 설정 */}
          <Card className="border border-gray-200 bg-white hover:border-gray-300 transition-all duration-200">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center border border-purple-100">
                    <Sparkles className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg font-semibold text-gray-900">OpenRouter API</CardTitle>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">선택</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">다양한 AI 모델 통합 플랫폼</p>
                    <CardDescription className="text-sm text-gray-500 leading-relaxed">
                      비용 효율적인 AI 분석 서비스 (OpenAI 대안)
                    </CardDescription>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  getServiceStatus('openrouter') === 'ready' ? 'bg-green-100 text-green-700' :
                  getServiceStatus('openrouter') === 'no-key' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {getServiceStatus('openrouter') === 'ready' ? '연결됨' : 
                   getServiceStatus('openrouter') === 'no-key' ? '키 필요' : '비활성'}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {/* Toggle Switch */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                      <Sparkles className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-900">서비스 활성화</Label>
                      <p className="text-xs text-gray-500">OpenRouter API 사용 여부</p>
                    </div>
                  </div>
                  <Switch
                    checked={apiKeys.openrouter.isEnabled}
                    onCheckedChange={(checked) => handleApiKeyChange('openrouter', 'isEnabled', checked)}
                    className="data-[state=checked]:bg-purple-600"
                  />
                </div>

                {apiKeys.openrouter.isEnabled && (
                  <div className="space-y-4 pt-2">
                    <Separator className="bg-gray-100" />
                    
                    {/* API Key Input */}
                    <div className="space-y-2">
                      <Label htmlFor="openrouter-api-key" className="text-sm font-medium text-gray-900">
                        API 키
                      </Label>
                      <div className="relative">
                        <Input
                          id="openrouter-api-key"
                          type={showKeys.openrouter ? 'text' : 'password'}
                          value={apiKeys.openrouter.apiKey}
                          onChange={(e) => handleApiKeyChange('openrouter', 'apiKey', e.target.value)}
                          placeholder="OpenRouter API 키를 입력하세요"
                          className="pr-20 bg-white border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20"
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleKeyVisibility('openrouter')}
                            className="h-7 w-7 p-0 hover:bg-gray-100"
                          >
                            {showKeys.openrouter ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(apiKeys.openrouter.apiKey, 'OpenRouter')}
                            className="h-7 w-7 p-0 hover:bg-gray-100"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* API URL Input */}
                    <div className="space-y-2">
                      <Label htmlFor="openrouter-api-url" className="text-sm font-medium text-gray-900">
                        API URL
                      </Label>
                      <Input
                        id="openrouter-api-url"
                        value={apiKeys.openrouter.apiUrl}
                        onChange={(e) => handleApiKeyChange('openrouter', 'apiUrl', e.target.value)}
                        placeholder="OpenRouter API URL"
                        className="bg-white border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20"
                      />
                    </div>

                    {/* Info Alert */}
                    <Alert className="border-purple-100 bg-purple-50/50">
                      <AlertCircle className="h-4 w-4 text-purple-600" />
                      <AlertDescription className="text-purple-800 text-sm">
                        <strong>API 키 발급:</strong> OpenRouter 플랫폼에서 발급받을 수 있습니다.
                        <a 
                          href="https://openrouter.ai" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium ml-1"
                        >
                          방문하기 <ExternalLink className="h-3 w-3" />
                        </a>
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 간소화된 가이드 섹션 */}
        <div className="mt-12">
          <div className="border-t border-gray-100 pt-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <Key className="h-4 w-4 text-gray-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">API 키 발급 가이드</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">1</div>
                  <h3 className="font-medium text-gray-900">KIPRIS API</h3>
                </div>
                <p className="text-sm text-gray-600 ml-8">
                  한국특허정보원에서 회원가입 후 API 키를 신청하세요.
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="ml-8 text-xs"
                  onClick={() => window.open('https://www.kipris.or.kr', '_blank')}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  방문하기
                </Button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">2</div>
                  <h3 className="font-medium text-gray-900">OpenAI API</h3>
                </div>
                <p className="text-sm text-gray-600 ml-8">
                  OpenAI 플랫폼에서 계정 생성 후 API 키를 발급받으세요.
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="ml-8 text-xs"
                  onClick={() => window.open('https://platform.openai.com', '_blank')}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  방문하기
                </Button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">3</div>
                  <h3 className="font-medium text-gray-900">OpenRouter API</h3>
                </div>
                <p className="text-sm text-gray-600 ml-8">
                  OpenRouter에서 무료 계정을 생성하고 API 키를 복사하세요.
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="ml-8 text-xs"
                  onClick={() => window.open('https://openrouter.ai', '_blank')}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  방문하기
                </Button>
              </div>
            </div>

            {/* 보안 안내 */}
            <Alert className="mt-8 border-amber-200 bg-amber-50">
              <Lock className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 text-sm">
                <strong>보안 주의:</strong> API 키는 민감한 정보입니다. 안전하게 보관하고 정기적으로 갱신하세요.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  );
}
