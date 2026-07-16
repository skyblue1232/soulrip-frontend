<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Utensils, NotebookPen, UsersRound, MessageCircle } from 'lucide-vue-next'
import { api } from '@/services/api'
import type { CommunityPost } from '@/types'

const route = useRoute()
const router = useRouter()
const post = ref<CommunityPost | null>(null)
const loading = ref(true)
const error = ref('')
const deleteOpen = ref(false)
const password = ref('')
const deleteError = ref('')
const deleting = ref(false)
const liked = ref(false)
const typeInfo = computed(() => {
  if (!post.value) return null

  return {
    FOOD: {
      label: '혼밥·장소 추천',
      icon: Utensils,
    },
    REVIEW: {
      label: '여행 후기',
      icon: NotebookPen,
    },
    COMPANION: {
      label: '동행 모집',
      icon: UsersRound,
    },
    GENERAL: {
      label: '자유 이야기',
      icon: MessageCircle,
    },
  }[post.value.type] || {
    label: '커뮤니티',
    icon: MessageCircle,
  }
})

async function loadPost() {
  try {
    post.value = await api.getPost(Number(route.params.id))
  } catch (err) {
    error.value = err instanceof Error ? err.message : '게시글을 불러오지 못했습니다.'
  } finally {
    loading.value = false
  }
}

async function likePost() {
  if (!post.value || liked.value) return

  try {
    let clientId = localStorage.getItem('client_id')

    if (!clientId) {
      clientId = crypto.randomUUID()
      localStorage.setItem('client_id', clientId)
    }

    const result = await api.likePost(post.value.id, clientId)

    liked.value = result.liked
    post.value.likes = result.likesCount
  } catch (err) {
    error.value = err instanceof Error ? err.message : '좋아요 처리에 실패했습니다.'
  }
}

async function removePost() {
  if (!post.value || !password.value) return

  deleting.value = true
  deleteError.value = ''

  try {
    await api.deletePost(post.value.id, password.value)
    await router.push('/community')
  } catch (err) {
    deleteError.value = err instanceof Error ? err.message : '삭제하지 못했습니다.'
  } finally {
    deleting.value = false
  }
}

onMounted(loadPost)
</script>

<template>
  <div class="page">
    <div v-if="loading" class="container loading">
      게시글을 불러오는 중입니다…
    </div>

    <div v-else-if="error || !post" class="container empty-state card">
      <p class="error">{{ error }}</p>
      <RouterLink class="btn btn-soft" to="/community">
        목록으로
      </RouterLink>
    </div>

    <div v-else class="container narrow">
      <RouterLink class="btn btn-soft btn-small" to="/community">
        ← 커뮤니티 목록
      </RouterLink>

      <article class="card post-detail">
        <div class="top-row">
          <span class="badge">
            <component :is="typeInfo?.icon" :size="15" />
            {{ typeInfo?.label }}
          </span>

          <span>
            {{ new Date(post.createdAt).toLocaleString('ko-KR') }}
          </span>
        </div>

        <h1>{{ post.title }}</h1>

        <div class="meta">
          <span>
            <UserRound :size="14" />
            {{ post.nickname }}
          </span>

          <span>
            <Eye :size="14" />
            {{ post.views }}
          </span>

          <span>
            <Heart :size="14" />
            {{ post.likes }}
          </span>

          <span>
            <MessageSquare :size="14" />
            {{ post.commentCount }}
          </span>
        </div>

        <p class="content">
          {{ post.content }}
        </p>

        <div class="tags">
          <span v-for="tag in post.tags" :key="tag" class="tag">
            #{{ tag }}
          </span>
        </div>

        <div class="actions">
          <button class="btn btn-outline btn-small" :disabled="liked" @click="likePost">
            <Heart :size="15" :fill="liked ? 'currentColor' : 'none'" />
            {{ liked ? '좋아요 완료' : '좋아요' }}
          </button>

          <div>
            <RouterLink class="btn btn-soft btn-small" :to="`/community/${post.id}/edit`">
              수정
            </RouterLink>

            <button class="btn btn-danger btn-small" @click="deleteOpen = true">
              삭제
            </button>
          </div>
        </div>
      </article>
    </div>

    <div v-if="deleteOpen" class="modal-backdrop" @click.self="deleteOpen = false">
      <section class="modal card">
        <h3>게시글 삭제</h3>

        <p class="help">
          작성할 때 입력한 비밀번호를 입력하세요.
        </p>

        <input
          v-model="password"
          class="input"
          type="password"
          placeholder="비밀번호"
          @keyup.enter="removePost"
        />

        <p v-if="deleteError" class="error">
          {{ deleteError }}
        </p>

        <div class="modal-actions">
          <button class="btn btn-soft" @click="deleteOpen = false">
            취소
          </button>

          <button class="btn btn-danger" :disabled="deleting || !password" @click="removePost">
            {{ deleting ? '삭제 중…' : '삭제' }}
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 48px 0 80px;
}

.narrow {
  max-width: 820px;
}

.post-detail {
  margin-top: 20px;
  padding: 38px;
  border-radius: 28px;
  border: 1px solid #e5eaf5;
  background: #fff;
  box-shadow: 0 20px 50px rgba(30, 41, 59, 0.08);
}

.top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.top-row > span:last-child {
  color: var(--muted);
  font-size: 13px;
  font-weight: 700;
}

h1 {
  margin: 22px 0 18px;
  color: #111827;
  font-size: clamp(30px, 5vw, 46px);
  line-height: 1.25;
  letter-spacing: -0.04em;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  padding-bottom: 22px;
  border-bottom: 1px solid var(--border);
}

.meta span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 999px;
  color: #667085;
  background: #f7f8fc;
  font-size: 13px;
  font-weight: 700;
}

.meta svg {
  color: var(--primary);
}

.content {
  min-height: 220px;
  padding: 32px 0;
  color: #344054;
  font-size: 16px;
  line-height: 1.9;
  white-space: pre-wrap;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  padding: 7px 13px;
  border-radius: 999px;
  color: var(--primary);
  background: #eef2ff;
  font-size: 13px;
  font-weight: 700;
}

.actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 28px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
}

.actions > button {
  display: flex;
  align-items: center;
  gap: 7px;
}

.actions > div {
  display: flex;
  gap: 10px;
}

.actions .btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(15, 23, 42, 0.45);
  z-index: 100;
}

.modal {
  width: min(420px, 100%);
  padding: 30px;
  border-radius: 24px;
  background: #fff;
}

.modal h3 {
  margin: 0 0 10px;
  font-size: 24px;
}

.help {
  margin-bottom: 18px;
  color: var(--muted);
  line-height: 1.6;
}

.modal .input {
  margin-bottom: 12px;
}

.modal-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 18px;
}

.error {
  padding: 12px 14px;
  border-radius: 12px;
  color: #d92d20;
  background: #fff1f0;
  font-size: 14px;
  font-weight: 700;
}

.loading,
.empty-state {
  min-height: 300px;
}

button svg {
  flex-shrink: 0;
}

@media (max-width: 700px) {
  .page {
    padding: 32px 0 60px;
  }

  .post-detail {
    padding: 26px 20px;
    border-radius: 22px;
  }

  .top-row {
    align-items: flex-start;
    flex-direction: column;
  }

  h1 {
    font-size: 32px;
  }

  .actions {
    align-items: stretch;
    flex-direction: column;
  }

  .actions > button,
  .actions > div {
    width: 100%;
  }

  .actions > div {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 420px) {
  .meta {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .meta span {
    justify-content: center;
  }

  .modal-actions {
    grid-template-columns: 1fr;
  }
}
</style>