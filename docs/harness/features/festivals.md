# Festivals Domain Guide

## Role

축제 도메인은 월/날짜 중심으로 서울의 축제를 탐색하고 상세 일정/장소를 확인하는 흐름이다.

## Key Files

- `src/views/FestivalsView.vue`
- `src/views/FestivalDetailView.vue`
- `src/components/FestivalCard.vue`
- `src/services/api.ts`: `getFestivals`, `getFestival`
- `src/types/index.ts`: `Festival`, `PaginationMeta`

## Core State

- `month`
- `selectedDate`
- `currentPage`
- `meta`
- `festivals`
- `loading`

필터를 바꿀 때 이 상태들이 서로 어긋나지 않도록 설계해야 한다.

## Date Rules

`startDate`와 `endDate`는 null일 수 있다. 현재 구현은 `YYYY-MM-DD` 부분을 분해해 로컬 `Date(year, month - 1, day)`를 만들기 때문에 단순 `new Date('YYYY-MM-DD')`로 바꾸면 시간대에 따라 날짜가 밀릴 수 있다.

축제 기간 판정은 선택 날짜가 start 00:00 ~ end 23:59:59 사이인지 확인한다.

## Pagination Rules

- `meta.pages`가 페이지 범위의 source of truth다.
- filter/month 변경 시 currentPage가 범위를 벗어나지 않게 한다.
- 페이지 이동 후 리스트 영역으로 스크롤하는 현재 UX를 변경할 때 의도를 명시한다.

## Missing Data

일정, 이미지, 위치 정보가 없더라도 화면이 깨지지 않아야 한다.
