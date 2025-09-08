export interface CompressionOptions {
  algorithm: 'gzip' | 'deflate' | 'lz4' | 'custom';
  level: number; // 1-9, 높을수록 압축률이 좋지만 느림
  threshold: number; // 이 크기 이상일 때만 압축
  preserveStructure: boolean; // 데이터 구조 보존 여부
}

export interface OptimizationResult<T> {
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  data: T;
  metadata: {
    algorithm: string;
    compressionTime: number;
    decompressionTime: number;
  };
}

export class CompressionService {
  private options: CompressionOptions;

  constructor(options: Partial<CompressionOptions> = {}) {
    this.options = {
      algorithm: 'gzip',
      level: 6,
      threshold: 1024, // 1KB 이상일 때만 압축
      preserveStructure: true,
      ...options
    };
  }

  // 특허 데이터 압축
  async compressPatentData(patent: any): Promise<OptimizationResult<any>> {
    const startTime = performance.now();
    const originalData = JSON.stringify(patent);
    const originalSize = new Blob([originalData]).size;

    if (originalSize < this.options.threshold) {
      return {
        originalSize,
        compressedSize: originalSize,
        compressionRatio: 1,
        data: patent,
        metadata: {
          algorithm: 'none',
          compressionTime: 0,
          decompressionTime: 0
        }
      };
    }

    // 특허 데이터 최적화
    const optimizedPatent = this.optimizePatentStructure(patent);
    const compressedData = await this.compress(JSON.stringify(optimizedPatent));
    const compressedSize = new Blob([compressedData]).size;
    const compressionTime = performance.now() - startTime;

    return {
      originalSize,
      compressedSize,
      compressionRatio: compressedSize / originalSize,
      data: compressedData,
      metadata: {
        algorithm: this.options.algorithm,
        compressionTime,
        decompressionTime: 0
      }
    };
  }

  // 특허 검색 결과 압축
  async compressPatentSearchResults(patents: any[]): Promise<OptimizationResult<any[]>> {
    const startTime = performance.now();
    const originalData = JSON.stringify(patents);
    const originalSize = new Blob([originalData]).size;

    if (originalSize < this.options.threshold) {
      return {
        originalSize,
        compressedSize: originalSize,
        compressionRatio: 1,
        data: patents,
        metadata: {
          algorithm: 'none',
          compressionTime: 0,
          decompressionTime: 0
        }
      };
    }

    // 검색 결과 최적화
    const optimizedPatents = patents.map(patent => this.optimizePatentForSearch(patent));
    const compressedData = await this.compress(JSON.stringify(optimizedPatents));
    const compressedSize = new Blob([compressedData]).size;
    const compressionTime = performance.now() - startTime;

    return {
      originalSize,
      compressedSize,
      compressionRatio: compressedSize / originalSize,
      data: compressedData,
      metadata: {
        algorithm: this.options.algorithm,
        compressionTime,
        decompressionTime: 0
      }
    };
  }

  // 웹 검색 결과 압축
  async compressWebSearchResults(results: any[]): Promise<OptimizationResult<any[]>> {
    const startTime = performance.now();
    const originalData = JSON.stringify(results);
    const originalSize = new Blob([originalData]).size;

    if (originalSize < this.options.threshold) {
      return {
        originalSize,
        compressedSize: originalSize,
        compressionRatio: 1,
        data: results,
        metadata: {
          algorithm: 'none',
          compressionTime: 0,
          decompressionTime: 0
        }
      };
    }

    // 웹 검색 결과 최적화
    const optimizedResults = results.map(result => this.optimizeWebSearchResult(result));
    const compressedData = await this.compress(JSON.stringify(optimizedResults));
    const compressedSize = new Blob([compressedData]).size;
    const compressionTime = performance.now() - startTime;

    return {
      originalSize,
      compressedSize,
      compressionRatio: compressedSize / originalSize,
      data: compressedData,
      metadata: {
        algorithm: this.options.algorithm,
        compressionTime,
        decompressionTime: 0
      }
    };
  }

  // 시장 분석 보고서 압축
  async compressMarketReport(report: any): Promise<OptimizationResult<any>> {
    const startTime = performance.now();
    const originalData = JSON.stringify(report);
    const originalSize = new Blob([originalData]).size;

    if (originalSize < this.options.threshold) {
      return {
        originalSize,
        compressedSize: originalSize,
        compressionRatio: 1,
        data: report,
        metadata: {
          algorithm: 'none',
          compressionTime: 0,
          decompressionTime: 0
        }
      };
    }

    // 보고서 최적화
    const optimizedReport = this.optimizeMarketReport(report);
    const compressedData = await this.compress(JSON.stringify(optimizedReport));
    const compressedSize = new Blob([compressedData]).size;
    const compressionTime = performance.now() - startTime;

    return {
      originalSize,
      compressedSize,
      compressionRatio: compressedSize / originalSize,
      data: compressedData,
      metadata: {
        algorithm: this.options.algorithm,
        compressionTime,
        decompressionTime: 0
      }
    };
  }

  // 압축된 데이터 압축 해제
  async decompress<T>(compressedData: any): Promise<T> {
    const startTime = performance.now();
    
    if (typeof compressedData === 'string') {
      return JSON.parse(compressedData);
    }

    // 실제 압축 해제 로직 (여기서는 간단한 구현)
    const decompressedData = await this.decompressData(compressedData);
    const decompressionTime = performance.now() - startTime;

    return decompressedData;
  }

