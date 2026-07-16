<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  MapPin,
  PartyPopper,
} from 'lucide-vue-next'

import type {
  Festival,
  PaginationMeta,
} from '@/types'
import FestivalCard from '@/components/FestivalCard.vue'
import { api } from '@/services/api'

interface CalendarDay {
  key: string
  day: number | null
  festivals: Festival[]
  isToday: boolean
  isSelected: boolean
}

const today = new Date()
const festivals = ref<Festival[]>([])
const month = ref<number | null>(today.getMonth() + 1)
const loading = ref(false)
const currentPage = ref(1)
const pageSize = 12

const meta = ref<PaginationMeta>({
  total: 0,
  page: 1,
  size: pageSize,
  pages: 1,
})

const selectedDate = ref(
  createDateKey(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate()
  )
)

const months = Array.from({ length: 12 }, (_, index) => index + 1)
const weekDays = ['일', '월', '화', '수', '목', '금', '토']

const calendarYear = computed(() => today.getFullYear())
const calendarMonth = computed(() => month.value ?? today.getMonth() + 1)

const calendarTitle = computed(() => {
  return `${calendarYear.value}년 ${calendarMonth.value}월`
})

const selectedDateLabel = computed(() => {
  const date = parseDateKey(selectedDate.value)

  if (!date) return '날짜를 선택해 주세요'

  return `${date.getMonth() + 1}월 ${date.getDate()}일 ${weekDays[date.getDay()]}요일`
})

const selectedDayFestivals = computed(() => {
  return festivals.value.filter((festival) =>
    festivalOccursOnDate(festival, selectedDate.value)
  )
})

const calendarDays = computed<CalendarDay[]>(() => {
  const year = calendarYear.value
  const targetMonth = calendarMonth.value
  const firstDayIndex = new Date(year, targetMonth - 1, 1).getDay()
  const lastDate = new Date(year, targetMonth, 0).getDate()

  const days: CalendarDay[] = []

  for (let index = 0; index < firstDayIndex; index++) {
    days.push({
      key: `empty-start-${index}`,
      day: null,
      festivals: [],
      isToday: false,
      isSelected: false,
    })
  }

  for (let day = 1; day <= lastDate; day++) {
    const key = createDateKey(year, targetMonth, day)

    days.push({
      key,
      day,
      festivals: festivals.value.filter((festival) =>
        festivalOccursOnDate(festival, key)
      ),
      isToday:
        year === today.getFullYear() &&
        targetMonth === today.getMonth() + 1 &&
        day === today.getDate(),
      isSelected: selectedDate.value === key,
    })
  }

  while (days.length % 7 !== 0) {
    days.push({
      key: `empty-end-${days.length}`,
      day: null,
      festivals: [],
      isToday: false,
      isSelected: false,
    })
  }

  return days
})

async function loadFestivals() {
  loading.value = true

  try {
    const result = await api.getFestivals({
      month: month.value,
      page: currentPage.value,
      size: pageSize,
    })

    festivals.value = result.items
    meta.value = result.meta

    setInitialSelectedDate()
  } finally {
    loading.value = false
  }
}

function setInitialSelectedDate() {
  const year = calendarYear.value
  const targetMonth = calendarMonth.value

  if (
    year === today.getFullYear() &&
    targetMonth === today.getMonth() + 1
  ) {
    selectedDate.value = createDateKey(
      year,
      targetMonth,
      today.getDate()
    )
    return
  }

  const lastDate = new Date(year, targetMonth, 0).getDate()

  for (let day = 1; day <= lastDate; day++) {
    const dateKey = createDateKey(year, targetMonth, day)

    if (
      festivals.value.some((festival) =>
        festivalOccursOnDate(festival, dateKey)
      )
    ) {
      selectedDate.value = dateKey
      return
    }
  }

  selectedDate.value = createDateKey(year, targetMonth, 1)
}

function selectMonth(value: number | null) {
  if (month.value === value) return

  currentPage.value = 1
  month.value = value
}

function selectDate(value: string) {
  selectedDate.value = value
}

function movePage(page: number) {
  if (
    page < 1 ||
    page > meta.value.pages ||
    page === currentPage.value
  ) {
    return
  }

  currentPage.value = page
  loadFestivals()

  document
    .querySelector('.festival-list-section')
    ?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
}

