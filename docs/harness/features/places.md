# Places Domain Guide

## Role

장소 도메인은 사용자가 서울의 관광지, 레포츠, 문화시설, 쇼핑, 숙박, 여행코스, 축제성 장소를 카테고리/검색으로 탐색하고 상세 정보를 보는 흐름을 담당한다.

## Key Files

- `src/views/ExploreView.vue`
- `src/views/PlaceDetailView.vue`
- `src/components/PlaceCard.vue`
- `src/components/MapEmbed.vue`
- `src/services/api.ts`: `getPlaces`, `getPlace`
- `src/types/index.ts`: `Place`, `PlaceCategory`

## Current Contract

`PlaceCategory`:

```text
ALL / TOUR / LEISURE / CULTURE / SHOPPING / ACCOMMODATION / COURSE / FESTIVAL
```

`api.getPlaces`는 category/search/page/size를 받아 query string을 만든다. category는 백엔드의 contentType 값으로 매핑된다.

## UI and Data Considerations

- `district`, `longitude`, `latitude`, `mapLevel`, `soloScore`는 null일 수 있다.
- 목록 이미지는 `thumbnailUrl || imageUrl` fallback을 사용한다.
- `name || title` fallback이 존재한다.
- 태그가 없을 수 있다.
- Explore 검색은 현재 약 280ms debounce로 API를 호출한다.

## Feature Extension Examples

### District Filter

필터 UI만 추가하지 말고 백엔드 query contract 존재 여부를 먼저 확인한다. 스펙이 없으면 프론트에서 전체 결과를 임의 필터링하기 전에 데이터 규모/페이지네이션 영향도 확인한다.

### Infinite Scroll

현재 API가 pagination meta를 제공하므로 기존 page/size contract를 보존하면서 누적 로딩 상태와 중복 요청 방지를 설계한다.

### Map Feature

좌표 null을 정상 상태로 처리하고 지도 없는 fallback UI를 제공한다.
