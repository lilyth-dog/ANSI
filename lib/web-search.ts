import axios from 'axios';
import * as cheerio from 'cheerio';
import { parseHTML } from 'node-html-parser';

export interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
  publishedDate?: string;
  relevance: number;
}

export interface WebSearchParams {
  query: string;
  maxResults?: number;
  sources?: string[];
  dateRange?: {
    from: string;
    to: string;
  };
}

export class WebSearchService {
  private searchEngines = {
    google: 'https://www.google.com/search',
    bing: 'https://www.bing.com/search',
    duckduckgo: 'https://duckduckgo.com/html/'
  };

  /**
   * 웹 검색 수행
   */
  async searchWeb(params: WebSearchParams): Promise<WebSearchResult[]> {
    try {
      const results: WebSearchResult[] = [];
      
      // 여러 검색 엔진에서 검색
      if (params.sources?.includes('google') || !params.sources) {
        const googleResults = await this.searchGoogle(params);
        results.push(...googleResults);
      }
      
      if (params.sources?.includes('bing') || !params.sources) {
        const bingResults = await this.searchBing(params);
        results.push(...bingResults);
      }
      
      if (params.sources?.includes('duckduckgo') || !params.sources) {
        const ddgResults = await this.searchDuckDuckGo(params);
        results.push(...ddgResults);
      }

      // 중복 제거 및 관련성 순으로 정렬
      const uniqueResults = this.removeDuplicates(results);
      const sortedResults = uniqueResults.sort((a, b) => b.relevance - a.relevance);
      
      return sortedResults.slice(0, params.maxResults || 20);
    } catch (error) {
      console.error('웹 검색 오류:', error);
      return this.getDummySearchResults(params);
    }
  }

