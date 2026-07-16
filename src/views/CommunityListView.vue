<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { MessageCircle, Utensils, NotebookPen, UsersRound, Search } from 'lucide-vue-next'
import PostCard from '@/components/PostCard.vue'
import { api } from '@/services/api'
import type { CommunityPost, PostType } from '@/types'

const types: { key: PostType; label: string; icon: typeof MessageCircle }[] = [
  { key: 'ALL', label: '전체', icon: MessageCircle },
  { key: 'FOOD', label: '혼밥·장소 추천', icon: Utensils },
  { key: 'REVIEW', label: '여행 후기', icon: NotebookPen },
  { key: 'COMPANION', label: '동행 모집', icon: UsersRound },
]

const posts = ref<CommunityPost[]>([])
const postType = ref<PostType>('ALL')
const search = ref('')
const loading = ref(false)
const error = ref('')
let timer: number | undefined

async function loadPosts() {
  loading.value = true
  error.value = ''
  try {
    const result = await api.getPosts({ postType: postType.value, search: search.value })
    posts.value = result.items
  } catch (err) {
    error.value = err instanceof Error ? err.message : '게시글을 불러오지 못했습니다.'
  } finally {
    loading.value = false
  }
}

watch(postType, loadPosts)

watch(search, () => {
  window.clearTimeout(timer)
  timer = window.setTimeout(loadPosts, 280)
})

onMounted(loadPosts)
</script>

<template>
  <div class="page">
    <div class="container">
      <div class="section-heading">
        <div>
          <span class="badge">
            <MessageCircle :size="15" />
            익명 혼행 커뮤니티
          </span>
          <h1 class="section-title">혼자 다녀온 경험을 나누고, 함께 갈 사람을 찾아보세요</h1>
          <p class="section-description">회원가입 없이 닉네임과 비밀번호만으로 작성할 수 있습니다. 수정·삭제에는 작성 시 입력한 비밀번호가 필요합니다.</p>
        </div>
        <RouterLink class="btn btn-primary" to="/community/new">새 글 작성</RouterLink>
      </div>

      <div class="search-row">
        <div class="search-box">
          <Search :size="18" />
          <input v-model="search" class="input" placeholder="제목·내용·태그 검색" />
        </div>
      </div>

      <div class="pills" style="margin-bottom: 28px">
        <button v-for="type in types" :key="type.key" class="pill" :class="{ active: postType === type.key }" @click="postType = type.key">
          <component :is="type.icon" :size="15" />
          {{ type.label }}
        </button>
      </div>

      <div v-if="loading" class="grid post-grid">
        <div v-for="i in 6" :key="i" class="skeleton" />
      </div>

      <div v-else-if="error" class="empty-state card">
        <p class="error">{{ error }}</p>
        <button class="btn btn-soft" @click="loadPosts">다시 불러오기</button>
      </div>

      <div v-else-if="posts.length" class="grid post-grid">
        <PostCard v-for="post in posts" :key="post.id" :post="post" />
      </div>

      <div v-else class="empty-state card">
        조건에 맞는 게시글이 없습니다.
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 48px 0 80px;
}

.section-heading {
  align-items: flex-end;
  margin-bottom: 32px;
}

.section-description {
  max-width: 760px;
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
  height: 52px;
  padding: 0;
  border: 0;
  color: #111827;
  background: transparent;
  box-shadow: none;
  caret-color: #111827;
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
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 28px;
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
  color: var(--primary);
  border-color: #b9c7ff;
  background: #f7f8ff;
}

.pill.active {
  color: #fff;
  border-color: var(--primary);
  background: var(--primary);
  box-shadow: 0 8px 20px rgba(65, 104, 247, 0.25);
}

.post-grid {
  margin-top: 10px;
}

.skeleton {
  height: 260px;
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
  min-height: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  text-align: center;
}

.error {
  color: #e5484d;
  font-weight: 700;
}

button.btn {
  cursor: pointer;
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

  .section-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 20px;
  }

  .search-box {
    max-width: 100%;
  }

  .pills {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 4px;
  }

  .pill {
    flex-shrink: 0;
  }
}
</style>
