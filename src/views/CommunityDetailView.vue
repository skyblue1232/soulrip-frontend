<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Eye,
  Heart,
  MessageCircle,
  MessageSquare,
  NotebookPen,
  Send,
  UserRound,
  UsersRound,
  Utensils,
} from 'lucide-vue-next'
import { api } from '@/services/api'
import type { Comment, CommunityPost } from '@/types'

const route = useRoute()
const router = useRouter()

const post = ref<CommunityPost | null>(null)
const comments = ref<Comment[]>([])

const loading = ref(true)
const error = ref('')

const commentsLoading = ref(true)
const commentError = ref('')
const commentSubmitting = ref(false)
const commentNickname = ref('')
const commentPassword = ref('')
const commentContent = ref('')

const deleteOpen = ref(false)
const password = ref('')
const deleteError = ref('')
const deleting = ref(false)
const liked = ref(false)

function getClientId() {
  let clientId = localStorage.getItem('client_id')

  if (!clientId) {
    clientId = crypto.randomUUID()
    localStorage.setItem('client_id', clientId)
  }

  return clientId
}

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
  const postId = Number(route.params.id)
  const clientId = getClientId()

  post.value = await api.getPost(postId)
  liked.value = await api.getLikeStatus(postId, clientId)
}

async function loadComments() {
  commentsLoading.value = true
  commentError.value = ''

  try {
    comments.value = await api.getComments(Number(route.params.id))
  } catch (err) {
    commentError.value = err instanceof Error
      ? err.message
      : '댓글을 불러오지 못했습니다.'
  } finally {
    commentsLoading.value = false
  }
}

async function submitComment() {
  if (
    !post.value ||
    !commentNickname.value.trim() ||
    !commentPassword.value.trim() ||
    !commentContent.value.trim()
  ) {
    commentError.value = '닉네임, 비밀번호, 댓글 내용을 모두 입력해주세요.'
    return
  }

  commentSubmitting.value = true
  commentError.value = ''

  try {
    const createdComment = await api.createComment(post.value.id, {
      nickname: commentNickname.value.trim(),
      password: commentPassword.value,
      content: commentContent.value.trim(),
    })

    comments.value.push(createdComment)
    post.value.commentCount += 1

    commentContent.value = ''
  } catch (err) {
    commentError.value = err instanceof Error
      ? err.message
      : '댓글을 등록하지 못했습니다.'
  } finally {
    commentSubmitting.value = false
  }
}

