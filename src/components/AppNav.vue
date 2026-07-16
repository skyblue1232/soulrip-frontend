<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Map, PartyPopper, MessageCircle, MapPin, Moon, Sun, Menu, X, Languages, ChevronDown } from 'lucide-vue-next'
import { useApp } from '@/composables/useApp'
import type { Lang } from '@/types'
import logo from '@/assets/images/logo.png'

const route = useRoute()
const { state, t, languages, isDark, toggleTheme, setLang } = useApp()
const menuOpen = ref(false)
const languageOpen = ref(false)

const links = [
  { to: '/explore', labelKey: 'navExplore', icon: Map },
  { to: '/festivals', labelKey: 'navFestival', icon: PartyPopper },
  { to: '/community', labelKey: 'navCommunity', icon: MessageCircle },
] as const

const currentLanguageLabel = computed(() => {
  return languages.find((language) => language.code === state.lang)?.label ?? '한국어'
})
const languageLabel = computed(() => ({
  ko: '언어', en: 'Language', ja: '言語', zh: '语言',
  fr: 'Langue', es: 'Idioma', de: 'Sprache',
}[state.lang]))

function active(path: string) {
  return route.path === path || route.path.startsWith(`${path}/`)
}

function selectLanguage(lang: Lang) {
  setLang(lang)
  languageOpen.value = false
}

function closeMobileMenu() {
  menuOpen.value = false
  languageOpen.value = false
}
</script>

<template>
  <header class="nav-wrap">
    <div class="container nav-inner">
      <RouterLink class="brand" to="/" aria-label="Soulrip 홈" @click="closeMobileMenu">
        <span class="brand-mark">
          <img :src="logo" alt="" aria-hidden="true" />
        </span>
        <span class="brand-name">Soulrip</span>
      </RouterLink>

      <nav class="desktop-links" aria-label="주요 메뉴">
        <RouterLink v-for="link in links" :key="link.to" :to="link.to" class="nav-link" :class="{ active: active(link.to) }">
          <span class="nav-icon">
            <component :is="link.icon" :size="18" :stroke-width="2" />
          </span>
          <span>{{ t[link.labelKey] }}</span>
        </RouterLink>
      </nav>

      <div class="nav-actions desktop-actions">
        <span class="seoul-chip">
          <MapPin :size="15" />
          Seoul
        </span>

        <div class="language-menu">
          <button class="lang-btn" type="button" :aria-expanded="languageOpen" aria-haspopup="listbox" @click="languageOpen = !languageOpen">
            <Languages :size="16" />
            <span>{{ currentLanguageLabel }}</span>
            <ChevronDown :size="15" :class="{ rotated: languageOpen }" />
          </button>

          <div v-if="languageOpen" class="language-dropdown" role="listbox">
            <button
              v-for="language in languages"
              :key="language.code"
              type="button"
              :class="{ active: state.lang === language.code }"
              @click="selectLanguage(language.code)"
            >
              {{ language.label }}
            </button>
          </div>
        </div>

        <button class="icon-btn" type="button" aria-label="테마 전환" @click="toggleTheme">
          <Sun v-if="isDark" :size="18" />
          <Moon v-else :size="18" />
        </button>
      </div>

      <div class="mobile-actions">
        <button class="icon-btn" type="button" aria-label="테마 전환" @click="toggleTheme">
          <Sun v-if="isDark" :size="18" />
          <Moon v-else :size="18" />
        </button>

        <button class="icon-btn" type="button" :aria-label="menuOpen ? '메뉴 닫기' : '메뉴 열기'" :aria-expanded="menuOpen" @click="menuOpen = !menuOpen">
          <X v-if="menuOpen" :size="20" />
          <Menu v-else :size="20" />
        </button>
      </div>
    </div>

    <div v-if="menuOpen" class="mobile-menu">
      <div class="container mobile-menu-inner">
        <RouterLink v-for="link in links" :key="link.to" :to="link.to" @click="closeMobileMenu">
          <span class="nav-icon">
            <component :is="link.icon" :size="18" :stroke-width="2" />
          </span>
          <span>{{ t[link.labelKey] }}</span>
        </RouterLink>

        <div class="mobile-language">
          <span class="mobile-language-label">
            <Languages :size="17" />
            {{ languageLabel }}
          </span>

          <select :value="state.lang" :aria-label="languageLabel" @change="selectLanguage(($event.target as HTMLSelectElement).value as Lang)">
            <option v-for="language in languages" :key="language.code" :value="language.code">
              {{ language.label }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.nav-wrap {
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid var(--border);
  background: color-mix(in srgb, var(--surface) 94%, transparent);
  box-shadow: 0 4px 18px color-mix(in srgb, var(--shadow) 45%, transparent);
  backdrop-filter: blur(18px);
}

.nav-inner {
  display: flex;
  align-items: center;
  gap: 26px;
  min-height: 76px;
  padding: 9px 0;
}

.brand {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 9px;
  min-height: 48px;
}

.brand-mark {
  position: relative;
  display: block;
  width: 28px;
  height: 32px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 8px;
}

.brand-mark img {
  position: absolute;
  top: -12px;
  left: -23px;
  display: block;
  width: 74px;
  height: 74px;
  max-width: none;
  object-fit: contain;
}

.brand-name {
  color: var(--primary);
  font-family: 'Fredoka', sans-serif;
  font-size: 25px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -.5px;
}

.desktop-links {
  display: flex;
  align-items: center;
  gap: 5px;
  height: 44px;
}

.nav-link {
  display: inline-flex;
  height: 42px;
  align-items: center;
  gap: 8px;
  padding: 0 15px;
  overflow: visible;
  border-radius: 999px;
  color: var(--muted);
  font-weight: 800;
  line-height: 1;
  white-space: nowrap;
  transition: color .2s ease, background .2s ease, transform .2s ease;
}

.nav-icon {
  display: inline-flex;
  width: 20px;
  height: 22px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  overflow: visible;
}

.nav-icon :deep(svg) {
  display: block;
  flex-shrink: 0;
  overflow: visible;
}

.nav-link:hover {
  color: var(--primary);
  background: var(--soft);
  transform: translateY(-1px);
}

.nav-link.active {
  color: #fff;
  background: var(--primary);
  box-shadow: 0 6px 18px color-mix(in srgb, var(--primary) 28%, transparent);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.seoul-chip,
.lang-btn {
  display: inline-flex;
  height: 40px;
  align-items: center;
  gap: 7px;
  padding: 0 14px;
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--text);
  background: var(--surface);
  font-size: 13px;
  font-weight: 800;
  line-height: 1;
  white-space: nowrap;
}

.seoul-chip {
  color: var(--primary);
  border-color: transparent;
  background: var(--soft);
}

.language-menu {
  position: relative;
}

.lang-btn {
  cursor: pointer;
}

.lang-btn svg:last-child {
  transition: transform .2s ease;
}

.lang-btn svg.rotated {
  transform: rotate(180deg);
}

.language-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  z-index: 120;
  display: grid;
  min-width: 180px;
  padding: 8px;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--surface);
  box-shadow: 0 16px 36px var(--shadow-md);
}

