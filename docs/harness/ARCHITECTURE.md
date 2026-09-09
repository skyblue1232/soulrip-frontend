# Soulrip Frontend Architecture

## Current Data Flow

```text
Route
  ↓
View
  ├─ page state / loading / error / filter
  ├─ Service API call
  └─ Components composition
       ↓
Reusable Components

View or intentional feature widget
  ↓
services/api.ts
  ↓
Backend API

Shared contracts → types/index.ts
Shared app state → composables/
Static translations → i18n/
```

## Folder Responsibilities

### `src/views`

URL과 연결되는 페이지 단위 경계다. route param, API 로딩, 페이지 필터/페이지네이션, 화면 조합을 담당한다.

### `src/components`

재사용 UI 경계다. 카드, 네비게이션, 지도, 챗봇 등 화면 요소를 담당한다. 일반적인 카드 컴포넌트는 API를 직접 호출하지 않는다.

### `src/services/api.ts`

HTTP 경계다. base URL, headers, 에러 변환, query string, payload, 응답 타입을 한곳에서 관리한다.

현재 서비스 파일이 하나이므로 기능 하나 추가할 때마다 파일을 쪼개지 않는다. API가 크게 성장해 탐색이 어려워질 때 places/community/chat 등 도메인 서비스 분리를 고려한다.

### `src/types/index.ts`

프론트 전체가 공유하는 API/도메인 타입의 단일 진입점이다. 현재 규모에서는 중앙화의 단순성이 장점이다.

### `src/composables`

재사용 반응형 상태/로직이다. 현재 `useApp`은 theme/language를 관리한다.

### `src/i18n`

정적 페이지 문구와 번역 데이터다. 같은 문구 도메인을 여러 파일에서 중복 관리하지 않는 것이 중요하다.

## Feature Placement Decision

```text
새 URL이 필요한가?
 ├─ Yes → view + router
 └─ No
     ↓
여러 화면에서 재사용되는 UI인가?
 ├─ Yes → component
 └─ No → 현재 view 내부부터 시작

백엔드 호출이 필요한가?
 ├─ Yes → services/api.ts + types
 └─ No

반응형 로직이 여러 곳에서 재사용되는가?
 ├─ Yes → composable
 └─ No → 로컬 상태 유지
```

## Abstraction Criteria

다음 중 두 가지 이상이 명확할 때 추출을 고려한다.

- 같은 로직이 2곳 이상에서 반복된다.
- 테스트/이해가 어려울 정도로 view가 커졌다.
- 독립적인 비즈니스 상태 수명주기가 있다.
- 코드 소유 책임이 명확히 다른 계층이다.

단순히 파일 길이가 길다는 이유만으로 계층을 추가하지 않는다.