function getPageNumbers() {
  const totalPages = meta.value.pages
  const current = currentPage.value
  const maxVisible = 5

  let start = Math.max(
    1,
    current - Math.floor(maxVisible / 2),
  )

  let end = Math.min(
    totalPages,
    start + maxVisible - 1,
  )

  if (end - start + 1 < maxVisible) {
    start = Math.max(
      1,
      end - maxVisible + 1,
    )
  }

  return Array.from(
    { length: end - start + 1 },
    (_, index) => start + index,
  )
}

function createDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function parseDateKey(value: string) {
  const [year, month, day] = value.split('-').map(Number)

  if (!year || !month || !day) return null

  return new Date(year, month - 1, day)
}

function parseFestivalDate(value?: string | null) {
  if (!value) return null

  const [year, month, day] = value.slice(0, 10).split('-').map(Number)

  if (!year || !month || !day) return null

  return new Date(year, month - 1, day)
}

function festivalOccursOnDate(
  festival: Festival,
  dateKey: string
) {
  const selected = parseDateKey(dateKey)
  const start = parseFestivalDate(festival.startDate)
  const end = parseFestivalDate(festival.endDate) || start

  if (!selected || !start || !end) return false

  selected.setHours(0, 0, 0, 0)
  start.setHours(0, 0, 0, 0)
  end.setHours(23, 59, 59, 999)

  return selected >= start && selected <= end
}

function getFestivalPeriod(festival: Festival) {
  const start = parseFestivalDate(festival.startDate)
  const end = parseFestivalDate(festival.endDate)

  if (!start) return '일정 정보 없음'

  const startText = `${start.getMonth() + 1}.${start.getDate()}`

  if (!end || start.getTime() === end.getTime()) {
    return startText
  }

  return `${startText} - ${end.getMonth() + 1}.${end.getDate()}`
}

watch(month, loadFestivals)
onMounted(loadFestivals)
</script>

