import { computed, reactive, watch } from 'vue'
import type { Lang } from '@/types'

interface AppMessages {
  navExplore: string
  navFestival: string
  navCommunity: string
  heroBadge: string
  heroTitle1: string
  heroTitle2: string
  heroDescription: string
  exploreCta: string
  communityCta: string
  footer: string
}

export const languages: { code: Lang; label: string }[] = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
  { code: 'zh', label: '中文' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
  { code: 'de', label: 'Deutsch' },
]

const languageCodes = languages.map((language) => language.code)

function isLang(value: string | null): value is Lang {
  return value !== null && languageCodes.includes(value as Lang)
}

const savedTheme = localStorage.getItem('soulrip-theme')
const savedLang = localStorage.getItem('soulrip-lang')

const state = reactive<{
  theme: 'light' | 'dark'
  lang: Lang
}>({
  theme: savedTheme === 'dark' ? 'dark' : 'light',
  lang: isLang(savedLang) ? savedLang : 'ko',
})

watch(
  () => state.theme,
  (theme) => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('soulrip-theme', theme)
  },
  { immediate: true },
)

watch(
  () => state.lang,
  (lang) => {
    document.documentElement.lang = lang
    localStorage.setItem('soulrip-lang', lang)
  },
  { immediate: true },
)

const messages: Record<Lang, AppMessages> = {
  ko: {
    navExplore: '서울 탐색',
    navFestival: '축제',
    navCommunity: '혼행 커뮤니티',
    heroBadge: '혼자여도 충분히 좋은 서울 여행',
    heroTitle1: '나만의 속도로,',
    heroTitle2: '서울을 Soulrip',
    heroDescription: '관광지·혼밥·축제 정보를 한곳에서 찾고,\n혼자 다녀온 경험과 함께할 일행을 익명으로 나눠보세요.',
    exploreCta: '서울 탐색하기',
    communityCta: '혼행 이야기 보기',
    footer: '혼자여도 연결되는 서울 여행',
  },
  en: {
    navExplore: 'Explore Seoul',
    navFestival: 'Festivals',
    navCommunity: 'Solo Community',
    heroBadge: 'A better Seoul trip, even on your own',
    heroTitle1: 'At your own pace,',
    heroTitle2: 'Soulrip Seoul',
    heroDescription: 'Find places, solo dining, and festivals in one place.\nShare experiences or find companions anonymously.',
    exploreCta: 'Explore Seoul',
    communityCta: 'Open Community',
    footer: 'Seoul travel that connects solo explorers',
  },
  ja: {
    navExplore: 'ソウル探索',
    navFestival: 'フェスティバル',
    navCommunity: 'ひとり旅コミュニティ',
    heroBadge: 'ひとりでも十分に楽しめるソウル旅行',
    heroTitle1: '自分のペースで、',
    heroTitle2: 'ソウルを Soulrip',
    heroDescription: '観光地・ひとりごはん・フェスティバル情報を一か所で確認し、\n旅の体験や同行者募集を匿名で共有できます。',
    exploreCta: 'ソウルを探索する',
    communityCta: 'コミュニティを見る',
    footer: 'ひとりでもつながるソウル旅行',
  },
  zh: {
    navExplore: '探索首尔',
    navFestival: '节庆活动',
    navCommunity: '独行社区',
    heroBadge: '一个人也能尽情享受的首尔旅行',
    heroTitle1: '按照自己的节奏，',
    heroTitle2: '用 Soulrip 探索首尔',
    heroDescription: '在一个平台查找景点、独自用餐和节庆信息，\n匿名分享旅行体验或寻找同行伙伴。',
    exploreCta: '探索首尔',
    communityCta: '查看社区',
    footer: '让独自旅行者彼此连接的首尔之旅',
  },
  fr: {
    navExplore: 'Explorer Séoul',
    navFestival: 'Festivals',
    navCommunity: 'Communauté solo',
    heroBadge: 'Un voyage à Séoul agréable, même en solo',
    heroTitle1: 'À votre rythme,',
    heroTitle2: 'Découvrez Séoul avec Soulrip',
    heroDescription: 'Trouvez des lieux, des restaurants adaptés aux voyageurs seuls et des festivals au même endroit.\nPartagez vos expériences ou trouvez des compagnons anonymement.',
    exploreCta: 'Explorer Séoul',
    communityCta: 'Voir la communauté',
    footer: 'Un voyage à Séoul qui relie les voyageurs solo',
  },
  es: {
    navExplore: 'Explorar Seúl',
    navFestival: 'Festivales',
    navCommunity: 'Comunidad en solitario',
    heroBadge: 'Un viaje por Seúl que también se disfruta a solas',
    heroTitle1: 'A tu propio ritmo,',
    heroTitle2: 'Descubre Seúl con Soulrip',
    heroDescription: 'Encuentra lugares, restaurantes para comer solo y festivales en un solo sitio.\nComparte experiencias o busca acompañantes de forma anónima.',
    exploreCta: 'Explorar Seúl',
    communityCta: 'Ver comunidad',
    footer: 'Un viaje por Seúl que conecta a viajeros en solitario',
  },
  de: {
    navExplore: 'Seoul entdecken',
    navFestival: 'Festivals',
    navCommunity: 'Solo-Community',
    heroBadge: 'Eine schöne Seoul-Reise, auch allein',
    heroTitle1: 'In deinem eigenen Tempo,',
    heroTitle2: 'Seoul mit Soulrip erleben',
    heroDescription: 'Finde Sehenswürdigkeiten, Restaurants für Alleinreisende und Festivals an einem Ort.\nTeile Erfahrungen oder finde anonym Reisebegleitung.',
    exploreCta: 'Seoul entdecken',
    communityCta: 'Community öffnen',
    footer: 'Eine Seoul-Reise, die Alleinreisende verbindet',
  },
}

export function useApp() {
  const t = computed(() => messages[state.lang])

  function toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light'
  }

  function setLang(lang: Lang) {
    state.lang = lang
  }

  return {
    state,
    t,
    languages,
    isDark: computed(() => state.theme === 'dark'),
    toggleTheme,
    setLang,
  }
}