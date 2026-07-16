<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  Sun,
  Clock3,
  Coffee,
  Heart,
  MapPin,
  Utensils,
  PartyPopper,
  MessageCircle,
  Compass,
  Sparkles,
} from 'lucide-vue-next'
import PlaceCard from '@/components/PlaceCard.vue'
import FestivalCard from '@/components/FestivalCard.vue'
import PostCard from '@/components/PostCard.vue'
import { api } from '@/services/api'
import type {
  CommunityPost,
  Festival,
  Place,
  TodayInsightResponse,
} from '@/types'

interface InsightItem {
  id: number
  category: string
  title: string
  description: string
  icon: typeof Sun
  tone: 'weather' | 'time' | 'place' | 'tip'
  image: string
  imageAlt: string
}

interface ServiceStat {
  id: number
  value: string
  label: string
  icon: typeof MapPin
  tone: 'place' | 'food' | 'festival'
}

const places = ref<Place[]>([])
const festivals = ref<Festival[]>([])
const posts = ref<CommunityPost[]>([])

const insight = ref<TodayInsightResponse | null>(null)

const loading = ref(true)
const insightLoading = ref(false)
const insightError = ref('')

const insightItems = computed<InsightItem[]>(() => {
  if (!insight.value) {
    return []
  }

  return [
    {
      id: 1,
      icon: Sun,
      tone: 'weather',
      category: insight.value.today.label,
      title: insight.value.today.headline,
      description: insight.value.today.description,
      image: insight.value.today.image_url,
      imageAlt: insight.value.today.headline,
    },
    {
      id: 2,
      icon: Clock3,
      tone: 'time',
      category: insight.value.time.label,
      title: insight.value.time.headline,
      description: insight.value.time.description,
      image: insight.value.time.image_url,
      imageAlt: insight.value.time.headline,
    },
    {
      id: 3,
      icon: Coffee,
      tone: 'place',
      category: insight.value.place.label,
      title: insight.value.place.headline,
      description: insight.value.place.description,
      image: insight.value.place.image_url,
      imageAlt: insight.value.place.headline,
    },
    {
      id: 4,
      icon: Heart,
      tone: 'tip',
      category: insight.value.tip.label,
      title: insight.value.tip.headline,
      description: insight.value.tip.description,
      image: insight.value.tip.image_url,
      imageAlt: insight.value.tip.headline,
    },
  ]
})

const serviceStats: ServiceStat[] = [
  {
    id: 1,
    value: '150+',
    label: '관광지',
    icon: MapPin,
    tone: 'place',
  },
  {
    id: 2,
    value: '80+',
    label: '맛집',
    icon: Utensils,
    tone: 'food',
  },
  {
    id: 3,
    value: '30+',
    label: '축제',
    icon: PartyPopper,
    tone: 'festival',
  },
]

const popularKeywords = [
  '#혼밥',
  '#혼자걷기',
  '#야경명소',
  '#전시추천',
  '#카페투어',
  '#당일치기',
]

async function loadTodayInsight() {
  if (insightLoading.value) {
    return
  }

  insightLoading.value = true
  insightError.value = ''

  try {
    insight.value = await api.getTodayInsight()
  } catch (error) {
    insightError.value =
      error instanceof Error
        ? error.message
        : '오늘의 AI 인사이트를 불러오지 못했습니다.'
  } finally {
    insightLoading.value = false
  }
}

