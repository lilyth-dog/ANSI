'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, FileText, Calendar, User, Building, Heart, History, Download, Star, Sparkles } from 'lucide-react';
import { Patent, PatentStatus, SearchHistory } from '@/types';
import { storageService } from '@/lib/storage';
import DataSourceIndicator from '@/components/data-source-indicator';

export default function PatentSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Patent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [favoritePatents, setFavoritePatents] = useState<Patent[]>([]);
  const [filters, setFilters] = useState({
    status: 'all',
    dateFrom: '',
    dateTo: '',
    classification: ''
  });

  const mockSearchResults: Patent[] = [
    {
      id: 'KR1020240012345',
      title: 'AI 기반 감정 분석 시스템 및 방법',
      abstract: '본 발명은 음성 데이터를 분석하여 사용자의 감정 상태를 실시간으로 파악하는 AI 기반 감정 분석 시스템에 관한 것이다.',
      inventors: ['김철수', '이영희'],
      applicants: ['테크스타트업 주식회사'],
      applicationDate: '2024-01-15',
      publicationDate: '2024-03-20',
      status: PatentStatus.PUBLISHED,
      classification: ['G06N 3/08', 'G10L 25/63'],
      claims: ['청구항 1: 음성 데이터를 수신하는 단계...'],
      description: '상세한 기술 설명...',
      drawings: ['도면1', '도면2'],
      legalStatus: 'active',
      citations: ['KR1020230056789'],
      familyPatents: ['US20240012345']
    },
    {
      id: 'KR1020240012346',
      title: '블록체인 기반 특허 관리 시스템',
      abstract: '특허 정보를 블록체인에 저장하여 위변조를 방지하고 투명성을 확보하는 시스템이다.',
      inventors: ['박민수'],
      applicants: ['블록체인테크 주식회사'],
      applicationDate: '2024-01-20',
      publicationDate: '2024-03-25',
      status: PatentStatus.PENDING,
      classification: ['G06Q 50/18', 'H04L 9/32'],
      claims: ['청구항 1: 블록체인 노드를 구성하는 단계...'],
      description: '상세한 기술 설명...',
      drawings: ['도면1'],
      legalStatus: 'active',
      citations: [],
      familyPatents: []
    }
  ];

  // 컴포넌트 마운트 시 로컬 스토리지에서 데이터 로드
  useEffect(() => {
    loadLocalData();
  }, []);

  const loadLocalData = async () => {
    try {
      await storageService.init();
      const [history, favorites] = await Promise.all([
        storageService.getSearchHistory(10),
        storageService.getFavoritePatents()
      ]);
      setSearchHistory(history);
      setFavoritePatents(favorites);
    } catch (error) {
      console.error('로컬 데이터 로드 오류:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    
    // 실제 구현에서는 KIPRIS API 호출
    setTimeout(async () => {
      setSearchResults(mockSearchResults);
      
      // 검색 히스토리 저장
      try {
        await storageService.saveSearchHistory(searchQuery, mockSearchResults, mockSearchResults.length);
        await loadLocalData(); // 히스토리 새로고침
      } catch (error) {
        console.error('검색 히스토리 저장 오류:', error);
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const handleFilterChange = (key: string, value: string) => {
    // "all" 값을 빈 문자열로 변환
    const filterValue = value === 'all' ? '' : value;
    setFilters(prev => ({ ...prev, [key]: filterValue }));
  };

  const toggleFavorite = async (patent: Patent) => {
    try {
      const isFavorite = favoritePatents.some(fp => fp.id === patent.id);
      
      if (isFavorite) {
        await storageService.removeFavoritePatent(patent.id);
      } else {
        await storageService.addFavoritePatent(patent);
      }
      
      await loadLocalData(); // 즐겨찾기 목록 새로고침
    } catch (error) {
      console.error('즐겨찾기 토글 오류:', error);
    }
  };

  const exportSearchResults = () => {
    const data = {
      query: searchQuery,
      results: searchResults,
      filters,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patent-search-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: PatentStatus) => {
    const statusConfig = {
      [PatentStatus.PENDING]: { label: '출원', className: 'badge-status pending' },
      [PatentStatus.PUBLISHED]: { label: '공개', className: 'badge-status published' },
      [PatentStatus.GRANTED]: { label: '등록', className: 'badge-status granted' },
      [PatentStatus.REJECTED]: { label: '거절', className: 'badge-status rejected' },
      [PatentStatus.EXPIRED]: { label: '만료', className: 'badge-status expired' }
    };
    
    const config = statusConfig[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const isFavorite = (patentId: string) => {
    return favoritePatents.some(fp => fp.id === patentId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container-patent py-12">
        {/* Premium Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-200/50 text-blue-800 rounded-full text-sm font-semibold mb-6 shadow-sm backdrop-blur-sm">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
            <Search className="h-4 w-4 text-blue-600" />
            특허 검색
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            특허를 검색하고
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> AI 초안</span>을 생성하세요
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            특허를 검색하고 AI가 자동으로 특허 초안을 작성합니다
          </p>
        </div>

        {/* Premium Search Form */}
        <div className="max-w-3xl mx-auto mb-16">
          <Card className="bg-white/80 backdrop-blur-xl shadow-xl border-0 rounded-3xl overflow-hidden">
            <CardContent className="p-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">특허 검색하기</h2>
                <p className="text-gray-600 text-lg">특허명, 발명자, 출원인 등으로 검색하세요</p>
              </div>

              <div className="space-y-6">
                <div className="relative">
                  <Input
                    placeholder="예: 인공지능, 스마트폰, 김철수..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="text-lg h-16 pl-6 pr-16 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 bg-white/50 backdrop-blur-sm"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <Search className="h-6 w-6 text-gray-400" />
                  </div>
                </div>

                <Button
                  onClick={handleSearch}
                  disabled={isLoading || !searchQuery.trim()}
                  className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                      <span className="font-semibold">검색 중...</span>
                    </>
                  ) : (
                    <>
                      <Search className="mr-3 h-6 w-6" />
                      <span className="font-semibold">특허 검색하기</span>
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Searches */}
        {searchHistory.length > 0 && (
          <div className="max-w-2xl mx-auto mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 검색</h3>
            <div className="flex flex-wrap gap-2">
              {searchHistory.slice(0, 8).map((history) => (
                <button
                  key={history.id}
                  onClick={() => {
                    setSearchQuery(history.query);
                    handleSearch();
                  }}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors"
                >
                  {history.query}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Premium Search Results */}
        {searchResults.length > 0 && (
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                검색 결과 <span className="text-blue-600">({searchResults.length}건)</span>
              </h2>
              <p className="text-gray-600 text-lg">원하는 특허를 선택해 AI 초안을 생성하세요</p>
            </div>

            <div className="space-y-6">
              {searchResults.map((patent, index) => (
                <Card key={patent.id} className="group bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl border-0 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          {getStatusBadge(patent.status)}
                          <span className="text-sm text-gray-500 font-mono bg-gray-100 px-3 py-1 rounded-full">{patent.id}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors leading-tight">
                          {patent.title}
                        </h3>
                        <p className="text-gray-600 text-base line-clamp-3 mb-4 leading-relaxed">
                          {patent.abstract}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                            <span>발명자: {patent.inventors.join(', ')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                            <span>출원인: {patent.applicants.join(', ')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                            <span>출원일: {patent.applicationDate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3 ml-6">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(patent)}
                          className={`rounded-xl px-3 py-2 transition-all duration-200 ${
                            isFavorite(patent.id)
                              ? 'text-red-500 bg-red-50 hover:bg-red-100'
                              : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                          }`}
                        >
                          <Heart className={`h-5 w-5 ${isFavorite(patent.id) ? 'fill-current' : ''}`} />
                        </Button>
                        <Button
                          onClick={() => window.open(`/patents/draft?patentId=${patent.id}`, '_blank')}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold"
                        >
                          <Sparkles className="h-5 w-5 mr-2" />
                          AI 초안 생성
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Premium Empty State */}
        {searchResults.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
              <Search className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">특허를 검색해보세요</h3>
            <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
              위의 검색창에 키워드를 입력하고 검색 버튼을 클릭하세요.
              AI가 자동으로 특허 초안을 작성해드립니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