async function likePost() {
  if (!post.value || liked.value) return

  try {
    const clientId = getClientId()
    const result = await api.likePost(post.value.id, clientId)

    liked.value = result.liked
    post.value.likes = result.likesCount
  } catch (err) {
    error.value = err instanceof Error
      ? err.message
      : '좋아요 처리에 실패했습니다.'
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

onMounted(async () => {
  try {
    await Promise.all([
      loadPost(),
      loadComments(),
    ])
  } catch (err) {
    error.value = err instanceof Error
      ? err.message
      : '게시글을 불러오지 못했습니다.'
  } finally {
    loading.value = false
  }
})
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
          <span class="meta-item">
            <UserRound :size="15" />

            <span class="meta-label">
              작성자
            </span>

            <strong>
              {{ post.nickname }}
            </strong>
          </span>

          <span class="meta-item">
            <Eye :size="15" />

            <span class="meta-label">
              조회
            </span>

            <strong>
              {{ post.views }}
            </strong>
          </span>

          <span class="meta-item">
            <Heart :size="15" />

            <span class="meta-label">
              좋아요
            </span>

            <strong>
              {{ post.likes }}
            </strong>
          </span>

          <span class="meta-item">
            <MessageSquare :size="15" />

            <span class="meta-label">
              댓글
            </span>

            <strong>
              {{ post.commentCount }}
            </strong>
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
          <button
            class="btn btn-outline btn-small like-button"
            :class="{ liked }"
            :disabled="liked"
            @click="likePost"
          >
            <Heart
              :size="15"
              :fill="liked ? 'currentColor' : 'none'"
            />

            {{ liked ? '좋아요 완료' : '좋아요' }}

            <strong>
              {{ post.likes }}
            </strong>
          </button>

          <div>
            <RouterLink
              class="btn btn-soft btn-small"
              :to="`/community/${post.id}/edit`"
            >
              수정
            </RouterLink>

            <button
              class="btn btn-danger btn-small"
              @click="deleteOpen = true"
            >
              삭제
            </button>
          </div>
        </div>
      </article>

      <section class="card comments-section">
        <div class="comments-heading">
          <div>
            <p class="section-eyebrow">
              COMMUNITY
            </p>

            <h2>
              댓글
              <span>{{ post.commentCount }}</span>
            </h2>
          </div>

          <MessageSquare :size="24" />
        </div>

        <form class="comment-form" @submit.prevent="submitComment">
          <div class="comment-user-fields">
            <label>
              <span>닉네임</span>

              <input
                v-model="commentNickname"
                class="input"
                type="text"
                maxlength="20"
                placeholder="닉네임을 입력하세요"
              />
            </label>

            <label>
              <span>비밀번호</span>

              <input
                v-model="commentPassword"
                class="input"
                type="password"
                maxlength="30"
                placeholder="댓글 삭제·수정용 비밀번호"
              />
            </label>
          </div>

          <label class="comment-content-field">
            <span>댓글 내용</span>

            <textarea
              v-model="commentContent"
              class="input comment-textarea"
              maxlength="500"
              placeholder="댓글을 입력하세요."
              @keydown.ctrl.enter="submitComment"
            />
          </label>

          <div class="comment-form-bottom">
            <span>
              {{ commentContent.length }} / 500
            </span>

            <button
              class="btn btn-primary comment-submit"
              type="submit"
              :disabled="
                commentSubmitting ||
                !commentNickname.trim() ||
                !commentPassword.trim() ||
                !commentContent.trim()
              "
            >
              <Send :size="16" />

              {{ commentSubmitting ? '등록 중…' : '댓글 등록' }}
            </button>
          </div>
        </form>

        <p v-if="commentError" class="error comment-error">
          {{ commentError }}
        </p>

        <div v-if="commentsLoading" class="comments-state">
          댓글을 불러오는 중입니다…
        </div>

        <div v-else-if="comments.length === 0" class="comments-empty">
          <MessageCircle :size="28" />

          <strong>아직 댓글이 없습니다.</strong>

          <span>첫 번째 댓글을 남겨보세요.</span>
        </div>

        <div v-else class="comment-list">
          <article
            v-for="comment in comments"
            :key="comment.id"
            class="comment-item"
          >
            <div class="comment-avatar">
              {{ comment.nickname.slice(0, 1).toUpperCase() }}
            </div>

            <div class="comment-body">
              <div class="comment-meta">
                <strong>{{ comment.nickname }}</strong>

                <time :datetime="comment.createdAt">
                  {{ new Date(comment.createdAt).toLocaleString('ko-KR') }}
                </time>
              </div>

              <p>{{ comment.content }}</p>
            </div>
          </article>
        </div>
      </section>
    </div>

    <div
      v-if="deleteOpen"
      class="modal-backdrop"
      @click.self="deleteOpen = false"
    >
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

          <button
            class="btn btn-danger"
            :disabled="deleting || !password"
            @click="removePost"
          >
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

.post-detail,
.comments-section {
  margin-top: 20px;
  padding: 38px;
  border: 1px solid #e5eaf5;
  border-radius: 28px;
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

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 13px;
  border: 1px solid #e7ebf3;
  border-radius: 999px;
  color: #667085;
  background: #f8f9fc;
  font-size: 13px;
}

.meta-item svg {
  flex-shrink: 0;
  color: var(--primary);
}

.meta-label {
  color: #667085;
  font-weight: 600;
}

.meta-item strong {
  color: #344054;
  font-size: 13px;
  font-weight: 800;
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

.comments-section {
  margin-top: 24px;
}

.comments-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 22px;
}

.comments-heading > svg {
  color: var(--primary);
}

.section-eyebrow {
  margin: 0 0 5px;
  color: var(--primary);
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.14em;
}

.comments-heading h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  color: #111827;
  font-size: 26px;
}

.comments-heading h2 span {
  min-width: 28px;
  padding: 3px 9px;
  border-radius: 999px;
  color: var(--primary);
  background: #eef2ff;
  font-size: 13px;
  text-align: center;
}

.comment-form {
  padding: 22px;
  border: 1px solid #e6eaf2;
  border-radius: 20px;
  background: #f8faff;
}

.comment-user-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.comment-form label {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.comment-form label > span {
  color: #344054;
  font-size: 13px;
  font-weight: 800;
}

.comment-content-field {
  margin-top: 14px;
}

.comment-textarea {
  min-height: 116px;
  padding: 15px 16px;
  resize: vertical;
  line-height: 1.7;
}

.comment-form-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 12px;
}

.comment-form-bottom > span {
  color: #98a2b3;
  font-size: 12px;
  font-weight: 700;
}

.comment-submit {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.comment-error {
  margin-top: 14px;
}

.comments-state,
.comments-empty {
  margin-top: 20px;
  padding: 38px 20px;
  border: 1px dashed #d7deec;
  border-radius: 18px;
  color: #667085;
  text-align: center;
}

.comments-empty {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 7px;
}

.comments-empty svg {
  color: var(--primary);
}

.comments-empty strong {
  color: #344054;
}

.comments-empty span {
  font-size: 13px;
}

.comment-list {
  display: flex;
  flex-direction: column;
  margin-top: 24px;
}

.comment-item {
  display: flex;
  gap: 13px;
  padding: 20px 0;
  border-bottom: 1px solid #edf0f5;
}

.comment-item:first-child {
  padding-top: 0;
}

.comment-item:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.comment-avatar {
  display: grid;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 50%;
  color: var(--primary);
  background: #eef2ff;
  font-size: 14px;
  font-weight: 900;
}

.comment-body {
  min-width: 0;
  flex: 1;
}

.comment-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.comment-meta strong {
  color: #1d2939;
  font-size: 14px;
}

.comment-meta time {
  flex-shrink: 0;
  color: #98a2b3;
  font-size: 12px;
}

.comment-body p {
  margin: 8px 0 0;
  color: #475467;
  font-size: 14px;
  line-height: 1.75;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(15, 23, 42, 0.45);
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

.like-button strong {
  min-width: 20px;
  padding: 2px 7px;
  border-radius: 999px;
  background: rgba(65, 104, 247, 0.1);
  font-size: 12px;
  text-align: center;
}

.like-button.liked {
  color: #e5484d;
  border-color: #fecaca;
  background: #fff1f2;
}

.like-button.liked strong {
  background: rgba(229, 72, 77, 0.1);
}

@media (max-width: 700px) {
  .page {
    padding: 32px 0 60px;
  }

  .post-detail,
  .comments-section {
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

  .comment-user-fields {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 520px) {
  .comment-form {
    padding: 17px;
  }

  .comment-form-bottom,
  .comment-meta {
    align-items: flex-start;
    flex-direction: column;
  }

  .comment-submit {
    width: 100%;
    justify-content: center;
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
