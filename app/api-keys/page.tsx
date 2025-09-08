'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
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
  ExternalLink
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">API 키 설정</h1>
        <p className="text-gray-600">서비스 사용을 위해 필요한 API 키를 설정하세요</p>
      </div>

      {/* 저장 버튼 */}
      <div className="flex gap-4 mb-8">
        <Button 
          onClick={saveApiKeys} 
          disabled={isLoading}
          variant={getSaveButtonVariant()}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {getSaveButtonText()}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* KIPRIS API 설정 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              KIPRIS API
              {getStatusIcon(getServiceStatus('kipris'))}
            </CardTitle>
            <CardDescription>
              한국특허정보원 API를 통한 특허 정보 검색
              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                getServiceStatus('kipris') === 'ready' ? 'bg-green-100 text-green-800' :
                getServiceStatus('kipris') === 'no-key' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {getStatusText(getServiceStatus('kipris'))}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>KIPRIS API 활성화</Label>
              <Switch
                checked={apiKeys.kipris.isEnabled}
                onCheckedChange={(checked) => handleApiKeyChange('kipris', 'isEnabled', checked)}
              />
            </div>

            {apiKeys.kipris.isEnabled && (
              <>
                <Separator />
                <div>
                  <Label htmlFor="kipris-api-key">API 키</Label>
                  <div className="relative">
                    <Input
                      id="kipris-api-key"
                      type={showKeys.kipris ? 'text' : 'password'}
                      value={apiKeys.kipris.apiKey}
                      onChange={(e) => handleApiKeyChange('kipris', 'apiKey', e.target.value)}
                      placeholder="KIPRIS API 키를 입력하세요"
                      className="pr-20"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleKeyVisibility('kipris')}
                        className="h-8 w-8 p-0"
                      >
                        {showKeys.kipris ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(apiKeys.kipris.apiKey, 'KIPRIS')}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="kipris-api-url">API URL</Label>
                  <Input
                    id="kipris-api-url"
                    value={apiKeys.kipris.apiUrl}
                    onChange={(e) => handleApiKeyChange('kipris', 'apiUrl', e.target.value)}
                    placeholder="KIPRIS API URL"
                  />
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    KIPRIS API 키는 한국특허정보원에서 발급받을 수 있습니다.
                    <a 
                      href="https://www.kipris.or.kr" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline ml-1"
                    >
                      방문하기 <ExternalLink className="h-3 w-3 inline" />
                    </a>
                  </AlertDescription>
                </Alert>
              </>
            )}
          </CardContent>
        </Card>

        {/* OpenAI API 설정 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              OpenAI API
              {getStatusIcon(getServiceStatus('openai'))}
            </CardTitle>
            <CardDescription>
              OpenAI GPT 모델을 통한 AI 특허 분석
              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                getServiceStatus('openai') === 'ready' ? 'bg-green-100 text-green-800' :
                getServiceStatus('openai') === 'no-key' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {getStatusText(getServiceStatus('openai'))}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>OpenAI API 활성화</Label>
              <Switch
                checked={apiKeys.openai.isEnabled}
                onCheckedChange={(checked) => handleApiKeyChange('openai', 'isEnabled', checked)}
              />
            </div>

            {apiKeys.openai.isEnabled && (
              <>
                <Separator />
                <div>
                  <Label htmlFor="openai-api-key">API 키</Label>
                  <div className="relative">
                    <Input
                      id="openai-api-key"
                      type={showKeys.openai ? 'text' : 'password'}
                      value={apiKeys.openai.apiKey}
                      onChange={(e) => handleApiKeyChange('openai', 'apiKey', e.target.value)}
                      placeholder="OpenAI API 키를 입력하세요"
                      className="pr-20"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleKeyVisibility('openai')}
                        className="h-8 w-8 p-0"
                      >
                        {showKeys.openai ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(apiKeys.openai.apiKey, 'OpenAI')}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="openai-api-url">API URL</Label>
                  <Input
                    id="openai-api-url"
                    value={apiKeys.openai.apiUrl}
                    onChange={(e) => handleApiKeyChange('openai', 'apiUrl', e.target.value)}
                    placeholder="OpenAI API URL"
                  />
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    OpenAI API 키는 OpenAI 플랫폼에서 발급받을 수 있습니다.
                    <a 
                      href="https://platform.openai.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline ml-1"
                    >
                      방문하기 <ExternalLink className="h-3 w-3 inline" />
                    </a>
                  </AlertDescription>
                </Alert>
              </>
            )}
          </CardContent>
        </Card>

        {/* OpenRouter API 설정 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              OpenRouter API
              {getStatusIcon(getServiceStatus('openrouter'))}
            </CardTitle>
            <CardDescription>
              다양한 AI 모델을 통한 특허 분석 (OpenAI 대안)
              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                getServiceStatus('openrouter') === 'ready' ? 'bg-green-100 text-green-800' :
                getServiceStatus('openrouter') === 'no-key' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {getStatusText(getServiceStatus('openrouter'))}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>OpenRouter API 활성화</Label>
              <Switch
                checked={apiKeys.openrouter.isEnabled}
                onCheckedChange={(checked) => handleApiKeyChange('openrouter', 'isEnabled', checked)}
              />
            </div>

            {apiKeys.openrouter.isEnabled && (
              <>
                <Separator />
                <div>
                  <Label htmlFor="openrouter-api-key">API 키</Label>
                  <div className="relative">
                    <Input
                      id="openrouter-api-key"
                      type={showKeys.openrouter ? 'text' : 'password'}
                      value={apiKeys.openrouter.apiKey}
                      onChange={(e) => handleApiKeyChange('openrouter', 'apiKey', e.target.value)}
                      placeholder="OpenRouter API 키를 입력하세요"
                      className="pr-20"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleKeyVisibility('openrouter')}
                        className="h-8 w-8 p-0"
                      >
                        {showKeys.openrouter ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(apiKeys.openrouter.apiKey, 'OpenRouter')}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="openrouter-api-url">API URL</Label>
                  <Input
                    id="openrouter-api-url"
                    value={apiKeys.openrouter.apiUrl}
                    onChange={(e) => handleApiKeyChange('openrouter', 'apiUrl', e.target.value)}
                    placeholder="OpenRouter API URL"
                  />
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    OpenRouter API 키는 OpenRouter 플랫폼에서 발급받을 수 있습니다.
                    <a 
                      href="https://openrouter.ai" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline ml-1"
                    >
                      방문하기 <ExternalLink className="h-3 w-3 inline" />
                    </a>
                  </AlertDescription>
                </Alert>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 설정 가이드 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API 키 설정 가이드
          </CardTitle>
          <CardDescription>API 키 발급 및 설정 방법을 안내합니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">1. KIPRIS API</h4>
              <p className="text-sm text-gray-600">
                한국특허정보원에서 특허 검색 API 키를 발급받아 특허 정보를 검색할 수 있습니다.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">2. OpenAI API</h4>
              <p className="text-sm text-gray-600">
                OpenAI에서 GPT 모델 API 키를 발급받아 AI 특허 분석을 수행할 수 있습니다.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">3. OpenRouter API</h4>
              <p className="text-sm text-gray-600">
                OpenRouter에서 다양한 AI 모델 API 키를 발급받아 OpenAI 대안으로 사용할 수 있습니다.
              </p>
            </div>
          </div>
          
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>중요:</strong> API 키는 민감한 정보이므로 안전하게 보관하세요. 
              API 키가 노출되지 않도록 주의하고, 필요시 정기적으로 갱신하세요.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
