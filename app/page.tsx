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
  Award,
  Crown,
  Sparkles,
  Building,
  Lock
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
    { label: '플랫폼 출시', value: '2024', icon: Search, color: 'text-blue-600' },
    { label: '지원 기술', value: 'AI + KIPRIS', icon: TrendingUp, color: 'text-green-600' },
    { label: '서비스 대상', value: '스타트업', icon: Users, color: 'text-purple-600' },
    { label: '보안 인증', value: 'ISO 27001', icon: Award, color: 'text-orange-600' }
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
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full mb-8">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-800">Enterprise-Grade AI Patent Platform</span>
            </div>
            
            <h1 className="text-6xl lg:text-8xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-8 leading-tight">
              특허의 미래를<br />
              <span className="text-blue-600">AI로 혁신하다</span>
            </h1>
            
            <p className="text-2xl text-gray-700 max-w-4xl mx-auto mb-12 leading-relaxed font-light">
              <span className="font-semibold text-gray-900">PatentAI</span>는 KIPRIS 공식 API와 AI 기술을 활용하여<br />
              스타트업의 특허 전략을 <span className="text-blue-600 font-semibold">체계적으로</span> 지원합니다.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link href="/patents/search">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-10 py-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <Search className="mr-3 h-6 w-6" />
                  무료로 시작하기
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="border-2 border-gray-300 hover:border-blue-500 text-lg px-10 py-5 rounded-xl hover:bg-blue-50 transition-all duration-300">
                  <Crown className="mr-3 h-6 w-6" />
                  프리미엄 체험
                </Button>
              </Link>
            </div>

            {/* Platform Features */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
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

      {/* Enterprise Trust Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-patent">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              엔터프라이즈급 신뢰성
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              대기업과 스타트업 모두가 신뢰하는 PatentAI의 보안과 안정성
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center p-8 border-2 border-green-200 bg-green-50">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-green-600" />
              </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">보안 우선</h3>
            <p className="text-gray-600">사용자 데이터 보호를 최우선으로 하는 안전한 서비스</p>
            </Card>
            
            <Card className="text-center p-8 border-2 border-blue-200 bg-blue-50">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building className="w-8 h-8 text-blue-600" />
              </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">안정적 서비스</h3>
            <p className="text-gray-600">신뢰할 수 있는 인프라로 제공하는 안정적인 서비스</p>
            </Card>
            
            <Card className="text-center p-8 border-2 border-purple-200 bg-purple-50">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">데이터 보호</h3>
            <p className="text-gray-600">사용자 개인정보와 데이터를 안전하게 보호합니다</p>
            </Card>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-4 px-8 py-4 bg-white rounded-full shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">안전한 데이터 처리</span>
              </div>
              <div className="w-px h-6 bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">신뢰할 수 있는 서비스</span>
              </div>
              <div className="w-px h-6 bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">사용자 중심 설계</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container-patent text-center relative z-10">
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            지금 시작하세요
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
            AI 기반 특허 컨설팅으로 스타트업의 성공적인 시장 진입을 지원합니다.<br />
            무료 체험으로 PatentAI의 강력한 기능을 경험해보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/patents/search">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-10 py-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Search className="mr-3 h-6 w-6" />
                무료로 시작하기
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-10 py-5 rounded-xl transition-all duration-300">
                <Crown className="mr-3 h-6 w-6" />
                프리미엄 체험
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
