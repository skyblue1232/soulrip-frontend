<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Pencil, MessageCircle, Utensils, NotebookPen, UsersRound } from 'lucide-vue-next'
import { api } from '@/services/api'
import type { PostPayload } from '@/types'

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => route.name === 'community-edit')
const loading = ref(isEdit.value)
const submitting = ref(false)
const error = ref('')
const tagsInput = ref('')

const availableTypes = ['FOOD', 'REVIEW', 'COMPANION', 'GENERAL'] as const

const queryType = String(route.query.type || '').toUpperCase()

const initialType = availableTypes.includes(
  queryType as (typeof availableTypes)[number],
)
  ? queryType as (typeof availableTypes)[number]
  : 'FOOD'

const form = reactive<PostPayload>({
  type: initialType,
  title: '',
  content: '',
  nickname: '',
  password: '',
  tags: [],
})

const valid = computed(() =>
  form.title.trim().length >= 2 &&
  form.content.trim().length >= 2 &&
  form.nickname.trim().length > 0 &&
  form.password.length >= 4
)

const typeOptions = [
  {
    value: 'FOOD',
    label: '혼밥·장소 추천',
    icon: Utensils,
  },
  {
    value: 'REVIEW',
    label: '여행 후기',
    icon: NotebookPen,
  },
  {
    value: 'COMPANION',
    label: '축제·관광지 동행 모집',
    icon: UsersRound,
  },
  {
    value: 'GENERAL',
    label: '자유 이야기',
    icon: MessageCircle,
  },
]

onMounted(async () => {
  if (!isEdit.value) return

  try {
    const post = await api.getPost(Number(route.params.id))

    form.type = post.type
    form.title = post.title
    form.content = post.content
    form.nickname = post.nickname
    form.tags = post.tags

    tagsInput.value = post.tags.join(', ')
  } catch (err) {
    error.value = err instanceof Error ? err.message : '게시글을 불러오지 못했습니다.'
  } finally {
    loading.value = false
  }
})

async function submit() {
  if (!valid.value) return

  submitting.value = true
  error.value = ''

  form.tags = tagsInput.value
    .split(',')
    .map((tag) => tag.trim().replace(/^#/, ''))
    .filter(Boolean)

  try {
    const result = isEdit.value
      ? await api.updatePost(Number(route.params.id), form)
      : await api.createPost(form)

    await router.push(`/community/${result.id}`)
  } catch (err) {
    error.value = err instanceof Error ? err.message : '게시글을 저장하지 못했습니다.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="page">
    <div class="container form-container">
      <RouterLink
        class="btn btn-soft btn-small"
        :to="isEdit ? `/community/${route.params.id}` : '/community'"
      >
        ← 돌아가기
      </RouterLink>

      <section class="card form-card">
        <span class="badge">
          <Pencil v-if="isEdit" :size="15" />
          <MessageCircle v-else :size="15" />
          {{ isEdit ? '게시글 수정' : '익명 게시글 작성' }}
        </span>

        <h1>
          {{ isEdit ? '작성한 내용을 수정하세요' : '혼행 정보를 자유롭게 나눠보세요' }}
        </h1>

        <p class="section-description">
          비밀번호는 수정·삭제 시 필요합니다.
        </p>

        <div v-if="loading" class="loading">
          게시글을 불러오는 중입니다…
        </div>

        <form v-else class="form-grid" @submit.prevent="submit">
          <div class="form-group">
            <label class="form-label">게시글 유형</label>

            <select v-model="form.type" class="select">
              <option
                v-for="item in typeOptions"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </option>
            </select>
          </div>

          <div class="two-columns">
            <div class="form-group">
              <label class="form-label">닉네임</label>
              <input
                v-model="form.nickname"
                class="input"
                maxlength="40"
                placeholder="익명 닉네임"
              />
            </div>

            <div class="form-group">
              <label class="form-label">비밀번호</label>
              <input
                v-model="form.password"
                class="input"
                type="password"
                minlength="4"
                placeholder="4자 이상"
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">제목</label>
            <input
              v-model="form.title"
              class="input"
              maxlength="150"
              placeholder="제목을 입력하세요"
            />
          </div>

          <div class="form-group">
            <label class="form-label">내용</label>
            <textarea
              v-model="form.content"
              class="textarea"
              maxlength="5000"
              placeholder="혼자 방문했을 때의 팁, 후기, 동행 조건 등을 자세히 적어주세요."
            />
          </div>

          <div class="form-group">
            <label class="form-label">태그</label>
            <input
              v-model="tagsInput"
              class="input"
              placeholder="혼밥, 경복궁, 동행 (쉼표로 구분)"
            />
            <span class="help">
              관광지·맛집·축제·혼밥·동행 모집 등의 키워드를 입력하세요.
            </span>
          </div>

          <p v-if="error" class="error">
            {{ error }}
          </p>

          <button
            class="btn btn-primary"
            type="submit"
            :disabled="!valid || submitting"
          >
            {{ submitting ? '저장 중…' : isEdit ? '수정 저장' : '게시글 등록' }}
          </button>
        </form>
      </section>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 48px 0 80px;
}

.form-container {
  max-width: 820px;
}

.form-card {
  margin-top: 20px;
  padding: 38px;
  border-radius: 28px;
  background: #fff;
  border: 1px solid #e6eaf4;
  box-shadow: 0 20px 50px rgba(30, 41, 59, 0.08);
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

h1 {
  margin: 18px 0 10px;
  color: #111827;
  font-size: clamp(30px, 5vw, 44px);
  line-height: 1.25;
  letter-spacing: -0.04em;
}

.section-description {
  margin-bottom: 32px;
  color: var(--muted);
  line-height: 1.7;
}

.form-grid {
  display: grid;
  gap: 24px;
}

.form-group {
  display: grid;
  gap: 9px;
}

.form-label {
  color: #344054;
  font-size: 14px;
  font-weight: 800;
}

.input,
.textarea,
.select {
  width: 100%;
  border: 1px solid #dfe5f2;
  border-radius: 14px;
  background: #fff;
  color: #1d2939;
  transition: .2s;
}

.input,
.select {
  height: 52px;
  padding: 0 16px;
}

.textarea {
  min-height: 220px;
  padding: 16px;
  resize: vertical;
  line-height: 1.7;
}

.input:focus,
.textarea:focus,
.select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(65, 104, 247, 0.12);
}

.two-columns {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}

.help {
  color: #667085;
  font-size: 13px;
  line-height: 1.5;
}

.error {
  padding: 14px 16px;
  border-radius: 14px;
  color: #d92d20;
  background: #fff1f0;
  font-size: 14px;
  font-weight: 700;
}

button.btn-primary {
  width: 100%;
  height: 54px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 800;
  transition: .2s;
}

button.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(65, 104, 247, 0.25);
}

button.btn-primary:disabled {
  opacity: .5;
  cursor: not-allowed;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: var(--muted);
  font-weight: 700;
}

@media (max-width: 768px) {
  .page {
    padding: 32px 0 60px;
  }

  .form-card {
    padding: 28px 22px;
    border-radius: 22px;
  }

  h1 {
    font-size: 32px;
  }

  .two-columns {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .form-card {
    padding: 22px 16px;
  }

  h1 {
    font-size: 28px;
  }

  .input,
  .select {
    height: 48px;
  }

  .textarea {
    min-height: 180px;
  }
}
</style>