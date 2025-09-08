# 특허 컨설팅 플랫폼 (PatentAI)

KIPRIS API를 활용한 특허 정보 색인 및 신규 스타트업의 초기 시장 진입 컨설팅 서비스

## 🚀 주요 기능

- **특허 검색**: KIPRIS API를 통한 한국 특허 정보 검색
- **AI 분석**: OpenAI/OpenRouter API를 활용한 특허 분석
- **컨설팅 서비스**: 스타트업을 위한 특허 전략 컨설팅
- **대시보드**: 종합적인 특허 정보 및 분석 결과 시각화

## 📋 요구사항

- Node.js 18.0.0 이상
- pnpm (권장) 또는 npm
- KIPRIS API 키
- OpenAI API 키 또는 OpenRouter API 키 (선택사항)

## 🛠️ 설치 및 실행

### 1. 저장소 클론
```bash
git clone <repository-url>
cd patent-ai-platform
```

### 2. 의존성 설치
```bash
pnpm install
# 또는
npm install
```

### 3. API 키 설정

#### 방법 1: 환경 변수 파일 사용 (권장)
```bash
# .env.local 파일 생성
cp env.example .env.local

# .env.local 파일 편집하여 API 키 입력
KIPRIS_API_KEY=your_kipris_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

#### 방법 2: 웹 인터페이스 사용
1. 애플리케이션 실행
2. `/api-keys` 페이지 방문
3. 각 서비스별 API 키 입력 및 저장

### 4. 개발 서버 실행
```bash
pnpm dev
# 또는
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 🔑 API 키 발급 방법

### KIPRIS API 키
1. [한국특허정보원](https://www.kipris.or.kr) 방문
2. 회원가입 및 로그인
3. API 서비스 신청
4. 승인 후 API 키 발급

### OpenAI API 키
1. [OpenAI Platform](https://platform.openai.com) 방문
2. 계정 생성 및 로그인
3. API Keys 섹션에서 새 키 생성
4. 생성된 API 키 복사

### OpenRouter API 키 (OpenAI 대안)
1. [OpenRouter](https://openrouter.ai) 방문
2. 계정 생성 및 로그인
3. API Keys 섹션에서 새 키 생성
4. 생성된 API 키 복사

## 🏗️ 프로젝트 구조

```
patent-ai-platform/
├── app/                    # Next.js 13+ App Router
│   ├── api-keys/          # API 키 설정 페이지
│   ├── optimization/      # 최적화 관리 페이지
│   ├── dashboard/         # 대시보드 페이지
│   ├── patents/           # 특허 관련 페이지
│   └── settings/          # 일반 설정 페이지
├── components/             # 재사용 가능한 UI 컴포넌트
│   ├── ui/                # 기본 UI 컴포넌트
│   └── navigation.tsx     # 네비게이션 컴포넌트
├── lib/                    # 서비스 및 유틸리티
│   ├── kipris.ts          # KIPRIS API 서비스
│   ├── ai-analysis.ts     # AI 분석 서비스
│   ├── cache-service.ts   # 캐싱 서비스
│   ├── compression-service.ts # 압축 서비스
│   ├── network-optimizer.ts   # 네트워크 최적화
│   ├── optimization-manager.ts # 통합 최적화 관리
│   └── storage.ts         # 로컬 스토리지 서비스
├── types/                  # TypeScript 타입 정의
└── public/                 # 정적 파일
```

## 🔧 주요 서비스

### KIPRIS 서비스
- 특허 검색 및 상세 정보 조회
- IPC 분류별, 출원인별, 발명자별 검색
- 특허 법적 상태 및 인용 정보 조회

### AI 분석 서비스
- 특허 신규성, 진보성, 산업상 이용가능성 분석
- 시장 잠재력 및 위험도 평가
- 경쟁 환경 분석 및 전략적 권장사항 제시

### 최적화 서비스
- **캐싱 시스템**: 데이터 다운로드 비용 최소화
- **압축 엔진**: 네트워크 전송량 최적화
- **배치 처리**: 네트워크 요청 효율성 향상
- **실시간 모니터링**: 최적화 효과 추적 및 분석

## 📱 사용법

### 1. API 키 설정
- `/api-keys` 페이지에서 필요한 API 키 입력
- 각 서비스별 활성화/비활성화 설정
- API 키 유효성 검증

### 2. 특허 검색
- `/patents/search` 페이지에서 키워드 검색
- 고급 필터링 (분류, 날짜, 상태 등)
- 검색 결과 저장 및 즐겨찾기

### 3. AI 분석
- 특허 선택 후 AI 분석 실행
- 종합적인 특허 평가 결과 확인
- 전략적 권장사항 및 위험도 분석

### 4. 컨설팅
- 스타트업 정보 입력
- 특허 포트폴리오 분석
- 맞춤형 컨설팅 리포트 생성

## 🚨 주의사항

- API 키는 민감한 정보이므로 안전하게 보관
- 환경 변수 파일은 `.gitignore`에 포함
- API 사용량 및 비용 모니터링 필요
- KIPRIS API 사용 시 이용약관 준수

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 지원

문제가 발생하거나 질문이 있으시면:
- GitHub Issues 생성
- 이메일: [your-email@example.com]

## 🙏 감사의 말

- [KIPRIS](https://www.kipris.or.kr) - 한국 특허 정보 제공
- [OpenAI](https://openai.com) - AI 모델 API
- [OpenRouter](https://openrouter.ai) - 다양한 AI 모델 접근
- [Next.js](https://nextjs.org) - React 프레임워크
- [Tailwind CSS](https://tailwindcss.com) - CSS 프레임워크