<template>
  <div class="page">
    <div class="container">
      <div class="section-heading festival-heading">
        <div>
          <span class="badge">
            <PartyPopper :size="15" />
            서울 축제 캘린더
          </span>
          <h1 class="section-title">혼자도, 함께도 즐거운 축제</h1>
          <p class="section-description">
            월별 일정을 확인하고 원하는 날짜를 눌러 진행 중인 축제를 확인해 보세요.
            동행이 필요하면 커뮤니티에서 함께 갈 사람을 모집할 수 있습니다.
          </p>
        </div>
        <RouterLink class="btn btn-primary" to="/community/new?type=COMPANION">
          동행 모집하기
        </RouterLink>
      </div>

      <div class="month-filter">
        <button class="pill" :class="{ active: month === null }" type="button" @click="selectMonth(null)">
          전체
        </button>
        <button v-for="item in months" :key="item" class="pill" :class="{ active: month === item }" type="button" @click="selectMonth(item)">
          {{ item }}월
        </button>
      </div>

      <section class="calendar-card">
        <div class="calendar-header">
          <div>
            <span class="calendar-eyebrow">FESTIVAL CALENDAR</span>
            <h2>{{ calendarTitle }}</h2>
          </div>
          <div class="calendar-guide">
            <span class="guide-line" />
            축제가 있는 날
          </div>
        </div>

        <div class="week-header">
          <div v-for="(weekDay, index) in weekDays" :key="weekDay" class="week-name" :class="{ sunday: index === 0, saturday: index === 6 }">
            {{ weekDay }}
          </div>
        </div>

        <div v-if="loading" class="calendar-loading">
          달력을 불러오는 중입니다.
        </div>

        <div v-else class="calendar-grid">
          <div
            v-for="dayItem in calendarDays"
            :key="dayItem.key"
            class="calendar-day"
            :class="{
              empty: dayItem.day === null,
              today: dayItem.isToday,
              selected: dayItem.isSelected,
              'has-festival': dayItem.festivals.length > 0,
            }"
            @click="dayItem.day !== null && selectDate(dayItem.key)"
          >
            <template v-if="dayItem.day !== null">
              <div class="day-header">
                <span class="day-number">
                  {{ dayItem.day }}
                </span>
                <span v-if="dayItem.isToday" class="today-label">
                  오늘
                </span>
              </div>

              <div class="calendar-events">
                <button
                  v-for="festival in dayItem.festivals.slice(0, 2)"
                  :key="festival.id"
                  class="event-line"
                  type="button"
                  :title="festival.name"
                  @click.stop="selectDate(dayItem.key)"
                >
                  <span class="event-line-bar" />
                  <span class="event-title">
                    {{ festival.name }}
                  </span>
                </button>

                <span v-if="dayItem.festivals.length > 2" class="more-festival">
                  +{{ dayItem.festivals.length - 2 }}개 더보기
                </span>
              </div>
            </template>
          </div>
        </div>
      </section>

      <section class="selected-date-section">
        <div class="selected-date-heading">
          <div>
            <span class="selected-date-badge">
              선택한 날짜
            </span>
            <h2>{{ selectedDateLabel }}</h2>
          </div>
          <span class="selected-count">
            {{ selectedDayFestivals.length }}개의 축제
          </span>
        </div>

        <div v-if="selectedDayFestivals.length" class="selected-festival-list">
          <article v-for="festival in selectedDayFestivals" :key="festival.id" class="selected-festival-item">
            <div class="selected-festival-line" />

            <div class="selected-festival-content">
              <span class="selected-festival-period">
                {{ getFestivalPeriod(festival) }}
              </span>

              <h3>
                {{ festival.name }}
              </h3>

              <p>
                <MapPin :size="14" />
                {{ festival.location }}
              </p>
            </div>

            <RouterLink class="selected-detail-link" :to="`/festivals/${festival.contentId}`">
              자세히 보기 →
            </RouterLink>
          </article>
        </div>

        <div v-else class="selected-empty">
          <CalendarDays :size="34" />
          <strong>이 날짜에는 예정된 축제가 없어요.</strong>
          <p>다른 날짜를 선택해 진행 중인 축제를 확인해 보세요.</p>
        </div>
      </section>

      <section class="festival-list-section">
        <div class="festival-list-heading">
          <div>
            <span class="badge">
              <PartyPopper :size="15" />
              축제 목록
            </span>
            <h2 class="section-title">
              {{ month === null ? '서울에서 열리는 축제' : `${month}월에 열리는 축제` }}
            </h2>
          </div>

          <span class="festival-total">
            총 {{ meta.total }}개
          </span>
        </div>

        <div v-if="loading" class="grid festival-grid">
          <div v-for="i in 6" :key="i" class="skeleton" />
        </div>

        <template v-else-if="festivals.length">
          <div class="grid festival-grid">
            <FestivalCard
              v-for="festival in festivals"
              :key="festival.id"
              :festival="festival"
            />
          </div>

          <nav
            v-if="meta.pages > 1"
            class="pagination"
            aria-label="축제 페이지 이동"
          >
            <button
              class="page-button page-arrow"
              type="button"
              :disabled="currentPage <= 1"
              aria-label="이전 페이지"
              @click="movePage(currentPage - 1)"
            >
              <ChevronLeft :size="18" />
            </button>

            <button
              v-for="pageNumber in getPageNumbers()"
              :key="pageNumber"
              class="page-button"
              :class="{ active: currentPage === pageNumber }"
              type="button"
              @click="movePage(pageNumber)"
            >
              {{ pageNumber }}
            </button>

            <button
              class="page-button page-arrow"
              type="button"
              :disabled="currentPage >= meta.pages"
              aria-label="다음 페이지"
              @click="movePage(currentPage + 1)"
            >
              <ChevronRight :size="18" />
            </button>
          </nav>
        </template>

        <div v-else class="empty-state card">
          선택한 월의 축제 정보가 없습니다.
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 48px 0 80px;
}

.festival-heading {
  align-items: flex-end;
  margin-bottom: 30px;
}

.section-description {
  max-width: 760px;
  margin: 14px 0 0;
  color: #667085;
  font-size: 16px;
  line-height: 1.7;
}

.month-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 30px;
}

.calendar-card {
  overflow: hidden;
  border: 1px solid #e4e8f2;
  border-radius: 26px;
  background: #fff;
  box-shadow: 0 18px 45px rgba(29, 45, 88, 0.06);
}

.calendar-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  padding: 28px 30px 24px;
  border-bottom: 1px solid #e9ecf4;
}

.calendar-eyebrow {
  display: block;
  margin-bottom: 7px;
  color: #4168f7;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: .12em;
}

.calendar-header h2 {
  margin: 0;
  color: #131b35;
  font-size: 28px;
}

.calendar-guide {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #667085;
  font-size: 13px;
  font-weight: 600;
}

.guide-line {
  width: 28px;
  height: 4px;
  border-radius: 999px;
  background: #4168f7;
}

.week-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #f8f9fd;
  border-bottom: 1px solid #e9ecf4;
}

