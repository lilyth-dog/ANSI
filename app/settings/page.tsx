'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  User, 
  Bell, 
  Palette, 
  Globe, 
  Database, 
  Shield, 
  Download,
  Upload,
  Trash2,
  Save,
  CheckCircle,
  AlertTriangle,
  Info,
  Moon,
  Sun,
  Monitor,
  Languages,
  Volume2,
  VolumeX
} from 'lucide-react';
import { UserSettings } from '@/types';
import { storageService } from '@/lib/storage';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    userId: 'default-user',
    theme: 'system',
    language: 'ko',
    notifications: {
      email: true,
      browser: true,
      analysisComplete: true,
      newRecommendations: true
    },
    display: {
      resultsPerPage: 20,
      showAbstracts: true,
      showCitations: true,
      defaultSort: 'relevance'
    },
    analysis: {
      defaultModel: 'gpt-4o-mini',
      autoSave: true,
      includeRiskAssessment: true,
      includeCompetitiveAnalysis: true
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // 컴포넌트 마운트 시 설정 로드
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      await storageService.init();
      const savedSettings = await storageService.getUserSettings('default-user');
      if (savedSettings) {
        setSettings(savedSettings);
      }
    } catch (error) {
      console.error('설정 로드 오류:', error);
    }
  };

  const handleSettingChange = (category: keyof UserSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      },
      updatedAt: new Date().toISOString()
    }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value
      },
      updatedAt: new Date().toISOString()
    }));
  };

  const handleDisplayChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      display: {
        ...prev.display,
        [field]: value
      },
      updatedAt: new Date().toISOString()
    }));
  };

  const handleAnalysisChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      analysis: {
        ...prev.analysis,
        [field]: value
      },
      updatedAt: new Date().toISOString()
    }));
  };

  const saveSettings = async () => {
    setIsLoading(true);
    setSaveStatus('saving');
    
    try {
      await storageService.saveUserSettings(settings);
      setSaveStatus('saved');
      toast.success('설정이 저장되었습니다!');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('설정 저장 오류:', error);
      setSaveStatus('error');
      toast.error('설정 저장 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetSettings = () => {
    if (confirm('모든 설정을 기본값으로 초기화하시겠습니까?')) {
      setSettings({
        userId: 'default-user',
        theme: 'system',
        language: 'ko',
        notifications: {
          email: true,
          browser: true,
          analysisComplete: true,
          newRecommendations: true
        },
        display: {
          resultsPerPage: 20,
          showAbstracts: true,
          showCitations: true,
          defaultSort: 'relevance'
        },
        analysis: {
          defaultModel: 'gpt-4o-mini',
          autoSave: true,
          includeRiskAssessment: true,
          includeCompetitiveAnalysis: true
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      toast.success('설정이 초기화되었습니다.');
    }
  };

  const exportSettings = () => {
    const data = {
      settings,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patent-ai-settings-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.settings) {
          setSettings(data.settings);
          toast.success('설정이 가져와졌습니다.');
        }
      } catch (error) {
        toast.error('설정 파일을 읽는 중 오류가 발생했습니다.');
      }
    };
    reader.readAsText(file);
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
        return '설정 저장';
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

  return (
    <div className="min-h-screen bg-gradient-patent">
      <div className="container-patent py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Settings className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">시스템 설정</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            설정
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            애플리케이션의 다양한 설정을 관리하고 개인화된 사용자 경험을 구성하세요
          </p>
        </div>

        {/* 저장 버튼 */}
        <div className="flex gap-4 mb-8 justify-center">
          <Button 
            onClick={saveSettings} 
            disabled={isLoading}
            variant={getSaveButtonVariant()}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {getSaveButtonText()}
          </Button>
          <Button 
            variant="outline" 
            onClick={exportSettings}
            className="btn-outline"
          >
            <Download className="h-4 w-4 mr-2" />
            설정 내보내기
          </Button>
          <Button 
            variant="outline" 
            onClick={resetSettings}
            className="btn-outline text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            초기화
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 일반 설정 */}
          <Card className="card-patent-hover animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                일반 설정
              </CardTitle>
              <CardDescription>기본 사용자 설정 및 환경 구성</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="theme">테마</Label>
                <Select value={settings.theme} onValueChange={(value) => handleSettingChange('theme', 'theme', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        라이트 모드
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        다크 모드
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        시스템 설정
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">언어</Label>
                <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', 'language', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ko">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        한국어
                      </div>
                    </SelectItem>
                    <SelectItem value="en">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        English
                      </div>
                    </SelectItem>
                    <SelectItem value="ja">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        日本語
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">데이터 관리</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="autoSave">자동 저장</Label>
                    <Switch
                      id="autoSave"
                      checked={settings.analysis.autoSave}
                      onCheckedChange={(checked) => handleAnalysisChange('autoSave', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 알림 설정 */}
          <Card className="card-patent-hover animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                알림 설정
              </CardTitle>
              <CardDescription>알림 및 알림 방식 설정</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="emailNotifications">이메일 알림</Label>
                    <p className="text-sm text-gray-500">중요한 업데이트를 이메일로 받기</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="browserNotifications">브라우저 알림</Label>
                    <p className="text-sm text-gray-500">브라우저 푸시 알림 받기</p>
                  </div>
                  <Switch
                    id="browserNotifications"
                    checked={settings.notifications.browser}
                    onCheckedChange={(checked) => handleNotificationChange('browser', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="analysisComplete">분석 완료 알림</Label>
                    <p className="text-sm text-gray-500">AI 분석 완료 시 알림</p>
                  </div>
                  <Switch
                    id="analysisComplete"
                    checked={settings.notifications.analysisComplete}
                    onCheckedChange={(checked) => handleNotificationChange('analysisComplete', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="newRecommendations">새 권장사항 알림</Label>
                    <p className="text-sm text-gray-500">새로운 권장사항 생성 시 알림</p>
                  </div>
                  <Switch
                    id="newRecommendations"
                    checked={settings.notifications.newRecommendations}
                    onCheckedChange={(checked) => handleNotificationChange('newRecommendations', checked)}
                  />
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  알림 설정은 브라우저의 알림 권한이 허용된 경우에만 작동합니다.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* 표시 설정 */}
          <Card className="card-patent-hover animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                표시 설정
              </CardTitle>
              <CardDescription>검색 결과 및 데이터 표시 방식 설정</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="resultsPerPage">페이지당 결과 수</Label>
                <Select 
                  value={settings.display.resultsPerPage.toString()} 
                  onValueChange={(value) => handleDisplayChange('resultsPerPage', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10개</SelectItem>
                    <SelectItem value="20">20개</SelectItem>
                    <SelectItem value="50">50개</SelectItem>
                    <SelectItem value="100">100개</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultSort">기본 정렬 방식</Label>
                <Select 
                  value={settings.display.defaultSort} 
                  onValueChange={(value) => handleDisplayChange('defaultSort', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">관련도순</SelectItem>
                    <SelectItem value="date">날짜순</SelectItem>
                    <SelectItem value="title">제목순</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">표시 옵션</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="showAbstracts">초록 표시</Label>
                    <Switch
                      id="showAbstracts"
                      checked={settings.display.showAbstracts}
                      onCheckedChange={(checked) => handleDisplayChange('showAbstracts', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="showCitations">인용 정보 표시</Label>
                    <Switch
                      id="showCitations"
                      checked={settings.display.showCitations}
                      onCheckedChange={(checked) => handleDisplayChange('showCitations', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 분석 설정 */}
          <Card className="card-patent-hover animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                분석 설정
              </CardTitle>
              <CardDescription>AI 분석 및 특허 평가 설정</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="defaultModel">기본 AI 모델</Label>
                <Select 
                  value={settings.analysis.defaultModel} 
                  onValueChange={(value) => handleAnalysisChange('defaultModel', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                    <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                    <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">분석 옵션</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="includeRiskAssessment">위험도 평가 포함</Label>
                    <Switch
                      id="includeRiskAssessment"
                      checked={settings.analysis.includeRiskAssessment}
                      onCheckedChange={(checked) => handleAnalysisChange('includeRiskAssessment', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="includeCompetitiveAnalysis">경쟁 분석 포함</Label>
                    <Switch
                      id="includeCompetitiveAnalysis"
                      checked={settings.analysis.includeCompetitiveAnalysis}
                      onCheckedChange={(checked) => handleAnalysisChange('includeCompetitiveAnalysis', checked)}
                    />
                  </div>
                </div>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  더 정확한 분석을 위해서는 위험도 평가와 경쟁 분석을 모두 활성화하는 것을 권장합니다.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* 데이터 관리 */}
          <Card className="card-patent-hover animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                데이터 관리
              </CardTitle>
              <CardDescription>로컬 데이터 백업 및 복원</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">데이터 현황</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    모든 데이터는 브라우저의 IndexedDB에 안전하게 저장됩니다.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    onClick={() => document.getElementById('import-settings')?.click()}
                    className="w-full btn-outline"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    설정 가져오기
                  </Button>
                  <input
                    id="import-settings"
                    type="file"
                    accept=".json"
                    onChange={importSettings}
                    className="hidden"
                  />

                  <Button 
                    variant="outline" 
                    onClick={exportSettings}
                    className="w-full btn-outline"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    설정 내보내기
                  </Button>
                </div>
              </div>

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  정기적으로 설정을 백업하여 데이터 손실을 방지하세요.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* 시스템 정보 */}
          <Card className="card-patent-hover animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                시스템 정보
              </CardTitle>
              <CardDescription>애플리케이션 및 브라우저 정보</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">애플리케이션 버전</span>
                  <Badge variant="secondary">v1.0.0</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">브라우저</span>
                  <span className="text-sm font-medium">{navigator.userAgent.split(' ')[0]}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">언어</span>
                  <span className="text-sm font-medium">{navigator.language}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">플랫폼</span>
                  <span className="text-sm font-medium">{navigator.platform}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">온라인 상태</span>
                  <Badge variant={navigator.onLine ? 'default' : 'destructive'}>
                    {navigator.onLine ? '온라인' : '오프라인'}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  설정 마지막 업데이트: {new Date(settings.updatedAt).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}