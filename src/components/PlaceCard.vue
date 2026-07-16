<script setup lang="ts">
import { computed } from 'vue'
import { MapPin, Star, ImageOff } from 'lucide-vue-next'
import type { Place } from '@/types'

const props = defineProps<{ place: Place }>()

const name = computed(
  () => props.place.name || props.place.title || '장소 정보',
)

// 목록 카드에서는 thumbnailUrl 우선
const imageUrl = computed(
  () => props.place.thumbnailUrl || props.place.imageUrl,
)

const summary = computed(() => {
  const parts = [
    props.place.district,
    props.place.address,
    props.place.contentType,
  ].filter(Boolean)

  return parts.join(' · ') || '서울의 장소 정보를 확인해 보세요.'
})

const categoryLabel = computed(() => {
  const labels: Record<string, string> = {
    TOUR: '관광',
    FOOD: '혼밥',
    CAFE: '카페',
    SHOPPING: '쇼핑·전시',
    NATURE: '자연',
    CULTURE: '문화시설',
    LEISURE: '레포츠',
    ACCOMMODATION: '숙박',
    COURSE: '여행코스',

    관광지: '관광지',
    음식점: '음식점',
    쇼핑: '쇼핑',
    문화시설: '문화시설',
    레포츠: '레포츠',
    숙박: '숙박',
    여행코스: '여행코스',
    축제공연행사: '축제공연행사',
  }

  return labels[props.place.category] || props.place.category || '서울 장소'
})

const soloScoreText = computed(() => {
  if (
    props.place.soloScore === null ||
    props.place.soloScore === undefined
  ) {
    return null
  }

  return `${props.place.soloScore}점`
})
</script>

<template>
  <RouterLink :to="`/places/${place.contentId}`" class="card card-hover place-card">
    <div class="image-wrap">
      <img v-if="imageUrl" :src="imageUrl" :alt="name" loading="lazy" />
      <div v-else class="image-empty">
        <ImageOff :size="30" />
        <span>이미지 없음</span>
      </div>

      <div class="image-overlay" />
      <span class="category-chip">{{ categoryLabel }}</span>

      <span v-if="soloScoreText" class="score-chip">
        <Star :size="13" fill="currentColor" />
        혼행 {{ soloScoreText }}
      </span>
    </div>

    <div class="content">
      <div class="district">
        <MapPin :size="14" />
        {{ place.district || '서울' }}
      </div>

      <h3>{{ name }}</h3>
      <p>{{ summary }}</p>

      <div v-if="place.tags.length" class="tags">
        <span v-for="tag in place.tags.slice(0, 3)" :key="tag" class="tag">#{{ tag }}</span>
      </div>

      <div v-else class="tags">
        <span class="tag">#{{ categoryLabel }}</span>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
.place-card {
  display: flex;
  min-width: 0;
  height: 100%;
  flex-direction: column;
  overflow: hidden;
  transition: transform .22s ease, box-shadow .22s ease;
}

.image-wrap {
  position: relative;
  height: 215px;
  flex-shrink: 0;
  overflow: hidden;
  background: var(--surface-alt);
}

.image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .35s ease;
}

.place-card:hover .image-wrap img {
  transform: scale(1.055);
}

.image-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(10, 16, 44, .03) 35%, rgba(10, 16, 44, .28));
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

.category-chip,
.score-chip {
  position: absolute;
  z-index: 1;
  top: 14px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 11px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  backdrop-filter: blur(8px);
}

.category-chip {
  left: 14px;
  color: #fff;
  background: color-mix(in srgb, var(--primary) 92%, transparent);
  box-shadow: 0 5px 14px rgba(30, 53, 145, .2);
}

.score-chip {
  right: 14px;
  color: #273256;
  background: rgba(255, 255, 255, .92);
  box-shadow: 0 5px 14px rgba(20, 31, 68, .12);
}

.score-chip svg {
  color: #f4a300;
}

.content {
  display: flex;
  min-height: 190px;
  flex: 1;
  flex-direction: column;
  padding: 19px 20px 21px;
}

.district {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--subtle);
  font-size: 12px;
  font-weight: 800;
}

.district svg {
  flex-shrink: 0;
  color: var(--primary);
}

h3 {
  display: -webkit-box;
  overflow: hidden;
  margin: 9px 0 9px;
  color: var(--text);
  font-size: 21px;
  line-height: 1.35;
  word-break: keep-all;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

p {
  display: -webkit-box;
  overflow: hidden;
  min-height: 49px;
  margin: 0 0 16px;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.65;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: auto;
}

.tag {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 700px) {
  .image-wrap {
    height: 205px;
  }

  .content {
    min-height: 175px;
    padding: 17px 18px 19px;
  }
}

@media (max-width: 480px) {
  .image-wrap {
    height: 190px;
  }

  .category-chip,
  .score-chip {
    top: 12px;
    padding: 5px 9px;
    font-size: 11px;
  }

  .category-chip {
    left: 12px;
  }

  .score-chip {
    right: 12px;
  }

  h3 {
    font-size: 19px;
  }
}
</style>
