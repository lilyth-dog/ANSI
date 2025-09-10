'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Database, 
  Brain, 
  CheckCircle, 
  AlertCircle, 
  Info,
  ExternalLink
} from 'lucide-react';
import { apiConfigManager } from '@/lib/api-config';

interface DataSourceIndicatorProps {
  type: 'search' | 'analysis';
  className?: string;
}

export function DataSourceIndicator({ type, className = '' }: DataSourceIndicatorProps) {
  const [config, setConfig] = useState(apiConfigManager.getConfig());
  const [isRealData, setIsRealData] = useState(false);

  useEffect(() => {
    if (type === 'search') {
      setIsRealData(config.kipris.isEnabled);
    } else if (type === 'analysis') {
      setIsRealData(config.openrouter.isEnabled);
    }
  }, [config, type]);

  const getIndicatorContent = () => {
    if (type === 'search') {
      return {
        icon: <Database className="h-4 w-4" />,
        title: '특허 데이터',
        realData: {
          text: '실제 KIPRIS 데이터',
          description: '한국특허정보원의 실시간 특허 데이터를 제공합니다.'
        },
        demoData: {
          text: '데모 데이터',
          description: '실제 KIPRIS API 키를 설정하면 실시간 데이터를 확인할 수 있습니다.'
        }
      };
    } else {
      return {
        icon: <Brain className="h-4 w-4" />,
        title: 'AI 분석',
        realData: {
          text: '실제 AI 분석',
          description: 'OpenRouter API를 통한 실시간 AI 분석 결과입니다.'
        },
        demoData: {
          text: '데모 분석',
          description: 'OpenRouter API 키를 설정하면 실제 AI 분석을 받을 수 있습니다.'
        }
      };
    }
  };

  const content = getIndicatorContent();
  const dataInfo = isRealData ? content.realData : content.demoData;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        {content.icon}
        <span className="text-sm font-medium">{content.title}</span>
        <Badge 
          variant={isRealData ? "default" : "secondary"}
          className="flex items-center gap-1"
        >
          {isRealData ? (
            <CheckCircle className="h-3 w-3" />
          ) : (
            <AlertCircle className="h-3 w-3" />
          )}
          {dataInfo.text}
        </Badge>
      </div>
      
      <Alert className="text-xs">
        <Info className="h-3 w-3" />
        <AlertDescription>
          {dataInfo.description}
          {!isRealData && (
            <div className="mt-1">
              <a 
                href="/settings/api" 
                className="inline-flex items-center gap-1 text-blue-600 hover:underline"
              >
                API 설정하기 <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
}

export default DataSourceIndicator;
