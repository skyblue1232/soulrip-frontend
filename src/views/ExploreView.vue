<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { Globe, Landmark, Dumbbell, Building2, ShoppingBag, BedDouble, Route, PartyPopper, Search } from 'lucide-vue-next'
import PlaceCard from '@/components/PlaceCard.vue'
import { api } from '@/services/api'
import type { Place, PlaceCategory } from '@/types'

const categories: { key: PlaceCategory; label: string; icon: typeof Globe }[] = [
  { key: 'ALL', label: '전체', icon: Globe },
  { key: 'TOUR', label: '관광지', icon: Landmark },
  { key: 'LEISURE', label: '레포츠', icon: Dumbbell },
  { key: 'CULTURE', label: '문화시설', icon: Building2 },
  { key: 'SHOPPING', label: '쇼핑', icon: ShoppingBag },
  { key: 'ACCOMMODATION', label: '숙박', icon: BedDouble },
  { key: 'COURSE', label: '여행코스', icon: Route },
  { key: 'FESTIVAL', label: '축제공연행사', icon: PartyPopper },
]

const places = ref<Place[]>([])
const category = ref<PlaceCategory>('ALL')
const search = ref('')
const loading = ref(false)
const error = ref('')
let timer: number | undefined

async function loadPlaces() {
  loading.value = true
  error.value = ''
  try {
    const result = await api.getPlaces({ category: category.value, search: search.value })
    places.value = result.items
  } catch (err) {
    error.value = err instanceof Error ? err.message : '장소 정보를 불러오지 못했습니다.'
  } finally {
    loading.value = false
  }
}

watch(category, loadPlaces)

watch(search, () => {
  window.clearTimeout(timer)
  timer = window.setTimeout(loadPlaces, 280)
})

onMounted(loadPlaces)
</script>

<template>
  <div class="page">
    <div class="container">
      <div class="section-heading">
        <div>
          <span class="badge">
            <Globe :size="15" />
            서울 지역 정보
          </span>
          <h1 class="section-title">나에게 맞는 서울 찾기</h1>
          <p class="section-description">서울의 관광지·레포츠·문화시설·쇼핑·숙박·여행코스·축제공연행사를 유형별로 탐색하고 상세 정보를 확인하세요.</p>
        </div>
      </div>

      <div class="search-row">
        <div class="search-box">
          <Search :size="18" />
          <input v-model="search" class="input" placeholder="장소명, 지역, 태그 검색" />
        </div>
      </div>

      <div class="pills" style="margin-bottom: 28px">
        <button v-for="item in categories" :key="item.key" type="button" class="pill" :class="{ active: category === item.key }" @click="category = item.key">
          <component :is="item.icon" :size="15" />
          {{ item.label }}
        </button>
      </div>

      <div v-if="loading" class="grid place-grid">
        <div v-for="i in 6" :key="i" class="skeleton" />
      </div>

      <div v-else-if="error" class="empty-state card">
        <p class="error">{{ error }}</p>
        <button class="btn btn-soft" @click="loadPlaces">다시 불러오기</button>
      </div>

      <div v-else-if="places.length" class="grid place-grid">
        <PlaceCard v-for="place in places" :key="place.id" :place="place" />
      </div>

      <div v-else class="empty-state card">
        검색 조건에 맞는 장소가 없습니다.
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 48px 0 80px;
}

.section-heading {
  margin-bottom: 32px;
}

.section-description {
  max-width: 720px;
  margin-top: 12px;
  color: var(--muted);
  line-height: 1.7;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.search-row {
  margin-bottom: 24px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 620px;
  padding: 4px 18px;
  border: 1px solid #e3e8f5;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 8px 25px rgba(30, 41, 59, 0.06);
  transition: .2s;
}

.search-box:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(65, 104, 247, 0.12);
}

.search-box svg {
  flex-shrink: 0;
  color: var(--primary);
}

.search-box .input {
  border: 0;
  box-shadow: none;
  color: #111827;
  background: transparent;
  caret-color: #111827;
  height: 52px;
  padding: 0;
}

.search-box .input::placeholder {
  color: #6b7280;
  opacity: 1;
}

.search-box .input:focus {
  outline: none;
}

.pills {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 11px 18px;
  border: 1px solid #e3e8f5;
  border-radius: 999px;
  color: #667085;
  background: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: .2s;
}

.pill:hover {
  border-color: #b9c7ff;
  color: var(--primary);
  background: #f7f8ff;
}

.pill.active {
  border-color: var(--primary);
  color: #fff;
  background: var(--primary);
  box-shadow: 0 8px 20px rgba(65, 104, 247, 0.25);
}

.place-grid {
  margin-top: 10px;
}

.skeleton {
  height: 320px;
  border-radius: 22px;
  background: linear-gradient(
    90deg,
    #f3f5fa 25%,
    #edf1fa 37%,
    #f3f5fa 63%
  );
  background-size: 400% 100%;
  animation: loading 1.4s infinite;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 260px;
  gap: 14px;
  text-align: center;
  color: var(--muted);
}

.empty-state .error {
  color: #e5484d;
  font-weight: 700;
}

@keyframes loading {
  0% {
    background-position: 100% 0;
  }

  100% {
    background-position: -100% 0;
  }
}

@media (max-width: 700px) {
  .page {
    padding: 32px 0 60px;
  }

  .search-box {
    max-width: 100%;
  }

  .pills {
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 4px;
  }

  .pill {
    flex-shrink: 0;
  }
}
</style>
