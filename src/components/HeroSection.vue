<script setup lang="ts">
import { Compass, MapPin, MessageCircle, Sparkles } from 'lucide-vue-next'
import { useApp } from '@/composables/useApp'
import chatCat from '@/assets/images/chat-cat.jpg'

const { t } = useApp()

const cards = [
  {
    name: '경복궁',
    tag: '혼자 걷기',
    image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=520&auto=format&fit=crop',
  },
  {
    name: '성수',
    tag: '혼자 카페',
    image: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=520&auto=format&fit=crop',
  },
  {
    name: '광장시장',
    tag: '혼밥',
    image: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=520&auto=format&fit=crop',
  },
  {
    name: '남산',
    tag: '야경',
    image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=520&auto=format&fit=crop',
  },
]
</script>

<template>
  <section class="hero container">
    <div class="hero-glow glow-one" />
    <div class="hero-glow glow-two" />

    <div class="hero-copy">
      <span class="badge">
        <Sparkles :size="15" />
        {{ t.heroBadge }}
      </span>

      <h1>
        {{ t.heroTitle1 }}<br />
        <span>{{ t.heroTitle2 }}</span>
      </h1>

      <p>{{ t.heroDescription }}</p>

      <div class="hero-actions">
        <RouterLink class="btn btn-primary" to="/explore">
          <Compass :size="18" />
          {{ t.exploreCta }}
        </RouterLink>

        <RouterLink class="btn btn-outline" to="/community">
          <MessageCircle :size="18" />
          {{ t.communityCta }}
        </RouterLink>
      </div>

      <div class="stats">
        <div class="stat-item">
          <span class="stat-icon">
            <MapPin :size="18" />
          </span>
          <div>
            <strong>150+</strong>
            <span>서울 장소</span>
          </div>
        </div>

        <div class="stat-item">
          <span class="stat-icon">
            <Compass :size="18" />
          </span>
          <div>
            <strong>80+</strong>
            <span>혼행 정보</span>
          </div>
        </div>

        <div class="stat-item">
          <span class="stat-icon">
            <Sparkles :size="18" />
          </span>
          <div>
            <strong>30+</strong>
            <span>축제·행사</span>
          </div>
        </div>
      </div>
    </div>

    <div class="hero-visual">
      <div class="cat-badge">
        <img :src="chatCat" alt="Soulrip 고양이 캐릭터" />
        <div>
          <strong>Soulrip Pick</strong>
          <span>혼자 가기 좋은 서울</span>
        </div>
      </div>

      <div class="photo-grid">
        <RouterLink
          v-for="(card, index) in cards"
          :key="card.name"
          to="/explore"
          class="photo-card"
          :class="{ lowered: index % 2 === 1 }"
        >
          <img :src="card.image" :alt="card.name" loading="lazy" />
          <div class="photo-overlay" />
          <div class="photo-label">
            <span>{{ card.tag }}</span>
            <strong>{{ card.name }}</strong>
          </div>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, .92fr) minmax(480px, 1.08fr);
  align-items: center;
  gap: 64px;
  overflow: hidden;
  padding-top: 76px;
  padding-bottom: 84px;
}

.hero-glow {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.glow-one {
  top: 20px;
  right: 2%;
  width: 420px;
  height: 420px;
  background: radial-gradient(circle, color-mix(in srgb, var(--primary) 18%, transparent), transparent 68%);
}

.glow-two {
  top: 150px;
  left: -100px;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(255, 209, 102, .3), transparent 68%);
}

.hero-copy,
.hero-visual {
  position: relative;
  z-index: 1;
}

.hero-copy {
  min-width: 0;
}

.badge {
  gap: 7px;
  padding: 8px 14px;
}

h1 {
  margin: 22px 0 26px;
  color: var(--text);
  font-size: clamp(48px, 6vw, 76px);
  line-height: 1.06;
  letter-spacing: -.055em;
  word-break: keep-all;
}

h1 span {
  position: relative;
  display: inline-block;
  color: var(--primary);
}

h1 span::after {
  position: absolute;
  right: 0;
  bottom: -8px;
  left: 0;
  height: 6px;
  border-radius: 999px;
  content: '';
  background: color-mix(in srgb, var(--primary) 48%, transparent);
  transform: rotate(-1deg);
}

