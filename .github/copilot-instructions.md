# Soulrip Frontend Copilot Instructions

## Repository Context

Soulrip은 서울에서 혼자 여행하는 사용자를 위한 Vue 3 + TypeScript + Vite 기반 프론트엔드 서비스이다. 주요 도메인은 장소, 축제, 익명 커뮤니티, AI 여행 챗봇이다.

저장소 구조는 다음과 같다.

- `src/views`: 라우트 단위 화면과 페이지 상태를 관리한다.
- `src/components`: 재사용 가능한 UI 컴포넌트를 관리한다.
- `src/services/api.ts`: 모든 HTTP 요청을 관리한다.
- `src/types/index.ts`: 공통 도메인 및 API 타입을 관리한다.
- `src/composables`: 재사용 가능한 반응형 상태와 로직을 관리한다.
- `src/i18n`: 정적 다국어 데이터를 관리한다.
- `src/router.ts`: 라우트 정의를 관리한다.
- `src/styles.css`: 전역 디자인 토큰과 공통 스타일을 관리한다.

## Working Rules

1. 새로운 패턴을 만들기 전에 가장 가까운 기존 구현을 먼저 확인한다.
2. 현재 아키텍처를 유지하는 최소 범위의 변경을 우선한다.
3. Vue `<script setup lang="ts">`, Composition API, 명시적인 TypeScript 타입을 사용한다.
4. 뷰나 컴포넌트에서 새로운 `fetch` 호출을 직접 작성하지 않고 `src/services/api.ts`를 확장한다.
5. 재사용 가능한 응답 및 도메인 타입은 각 뷰에 중복 선언하지 않고 `src/types/index.ts`에 둔다.
6. 비동기 화면은 로딩, 오류, 빈 상태, 성공 상태를 모두 고려한다.
7. 의미에 맞는 HTML 요소, 버튼 타입, 아이콘 전용 버튼의 라벨, 이미지 대체 텍스트를 통해 접근성을 유지한다.
8. 사용자에게 노출되는 공통 문구를 추가할 때 현재 7개 언어(`ko`, `en`, `ja`, `zh`, `fr`, `es`, `de`)에 미치는 영향을 확인한다.
9. 비밀값을 하드코딩하지 않으며, 근거 없이 백엔드 필드나 엔드포인트를 만들어내지 않는다.
10. 기능 구현이나 버그 수정 중에는 관련 없는 리팩터링을 함께 수행하지 않는다.

## Soulrip Domain Rules

- 장소 탐색은 카테고리 및 검색 필터와 `PlaceCard`를 중심으로 구성되어 있다.
- 축제 탐색은 월 필터, 달력 로직, 페이지네이션을 함께 관리한다.
- 커뮤니티는 익명 구조이다. 게시글 CRUD에는 닉네임과 비밀번호가 사용되며, 좋아요는 로컬 `client_id`를 사용하고, 댓글 변경 시 댓글 목록과 개수를 함께 일치시켜야 한다.
- 챗봇은 `api.chat`을 통해 메시지, 최근 대화 기록, 현재 언어를 전송하며 로딩 중 중복 전송을 차단한다.

## Verification Rules

구현이 끝났다고 판단하기 전에 다음 명령을 실행하거나 개발자가 실행하도록 안내한다.

```bash
npm run type-check
npm run lint
npm run build
```

현재 린트 명령에는 자동 수정 옵션이 포함되어 있으므로 린트 실행 뒤 `git diff`를 확인한다.

규모가 큰 작업은 먼저 짧은 계획을 제시하고, 작은 단위로 구현한 뒤, 변경 파일과 검증 결과를 마지막에 요약한다.