  /**
   * Google 검색
   */
  private async searchGoogle(params: WebSearchParams): Promise<WebSearchResult[]> {
    try {
      const response = await axios.get(this.searchEngines.google, {
        params: {
          q: params.query,
          num: Math.min(params.maxResults || 10, 10),
          hl: 'ko',
          gl: 'kr'
        },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      return this.parseGoogleResults(response.data, params.query);
    } catch (error) {
      console.error('Google 검색 오류:', error);
      return [];
    }
  }

  /**
   * Bing 검색
   */
  private async searchBing(params: WebSearchParams): Promise<WebSearchResult[]> {
    try {
      const response = await axios.get(this.searchEngines.bing, {
        params: {
          q: params.query,
          count: Math.min(params.maxResults || 10, 10),
          setlang: 'ko-KR'
        },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      return this.parseBingResults(response.data, params.query);
    } catch (error) {
      console.error('Bing 검색 오류:', error);
      return [];
    }
  }

  /**
   * DuckDuckGo 검색
   */
  private async searchDuckDuckGo(params: WebSearchParams): Promise<WebSearchResult[]> {
    try {
      const response = await axios.get(this.searchEngines.duckduckgo, {
        params: {
          q: params.query,
          t: 'h_',
          kl: 'kr-kr'
        },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      return this.parseDuckDuckGoResults(response.data, params.query);
    } catch (error) {
      console.error('DuckDuckGo 검색 오류:', error);
      return [];
    }
  }

  /**
   * Google 검색 결과 파싱
   */
  private parseGoogleResults(html: string, query: string): WebSearchResult[] {
    const results: WebSearchResult[] = [];
    const $ = cheerio.load(html);
    
    $('.g').each((i, element) => {
      const title = $(element).find('h3').text().trim();
      const url = $(element).find('a').attr('href') || '';
      const snippet = $(element).find('.VwiC3b').text().trim();
      
      if (title && url && snippet) {
        results.push({
          title,
          url,
          snippet,
          source: 'Google',
          relevance: this.calculateRelevance(query, title, snippet)
        });
      }
    });

    return results;
  }

  /**
   * Bing 검색 결과 파싱
   */
  private parseBingResults(html: string, query: string): WebSearchResult[] {
    const results: WebSearchResult[] = [];
    const $ = cheerio.load(html);
    
    $('.b_algo').each((i, element) => {
      const title = $(element).find('h2 a').text().trim();
      const url = $(element).find('h2 a').attr('href') || '';
      const snippet = $(element).find('.b_caption p').text().trim();
      
      if (title && url && snippet) {
        results.push({
          title,
          url,
          snippet,
          source: 'Bing',
          relevance: this.calculateRelevance(query, title, snippet)
        });
      }
    });

    return results;
  }

  /**
   * DuckDuckGo 검색 결과 파싱
   */
  private parseDuckDuckGoResults(html: string, query: string): WebSearchResult[] {
    const results: WebSearchResult[] = [];
    const $ = cheerio.load(html);
    
    $('.result').each((i, element) => {
      const title = $(element).find('.result__title a').text().trim();
      const url = $(element).find('.result__title a').attr('href') || '';
      const snippet = $(element).find('.result__snippet').text().trim();
      
      if (title && url && snippet) {
        results.push({
          title,
          url,
          snippet,
          source: 'DuckDuckGo',
          relevance: this.calculateRelevance(query, title, snippet)
        });
      }
    });

    return results;
  }

  /**
   * 관련성 점수 계산
   */
  private calculateRelevance(query: string, title: string, snippet: string): number {
    const queryWords = query.toLowerCase().split(/\s+/);
    const titleLower = title.toLowerCase();
    const snippetLower = snippet.toLowerCase();
    
    let score = 0;
    
    queryWords.forEach(word => {
      if (titleLower.includes(word)) score += 3;
      if (snippetLower.includes(word)) score += 1;
    });
    
    // 특허 관련 키워드 가중치
    const patentKeywords = ['특허', 'patent', '발명', 'invention', '기술', 'technology'];
    patentKeywords.forEach(keyword => {
      if (titleLower.includes(keyword) || snippetLower.includes(keyword)) {
        score += 2;
      }
    });
    
    return Math.min(score, 10);
  }

  /**
   * 중복 결과 제거
   */
  private removeDuplicates(results: WebSearchResult[]): WebSearchResult[] {
    const seen = new Set<string>();
    return results.filter(result => {
      const key = `${result.title}-${result.url}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  /**
   * 더미 검색 결과 (API 제한 시 사용)
   */
  private getDummySearchResults(params: WebSearchParams): WebSearchResult[] {
    return [
      {
        title: '특허청구범위 작성 가이드 - 한국특허정보원',
        url: 'https://www.kipris.or.kr/khome/main/base/guide/patent_claim.jsp',
        snippet: '특허청구범위 작성 방법과 주의사항에 대한 상세한 가이드입니다. 특허 출원 시 청구범위 작성이 가장 중요한 요소 중 하나입니다.',
        source: 'KIPRIS',
        relevance: 9
      },
      {
        title: 'AI 특허 분석 기술 동향 - 과학기술정보통신부',
        url: 'https://www.msit.go.kr/web/main/main.do',
        snippet: '인공지능을 활용한 특허 분석 기술의 최신 동향과 연구 방향에 대한 보고서입니다.',
        source: 'MSIT',
        relevance: 8
      },
      {
        title: '특허 맵 분석 방법론 - 특허청',
        url: 'https://www.kipo.go.kr/kpo/main/main.do',
        snippet: '특허 맵을 통한 기술 동향 분석과 경쟁사 분석 방법에 대한 가이드입니다.',
        source: 'KIPO',
        relevance: 7
      }
    ];
  }

  /**
   * 특정 웹사이트에서 정보 추출
   */
  async extractContentFromUrl(url: string): Promise<{ title: string; content: string; links: string[] }> {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      const $ = cheerio.load(response.data);
      
      // 메타 태그에서 제목 추출
      const title = $('title').text().trim() || $('h1').first().text().trim();
      
      // 본문 내용 추출 (메인 콘텐츠 영역)
      const content = $('main, .content, .main, article, .post-content').text().trim() || 
                     $('p').text().trim();
      
      // 링크 추출
      const links: string[] = [];
      $('a[href]').each((i, element) => {
        const href = $(element).attr('href');
        if (href && href.startsWith('http')) {
          links.push(href);
        }
      });

      return {
        title: title.substring(0, 200),
        content: content.substring(0, 2000),
        links: [...new Set(links)].slice(0, 20)
      };
    } catch (error) {
      console.error('웹페이지 내용 추출 오류:', error);
      return {
        title: '내용을 가져올 수 없습니다',
        content: '',
        links: []
      };
    }
  }
}

// 싱글톤 인스턴스 생성
export const webSearchService = new WebSearchService();