p {
  max-width: 520px;
  margin: 0;
  color: var(--muted);
  font-size: 17px;
  line-height: 1.8;
  white-space: pre-line;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 32px;
}

.hero-actions .btn {
  min-width: 174px;
  min-height: 52px;
  border-radius: 16px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 42px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 11px;
  min-width: 0;
  padding: 15px;
  border: 1px solid var(--border);
  border-radius: 18px;
  background: color-mix(in srgb, var(--surface) 92%, transparent);
  box-shadow: 0 8px 24px var(--shadow);
}

.stat-icon {
  display: grid;
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 12px;
  color: var(--primary);
  background: var(--soft);
}

.stat-item > div {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.stat-item strong {
  color: var(--primary);
  font-family: 'Fredoka', sans-serif;
  font-size: 23px;
  line-height: 1;
}

.stat-item div span {
  overflow: hidden;
  color: var(--subtle);
  font-size: 12px;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hero-visual {
  width: 100%;
  max-width: 620px;
  justify-self: end;
}

.cat-badge {
  display: inline-flex;
  align-items: center;
  gap: 11px;
  margin: 0 0 16px 8px;
  padding: 8px 14px 8px 8px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface);
  box-shadow: 0 8px 22px var(--shadow);
}

.cat-badge img {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  object-fit: cover;
}

.cat-badge div {
  display: grid;
  gap: 1px;
}

.cat-badge strong {
  color: var(--text);
  font-size: 13px;
}

.cat-badge span {
  color: var(--subtle);
  font-size: 11px;
  font-weight: 700;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.photo-card {
  position: relative;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--border) 80%, transparent);
  border-radius: 24px;
  background: var(--surface);
  box-shadow: 0 12px 30px var(--shadow-md);
  transition: transform .25s ease, box-shadow .25s ease;
}

.photo-card.lowered {
  transform: translateY(28px);
}

.photo-card:hover {
  transform: translateY(-4px) scale(1.015);
  box-shadow: 0 18px 38px var(--shadow-md);
}

.photo-card.lowered:hover {
  transform: translateY(22px) scale(1.015);
}

.photo-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .35s ease;
}

.photo-card:hover img {
  transform: scale(1.05);
}

.photo-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 38%, rgba(6, 12, 40, .82));
}

.photo-label {
  position: absolute;
  right: 16px;
  bottom: 16px;
  left: 16px;
  display: grid;
  gap: 7px;
  color: #fff;
}

.photo-label span {
  width: fit-content;
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--primary);
  font-size: 11px;
  font-weight: 800;
}

.photo-label strong {
  font-family: 'Fredoka', sans-serif;
  font-size: 20px;
  line-height: 1.2;
}

@media (max-width: 1000px) {
  .hero {
    grid-template-columns: 1fr;
    gap: 44px;
    padding-top: 56px;
  }

  .hero-copy {
    text-align: center;
  }

  .hero-copy p {
    margin-right: auto;
    margin-left: auto;
  }

  .hero-actions {
    justify-content: center;
  }

  .stats {
    max-width: 680px;
    margin-right: auto;
    margin-left: auto;
  }

  .hero-visual {
    max-width: 620px;
    justify-self: center;
  }

  .cat-badge {
    margin-left: 0;
  }
}

@media (max-width: 640px) {
  .hero {
    gap: 36px;
    padding-top: 42px;
    padding-bottom: 62px;
  }

  h1 {
    font-size: clamp(40px, 12vw, 54px);
  }

  .hero-actions {
    display: grid;
    grid-template-columns: 1fr;
  }

  .hero-actions .btn {
    width: 100%;
  }

  .stats {
    grid-template-columns: 1fr;
    gap: 9px;
    margin-top: 32px;
  }

  .stat-item {
    justify-content: flex-start;
  }

  .photo-grid {
    gap: 11px;
  }

  .photo-card {
    border-radius: 19px;
  }

  .photo-card.lowered {
    transform: translateY(16px);
  }

  .photo-card.lowered:hover {
    transform: translateY(12px) scale(1.01);
  }

  .photo-label {
    right: 12px;
    bottom: 12px;
    left: 12px;
  }

  .photo-label strong {
    font-size: 17px;
  }
}

@media (max-width: 400px) {
  .cat-badge {
    width: 100%;
    border-radius: 18px;
  }

  .cat-badge img {
    width: 42px;
    height: 42px;
  }
}
</style>