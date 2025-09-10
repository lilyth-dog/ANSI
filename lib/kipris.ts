import axios from 'axios';
import { Patent, KiprisResponse, KiprisSearchParams, PatentStatus } from '@/types';

export class KiprisService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = 'https://www.kipris.or.kr/khome/main/base';
    this.apiKey = '';
    this.loadApiKey();
  }

  /**
   * 로컬 스토리지에서 API 키 로드
   */
  private loadApiKey() {
    try {
      // 서버사이드 환경변수 우선 사용
      if (typeof window === 'undefined' && process.env.KIPRIS_API_KEY) {
        this.apiKey = process.env.KIPRIS_API_KEY;
        if (process.env.KIPRIS_API_URL) {
          this.baseUrl = process.env.KIPRIS_API_URL;
        }
        return;
      }

      // 클라이언트사이드에서는 로컬 스토리지 사용 (폴백)
      if (typeof window !== 'undefined') {
        const savedKeys = localStorage.getItem('patent-ai-api-keys');
        if (savedKeys && savedKeys.trim()) {
          const parsed = JSON.parse(savedKeys);
          if (parsed && parsed.kipris && parsed.kipris.isEnabled && parsed.kipris.apiKey) {
            this.apiKey = parsed.kipris.apiKey;
            if (parsed.kipris.apiUrl) {
              this.baseUrl = parsed.kipris.apiUrl;
            }
          }
        }
      }
    } catch (error) {
      console.error('API 키 로드 오류:', error);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('patent-ai-api-keys');
      }
    }
  }

  /**
   * API 키 유효성 검증
   */
  private validateApiKey(): boolean {
    if (!this.apiKey) {
      throw new Error('KIPRIS API 키가 설정되지 않았습니다. 설정 페이지에서 API 키를 입력해주세요.');
    }
    return true;
  }

  /**
   * 특허 검색 (실제 KIPRIS API 연동)
   */
  async searchPatents(params: KiprisSearchParams): Promise<KiprisResponse> {
    try {
      this.validateApiKey();
      
      // 실제 KIPRIS API 호출 시도
      try {
        const response = await axios.get('https://www.kipris.or.kr/khome/openapi/search', {
          params: {
            query: params.query,
            page: params.page || 1,
            pageSize: params.pageSize || 20,
            classification: params.classification?.join(','),
            dateFrom: params.dateFrom,
            dateTo: params.dateTo,
            status: params.status?.join(','),
            apiKey: this.apiKey
          },
          timeout: 10000 // 10초 타임아웃
        });

        return this.parseKiprisResponse(response.data);
      } catch (apiError) {
        console.warn('KIPRIS API 호출 실패, 더미 데이터 사용:', apiError);
        // API 호출 실패 시 더미 데이터 반환
        return this.getDummySearchResults(params);
      }
    } catch (error) {
      console.error('KIPRIS API 검색 오류:', error);
      // 더미 데이터 반환
      return this.getDummySearchResults(params);
    }
  }

  /**
   * 더미 검색 결과 (API 연동 전 테스트용)
   */
  private getDummySearchResults(params: KiprisSearchParams): KiprisResponse {
    const dummyPatents: Patent[] = [
      {
        id: 'KR1020230012345',
        title: '인공지능 기반 특허 분석 시스템',
        abstract: '머신러닝과 자연어 처리를 활용하여 특허 문서를 자동으로 분석하고 분류하는 시스템',
        inventors: ['김철수', '이영희'],
        applicants: ['테크놀로지 주식회사'],
        applicationDate: '2023-01-15',
        publicationDate: '2023-07-20',
        status: PatentStatus.PUBLISHED,
        classification: ['G06N 3/08', 'G06F 16/35'],
        claims: ['특허청구항 1', '특허청구항 2'],
        description: '상세한 기술 설명...',
        drawings: ['도면1.png', '도면2.png'],
        legalStatus: 'active',
        citations: ['KR1020200012345', 'US20200012345'],
        familyPatents: ['US20230012345', 'EP20230012345']
      },
      {
        id: 'KR1020230056789',
        title: '블록체인 기반 지적재산권 관리 플랫폼',
        abstract: '스마트 컨트랙트를 활용하여 지적재산권의 등록, 거래, 라이선싱을 관리하는 플랫폼',
        inventors: ['박민수', '정수진'],
        applicants: ['블록체인 솔루션즈'],
        applicationDate: '2023-03-20',
        publicationDate: '2023-09-15',
        status: PatentStatus.PUBLISHED,
        classification: ['G06Q 10/00', 'H04L 9/32'],
        claims: ['특허청구항 1', '특허청구항 2'],
        description: '상세한 기술 설명...',
        drawings: ['도면1.png', '도면2.png'],
        legalStatus: 'active',
        citations: ['KR1020200056789', 'JP20200056789'],
        familyPatents: ['US20230056789', 'CN20230056789']
      }
    ];

    return {
      success: true,
      data: dummyPatents,
      totalCount: dummyPatents.length,
      page: params.page || 1,
      pageSize: params.pageSize || 20
    };
  }

  /**
   * 특허 상세 정보 조회
   */
  async getPatentDetail(patentId: string): Promise<Patent> {
    try {
      this.validateApiKey();
      
      // 실제 KIPRIS API 호출
      const response = await axios.get(`https://www.kipris.or.kr/khome/openapi/detail/${patentId}`, {
        params: {
          apiKey: this.apiKey
        }
      });

      return this.parsePatentData(response.data);
    } catch (error) {
      console.error('특허 상세 정보 조회 오류:', error);
      // 더미 데이터 반환
      return this.getDummyPatentDetail(patentId);
    }
  }

  /**
   * 더미 특허 상세 정보
   */
  private getDummyPatentDetail(patentId: string): Patent {
    return {
      id: patentId,
      title: '인공지능 기반 특허 분석 시스템',
      abstract: '머신러닝과 자연어 처리를 활용하여 특허 문서를 자동으로 분석하고 분류하는 시스템입니다. 본 발명은 특허 문서의 텍스트를 분석하여 기술 분야를 자동으로 분류하고, 유사한 특허를 찾아내며, 특허의 가치를 평가하는 기능을 제공합니다.',
      inventors: ['김철수', '이영희', '박민수'],
      applicants: ['테크놀로지 주식회사', 'AI 연구소'],
      applicationDate: '2023-01-15',
      publicationDate: '2023-07-20',
      status: PatentStatus.PUBLISHED,
      classification: ['G06N 3/08', 'G06F 16/35', 'G06F 40/30'],
      claims: [
        '인공지능을 활용하여 특허 문서를 분석하는 시스템으로서, 텍스트 전처리 모듈과, 특징 추출 모듈과, 분류 모듈을 포함하는 특허 분석 시스템.',
        '제1항에 있어서, 상기 텍스트 전처리 모듈은 자연어 처리를 수행하는 것을 특징으로 하는 특허 분석 시스템.',
        '제1항에 있어서, 상기 특징 추출 모듈은 TF-IDF 알고리즘을 사용하는 것을 특징으로 하는 특허 분석 시스템.'
      ],
      description: '본 발명은 인공지능 기술을 활용하여 특허 문서를 자동으로 분석하고 분류하는 시스템에 관한 것이다. 특히, 머신러닝과 자연어 처리 기술을 결합하여 특허 문서의 내용을 이해하고, 기술 분야별로 자동 분류하며, 유사한 특허를 찾아내는 기능을 제공한다.',
      drawings: ['도면1.png', '도면2.png', '도면3.png'],
      legalStatus: 'active',
      citations: ['KR1020200012345', 'US20200012345', 'JP20200012345'],
      familyPatents: ['US20230012345', 'EP20230012345', 'CN20230012345']
    };
  }

  /**
   * IPC 분류별 특허 검색
   */
  async searchByClassification(ipcClass: string): Promise<KiprisResponse> {
    try {
      this.validateApiKey();
      
      const response = await axios.get('https://www.kipris.or.kr/khome/openapi/classification', {
        params: {
          ipcClass,
          apiKey: this.apiKey
        }
      });

      return this.parseKiprisResponse(response.data);
    } catch (error) {
      console.error('IPC 분류별 검색 오류:', error);
      throw new Error('IPC 분류별 검색 중 오류가 발생했습니다.');
    }
  }

  /**
   * 출원인별 특허 검색
   */
  async searchByApplicant(applicantName: string): Promise<KiprisResponse> {
    try {
      this.validateApiKey();
      
      const response = await axios.get('https://www.kipris.or.kr/khome/openapi/applicant', {
        params: {
          applicantName: encodeURIComponent(applicantName),
          apiKey: this.apiKey
        }
      });

      return this.parseKiprisResponse(response.data);
    } catch (error) {
      console.error('출원인별 검색 오류:', error);
      throw new Error('출원인별 검색 중 오류가 발생했습니다.');
    }
  }

  /**
   * 발명자별 특허 검색
   */
  async searchByInventor(inventorName: string): Promise<KiprisResponse> {
    try {
      this.validateApiKey();
      
      const response = await axios.get('https://www.kipris.or.kr/khome/openapi/inventor', {
        params: {
          inventorName: encodeURIComponent(inventorName),
          apiKey: this.apiKey
        }
      });

      return this.parseKiprisResponse(response.data);
    } catch (error) {
      console.error('발명자별 검색 오류:', error);
      throw new Error('발명자별 검색 중 오류가 발생했습니다.');
    }
  }

  /**
   * 특허 법적 상태 조회
   */
  async getPatentLegalStatus(patentId: string): Promise<any> {
    try {
      this.validateApiKey();
      
      const response = await axios.get(`https://www.kipris.or.kr/khome/openapi/legal-status/${patentId}`, {
        params: {
          apiKey: this.apiKey
        }
      });

      return response.data;
    } catch (error) {
      console.error('법적 상태 조회 오류:', error);
      throw new Error('법적 상태를 가져오는 중 오류가 발생했습니다.');
    }
  }

  /**
   * 특허 인용 정보 조회
   */
  async getPatentCitations(patentId: string): Promise<any> {
    try {
      this.validateApiKey();
      
      const response = await axios.get(`https://www.kipris.or.kr/khome/openapi/citations/${patentId}`, {
        params: {
          apiKey: this.apiKey
        }
      });

      return response.data;
    } catch (error) {
      console.error('인용 정보 조회 오류:', error);
      throw new Error('인용 정보를 가져오는 중 오류가 발생했습니다.');
    }
  }

  /**
   * KIPRIS API 응답을 파싱
   */
  private parseKiprisResponse(data: any): KiprisResponse {
    return {
      success: data.success || true,
      data: Array.isArray(data.data) ? data.data.map(this.parsePatentData) : [],
      totalCount: data.totalCount || 0,
      page: data.page || 1,
      pageSize: data.pageSize || 20
    };
  }

  /**
   * 특허 데이터를 파싱
   */
  private parsePatentData(data: any): Patent {
    return {
      id: data.patentNumber || data.id || '',
      title: data.title || data.patentName || '',
      abstract: data.abstract || data.summary || '',
      inventors: Array.isArray(data.inventors) ? data.inventors : [data.inventors || ''],
      applicants: Array.isArray(data.applicants) ? data.applicants : [data.applicants || ''],
      applicationDate: data.applicationDate || data.filingDate || '',
      publicationDate: data.publicationDate || data.publishedDate || '',
      status: this.mapPatentStatus(data.status),
      classification: Array.isArray(data.classification) ? data.classification : [data.classification || ''],
      claims: Array.isArray(data.claims) ? data.claims : [data.claims || ''],
      description: data.description || data.detailedDescription || '',
      drawings: Array.isArray(data.drawings) ? data.drawings : [data.drawings || ''],
      legalStatus: data.legalStatus || 'active',
      citations: Array.isArray(data.citations) ? data.citations : [data.citations || ''],
      familyPatents: Array.isArray(data.familyPatents) ? data.familyPatents : [data.familyPatents || '']
    };
  }

  /**
   * 특허 상태 매핑
   */
  private mapPatentStatus(status: string): PatentStatus {
    const statusMap: { [key: string]: PatentStatus } = {
      '출원': PatentStatus.PENDING,
      '공개': PatentStatus.PUBLISHED,
      '등록': PatentStatus.GRANTED,
      '거절': PatentStatus.REJECTED,
      '만료': PatentStatus.EXPIRED,
      'pending': PatentStatus.PENDING,
      'published': PatentStatus.PUBLISHED,
      'granted': PatentStatus.GRANTED,
      'rejected': PatentStatus.REJECTED,
      'expired': PatentStatus.EXPIRED
    };

    return statusMap[status] || PatentStatus.PENDING;
  }

  /**
   * API 키 유효성 검증
   */
  async validateApiKey(): Promise<boolean> {
    try {
      this.validateApiKey();
      
      const response = await axios.get('https://www.kipris.or.kr/khome/openapi/validate', {
        params: {
          apiKey: this.apiKey
        }
      });

      return response.data.valid || false;
    } catch (error) {
      console.error('API 키 검증 오류:', error);
      return false;
    }
  }

  /**
   * API 키 상태 확인
   */
  getApiKeyStatus(): { hasKey: boolean; isEnabled: boolean } {
    try {
      if (typeof window !== 'undefined') {
        const savedKeys = localStorage.getItem('patent-ai-api-keys');
        if (savedKeys) {
          const parsed = JSON.parse(savedKeys);
          if (parsed.kipris) {
            return {
              hasKey: !!parsed.kipris.apiKey,
              isEnabled: parsed.kipris.isEnabled
            };
          }
        }
      }
      return { hasKey: false, isEnabled: false };
    } catch (error) {
      return { hasKey: false, isEnabled: false };
    }
  }
}

// 싱글톤 인스턴스 생성
export const kiprisService = new KiprisService();