.week-name {
  padding: 15px;
  color: #525d76;
  font-size: 13px;
  font-weight: 700;
  text-align: center;
}

.week-name.sunday {
  color: #ed5873;
}

.week-name.saturday {
  color: #4168f7;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.calendar-day {
  min-height: 130px;
  padding: 13px 11px;
  border-right: 1px solid #edf0f6;
  border-bottom: 1px solid #edf0f6;
  cursor: pointer;
  transition: .2s;
}

.calendar-day:nth-child(7n) {
  border-right: 0;
}

.calendar-day:hover:not(.empty) {
  background: #f8f9ff;
}

.calendar-day.empty {
  cursor: default;
  background: #fafbfc;
}

.calendar-day.selected {
  background: #f4f6ff;
  box-shadow: inset 0 0 0 2px #4168f7;
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.day-number {
  color: #27314e;
  font-size: 14px;
  font-weight: 700;
}

.today .day-number {
  display: inline-flex;
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #fff;
  background: #4168f7;
}

.today-label {
  color: #4168f7;
  font-size: 10px;
  font-weight: 800;
}

.calendar-events {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-top: 10px;
}

.event-line {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0;
  border: 0;
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.event-line-bar {
  width: 100%;
  height: 4px;
  border-radius: 999px;
  background: #4168f7;
}

.event-title {
  overflow: hidden;
  color: #46516c;
  font-size: 11px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.more-festival {
  color: #68738d;
  font-size: 11px;
  font-weight: 700;
}

.calendar-loading {
  display: flex;
  height: 400px;
  align-items: center;
  justify-content: center;
  color: #667085;
}

.selected-date-section {
  margin-top: 26px;
  padding: 28px 30px;
  border-radius: 24px;
  background: #f8f9ff;
}

.selected-date-heading,
.festival-list-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
}

.selected-date-badge {
  display: inline-flex;
  padding: 6px 11px;
  margin-bottom: 8px;
  border-radius: 999px;
  color: #4168f7;
  font-size: 12px;
  font-weight: 800;
  background: #e9edff;
}

.selected-date-heading h2 {
  margin: 0;
  font-size: 24px;
}

.selected-count,
.festival-total {
  color: #4168f7;
  font-size: 14px;
  font-weight: 800;
}

.selected-festival-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.selected-festival-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 22px;
  border-radius: 18px;
  background: #fff;
  border: 1px solid #e2e7f2;
}

.selected-festival-line {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 5px;
  border-radius: 18px 0 0 18px;
  background: #4168f7;
}

.selected-festival-content {
  flex: 1;
}

.selected-festival-period {
  color: #4168f7;
  font-size: 12px;
  font-weight: 800;
}

.selected-festival-content h3 {
  margin: 8px 0;
  font-size: 17px;
}

.selected-festival-content p {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  color: #68738d;
  font-size: 13px;
}

.selected-detail-link {
  color: #4168f7;
  font-size: 13px;
  font-weight: 800;
  text-decoration: none;
}

.selected-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 40px;
  border: 1px dashed #cfd6e8;
  border-radius: 18px;
  background: #fff;
  color: #667085;
  text-align: center;
}

.selected-empty strong {
  color: #26304a;
}

.festival-list-section {
  margin-top: 56px;
}

.festival-list-heading .section-title {
  margin-top: 10px;
}

.badge,
.pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 40px;
}

.page-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 42px;
  height: 42px;
  padding: 0 12px;
  border: 1px solid #e3e8f5;
  border-radius: 12px;
  color: #667085;
  background: #fff;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: 0.2s;
}

.page-button:hover:not(:disabled):not(.active) {
  color: var(--primary);
  border-color: #b9c7ff;
  background: #f7f8ff;
}

.page-button.active {
  color: #fff;
  border-color: var(--primary);
  background: var(--primary);
  box-shadow: 0 8px 18px rgba(65, 104, 247, 0.22);
}

.page-button:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

.page-arrow {
  padding: 0;
}

@media (max-width: 900px) {
  .calendar-day {
    min-height: 105px;
  }
}

@media (max-width: 700px) {
  .festival-heading,
  .calendar-header,
  .selected-date-heading,
  .festival-list-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .month-filter {
    flex-wrap: nowrap;
    overflow-x: auto;
  }

  .calendar-card {
    overflow-x: auto;
  }

  .week-header,
  .calendar-grid {
    min-width: 760px;
  }

  .selected-festival-item {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
