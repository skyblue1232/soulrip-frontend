---
name: Soulrip API Service
description: HTTP 요청과 백엔드 연동에 적용하는 규칙이다
applyTo: "src/services/**/*.ts"
---

# API Service Rules

- 프론트엔드의 HTTP 요청은 의도적인 구조 변경이 없는 한 `src/services/api.ts`와 공통 `request<T>` 함수를 통해 처리한다.
- 기본 URL은 환경변수 기반의 `VITE_API_BASE_URL`을 유지하고 배포 주소를 코드에 직접 작성하지 않는다.
- 쿼리 문자열은 `URLSearchParams`를 사용하고, 경로나 쿼리 값을 직접 삽입해야 할 때는 `encodeURIComponent`를 사용한다.
- 공통 타입은 `@/types`에서 가져온다. 새로운 엔드포인트가 재사용 가능한 도메인 모델을 추가한다면 타입도 해당 위치에 추가하거나 보완한다.
- 백엔드가 요구하는 필드명은 그대로 유지한다. 별도의 변환 계층 없이 `camelCase`나 `snake_case`를 임의로 변경하지 않는다.
- 새 엔드포인트에서도 FastAPI 오류 처리는 기존 `getErrorMessage` 흐름을 유지한다.
- 서비스 메서드는 타입이 지정된 데이터를 반환하고 `any` 사용을 피한다.
- HTTP 204 응답은 기존의 `undefined as T` 처리 계약을 유지한다.
- 사용자 비밀번호, 비밀값, API 키, 환경변수 값을 로그에 남기거나 저장소에 커밋하지 않는다.
- 백엔드 계약이 코드만으로 명확하지 않은 경우에만 메서드 주변에 필요한 설명을 남긴다.

# Current Domain Endpoints

- 장소: 목록 조회, 상세 조회를 사용한다.
- 축제: 목록 조회, 상세 조회를 사용한다.
- 커뮤니티: 게시글 CRUD, 좋아요, 댓글 기능을 사용한다.
- 챗봇: `/chat`을 사용한다.
- AI 인사이트: `/ai-insights/today`를 사용한다.

요청 본문이나 쿼리 이름을 변경하기 전에 해당 메서드를 사용하는 모든 호출부를 찾고 실제 백엔드 계약이 변경되었는지 확인한다.