  // 데이터 압축
  private async compress(data: string): Promise<string> {
    // 간단한 압축 구현 (실제로는 더 정교한 압축 알고리즘 사용)
    return this.simpleCompression(data);
  }

  // 간단한 압축 (실제 구현에서는 더 정교한 알고리즘 사용)
  private simpleCompression(data: string): string {
    // 중복 공백 제거, 불필요한 문자 제거
    let compressed = data
      .replace(/\s+/g, ' ')
      .replace(/[{}"]/g, '')
      .replace(/,/g, ';')
      .trim();

    // 자주 사용되는 단어 축약
    const abbreviations: { [key: string]: string } = {
      'patent': 'p',
      'invention': 'inv',
      'technology': 'tech',
      'application': 'app',
      'classification': 'cls',
      'applicant': 'appl',
      'inventor': 'invr',
      'abstract': 'abs',
      'description': 'desc',
      'claims': 'clm'
    };

    for (const [full, abbr] of Object.entries(abbreviations)) {
      compressed = compressed.replace(new RegExp(full, 'gi'), abbr);
    }

    return compressed;
  }

  // 압축 해제
  private async decompressData(compressedData: any): Promise<any> {
    // 간단한 압축 해제 구현
    if (typeof compressedData === 'string') {
      return this.simpleDecompression(compressedData);
    }
    return compressedData;
  }

  // 간단한 압축 해제
  private simpleDecompression(compressed: string): any {
    // 축약된 단어 복원
    const abbreviations: { [key: string]: string } = {
      'p': 'patent',
      'inv': 'invention',
      'tech': 'technology',
      'app': 'application',
      'cls': 'classification',
      'appl': 'applicant',
      'invr': 'inventor',
      'abs': 'abstract',
      'desc': 'description',
      'clm': 'claims'
    };

    let decompressed = compressed;
    for (const [abbr, full] of Object.entries(abbreviations)) {
      decompressed = decompressed.replace(new RegExp(`\\b${abbr}\\b`, 'g'), full);
    }

    // 구분자 복원
    decompressed = decompressed
      .replace(/;/g, ',')
      .replace(/([a-zA-Z]+):/g, '"$1":')
      .replace(/:([^,}]+)/g, ':"$1"');

    try {
      return JSON.parse(`{${decompressed}}`);
    } catch {
      return { data: decompressed };
    }
  }

  // 특허 구조 최적화
  private optimizePatentStructure(patent: any): any {
    const optimized: any = {};

    // 필수 필드만 포함
    const essentialFields = ['id', 'title', 'abstract', 'claims', 'applicant', 'inventor', 'filingDate'];
    
    for (const field of essentialFields) {
      if (patent[field] !== undefined && patent[field] !== null) {
        optimized[field] = patent[field];
      }
    }

    // 긴 텍스트 필드 압축
    if (patent.abstract && patent.abstract.length > 200) {
      optimized.abstract = patent.abstract.substring(0, 200) + '...';
    }

    if (patent.claims && Array.isArray(patent.claims)) {
      optimized.claims = patent.claims.slice(0, 3); // 처음 3개 청구항만
    }

    return optimized;
  }

  // 검색용 특허 최적화
  private optimizePatentForSearch(patent: any): any {
    const optimized: any = {};

    // 검색에 필요한 핵심 정보만
    const searchFields = ['id', 'title', 'abstract', 'applicant', 'inventor', 'filingDate', 'classification'];
    
    for (const field of searchFields) {
      if (patent[field] !== undefined && patent[field] !== null) {
        optimized[field] = patent[field];
      }
    }

    // 분류 정보 간소화
    if (patent.classification && Array.isArray(patent.classification)) {
      optimized.classification = patent.classification.slice(0, 2); // 상위 2개만
    }

    return optimized;
  }

  // 웹 검색 결과 최적화
  private optimizeWebSearchResult(result: any): any {
    const optimized: any = {};

    // 핵심 정보만 포함
    const coreFields = ['title', 'url', 'snippet', 'source'];
    
    for (const field of coreFields) {
      if (result[field] !== undefined && result[field] !== null) {
        optimized[field] = result[field];
      }
    }

    // 스니펫 길이 제한
    if (result.snippet && result.snippet.length > 150) {
      optimized.snippet = result.snippet.substring(0, 150) + '...';
    }

    return optimized;
  }

  // 시장 분석 보고서 최적화
  private optimizeMarketReport(report: any): any {
    const optimized: any = {};

    // 핵심 섹션만 포함
    const coreSections = ['summary', 'marketSize', 'trends', 'competition', 'opportunities', 'risks'];
    
    for (const section of coreSections) {
      if (report[section] !== undefined && report[section] !== null) {
        optimized[section] = report[section];
      }
    }

    // 상세 데이터는 요약으로 대체
    if (report.detailedAnalysis) {
      optimized.detailedAnalysis = '상세 분석 데이터는 별도로 제공됩니다.';
    }

    return optimized;
  }

  // 압축 통계
  getCompressionStats(): { algorithm: string; level: number; threshold: number } {
    return {
      algorithm: this.options.algorithm,
      level: this.options.level,
      threshold: this.options.threshold
    };
  }

  // 압축 옵션 업데이트
  updateOptions(newOptions: Partial<CompressionOptions>): void {
    this.options = { ...this.options, ...newOptions };
  }
}

// 싱글톤 인스턴스
export const compressionService = new CompressionService();
