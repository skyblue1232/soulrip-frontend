---
name: Soulrip Router
description: 라우트와 화면 이동에 적용하는 규칙이다
applyTo: "src/router.ts"
---

# Router Rules

- 홈 라우트는 현재처럼 즉시 불러오고, 나머지 라우트 화면은 성능 측정 결과로 변경할 이유가 없는 한 지연 로딩 방식을 유지한다.
- 안정적인 라우트 이름과 기존 URL 체계인 `/explore`, `/places/:id`, `/festivals`, `/community`를 우선 유지한다.
- 새로운 기능이 독립적으로 이동 가능한 페이지일 때만 새 라우트를 추가한다. 로컬 패널이나 모달은 컴포넌트 상태를 우선 사용한다.
- 동적 형제 라우트와 충돌할 가능성이 있다면 더 구체적인 라우트를 먼저 선언한다.
- 제품 요구사항에서 별도의 404 페이지를 도입하지 않는 한 현재 fallback redirect를 유지한다.
- 라우트 파라미터를 변경할 때는 모든 `RouterLink`, `router.push`, `useRoute` 사용 위치를 함께 확인한다.