onMounted(async () => {
  try {
    const [
      placeResult,
      festivalResult,
      postResult,
    ] = await Promise.all([
      api.getPlaces(),
      api.getFestivals(),
      api.getPosts({ size: 4 }),
    ])

    places.value = placeResult.items.slice(0, 6)
    festivals.value = festivalResult.items.slice(0, 3)
    posts.value = postResult.items.slice(0, 4)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <main class="home-page">
    <section class="hero-section">
      <div class="container hero-layout">
        <div class="hero-content">
          <span class="hero-badge">
            <Sparkles :size="15" />
            서울 혼행 가이드
          </span>

          <div class="hero-title-wrap">
            <h1 class="hero-title">
              서울,<br />
              <span class="hero-title-highlight">혼자여도</span><br />
              충분히 좋아요
            </h1>

            <span class="hero-heart">
              <Heart :size="38" />
            </span>
          </div>

          <p class="hero-description">
            혼밥하기 좋은 식당부터<br />
            혼자 걷기 좋은 코스까지.<br />
            여행자와 서울 주민 모두를 위한<br />
            로컬 혼행 가이드.
          </p>

          <div class="hero-actions">
            <RouterLink
              class="hero-button hero-button-primary"
              to="/explore"
            >
              <Compass :size="17" />
              지역 탐색하기
            </RouterLink>

            <RouterLink
              class="hero-button hero-button-outline"
              to="/community"
            >
              <MessageCircle :size="17" />
              커뮤니티
            </RouterLink>
          </div>

          <div class="hero-stats">
            <article
              v-for="stat in serviceStats"
              :key="stat.id"
              class="stat-card"
            >
              <div
                class="stat-icon"
                :class="`stat-icon-${stat.tone}`"
              >
                <component
                  :is="stat.icon"
                  :size="25"
                />
              </div>

              <div>
                <strong :class="`stat-value-${stat.tone}`">
                  {{ stat.value }}
                </strong>

                <span>{{ stat.label }}</span>
              </div>
            </article>
          </div>
        </div>

        <aside class="insight-panel">
          <div class="insight-header">
            <h2>
              <Sparkles :size="20" />
              오늘의 AI 인사이트
            </h2>

            <button
              class="refresh-button"
              type="button"
              :disabled="insightLoading"
              @click="loadTodayInsight"
            >
              {{
                insightLoading
                  ? '분석 중...'
                  : insight
                    ? '다시 불러오기'
                    : '인사이트 보기'
              }}
            </button>
          </div>

          <div
            v-if="!insight && !insightLoading && !insightError"
            class="insight-empty"
          >
            <Sparkles :size="32" />

            <strong>오늘의 서울 인사이트를 확인해 보세요.</strong>

            <span>
              AI가 서울 관광 데이터를 분석해<br />
              혼자 여행하기 좋은 정보를 추천해 드려요.
            </span>

            <button
              class="insight-load-button"
              type="button"
              @click="loadTodayInsight"
            >
              <Sparkles :size="17" />
              인사이트 보기
            </button>
          </div>

          <div
            v-else-if="insightLoading && !insight"
            class="insight-loading"
          >
            <Sparkles :size="24" />
            <strong>서울 관광 데이터를 분석하고 있어요.</strong>
            <span>혼자 여행하기 좋은 정보를 찾는 중이에요.</span>
          </div>

          <div
            v-else-if="insightError && !insight"
            class="insight-error"
          >
            <strong>인사이트를 불러오지 못했어요.</strong>
            <span>{{ insightError }}</span>

            <button
              type="button"
              @click="loadTodayInsight"
            >
              다시 시도
            </button>
          </div>

          <div
            v-else
            class="insight-list"
            :class="{ 'is-refreshing': insightLoading }"
          >
            <article
              v-for="item in insightItems"
              :key="item.id"
              class="insight-item"
            >
              <div
                class="insight-icon"
                :class="`insight-icon-${item.tone}`"
              >
                <component
                  :is="item.icon"
                  :size="26"
                />
              </div>

              <div class="insight-text">
                <span class="insight-category">
                  {{ item.category }}
                </span>

                <strong>
                  {{ item.title }}
                </strong>

                <p>
                  {{ item.description }}
                </p>
              </div>

              <img
                class="insight-image"
                :src="item.image"
                :alt="item.imageAlt"
                loading="lazy"
              />
            </article>
          </div>

          <p
            v-if="insightError && insight"
            class="insight-refresh-error"
          >
            새로고침에 실패했어요. 기존 인사이트를 표시합니다.
          </p>

          <!-- <RouterLink
            class="insight-more"
            to="/explore"
          >
            <span>더 많은 인사이트 보기</span>
            <span>→</span>
          </RouterLink> -->
        </aside>
      </div>
    </section>

    <section class="keyword-section">
      <div class="container keyword-bar">
        <strong>지금 많이 찾는 키워드</strong>

        <div class="keyword-list">
          <RouterLink
            v-for="keyword in popularKeywords"
            :key="keyword"
            class="keyword-chip"
            :to="{
              path: '/explore',
              query: {
                keyword: keyword.replace('#', ''),
              },
            }"
          >
            {{ keyword }}
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-heading">
          <div>
            <span class="badge">
              <MapPin :size="15" />
              서울 탐색
            </span>

            <h2 class="section-title">
              혼자 가기 좋은 서울
            </h2>
          </div>

          <RouterLink
            class="btn btn-soft btn-small"
            to="/explore"
          >
            전체 보기 →
          </RouterLink>
        </div>

        <div
          v-if="loading"
          class="grid place-grid"
        >
          <div
            v-for="i in 6"
            :key="i"
            class="skeleton"
          />
        </div>

        <div
          v-else
          class="grid place-grid"
        >
          <PlaceCard
            v-for="place in places"
            :key="place.id"
            :place="place"
          />
        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="container">
        <div class="section-heading">
          <div>
            <span class="badge">
              <PartyPopper :size="15" />
              축제 캘린더
            </span>

            <h2 class="section-title">
              곧 만날 서울 축제
            </h2>
          </div>

          <RouterLink
            class="btn btn-soft btn-small"
            to="/festivals"
          >
            전체 일정 →
          </RouterLink>
        </div>

        <div
          v-if="loading"
          class="grid festival-grid"
        >
          <div
            v-for="i in 3"
            :key="i"
            class="skeleton"
          />
        </div>

        <div
          v-else
          class="grid festival-grid"
        >
          <FestivalCard
            v-for="festival in festivals"
            :key="festival.id"
            :festival="festival"
          />
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-heading">
          <div>
            <span class="badge">
              <MessageCircle :size="15" />
              익명 혼행 커뮤니티
            </span>

            <h2 class="section-title">
              혼밥 추천부터 동행 모집까지
            </h2>
          </div>

          <RouterLink
            class="btn btn-primary btn-small"
            to="/community/new"
          >
            글쓰기
          </RouterLink>
        </div>

        <div
          v-if="loading"
          class="grid post-grid"
        >
          <div
            v-for="i in 4"
            :key="i"
            class="skeleton"
          />
        </div>

        <div
          v-else
          class="grid post-grid"
        >
          <PostCard
            v-for="post in posts"
            :key="post.id"
            :post="post"
          />
        </div>
      </div>
    </section>

    <RouterLink
      class="floating-chat-button"
      to="/chat"
      aria-label="AI 챗봇 열기"
    >
      <MessageCircle :size="28" />
    </RouterLink>
  </main>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
  color: var(--text-main);
  background: var(--page-bg);
}

:global(html.dark) .home-page,
:global(body.dark) .home-page,
:global(.dark) .home-page,
:global(.home-page.dark),

:global(html[data-theme='dark']) .home-page,
:global(body[data-theme='dark']) .home-page,
:global([data-theme='dark']) .home-page,
:global(.home-page[data-theme='dark']) {
  --page-bg: #0b1120;
  --hero-bg-start: #0f172a;
  --hero-bg-end: #0b1120;
  --surface: #172033;
  --surface-soft: #111a2c;
  --surface-alt: #0f1829;
  --text-main: #f8fafc;
  --text-sub: #a8b3c7;
  --border-soft: #34415c;
  --shadow-card: 0 12px 30px rgba(0, 0, 0, 0.24);
  --shadow-panel: 0 20px 50px rgba(0, 0, 0, 0.3);

  color: var(--text-main);
  background: var(--page-bg);
}

.hero-section {
  padding-top: 48px;
  background: linear-gradient(
    180deg,
    var(--hero-bg-start) 0%,
    var(--hero-bg-end) 100%
  );
}

.hero-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: 48px;
  align-items: start;
}

