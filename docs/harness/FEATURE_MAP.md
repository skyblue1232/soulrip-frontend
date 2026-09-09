# Soulrip Feature Map

| 도메인 | 주요 Route | View | Component | Service | Shared Type |
|---|---|---|---|---|---|
| Home | `/` | `HomeView.vue` | `HeroSection`, 공통 UI | AI insight 사용 가능 | `TodayInsightResponse` |
| Places | `/explore`, `/places/:id` | `ExploreView`, `PlaceDetailView` | `PlaceCard`, `MapEmbed` | `getPlaces`, `getPlace` | `Place`, `PlaceCategory` |
| Festivals | `/festivals`, `/festivals/:id` | `FestivalsView`, `FestivalDetailView` | `FestivalCard`, `MapEmbed` | `getFestivals`, `getFestival` | `Festival`, `PaginationMeta` |
| Community | `/community`, `/community/new`, `/community/:id`, `/community/:id/edit` | `CommunityListView`, `CommunityFormView`, `CommunityDetailView` | `PostCard` | posts/likes/comments methods | `CommunityPost`, `PostPayload`, `PostType`, `Comment`, `LikeResponse` |
| Chatbot | global widget | — | `ChatBot.vue` | `chat` | `ChatHistoryItem`, `ChatResponse`, `ChatSource` |
| App state | global | — | Nav/Footer/ChatBot consumers | — | `Lang` |

## Change Impact Examples

### Add Place Filter

`PlaceCategory` → `api.getPlaces` category mapping → `ExploreView` filter UI → 필요 시 `PlaceCard` label을 확인한다.

### Add Festival API Field

`Festival` 타입 → `api` 응답 contract → `FestivalsView`/`FestivalCard`/`FestivalDetailView` 표시를 확인한다.

### Add Community Post Type

`PostType` → 목록 필터 → 폼 선택지 → 상세 type label/icon → API payload/query를 확인한다.

### Add Supported Language

`Lang` → `useApp.languages` → app messages → static i18n → chatbot dictionary → backend chat language 지원을 확인한다.
