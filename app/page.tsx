import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  TrendingUp, 
  Shield, 
  Users, 
  FileText, 
  BarChart3, 
  ArrowRight,
  CheckCircle,
  Zap,
  Target,
  Globe,
  Award
} from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Search,
      title: '특허 정보 색인',
      description: 'KIPRIS API를 활용한 실시간 특허 데이터 검색 및 분석',
      color: 'text-blue-600'
    },
    {
      icon: TrendingUp,
      title: 'AI 기반 분석',
      description: 'OpenRouter를 통한 ChatGPT OSS 모델 활용 특허 평가',
      color: 'text-green-600'
    },
    {
      icon: Shield,
      title: '위험도 평가',
      description: '특허 침해, 유효성, 집행 위험 종합 분석',
      color: 'text-orange-600'
    },
    {
      icon: Users,
      title: '스타트업 컨설팅',
      description: '맞춤형 특허 전략 및 시장 진입 로드맵',
      color: 'text-purple-600'
    },
    {
      icon: BarChart3,
      title: '경쟁 환경 분석',
      description: '경쟁사 특허 현황 및 시장 포지셔닝',
      color: 'text-indigo-600'
    },
    {
      icon: FileText,
      title: '컨설팅 리포트',
      description: 'AI 기반 종합 분석 결과 및 권장사항',
      color: 'text-teal-600'
    }
  ];

  const stats = [
    { label: '분석된 특허', value: '10,000+', icon: Search },
    { label: 'AI 분석 정확도', value: '95%', icon: TrendingUp },
    { label: '컨설팅 성공률', value: '89%', icon: Users },
    { label: '고객 만족도', value: '4.8/5.0', icon: Award }
  ];

  const benefits = [
    '실시간 특허 데이터 검색 및 분석',
    'AI 기반 객관적 특허 평가',
    '스타트업 맞춤형 전략 수립',
    '경쟁 환경 및 시장 분석',
    '리스크 관리 및 대응 방안',
    '투자 유치 지원 자료'
  ];

  return (
    <div className="min-h-screen bg-gradient-patent">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container-patent py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
              <Zap className="w-4 h-4 mr-2" />
              AI 기반 특허 컨설팅 플랫폼
            </Badge>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              특허로{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                미래를
              </span>
              {' '}만들다
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              KIPRIS API를 활용한 특허 정보 색인 및 신규 스타트업의 초기 시장 진입을 위한
              다각적인 분석과 특허 출원 가이드라인을 제공합니다.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="btn-primary text-lg px-8 py-4">
                <Link href="/patents/search">
                  <Search className="mr-2 h-5 w-5" />
                  특허 검색 시작
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="btn-outline text-lg px-8 py-4">
                <Link href="/consulting">
                  <FileText className="mr-2 h-5 w-5" />
                  컨설팅 신청
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="container-patent">
          <div className="grid-patent-4">
            {stats.map((stat, index) => (
              <Card key={index} className="card-patent text-center p-6 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-0">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <stat.icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container-patent">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              강력한 기능으로 특허 전략을 완성하세요
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              AI 기술과 특허 전문성을 결합하여 스타트업의 성공적인 시장 진입을 지원합니다
            </p>
          </div>
          
          <div className="grid-patent-3">
            {features.map((feature, index) => (
              <Card key={index} className="card-patent-hover p-8 animate-scale-in" style={{ animationDelay: `${index * 150}ms` }}>
                <CardHeader className="p-0 mb-6">
                  <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container-patent">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-up">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                왜 PatentAI인가요?
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                특허 컨설팅의 새로운 패러다임을 제시합니다. 
                AI 기술과 전문성을 결합하여 정확하고 신뢰할 수 있는 분석 결과를 제공합니다.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <Button asChild className="btn-primary mt-8">
                <Link href="/dashboard">
                  대시보드 둘러보기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="relative animate-fade-in">
              <div className="relative z-10">
                <Card className="card-patent-hover p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Target className="w-12 h-12 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">목표 달성률</h3>
                    <div className="text-6xl font-bold text-primary mb-2">94%</div>
                    <p className="text-gray-600">고객 만족도 기반</p>
                  </div>
                </Card>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
                <Globe className="w-8 h-8 text-accent" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container-patent text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            지금 시작하세요
          </h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
            AI 기반 특허 컨설팅으로 스타트업의 성공적인 시장 진입을 지원합니다.
            무료 체험으로 PatentAI의 강력한 기능을 경험해보세요.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-4">
              <Link href="/patents/search">
                <Search className="mr-2 h-5 w-5" />
                무료 체험하기
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-blue-600">
              <Link href="/consulting">
                <Users className="mr-2 h-5 w-5" />
                컨설팅 문의
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
