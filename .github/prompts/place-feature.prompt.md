---
name: soulrip-place-feature
description: 장소 탐색 및 상세 기능을 구현하거나 변경하는 프롬프트이다
argument-hint: "change=장소 탐색/필터/카드/상세 기능"
agent: agent
---

다음 Soulrip 장소 기능을 작업한다. `${input:change:변경할 장소 기능}`

수정하기 전에 필요한 범위에서 `src/views/ExploreView.vue`, `src/components/PlaceCard.vue`, `src/services/api.ts`, `src/types/index.ts`, `/places/:id` 라우트와 상세 뷰를 확인한다.

다음 불변조건을 유지한다.

- 기존 `PlaceCategory` 값과 API 카테고리 매핑을 기본 계약으로 유지한다.
- 검색으로 발생하는 요청이 과도하게 실행되지 않도록 기존 debounce 동작을 유지하거나 개선한다.
- 장소 데이터에는 지역구, 이미지, 좌표, 혼행 점수가 없을 수 있다.
- 목록 카드는 `imageUrl`보다 `thumbnailUrl`을 우선 사용한다.
- 새로운 장소 요청은 `api.getPlaces`, `api.getPlace` 또는 목적이 명확한 서비스 메서드를 통해 처리한다.
- 목록 항목에서 상세 화면으로 이동할 때 백엔드 상세 API가 기대하는 식별자를 전달한다.

먼저 계획을 세우고 구현한다. 이후 로딩, 오류, 빈 상태와 모바일 카드 배치를 확인하고 검증 결과와 백엔드 계약 관련 가정을 정리한다.
