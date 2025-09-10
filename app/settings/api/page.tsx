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
  ExternalLink,
  Settings,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import { apiConfigManager } from '@/lib/api-config';

export default function ApiSettingsPage() {
  const [openRouterKey, setOpenRouterKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [config, setConfig] = useState(apiConfigManager.getConfig());

  useEffect(() => {
    // OpenRouter 키만 로드 (KIPRIS는 서버에서 관리)
    const openRouterConfig = apiConfigManager.getOpenRouterConfig();
    if (openRouterConfig.isEnabled) {
      setOpenRouterKey('***설정됨***');
    }
  }, []);

  const handleSaveOpenRouterKey = async () => {
    if (!openRouterKey || openRouterKey === '***설정됨***') {
      toast.error('API 키를 입력해주세요.');
      return;
    }

    setIsValidating(true);
    try {
      const isValid = await apiConfigManager.validateOpenRouterKey(openRouterKey);
      if (isValid) {
        apiConfigManager.saveUserOpenRouterKey(openRouterKey);
        setConfig(apiConfigManager.getConfig());
        toast.success('OpenRouter API 키가 성공적으로 설정되었습니다.');
        setOpenRouterKey('***설정됨***');
      } else {
        toast.error('유효하지 않은 API 키입니다.');
      }
    } catch (error) {
      toast.error('API 키 검증 중 오류가 발생했습니다.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveOpenRouterKey = () => {
    apiConfigManager.saveUserOpenRouterKey('');
    setConfig(apiConfigManager.getConfig());
    setOpenRouterKey('');
    toast.success('OpenRouter API 키가 제거되었습니다.');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">API 연결 설정</h1>
          <p className="text-gray-600">외부 서비스와의 연결을 관리합니다.</p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* KIPRIS 설정 - 읽기 전용 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              KIPRIS 특허 데이터베이스
            </CardTitle>
            <CardDescription>
              특허 정보 검색을 위한 공식 API (관리자 설정)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {config.kipris.isEnabled ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm ${config.kipris.isEnabled ? 'text-green-600' : 'text-red-600'}`}>
                  {config.kipris.isEnabled ? '연결됨' : '연결되지 않음'}
                </span>
              </div>
              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                서버 관리
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>API URL</Label>
              <Input 
                value={config.kipris.apiUrl} 
                disabled 
                className="bg-gray-50"
              />
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                KIPRIS API는 서버에서 관리되며, 별도 설정이 필요하지 않습니다.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* OpenRouter 설정 - 사용자 설정 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              OpenRouter AI 서비스
            </CardTitle>
            <CardDescription>
              AI 분석을 위한 LLM 서비스 (선택사항)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {config.openrouter.isEnabled ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                )}
                <span className={`text-sm ${config.openrouter.isEnabled ? 'text-green-600' : 'text-yellow-600'}`}>
                  {config.openrouter.isEnabled ? '연결됨' : '설정되지 않음'}
                </span>
              </div>
              <div className="text-xs text-gray-500 bg-blue-100 px-2 py-1 rounded">
                사용자 설정
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="openrouter-key">API 키</Label>
              <div className="flex gap-2">
                <Input
                  id="openrouter-key"
                  type={showKey ? "text" : "password"}
                  value={openRouterKey}
                  onChange={(e) => setOpenRouterKey(e.target.value)}
                  placeholder="OpenRouter API 키를 입력하세요"
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>API URL</Label>
              <Input 
                value={config.openrouter.apiUrl} 
                disabled 
                className="bg-gray-50"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleSaveOpenRouterKey}
                disabled={isValidating || !openRouterKey || openRouterKey === '***설정됨***'}
                className="flex-1"
              >
                {isValidating ? '검증 중...' : '저장'}
              </Button>
              {config.openrouter.isEnabled && (
                <Button 
                  variant="outline" 
                  onClick={handleRemoveOpenRouterKey}
                >
                  제거
                </Button>
              )}
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                OpenRouter API 키는 브라우저에 안전하게 저장되며, AI 분석 기능을 위해 필요합니다.
                <br />
                <a 
                  href="https://openrouter.ai/keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:underline mt-1"
                >
                  API 키 발급받기 <ExternalLink className="h-3 w-3" />
                </a>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* 사용법 안내 */}
        <Card>
          <CardHeader>
            <CardTitle>API 연결 가이드</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <h4 className="font-medium">KIPRIS API</h4>
                  <p className="text-sm text-gray-600">
                    특허 검색 기능에 필요합니다. 서버에서 자동으로 관리되므로 별도 설정이 필요하지 않습니다.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <h4 className="font-medium">OpenRouter API</h4>
                  <p className="text-sm text-gray-600">
                    AI 분석 기능에 필요합니다. OpenRouter에서 API 키를 발급받아 설정하세요.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
