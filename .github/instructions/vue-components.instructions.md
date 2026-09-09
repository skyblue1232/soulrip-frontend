---
name: Soulrip Vue Components
description: Soulrip Vue SFC의 UI 컴포넌트에 적용하는 규칙이다
applyTo: "src/components/**/*.vue"
---

# Component Rules

- `<script setup lang="ts">`를 사용한다.
- 외부에 공개되는 컴포넌트 인터페이스에는 타입이 지정된 `defineProps`와 `defineEmits`를 우선 사용한다.
- 하나의 컴포넌트는 재사용 가능한 하나의 UI 책임에 집중한다.
- 표현 중심 컴포넌트가 라우트 상태를 직접 가져오기보다 props와 emits를 우선 사용한다.
- 새로운 직접 `fetch` 호출을 추가하지 않는다. 현재 `ChatBot.vue`처럼 의도적으로 독립된 기능 위젯인 경우에만 `@/services/api` 사용을 허용한다.
- 복잡한 템플릿 표현식보다 `computed`로 화면 파생값을 분리한다.
- null 또는 빈 데이터를 정상 상태로 고려한다. 장소 및 축제의 이미지와 좌표는 항상 존재하지 않는다.
- 새로운 시각 체계를 만들기 전에 기존 카드 스타일(`card`, `card-hover`), 칩, 태그, CSS 변수를 재사용한다.
- 컴포넌트 전용 규칙은 scoped style을 사용하고, 공통 디자인 동작은 `src/styles.css`의 전역 토큰과 클래스를 사용한다.
- 이미지에는 의미 있는 `alt`를 제공하고 아이콘 전용 버튼에는 `aria-label`을 제공한다.
- 상호작용 요소에는 의미에 맞는 버튼 또는 링크를 사용하고 버튼 타입을 명시한다.
- 안정적인 id, contentId, 태그 또는 다른 고정 값이 있다면 배열 index를 `key`로 사용하지 않는다.
- 고정 또는 플로팅 UI와 밀도가 높은 카드 배치는 모바일 화면에서도 확인한다.
