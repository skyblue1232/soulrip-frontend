---
name: Soulrip Composable
description: 공통 반응형 로직과 앱 상태에 적용하는 규칙이다
applyTo: "src/composables/**/*.ts"
---

# Composable Rules

- 상태나 로직이 여러 곳에서 재사용되거나, 하나의 페이지 또는 컴포넌트에서 응집된 로직을 분리했을 때 더 명확해지는 경우에만 composable을 만든다.
- composable 이름은 `use...` 형식을 사용한다.
- 반환하는 상태와 변경 함수의 역할을 명확히 드러내고 숨겨진 부수 효과를 피한다.
- 상태를 영구 저장할 때는 `localStorage` 값을 신뢰하기 전에 유효성을 검증한다.
- `localStorage`, `document`, `window`와 같은 브라우저 전용 API는 명확한 범위에 격리하여 향후 SSR 전환 가능성을 불필요하게 어렵게 만들지 않는다.
- 파생값에는 `computed`를 우선 사용하고, 상태 변화로 발생하는 효과에는 필요한 범위에서 `watch`를 사용한다.
- 한 번만 사용하는 보조 로직을 불필요한 전역 반응형 상태로 만들지 않는다.

현재 `useApp.ts`는 테마와 언어 상태를 관리하고 `soulrip-theme`, `soulrip-lang`을 저장한다. 같은 상태를 관리하는 두 번째 기준점을 만들지 않고 기존 흐름을 확장한다.
