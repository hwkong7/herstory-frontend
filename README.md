# HER-STORY Frontend

## 적용 방법

이 폴더의 `src/`, `vite.config.ts`, `.env.development` 를 기존 `herstory-frontend` 프로젝트 루트에 덮어씁니다.
기존 `src/App.tsx`, `src/App.css` 는 삭제하세요 (라우터가 대신합니다).

## 추가 설치

react-hook-form 의 zod 연동 어댑터가 아직 없습니다:

```bash
npm i @hookform/resolvers
npm i -D openapi-typescript
```

## tsconfig.app.json

`compilerOptions` 안에 alias 를 추가하세요:

```json
"baseUrl": ".",
"paths": { "@/*": ["./src/*"] }
```

## package.json scripts

```json
"api:types": "openapi-typescript https://herstory-backend.onrender.com/v3/api-docs -o src/shared/api/schema.d.ts"
```

`npm run api:types` 실행 후 `src/shared/api/types.ts` 상단 주석대로
자동 생성 타입으로 교체하고 fallback 블록을 지우면 됩니다.

## 실행

```bash
npm run dev
```

테스트 계정
- 아티스트: artist@herstory.com / password123
- 고객: customer@herstory.com / password123

## 폴더 구조

```
src/
├─ app/                  라우터 · 레이아웃 · 권한 가드
│  ├─ router.tsx
│  ├─ Layout.tsx
│  └─ RoleGuard.tsx
├─ shared/
│  ├─ api/
│  │  ├─ client.ts       axios 인스턴스 · JWT · ApiResponse 언랩
│  │  ├─ endpoints.ts    Swagger 기준 경로 상수
│  │  └─ types.ts        타입 별칭 (schema.d.ts 생성 후 교체)
│  ├─ store/auth.ts      zustand 인증 상태
│  ├─ ui/primitives.tsx  Button · Input · Section · Loading …
│  └─ lib/format.ts      금액 · 날짜 포맷
└─ features/
   ├─ auth/              로그인 · 회원가입 · OAuth 콜백
   ├─ home/              HOME-01 ~ 04
   ├─ studio/            STUDIO-01 ~ 03 (아티스트 전용)
   ├─ showroom/          SHOW-01 ~ 04 + GarmentViewer (3D)
   ├─ mypage/            MY-01 ~ 08
   └─ o2o/               O2O-01 ~ 03
```

## 기능명세서 대응표

| 기능 ID | 파일 |
|---|---|
| HOME-01~04 | `features/home/HomePage.tsx` |
| STUDIO-01~03 | `features/studio/StudioPage.tsx` |
| SHOW-01~02 | `features/showroom/ShowroomDetailPage.tsx` + `GarmentViewer.tsx` |
| SHOW-03~04 | `features/showroom/ShowroomDetailPage.tsx` 하단 |
| IMPACT-02 | `features/mypage/MyPage.tsx` 증서 지갑 |
| MY-02 / MY-04 / MY-05 | `features/mypage/MyPage.tsx` |
| O2O-01~03 | `features/o2o/PopupStorePage.tsx` |

## 남은 작업

- `types.ts` 의 fallback 을 자동 생성 타입으로 교체
- IMPACT-01 로열티 현황 · IMPACT-03 커뮤니티 · IMPACT-04 ESG 리포트 페이지
- MY-03 멘토링 · MY-06 위시리스트 · MY-07 계정설정 · MY-08 고객센터
- 알림센터 (`/notifications/my`)
