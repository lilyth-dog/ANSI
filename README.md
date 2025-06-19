# SilverCare - 고령자 감정 분석 플랫폼

전화 기반 AI 감정 분석을 통한 고령자 정신 건강 모니터링 및 돌봄 통합 플랫폼입니다.

## 🎯 프로젝트 개요

SilverCare는 고령자의 전화 통화 내용을 AI로 분석하여 감정 상태를 파악하고, 가족(보호자)과 전문 상담사가 함께 돌봄을 제공하는 통합 플랫폼입니다.

### 주요 기능

- **4가지 사용자 역할**: 관리자, 상담자, 보호자, 대상자(고령자)
- **AI 감정 분석**: 통화 내용 기반 실시간 감정 상태 분석
- **실시간 모니터링**: 감정 변화 추적 및 위험 상황 조기 감지
- **통합 대시보드**: 역할별 맞춤 대시보드 제공
- **알림 시스템**: 위험 상황 발생 시 즉시 알림
- **상담 기록 관리**: 전문 상담사의 개입 기록 및 추적

## 🏗️ 기술 스택

### Frontend & Backend
- **Next.js 14** (App Router)
- **TypeScript**
- **React 18**
- **Tailwind CSS**
- **shadcn/ui**

### 개발 도구
- **ESLint** - 코드 품질 관리
- **Prettier** - 코드 포맷팅
- **Husky** - Git hooks
- **Vitest** - 단위 테스트
- **pnpm** - 패키지 관리

### 클라우드 & 인프라 (향후 계획)
- **Google Cloud Platform**
- **Firebase** (Authentication, Firestore, Storage)
- **Google Cloud Logging**
- **Cloud Functions**

## 📁 프로젝트 구조

\`\`\`
silvercare/
├── app/                          # Next.js App Router
│   ├── dashboard/               # 역할별 대시보드
│   │   ├── admin/              # 관리자 대시보드
│   │   ├── counselor/          # 상담자 대시보드
│   │   ├── protector/          # 보호자 대시보드
│   │   └── senior/             # 대상자 대시보드
│   ├── api/                    # API 라우트
│   │   └── analyze-emotion/    # 감정 분석 API
│   ├── globals.css             # 글로벌 스타일
│   ├── layout.tsx              # 루트 레이아웃
│   └── page.tsx                # 홈페이지
├── components/                  # 재사용 가능한 컴포넌트
│   ├── ui/                     # shadcn/ui 컴포넌트
│   ├── auth-provider.tsx       # 인증 프로바이더
│   ├── navigation.tsx          # 네비게이션
│   ├── stats-card.tsx          # 통계 카드
│   ├── emotion-chart.tsx       # 감정 차트
│   └── recent-alerts.tsx       # 최근 알림
├── hooks/                      # React 훅
│   └── useCurrentUser.ts       # 사용자 인증 훅
├── lib/                        # 유틸리티 라이브러리
│   ├── db.ts                   # 데이터베이스 연결
│   ├── firebase.ts             # Firebase 설정
│   ├── iam.ts                  # IAM 권한 관리
│   ├── logger.ts               # 로깅 시스템
│   ├── utils.ts                # 유틸리티 함수
│   └── mock-data.ts            # 시범용 데이터
├── types/                      # TypeScript 타입 정의
│   └── index.ts                # 전역 타입
├── scripts/                    # 데이터베이스 스크립트
│   ├── 001-create-tables.sql   # 테이블 생성
│   └── 002-seed-data.sql       # 초기 데이터
└── functions/                  # Cloud Functions (예정)
\`\`\`

## 🚀 시작하기

### 필수 요구사항

- Node.js 18.0.0 이상
- pnpm 8.0.0 이상

### 설치 및 실행

1. **저장소 클론**
   \`\`\`bash
   git clone <repository-url>
   cd silvercare
   \`\`\`

2. **의존성 설치**
   \`\`\`bash
   pnpm install
   \`\`\`

3. **환경 변수 설정** (선택사항)
   \`\`\`bash
   cp .env.example .env.local
   # .env.local 파일을 편집하여 필요한 환경 변수를 설정하세요
   \`\`\`

4. **개발 서버 실행**
   \`\`\`bash
   pnpm dev
   \`\`\`

5. **브라우저에서 확인**
   \`\`\`
   http://localhost:3000
   \`\`\`

### 데모 모드

현재 프로젝트는 **데모 모드**로 실행됩니다:
- 실제 데이터베이스 대신 Mock 데이터 사용
- Firebase Admin 없이 클라이언트 사이드만 구현
- 콘솔 로깅으로 시스템 모니터링

## 👥 사용자 역할

### 1. 관리자 (ADMIN)
- 시스템 전체 관리
- 사용자 계정 관리
- IAM 권한 설정
- 시스템 로그 모니터링

### 2. 상담자 (COUNSELOR)
- 전문 상담 서비스 제공
- 상담 기록 작성 및 관리
- 개입 제안 및 추적
- 위험도 평가

### 3. 보호자 (PROTECTOR)
- 가족 돌봄 지원
- 통화 기록 확인
- 감정 추세 분석
- 알림 수신 및 대응

### 4. 대상자 (SENIOR)
- 고령자 본인
- 기분 기록 작성
- 간편 통화 기능
- 개인 현황 확인

## 🔄 역할 전환 (데모용)

네비게이션에서 **데모용 역할 전환** 버튼을 통해 다른 사용자 역할의 대시보드를 체험할 수 있습니다.

## 📊 감정 분석

### 분석 항목
- **기본 감정**: 행복, 슬픔, 분노, 두려움, 놀라움
- **전반적 감정**: 긍정적, 부정적, 중립적
- **위험도**: 낮음, 보통, 높음, 긴급
- **신뢰도**: 분석 결과의 정확도

### 키워드 추출
- 감정 관련 핵심 키워드 자동 추출
- 상황별 맥락 분석
- 트렌드 분석을 위한 데이터 축적

## 🚨 알림 시스템

### 알림 유형
- **감정적 고통**: 지속적인 우울감, 불안감
- **응급상황**: 즉시 개입이 필요한 상황
- **건강 우려**: 신체적 불편함 호소
- **통화 누락**: 예정된 통화 미응답

### 알림 등급
- **낮음**: 일반적인 상황 알림
- **보통**: 주의 깊은 관찰 필요
- **높음**: 빠른 대응 필요
- **긴급**: 즉시 개입 필요

## 🧪 테스트

### 단위 테스트
\`\`\`bash
# 테스트 실행
pnpm test

# 테스트 감시 모드
pnpm test --watch

# 커버리지 리포트
pnpm test:coverage
\`\`\`

## 🔄 배포

### Vercel 배포 (권장)
\`\`\`bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel --prod
\`\`\`

## 📝 향후 계획

- [ ] Firebase Authentication 통합
- [ ] 실제 데이터베이스 연결
- [ ] Google Cloud Logging 구현
- [ ] 실시간 알림 시스템
- [ ] 음성 파일 업로드 기능
- [ ] PDF 리포트 생성
- [ ] 모바일 앱 개발

## 📞 지원

문의사항이나 지원이 필요한 경우:

- **이메일**: support@silvercare.com
- **문서**: [프로젝트 위키](링크)
- **이슈 트래커**: [GitHub Issues](링크)

---

**SilverCare** - 고령자의 행복한 삶을 위한 기술 💙
