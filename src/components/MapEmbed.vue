<script setup lang="ts">
import { computed } from 'vue'
import { ExternalLink, MapPinned } from 'lucide-vue-next'

const props = defineProps<{
  lat: number
  lng: number
  title: string
}>()

const delta = 0.006

const hasValidLocation = computed(() => Number.isFinite(props.lat) && Number.isFinite(props.lng) && !(props.lat === 0 && props.lng === 0))

const mapUrl = computed(() => {
  if (!hasValidLocation.value) return ''

  const left = props.lng - delta
  const right = props.lng + delta
  const top = props.lat + delta
  const bottom = props.lat - delta

  return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${props.lat}%2C${props.lng}`
})

const externalUrl = computed(() => {
  if (!hasValidLocation.value) return '#'
  return `https://www.openstreetmap.org/?mlat=${props.lat}&mlon=${props.lng}#map=17/${props.lat}/${props.lng}`
})
</script>

<template>
  <section class="card map-card">
    <div class="map-header">
      <div>
        <span class="badge">
          <MapPinned :size="15" />
          위치 지도
        </span>
        <h2 class="section-title">{{ title }} 위치</h2>
      </div>

      <a
        v-if="hasValidLocation"
        class="btn btn-soft btn-small map-link"
        :href="externalUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
        큰 지도 열기
        <ExternalLink :size="15" />
      </a>
    </div>

    <iframe
      v-if="hasValidLocation"
      class="map-frame"
      :src="mapUrl"
      :title="`${title} 위치 지도`"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
    />

    <div v-else class="map-empty">
      <MapPinned :size="34" />
      <strong>위치 정보가 없습니다.</strong>
      <p>장소의 좌표가 등록되면 지도를 확인할 수 있습니다.</p>
    </div>
  </section>
</template>

<style scoped>
.map-card {
  margin-top: 26px;
  overflow: hidden;
  border-radius: 26px;
}

.map-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  padding: 26px 28px 22px;
  border-bottom: 1px solid var(--border);
}

.map-header .section-title {
  margin-top: 10px;
  font-size: clamp(25px, 4vw, 34px);
}

.badge,
.map-link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.map-frame {
  display: block;
  width: 100%;
  height: 430px;
  border: 0;
  background: var(--surface-alt);
}

.map-empty {
  display: flex;
  min-height: 320px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 40px 20px;
  color: var(--muted);
  text-align: center;
  background: var(--surface-alt);
}

.map-empty svg {
  color: var(--primary);
}

.map-empty strong {
  color: var(--text);
  font-size: 17px;
}

.map-empty p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
}

@media (max-width: 700px) {
  .map-card {
    border-radius: 22px;
  }

  .map-header {
    align-items: flex-start;
    flex-direction: column;
    padding: 22px;
  }

  .map-link {
    width: 100%;
  }

  .map-frame {
    height: 340px;
  }
}

@media (max-width: 480px) {
  .map-header {
    padding: 20px 16px;
  }

  .map-frame {
    height: 300px;
  }
}
</style>