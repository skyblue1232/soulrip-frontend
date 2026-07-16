<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Bookmark, BookmarkCheck, MapPin, Star, Clock3, WalletCards, Share2, Database, Sparkles } from 'lucide-vue-next'
import MapEmbed from '@/components/MapEmbed.vue'
import { api } from '@/services/api'
import type { Place } from '@/types'

const route = useRoute()

const place = ref<Place | null>(null)
const loading = ref(true)
const error = ref('')
const bookmarked = ref(false)

const name = computed(() => place.value?.name || place.value?.title || '')

const description = computed(() => {
  if (!place.value) return ''
  return `${place.value.category} 카테고리의 ${name.value}입니다. ${place.value.tags.join(', ')} 관련 정보를 확인해 보세요.`
})

const score = computed(() => {
  if (place.value?.soloScore === null || place.value?.soloScore === undefined) return '-'
  return `${place.value.soloScore}점`
})

function bookmarkKey() {
  return `soulrip-place-${route.params.id}`
}

function toggleBookmark() {
  bookmarked.value = !bookmarked.value
  localStorage.setItem(bookmarkKey(), String(bookmarked.value))
}

async function share() {
  const data = {
    title: name.value,
    text: place.value?.address || '',
    url: window.location.href,
  }

  if (navigator.share) {
    await navigator.share(data)
  } else {
    await navigator.clipboard.writeText(window.location.href)
    window.alert('링크를 복사했습니다.')
  }
}

onMounted(async () => {
  bookmarked.value = localStorage.getItem(bookmarkKey()) === 'true'

  try {
    place.value = await api.getPlace(Number(route.params.id))
  } catch (err) {
    error.value = err instanceof Error ? err.message : '장소 정보를 불러오지 못했습니다.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="page">
    <div v-if="loading" class="container loading">
      장소 정보를 불러오는 중입니다…
    </div>

    <div v-else-if="error || !place" class="container empty-state card">
      <p class="error">{{ error }}</p>
      <RouterLink class="btn btn-soft" to="/explore">
        목록으로
      </RouterLink>
    </div>

    <div v-else class="container">
      <RouterLink class="btn btn-soft btn-small" to="/explore" style="margin-bottom: 20px;">
        ← 서울 탐색으로
      </RouterLink>

      <section class="detail-hero place-hero">
        <img :src="place.imageUrl || place.thumbnailUrl" :alt="name" />

        <div class="detail-hero-content">
          <span class="badge">
            <MapPin :size="15" />
            {{ place.district || '서울' }}
          </span>

          <h1>
            {{ name }}
          </h1>

          <p>
            {{ description }}
          </p>
        </div>
      </section>

      <div class="detail-layout">
        <section class="card detail-section">
          <h2>
            장소 소개
          </h2>

          <p class="description">
            {{ description }}
          </p>

          <div class="tags">
            <span v-for="tag in place.tags" :key="tag" class="tag">
              #{{ tag }}
            </span>
          </div>

          <h2 class="sub-title">
            이용 정보
          </h2>

          <div class="info-list">
            <div class="info-item">
              <MapPin :size="18" />
              <div>
                <strong>주소</strong>
                <span>{{ place.address }}</span>
              </div>
            </div>

            <div class="info-item">
              <Star :size="18" />
              <div>
                <strong>혼행 추천 점수</strong>
                <span>{{ score }}</span>
              </div>
            </div>

            <div class="info-item">
              <Clock3 :size="18" />
              <div>
                <strong>카테고리</strong>
                <span>{{ place.category }}</span>
              </div>
            </div>
          </div>
        </section>

        <aside class="side-column">
          <section class="tip-box">
            <span class="badge">
              <Sparkles :size="15" />
              혼행 추천
            </span>

            <h2>
              혼자 방문하기 좋은 장소인지 확인해 보세요.
            </h2>
          </section>

          <section class="card detail-section action-card">
            <button class="btn btn-soft" type="button" @click="toggleBookmark">
              <BookmarkCheck v-if="bookmarked" :size="16" />
              <Bookmark v-else :size="16" />
              {{ bookmarked ? '저장됨' : '북마크' }}
            </button>

            <button class="btn btn-outline" type="button" @click="share">
              <Share2 :size="16" />
              공유하기
            </button>
          </section>

          <section class="card detail-section source-card">
            <h2>
              데이터 정보
            </h2>

            <div class="info-list">
              <div class="info-item">
                <Database :size="18" />
                <div>
                  <strong>콘텐츠 ID</strong>
                  <span>{{ place.contentId }}</span>
                </div>
              </div>

              <div class="info-item">
                <WalletCards :size="18" />
                <div>
                  <strong>콘텐츠 유형</strong>
                  <span>{{ place.contentType }}</span>
                </div>
              </div>
            </div>
          </section>
        </aside>
      </div>

      <MapEmbed
        :lat="place.latitude || 0"
        :lng="place.longitude || 0"
        :title="name"
      />
    </div>
  </div>
</template>

<style scoped>
.place-hero {
  overflow: hidden;
  border-radius: 24px;
}
.detail-hero-content p {
  max-width: 720px;
  margin: 0;
  font-size: 18px;
  line-height: 1.7;
  color: var(--muted);
}
.description {
  color: var(--muted);
  line-height: 1.9;
  font-size: 16px;
}
.sub-title {
  margin-top: 32px;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 22px;
}
.side-column {
  display: grid;
  gap: 20px;
  align-content: start;
}
.tip-box {
  padding: 24px;
  border-radius: 20px;
  background: var(--soft);
}
.tip-box h2 {
  margin: 16px 0 0;
  font-size: 22px;
  line-height: 1.5;
}
.info-list {
  display: grid;
  gap: 12px;
}
.info-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: 14px;
  background: var(--soft);
}
.info-item svg {
  margin-top: 2px;
  color: var(--primary);
}
.info-item div {
  display: grid;
  gap: 4px;
}
.info-item span {
  color: var(--muted);
}
.action-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.action-card button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.source-card .info-item {
  font-size: 13px;
}
@media (max-width: 500px) {
  .action-card {
    grid-template-columns: 1fr;
  }
}
</style>