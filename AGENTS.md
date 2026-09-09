# Soulrip Frontend Agent Guide

이 문서는 Soulrip 프론트엔드 저장소에서 AI 코딩 에이전트가 작업할 때 따라야 하는 최상위 프로젝트 가이드이다.

## 1. Project Purpose

Soulrip은 서울 공공데이터를 기반으로 혼자 여행하는 사용자가 장소를 탐색하고, 축제 일정을 확인하고, 익명 커뮤니티에서 경험을 공유하며, AI 챗봇으로 여행 정보를 탐색하는 Vue 기반 웹 서비스이다.

핵심 사용자 흐름은 다음과 같다.

1. **Discover Solo**는 장소와 카테고리를 탐색하는 흐름이다.
2. **Plan Solo**는 축제 및 AI 챗봇으로 여행 선택지를 구체화하는 흐름이다.
3. **Share Solo**는 익명 커뮤니티에서 혼행 경험을 공유하는 흐름이다.

## 2. Tech Stack

- Vue 3 Composition API를 사용한다.
- TypeScript를 사용한다.
- Vite를 사용한다.
- Vue Router를 사용한다.
- `lucide-vue-next`를 사용한다.
- Fetch 기반 API 계층을 사용한다.
- 전역 CSS와 Vue SFC scoped style을 함께 사용한다.

새 라이브러리는 기존 구조로 해결하기 어려운 명확한 이유가 있을 때만 추가한다.

## 3. Repository Structure First

```text
src/
├─ assets/images/      # 정적 이미지
├─ components/         # 재사용 가능한 UI 컴포넌트
├─ composables/        # 공통 반응형 상태와 로직
├─ i18n/               # 정적 다국어 데이터
├─ services/           # HTTP 및 API 호출
├─ types/              # 공통 TypeScript 타입
├─ views/              # 라우트 단위 화면
├─ App.vue
├─ main.ts
├─ router.ts
└─ styles.css
```

새 기능을 구현할 때 먼저 기존 파일에서 가장 가까운 패턴을 찾고 해당 패턴을 확장한다. 기존 구조를 무시한 새로운 계층이나 범용 추상화를 먼저 만들지 않는다.

## 4. Layer Responsibilities

- `views`는 라우트 단위 데이터 로딩, 화면 상태, 화면 조합을 담당한다.
- `components`는 props 중심의 재사용 UI를 담당하며 API를 직접 호출하지 않는 것을 기본값으로 한다. 다만 현재 `ChatBot.vue`처럼 기능 자체가 독립 위젯인 기존 예외는 유지할 수 있다.
- `services`는 HTTP 요청, 쿼리 파라미터, payload, API 오류 변환을 담당한다.
- `types`는 API 응답과 도메인 모델의 공통 타입을 중앙 관리한다.
- `composables`는 여러 화면과 컴포넌트에서 재사용되는 반응형 상태와 로직을 담당한다.
- `i18n`은 반복되는 정적 문구와 언어별 사전을 관리한다.

## 5. API Rules

- 컴포넌트나 뷰에서 새로운 `fetch`를 직접 호출하지 않는다. `src/services/api.ts`의 `request<T>`와 `api` 객체를 확장한다.
- API 응답 타입은 `src/types/index.ts`에 정의한 공통 타입을 우선 사용한다.
- 쿼리 파라미터는 `URLSearchParams`를 사용한다.
- 사용자에게 노출되는 실패 상태를 고려하고 가능한 한 `Error.message`를 보존한다.
- 백엔드 스펙을 추측해서 필드명을 임의로 만들지 않는다. 기존 API 또는 명시된 스펙을 확인한다.
- 비밀번호, 토큰, API 키 등 비밀값을 코드나 문서에 하드코딩하지 않는다.

## 6. Vue Rules

- 새 SFC는 `<script setup lang="ts">`를 사용한다.
- 기본 상태는 `ref`, 파생값은 `computed`, 외부 변화에 대한 반응은 필요한 범위에서 `watch`를 사용한다.
- 템플릿 안에 복잡한 변환 로직을 누적하지 않고 script의 computed 또는 함수로 올린다.
- 비동기 요청에는 로딩, 오류, 빈 상태를 함께 설계한다.
- 버튼에는 `type="button"` 또는 폼 목적에 맞는 `type`을 명시한다.
- 아이콘만 있는 버튼에는 `aria-label`을 제공한다.
- 목록의 `v-for` key는 index보다 도메인의 안정적인 식별자를 우선한다.

## 7. Soulrip Domain Invariants

### Places

- `PlaceCategory`의 기존 카테고리 체계를 우선한다.
- 목록 이미지는 `thumbnailUrl`을 우선 사용하고 상세 맥락에서는 `imageUrl` 사용을 고려한다.
- 이미지가 없을 수 있으며 위도와 경도도 null일 수 있다.

### Festivals

- `startDate`, `endDate`는 null일 수 있다.
- 날짜 파싱은 시간대에 따라 하루가 밀리지 않도록 현재 로컬 날짜 생성 패턴을 우선한다.
- 월 필터와 페이지네이션 상태를 함께 고려한다.

### Community

- 로그인 없는 익명 커뮤니티라는 전제를 유지한다.
- 게시글 수정과 삭제에는 비밀번호 흐름이 있다.
- 좋아요 식별은 현재 `client_id` localStorage 기반 흐름을 따른다.
- 댓글 생성 뒤 댓글 목록과 `commentCount`가 일치해야 한다.

### Chatbot

- `/chat` 요청에는 메시지, 최근 대화 기록, 현재 언어가 전달된다.
- 중복 전송을 막기 위해 로딩 중 전송을 차단한다.
- 언어가 바뀌면 초기 인사말 등 사용자 노출 문구의 일관성을 유지한다.

## 8. i18n Rules

현재 지원 언어는 `ko`, `en`, `ja`, `zh`, `fr`, `es`, `de`이다.

사용자에게 반복적으로 노출되는 새 정적 문구를 추가할 때는 한국어만 추가하고 끝내지 않고 다국어 영향 범위를 확인한다. 번역이 즉시 준비되지 않았다면 임의의 저품질 번역을 조용히 추가하지 않고 변경 범위를 명시한다.

## 9. Change Workflow

1. 요청을 사용자 기능 단위로 다시 정의한다.
2. 관련 라우트 → 뷰 → 컴포넌트 → 서비스 → 타입 → 다국어 순서로 영향 범위를 찾는다.
3. 최소 변경 계획을 세운다.
4. 기존 패턴을 재사용해 구현한다.
5. 로딩, 오류, 빈 상태와 모바일, 접근성을 확인한다.
6. 타입 검사, 린트, 빌드를 검증한다.
7. 변경한 파일과 사용자 동작 변화를 요약한다.

## 10. Verification Commands

```bash
npm run type-check
npm run lint
npm run build
```

`npm run lint`는 현재 설정상 자동 수정이 포함되어 있으므로 실행 후 `git diff`로 의도하지 않은 변경이 없는지 확인한다.

## 11. AI Collaboration Principles

- 생성한 코드를 개발자가 이해하고 설명할 수 있는 형태로 작성한다.
- 기존 코드와 요구사항이 충돌하면 추측해서 덮어쓰지 않고 충돌 지점을 드러낸다.
- 먼저 계획하고, 작게 구현하고, 검증 결과를 확인한다.
- 관련 없는 파일을 대규모로 리팩터링하지 않는다.
- 최종 산출물의 책임과 검증은 개발자에게 있다는 전제로 작업한다.
