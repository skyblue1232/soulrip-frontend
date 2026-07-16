<script setup lang="ts">
import { computed } from 'vue'
import { Eye, Heart, MessageCircle, MessageSquare, NotebookPen, UserRound, UsersRound, Utensils } from 'lucide-vue-next'
import type { CommunityPost } from '@/types'

const props = defineProps<{ post: CommunityPost }>()

const typeInfo = computed(() => {
  const labels = {
    FOOD: { text: '혼밥·장소 추천', icon: Utensils },
    REVIEW: { text: '여행 후기', icon: NotebookPen },
    COMPANION: { text: '동행 모집', icon: UsersRound },
    GENERAL: { text: '자유 이야기', icon: MessageCircle },
  }
  return labels[props.post.type as keyof typeof labels] ?? { text: '커뮤니티', icon: MessageCircle }
})

const createdDate = computed(() => {
  const date = new Date(props.post.createdAt)
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('ko-KR')
})
</script>

<template>
  <RouterLink :to="`/community/${post.id}`" class="card card-hover post-card">
    <div class="post-meta-top">
      <span class="type-chip">
        <component :is="typeInfo.icon" :size="15" />
        {{ typeInfo.text }}
      </span>
      <span class="created-date">{{ createdDate }}</span>
    </div>

    <h3>{{ post.title }}</h3>
    <p class="post-content">{{ post.content }}</p>

    <div v-if="post.tags.length" class="tags">
      <span v-for="tag in post.tags.slice(0, 3)" :key="tag" class="tag">#{{ tag }}</span>
    </div>
    <div v-else class="tags">
      <span class="tag">#{{ typeInfo.text }}</span>
    </div>

    <div class="post-footer">
      <span class="author">
        <UserRound :size="14" />
        {{ post.nickname }}
      </span>
      <div class="post-stats">
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
    </div>
  </RouterLink>
</template>

<style scoped>
.post-card {
  display: flex;
  min-width: 0;
  height: 100%;
  flex-direction: column;
  padding: 24px;
  overflow: hidden;
  transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease;
}

.post-card:hover {
  border-color: color-mix(in srgb, var(--primary) 28%, var(--border));
}

.post-meta-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.type-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  padding: 7px 11px;
  border-radius: 999px;
  color: var(--primary);
  background: var(--soft);
  font-size: 12px;
  font-weight: 800;
}

.type-chip svg {
  flex-shrink: 0;
}

.created-date {
  flex-shrink: 0;
  color: var(--subtle);
  font-size: 12px;
  font-weight: 800;
}

h3 {
  display: -webkit-box;
  overflow: hidden;
  margin: 17px 0 10px;
  color: var(--text);
  font-size: 21px;
  line-height: 1.4;
  word-break: keep-all;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.post-content {
  display: -webkit-box;
  overflow: hidden;
  min-height: 76px;
  margin: 0 0 18px;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.7;
  word-break: break-word;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-height: 25px;
  margin-top: auto;
  margin-bottom: 18px;
}

.tag {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.post-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
  color: var(--subtle);
  font-size: 12px;
  font-weight: 800;
}

.author,
.post-stats,
.post-stats span {
  display: inline-flex;
  align-items: center;
}

.author {
  min-width: 0;
  gap: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.author svg,
.post-stats svg {
  flex-shrink: 0;
  color: var(--primary);
}

.post-stats {
  flex-shrink: 0;
  gap: 11px;
}

.post-stats span {
  gap: 4px;
}

@media (max-width: 600px) {
  .post-card {
    padding: 20px;
  }

  h3 {
    font-size: 19px;
  }
}

@media (max-width: 400px) {
  .post-meta-top {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }

  .post-footer {
    align-items: flex-start;
    flex-direction: column;
  }

  .post-stats {
    width: 100%;
    justify-content: space-between;
  }
}
</style>