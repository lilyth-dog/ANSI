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
    <div className="min-h-screen bg-gradient-patent">
      <div className="container-patent py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">AI 기반 특허 검색</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            특허 검색
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            KIPRIS API를 활용한 실시간 특허 정보 검색 및 분석
          </p>
        </div>

        {/* 검색 폼 */}
        <Card className="card-patent-hover mb-12 animate-slide-up">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Search className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">특허 검색</CardTitle>
            <CardDescription className="text-lg">
              키워드, 출원인, 발명자, IPC 분류 등으로 특허를 검색할 수 있습니다
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="searchQuery" className="text-sm font-medium">검색어</Label>
                <Input
                  id="searchQuery"
                  placeholder="특허명, 초록, 청구항 등"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="input-patent"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">상태</Label>
                <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                  <SelectTrigger className="input-patent">
                    <SelectValue placeholder="전체" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="pending">출원</SelectItem>
                    <SelectItem value="published">공개</SelectItem>
                    <SelectItem value="granted">등록</SelectItem>
                    <SelectItem value="rejected">거절</SelectItem>
                    <SelectItem value="expired">만료</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateFrom" className="text-sm font-medium">출원일 시작</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="input-patent"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateTo" className="text-sm font-medium">출원일 종료</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="input-patent"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSearch} disabled={isLoading} className="btn-primary flex-1">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    검색 중...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    검색
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => setFilters({
                status: '',
                dateFrom: '',
                dateTo: '',
                classification: ''
              })} className="btn-outline">
                <Filter className="mr-2 h-4 w-4" />
                필터 초기화
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 데이터 소스 표시 */}
        <Card className="card-patent mb-8 animate-slide-up">
          <CardContent className="pt-6">
            <DataSourceIndicator type="search" />
          </CardContent>
        </Card>

        {/* 검색 히스토리 */}
        {searchHistory.length > 0 && (
          <Card className="card-patent mb-8 animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                최근 검색 기록
              </CardTitle>
              <CardDescription>최근에 검색한 키워드들을 확인할 수 있습니다</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {searchHistory.slice(0, 10).map((history) => (
                  <Button
                    key={history.id}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery(history.query);
                      handleSearch();
                    }}
                    className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {history.query} ({history.resultCount}건)
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 즐겨찾기 특허 */}
        {favoritePatents.length > 0 && (
          <Card className="card-patent mb-8 animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-accent" />
                즐겨찾기 특허
              </CardTitle>
              <CardDescription>저장해둔 특허들을 확인할 수 있습니다</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoritePatents.slice(0, 6).map((patent) => (
                  <div key={patent.id} className="card-patent-hover p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-sm text-clamp-2">{patent.title}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(patent)}
                        className="text-accent hover:text-accent/80 hover:bg-accent/10"
                      >
                        <Heart className="h-4 w-4 fill-current" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-600 text-clamp-2 mb-3">{patent.abstract}</p>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(patent.status)}
                      <span className="text-xs text-gray-500 font-mono">{patent.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 검색 결과 */}
        {searchResults.length > 0 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">검색 결과 ({searchResults.length}건)</h2>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Filter className="h-4 w-4" />
                  <span>정렬: 출원일순</span>
                </div>
                <Button variant="outline" size="sm" onClick={exportSearchResults} className="btn-outline">
                  <Download className="h-4 w-4 mr-2" />
                  내보내기
                </Button>
              </div>
            </div>

            {searchResults.map((patent, index) => (
              <Card key={patent.id} className="search-result-card animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {getStatusBadge(patent.status)}
                      <span className="text-sm text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">{patent.id}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 text-clamp-2">
                      {patent.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-clamp-2 leading-relaxed">
                      {patent.abstract}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(patent)}
                      className={isFavorite(patent.id) ? 'text-accent hover:text-accent/80' : 'text-gray-400 hover:text-accent'}
                    >
                      <Heart className={`h-5 w-5 ${isFavorite(patent.id) ? 'fill-current' : ''}`} />
                    </Button>
                    <Button variant="outline" size="sm" className="btn-outline">
                      <FileText className="h-4 w-4 mr-2" />
                      상세보기
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">발명자:</span>
                    <span className="font-medium">{patent.inventors.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">출원인:</span>
                    <span className="font-medium">{patent.applicants.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">출원일:</span>
                    <span className="font-medium">{patent.applicationDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">IPC:</span>
                    <span className="font-medium">{patent.classification.join(', ')}</span>
                  </div>
                </div>

                {patent.citations.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-medium text-gray-700">인용 특허:</span>
                      <span className="text-sm text-gray-500">({patent.citations.length}건)</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {patent.citations.map((citation) => (
                        <Badge key={citation} variant="secondary" className="text-xs">
                          {citation}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* 검색 안내 */}
        {searchResults.length === 0 && !isLoading && (
          <Card className="text-center py-16 animate-fade-in">
            <CardContent>
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">특허를 검색해보세요</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                위의 검색 폼을 사용하여 특허를 검색하거나, 필터를 적용하여 원하는 결과를 찾아보세요.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
