---
name: soulrip-festival-feature
description: 축제 목록, 달력, 필터, 페이지네이션, 상세 기능을 변경하는 프롬프트이다
argument-hint: "change=축제 캘린더/필터/페이지네이션/상세 변경"
agent: agent
---

다음 Soulrip 축제 기능을 작업한다. `${input:change:변경할 축제 기능}`

수정하기 전에 `FestivalsView.vue`, `FestivalCard.vue`, 축제 상세 화면, `api.getFestivals`, `api.getFestival`, `Festival`, `PaginationMeta` 타입을 확인한다.

다음 요구사항을 유지한다.

- `startDate`와 `endDate`는 null일 수 있는 값으로 처리한다.
- 로컬 달력의 날짜 의미를 유지하고 UTC 변환 때문에 날짜가 하루 밀릴 수 있는 파싱을 피한다.
- 월 또는 필터 조건이 바뀌면 페이지네이션과 선택 날짜 상태가 서로 일치하도록 유지한다.
- 사용 가능한 페이지 수는 API의 페이지네이션 메타데이터를 기준으로 판단한다.
- 파싱한 시작일과 종료일 범위에 포함되지 않는 날짜를 축제 개최일로 계산하지 않는다.
- 일정, 이미지, 위치 데이터가 없을 때도 안전한 대체 UI를 제공한다.

구현 전에 변경 계획을 세운다. 이후 달력 날짜 선택, 월 변경, 첫 페이지와 마지막 페이지, 빈 결과, 타입 검사와 빌드를 검증한다.
