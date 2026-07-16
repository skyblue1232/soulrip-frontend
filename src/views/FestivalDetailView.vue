<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { CalendarDays, MapPin, Tag, Database, ExternalLink, UsersRound } from 'lucide-vue-next'
import MapEmbed from '@/components/MapEmbed.vue'
import { api } from '@/services/api'
import type { Festival } from '@/types'

const route = useRoute()
const festival = ref<Festival | null>(null)
const loading = ref(true)
const error = ref('')

const name = computed(() => festival.value?.name || '')
const description = computed(() => festival.value?.description || '')

onMounted(async () => {
  try {
    festival.value = await api.getFestival(String(route.params.id))
  } catch (err) {
    error.value = err instanceof Error ? err.message : '축제 정보를 불러오지 못했습니다.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="page">
    <div v-if="loading" class="container loading">
      축제 정보를 불러오는 중입니다…
    </div>

    <div v-else-if="error || !festival" class="container empty-state card">
      <p class="error">{{ error }}</p>
      <RouterLink class="btn btn-soft" to="/festivals">
        목록으로
      </RouterLink>
    </div>

    <div v-else class="container">
      <RouterLink class="btn btn-soft btn-small" to="/festivals">
        ← 축제 목록으로
      </RouterLink>

      <section class="detail-hero festival-hero">
        <img :src="festival.imageUrl || festival.thumbnailUrl" :alt="name" />
        <div class="detail-hero-content">
          <span class="badge">
            <Tag :size="15" />
            {{ festival.category }}
          </span>
          <h1>{{ name }}</h1>
          <div class="hero-meta">
            <span>
              <CalendarDays :size="15" />
              {{ festival.startDate }} ~ {{ festival.endDate }}
            </span>
            <span>
              <MapPin :size="15" />
              {{ festival.location }}
            </span>
          </div>
        </div>
      </section>

      <div class="detail-layout">
        <section class="card detail-section">
          <h2>축제 소개</h2>
          <p class="description">
            {{ description }}
          </p>

          <h2 class="sub-title">
            방문 정보
          </h2>

          <div class="info-list">
            <div class="info-item">
              <CalendarDays :size="18" />
              <div>
                <strong>기간</strong>
                <span>{{ festival.startDate }} ~ {{ festival.endDate }}</span>
              </div>
            </div>

            <div class="info-item">
              <MapPin :size="18" />
              <div>
                <strong>장소</strong>
                <span>{{ festival.location }}</span>
              </div>
            </div>

            <div class="info-item">
              <Tag :size="18" />
              <div>
                <strong>지역</strong>
                <span>{{ festival.district || '-' }}</span>
              </div>
            </div>
          </div>
        </section>

        <aside class="side-column">
          <section class="tip-box">
            <span class="badge">
              <UsersRound :size="15" />
              혼행 추천
            </span>
            <h2>
              혼자 방문하기 좋은 축제를 찾아보세요.
            </h2>
          </section>

          <RouterLink
            class="btn btn-primary companion-btn"
            :to="`/community/new?type=COMPANION&place=${encodeURIComponent(name)}&date=${festival.startDate}`"
          >
            <UsersRound :size="16" />
            이 축제 동행 모집하기
          </RouterLink>

          <section class="card detail-section">
            <h2>데이터 정보</h2>

            <div class="info-list">
              <div class="info-item">
                <Database :size="18" />
                <div>
                  <strong>콘텐츠 ID</strong>
                  <span>{{ festival.contentId }}</span>
                </div>
              </div>

              <div class="info-item">
                <ExternalLink :size="18" />
                <div>
                  <strong>전화번호</strong>
                  <span>{{ festival.phone || '-' }}</span>
                </div>
              </div>
            </div>
          </section>
        </aside>
      </div>

      <MapEmbed
        :lat="festival.latitude || 0"
        :lng="festival.longitude || 0"
        :title="name"
      />
    </div>
  </div>
</template>

<style scoped>
.festival-hero {
  overflow: hidden;
  border-radius: 24px;
}

.detail-hero-content {
  padding: 28px;
}

.detail-hero-content h1 {
  margin: 18px 0;
  font-size: clamp(32px, 5vw, 48px);
  line-height: 1.25;
}

.hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  color: var(--muted);
  font-weight: 700;
}

.hero-meta span {
  display: flex;
  align-items: center;
  gap: 6px;
}

.description {
  color: var(--muted);
  font-size: 16px;
  line-height: 1.8;
}

.sub-title {
  margin-top: 32px;
}

.info-list {
  display: grid;
  gap: 14px;
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
  margin-top: 16px;
  font-size: 22px;
  line-height: 1.5;
}

.companion-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
</style>