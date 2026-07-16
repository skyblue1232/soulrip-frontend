<script setup lang="ts">
import { computed } from 'vue'
import {
  CalendarDays,
  ImageOff,
  MapPin,
} from 'lucide-vue-next'
import type { Festival } from '@/types'

const props = defineProps<{
  festival: Festival
}>()

const name = computed(
  () => props.festival.name || props.festival.title || '축제 정보',
)

const description = computed(
  () =>
    props.festival.description ||
    '축제 정보를 확인해 보세요.',
)

// 목록 카드에서는 썸네일 우선 사용
const imageUrl = computed(
  () =>
    props.festival.thumbnailUrl ||
    props.festival.imageUrl,
)

const dateText = computed(() => {
  if (!props.festival.dateAvailable) {
    return '일정 정보 없음'
  }

  const start =
    props.festival.startDate?.replace(/-/g, '.') || '-'

  const end =
    props.festival.endDate?.replace(/-/g, '.') || '-'

  return `${start} ~ ${end}`
})

const locationText = computed(
  () =>
    props.festival.district ||
    props.festival.location ||
    '서울',
)
</script>

<template>
  <RouterLink
    :to="`/festivals/${festival.contentId}`"
    class="card card-hover festival-card"
  >
    <div class="image-wrap">
      <img
        v-if="imageUrl"
        :src="imageUrl"
        :alt="name"
        loading="lazy"
      />

      <div
        v-else
        class="image-empty"
      >
        <ImageOff :size="30" />
        <span>이미지 없음</span>
      </div>

      <span class="category">
        {{ festival.category || '축제' }}
      </span>
    </div>

    <div class="festival-body">
      <div class="festival-location">
        <MapPin :size="14" />
        {{ locationText }}
      </div>

      <h3>{{ name }}</h3>

      <p>
        {{ description }}
      </p>

      <div class="festival-date">
        <CalendarDays :size="15" />
        {{ dateText }}
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
.festival-card {
  display: block;
  overflow: hidden;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.festival-card:hover {
  transform: translateY(-5px);
}

.image-wrap {
  position: relative;
  height: 190px;
  overflow: hidden;
  background: var(--surface-alt);
}

.image-wrap::after {
  position: absolute;
  inset: 0;
  content: '';
  pointer-events: none;
  background: linear-gradient(
    180deg,
    transparent 60%,
    rgba(0, 0, 0, 0.18)
  );
}

.image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.festival-card:hover img {
  transform: scale(1.05);
}

.image-empty {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--subtle);
}

.image-empty span {
  font-size: 13px;
  font-weight: 800;
}

.category {
  position: absolute;
  z-index: 1;
  top: 14px;
  left: 14px;
  padding: 6px 12px;
  border-radius: 999px;
  color: var(--primary);
  background: var(--surface);
  font-size: 12px;
  font-weight: 800;
}

.festival-body {
  padding: 18px 20px 20px;
}

.festival-location {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--subtle);
  font-size: 13px;
  font-weight: 800;
}

.festival-location svg {
  flex-shrink: 0;
}

h3 {
  margin: 12px 0 8px;
  color: var(--text);
  font-size: 21px;
  line-height: 1.35;
}

p {
  display: -webkit-box;
  overflow: hidden;
  min-height: 48px;
  margin: 0 0 18px;
  color: var(--muted);
  line-height: 1.6;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.festival-date {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--primary);
  font-size: 13px;
  font-weight: 800;
}

.festival-date svg {
  flex-shrink: 0;
}

@media (max-width: 600px) {
  .image-wrap {
    height: 170px;
  }

  .festival-body {
    padding: 16px;
  }

  h3 {
    font-size: 19px;
  }
}
</style>