.hero-content {
  min-width: 0;
}

.hero-badge,
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 13px;
  border-radius: 999px;
  color: var(--primary);
  background: #eef2ff;
  font-size: 13px;
  font-weight: 800;
}

.hero-title-wrap {
  position: relative;
  margin-top: 20px;
}

.hero-title {
  margin: 0;
  color: var(--text-main);
  font-size: clamp(44px, 6vw, 72px);
  line-height: 1.15;
  letter-spacing: -0.05em;
}

.hero-title-highlight {
  color: var(--primary);
}

.hero-heart {
  position: absolute;
  top: 12px;
  right: 90px;
  color: #ff7c92;
  transform: rotate(-12deg);
}

.hero-description {
  margin-top: 24px;
  color: var(--text-sub);
  font-size: 18px;
  line-height: 1.8;
}

.hero-actions {
  display: flex;
  gap: 12px;
  margin-top: 30px;
}

.hero-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 48px;
  padding: 0 22px;
  border-radius: 14px;
  font-weight: 800;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.hero-button:hover {
  transform: translateY(-2px);
}

.hero-button-primary {
  color: #ffffff;
  background: var(--primary);
}

.hero-button-outline {
  color: var(--primary);
  border: 1px solid var(--border-soft);
  background: var(--surface);
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 42px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  padding: 16px;
  border-radius: 18px;
  background: var(--surface);
  box-shadow: var(--shadow-card);
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 14px;
}

.stat-icon-place {
  color: #4168f7;
  background: #eef2ff;
}

.stat-icon-food {
  color: #f97316;
  background: #fff2e8;
}

.stat-icon-festival {
  color: #ec4899;
  background: #ffeaf4;
}

.stat-card strong {
  display: block;
  color: var(--text-main);
  font-size: 22px;
  line-height: 1;
}

.stat-card span {
  display: block;
  margin-top: 5px;
  color: var(--text-sub);
  font-size: 13px;
  font-weight: 700;
}

.insight-panel {
  align-self: start;
  min-width: 0;
  padding: 28px;
  border-radius: 28px;
  background: var(--surface);
  box-shadow: var(--shadow-panel);
}

.insight-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 22px;
}

.insight-header h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  color: var(--text-main);
  font-size: 22px;
}

.refresh-button {
  flex-shrink: 0;
  border: 0;
  color: var(--primary);
  background: transparent;
  font-weight: 700;
  cursor: pointer;
}