.language-dropdown button {
  padding: 10px 12px;
  border: 0;
  border-radius: 10px;
  color: var(--text);
  background: transparent;
  text-align: left;
  font-weight: 700;
  cursor: pointer;
}

.language-dropdown button:hover,
.language-dropdown button.active {
  color: var(--primary);
  background: var(--soft);
}

.icon-btn {
  display: grid;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  place-items: center;
  border: 1px solid var(--border);
  border-radius: 50%;
  background: var(--surface);
  cursor: pointer;
  transition: color .2s ease, background .2s ease, transform .2s ease;
}

.icon-btn:hover {
  color: var(--primary);
  background: var(--soft);
  transform: translateY(-1px);
}

.mobile-actions {
  display: none;
  gap: 8px;
  margin-left: auto;
}

.mobile-menu {
  border-top: 1px solid var(--border);
  background: var(--surface);
  box-shadow: 0 14px 30px var(--shadow);
}

.mobile-menu-inner {
  display: grid;
  gap: 7px;
  padding-top: 14px;
  padding-bottom: 18px;
}

.mobile-menu a {
  display: flex;
  width: 100%;
  min-height: 46px;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  overflow: visible;
  border-radius: 14px;
  color: var(--text);
  font-weight: 800;
}

.mobile-menu a.router-link-active {
  color: var(--primary);
  background: var(--soft);
}

.mobile-language {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 14px;
  background: var(--surface-alt);
}

.mobile-language-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  font-weight: 800;
}

.mobile-language select {
  width: 100%;
  padding: 9px 11px;
  border: 1px solid var(--border);
  border-radius: 10px;
  outline: none;
  color: var(--text);
  background: var(--surface);
}

@media (max-width: 1040px) {
  .nav-inner {
    gap: 18px;
  }

  .nav-link {
    padding: 0 12px;
  }

  .seoul-chip {
    display: none;
  }
}

@media (max-width: 900px) {
  .desktop-links,
  .desktop-actions {
    display: none;
  }

  .mobile-actions {
    display: flex;
  }
}

@media (max-width: 500px) {
  .nav-inner {
    min-height: 68px;
    padding: 8px 0;
  }

  .brand {
    gap: 7px;
  }

  .brand-mark {
    width: 25px;
    height: 29px;
  }

  .brand-mark img {
    top: -14px;
    left: -21px;
    width: 68px;
    height: 68px;
  }

  .brand-name {
    font-size: 22px;
  }

  .mobile-language {
    grid-template-columns: 1fr;
  }
}
</style>