.refresh-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.insight-empty,
.insight-loading,
.insight-error {
  display: flex;
  min-height: 330px;
  padding: 36px 24px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
  border-radius: 18px;
  color: var(--text-sub);
  background: var(--surface-soft);
  text-align: center;
}

.insight-empty > svg,
.insight-loading > svg {
  color: var(--primary);
}

.insight-empty strong,
.insight-loading strong,
.insight-error strong {
  color: var(--text-main);
  font-size: 16px;
}

.insight-empty span,
.insight-loading span,
.insight-error span {
  font-size: 13px;
  line-height: 1.7;
}

.insight-load-button,
.insight-error button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  height: 42px;
  margin-top: 10px;
  padding: 0 18px;
  border: 0;
  border-radius: 12px;
  color: #ffffff;
  background: var(--primary);
  font-weight: 800;
  cursor: pointer;
}

.insight-load-button:hover,
.insight-error button:hover {
  filter: brightness(0.96);
}

.insight-load-button:disabled,
.insight-error button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.insight-list.is-refreshing {
  opacity: 0.6;
  pointer-events: none;
}

.insight-list {
  display: grid;
  gap: 14px;
}

.insight-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) 70px;
  gap: 14px;
  align-items: center;
  min-width: 0;
  padding: 14px;
  border-radius: 18px;
  background: var(--surface-soft);
}

.insight-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 14px;
}

.insight-icon-weather {
  color: #f59e0b;
  background: #fff7dd;
}

.insight-icon-time {
  color: #4168f7;
  background: #eef2ff;
}

.insight-icon-place {
  color: #16a34a;
  background: #eaf8ef;
}

.insight-icon-tip {
  color: #ec4899;
  background: #ffeaf4;
}

.insight-text {
  min-width: 0;
}

.insight-category {
  color: #4168f7;
  font-size: 12px;
  font-weight: 800;
}

.insight-text strong {
  display: block;
  margin-top: 4px;
  color: var(--text-main);
  font-size: 15px;
}

.insight-text p {
  margin: 5px 0 0;
  color: var(--text-sub);
  font-size: 13px;
}

.insight-image {
  display: block;
  width: 70px;
  height: 70px;
  border-radius: 14px;
  object-fit: cover;
}

.insight-more {
  display: flex;
  justify-content: space-between;
  margin-top: 18px;
  color: var(--primary);
  font-weight: 800;
  text-decoration: none;
}

.keyword-section {
  padding: 20px 0;
  background: var(--page-bg);
}

.keyword-bar {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 20px 24px;
  border-radius: 18px;
  background: var(--surface-soft);
}

.keyword-bar > strong {
  flex-shrink: 0;
  color: var(--text-main);
}

.keyword-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.keyword-chip {
  padding: 8px 14px;
  border-radius: 999px;
  color: var(--text-sub);
  background: var(--surface);
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
}

.section {
  padding: 70px 0;
  background: var(--page-bg);
}

.section-alt {
  background: var(--surface-alt);
}

.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
  margin-bottom: 28px;
}

.floating-chat-button {
  position: fixed;
  right: 32px;
  bottom: 32px;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  color: #ffffff;
  background: var(--primary);
  box-shadow: 0 15px 35px rgba(65, 104, 247, 0.35);
}

/* 다크 모드에서 밝은 아이콘 배경만 조금 눌러줌 */
:global(html.dark) .home-page .hero-badge,
:global(body.dark) .home-page .hero-badge,
:global(.dark) .home-page .hero-badge,
:global([data-theme='dark']) .home-page .hero-badge,
:global(html.dark) .home-page .badge,
:global(body.dark) .home-page .badge,
:global(.dark) .home-page .badge,
:global([data-theme='dark']) .home-page .badge {
  color: #91a4ff;
  background: #1d2a4a;
}

@media (max-width: 1024px) {
  .hero-layout {
    grid-template-columns: 1fr;
    gap: 36px;
  }

  .hero-heart {
    right: 20%;
  }
}

@media (max-width: 700px) {
  .hero-section {
    padding: 40px 0 48px;
  }

  .hero-title {
    font-size: 42px;
  }

  .hero-heart {
    right: 10px;
  }

  .hero-actions {
    flex-direction: column;
  }

  .hero-button {
    width: 100%;
  }

  .hero-stats {
    grid-template-columns: 1fr;
    margin-top: 32px;
  }

  .keyword-bar,
  .section-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .insight-panel {
    padding: 20px;
  }

  .insight-empty,
  .insight-loading,
  .insight-error {
    min-height: 260px;
    padding: 28px 18px;
  }

  .insight-item {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .insight-image {
    display: none;
  }

  .floating-chat-button {
    right: 20px;
    bottom: 20px;
    width: 56px;
    height: 56px;
  }
}
</style>