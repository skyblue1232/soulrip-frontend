<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { Send, X } from 'lucide-vue-next'
import { api } from '@/services/api'
import { useApp } from '@/composables/useApp'
import type { ChatHistoryItem } from '@/types'
import chatCat from '@/assets/images/chat-cat.jpg'

const { state } = useApp()

const chatTexts = {
  ko: { subtitle: '서울 혼행 도우미', greeting: '안녕하세요! 혼자 서울 여행에 필요한 장소·혼밥·축제 정보를 물어보세요.', quick: ['혼밥하기 좋은 곳 추천해줘', '혼자 걷기 좋은 장소는?', '서울 축제 알려줘'], loading: '답변을 찾고 있어요…', placeholder: '서울 여행 정보를 물어보세요', error: '챗봇 연결을 확인해주세요.', close: '챗봇 닫기', open: 'Soulrip 챗봇 열기' },
  en: { subtitle: 'Seoul solo travel assistant', greeting: 'Hello! Ask me about places, solo dining, and festivals in Seoul.', quick: ['Recommend a place for solo dining', 'Where can I walk alone?', 'Tell me about Seoul festivals'], loading: 'Finding an answer…', placeholder: 'Ask about traveling in Seoul', error: 'Please check the chatbot connection.', close: 'Close chatbot', open: 'Open Soulrip chatbot' },
  ja: { subtitle: 'ソウルひとり旅アシスタント', greeting: 'こんにちは！ソウルの観光地、ひとりごはん、フェスティバルについて聞いてください。', quick: ['ひとりごはんにおすすめの場所', 'ひとりで歩きやすい場所は？', 'ソウルの祭りを教えて'], loading: '回答を探しています…', placeholder: 'ソウル旅行について質問する', error: 'チャットボットの接続を確認してください。', close: 'チャットボットを閉じる', open: 'Soulripチャットボットを開く' },
  zh: { subtitle: '首尔独自旅行助手', greeting: '你好！可以询问首尔景点、单人用餐和节庆活动。', quick: ['推荐适合单人用餐的地方', '适合独自散步的地方？', '介绍首尔的节庆活动'], loading: '正在查找答案…', placeholder: '询问首尔旅行信息', error: '请检查聊天机器人连接。', close: '关闭聊天机器人', open: '打开Soulrip聊天机器人' },
  fr: { subtitle: 'Assistant de voyage solo à Séoul', greeting: 'Bonjour ! Posez vos questions sur les lieux, les repas en solo et les festivals à Séoul.', quick: ['Un restaurant pour manger seul', 'Où se promener seul ?', 'Festivals à Séoul'], loading: 'Recherche de la réponse…', placeholder: 'Posez une question sur Séoul', error: 'Vérifiez la connexion du chatbot.', close: 'Fermer le chatbot', open: 'Ouvrir le chatbot Soulrip' },
  es: { subtitle: 'Asistente para viajar solo por Seúl', greeting: '¡Hola! Pregunta por lugares, comidas en solitario y festivales de Seúl.', quick: ['Un lugar para comer solo', '¿Dónde caminar a solas?', 'Festivales de Seúl'], loading: 'Buscando una respuesta…', placeholder: 'Pregunta sobre viajes en Seúl', error: 'Comprueba la conexión del chatbot.', close: 'Cerrar chatbot', open: 'Abrir chatbot Soulrip' },
  de: { subtitle: 'Assistent für Solo-Reisen in Seoul', greeting: 'Hallo! Frage nach Orten, Restaurants für Alleinreisende und Festivals in Seoul.', quick: ['Ein Restaurant für Alleinreisende', 'Wo kann ich allein spazieren?', 'Festivals in Seoul'], loading: 'Antwort wird gesucht…', placeholder: 'Frage zur Seoul-Reise', error: 'Bitte prüfe die Chatbot-Verbindung.', close: 'Chatbot schließen', open: 'Soulrip-Chatbot öffnen' },
} as const

const copy = computed(() => chatTexts[state.lang])

const open = ref(false)
const input = ref('')
const loading = ref(false)

const messages = ref<ChatHistoryItem[]>([
  {
    role: 'assistant',
    content: copy.value.greeting,
  },
])

const scroller = ref<HTMLElement | null>(null)

const quickQuestions = computed(() => copy.value.quick)

watch(() => state.lang, () => {
  if (messages.value.length === 1 && messages.value[0]?.role === 'assistant') {
    messages.value[0].content = copy.value.greeting
  }
})

async function scrollBottom() {
  await nextTick()
  scroller.value?.scrollTo({
    top: scroller.value.scrollHeight,
    behavior: 'smooth',
  })
}

async function send(text = input.value) {
  const message = text.trim()

  if (!message || loading.value) return

  messages.value.push({
    role: 'user',
    content: message,
  })

  input.value = ''
  loading.value = true

  await scrollBottom()

  try {
    const result = await api.chat(
      message,
      messages.value.slice(-8),
      state.lang,
    )

    messages.value.push({
      role: 'assistant',
      content: result.answer,
    })
  } catch {
    messages.value.push({
      role: 'assistant',
      content: copy.value.error,
    })
  } finally {
    loading.value = false
    await scrollBottom()
  }
}
</script>

<template>
  <div class="chat-root">
    <section v-if="open" class="chat-panel card">
      <header class="chat-header">
        <div class="chat-title">
          <img :src="chatCat" alt="Soulrip AI" />
          <div>
            <strong>Soulrip AI</strong>
            <span>{{ copy.subtitle }}</span>
          </div>
        </div>

        <button
          type="button"
          :aria-label="copy.close"
          @click="open = false"
        >
          <X :size="20" />
        </button>
      </header>

      <div ref="scroller" class="messages">
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="bubble"
          :class="message.role"
        >
          {{ message.content }}
        </div>

        <div
          v-if="loading"
          class="bubble assistant loading-bubble"
          role="status"
          :aria-label="copy.loading"
        >
          <div class="loading-title">
            <span>{{ copy.loading }}</span>

            <div class="typing-dots" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          <div class="skeleton-lines" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      <div class="quick-list">
        <button
          v-for="question in quickQuestions"
          :key="question"
          type="button"
          :disabled="loading"
          @click="send(question)"
        >
          {{ question }}
        </button>
      </div>

      <form class="chat-form" @submit.prevent="send()">
        <input
          v-model="input"
          :placeholder="copy.placeholder"
        />

        <button
          type="submit"
          :disabled="loading || !input.trim()"
        >
          <Send :size="18" />
        </button>
      </form>
    </section>

    <button
      class="chat-fab"
      type="button"
      :aria-label="copy.open"
      @click="open = !open"
    >
      <img :src="chatCat" alt="챗봇" />
    </button>
  </div>
</template>

<style scoped>
.chat-root {
  position: fixed;
  right: 28px;
  bottom: 28px;
  z-index: 300;
}

.chat-fab {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  padding: 4px;
  border: 3px solid var(--primary);
  border-radius: 50%;
  background: #ffffff;
  cursor: pointer;
  box-shadow: 0 12px 30px rgba(65, 104, 247, 0.35);
  transition: transform 0.2s ease;
  overflow: hidden;
}

.chat-fab:hover {
  transform: translateY(-4px);
}

.chat-fab img {
  display: block;
  width: 62px;
  height: 62px;
  object-fit: contain;
  border-radius: 50%;
}

.chat-panel {
  position: absolute;
  right: 0;
  bottom: 90px;
  width: min(390px, calc(100vw - 32px));
  overflow: hidden;
  border-radius: 24px;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  color: white;
  background: var(--primary);
}

.chat-header button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border: none;
  color: white;
  background: transparent;
  cursor: pointer;
}

.chat-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chat-title img {
  width: 42px;
  height: 42px;
  object-fit: contain;
  border-radius: 50%;
  background: white;
}

.chat-title div {
  display: grid;
  gap: 2px;
}

.chat-title span {
  font-size: 12px;
  opacity: .8;
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 340px;
  padding: 18px;
  overflow-y: auto;
  background: var(--surface-alt);
}

.bubble {
  max-width: 82%;
  padding: 12px 14px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-line;
}

.bubble.assistant {
  align-self: flex-start;
  border: 1px solid var(--border);
  background: var(--surface);
}

.bubble.user {
  align-self: flex-end;
  color: white;
  background: var(--primary);
}

.quick-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid var(--border);
  background: var(--surface);
}

.quick-list button {
  padding: 7px 12px;
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--muted);
  background: var(--surface);
  cursor: pointer;
  font-size: 12px;
  white-space: normal;
}

.chat-form {
  display: flex;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid var(--border);
  background: var(--surface);
}

.chat-form input {
  flex: 1;
  padding: 11px 14px;
  border: 1px solid var(--border);
  border-radius: 14px;
  outline: none;
  background: var(--surface-alt);
  color: var(--text);
}

.chat-form button {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  padding: 0;
  border: none;
  border-radius: 14px;
  color: white;
  background: var(--primary);
  cursor: pointer;
}

.chat-form button:disabled {
  opacity: .45;
}

@media (max-width: 600px) {
  .chat-root {
    right: 16px;
    bottom: 16px;
  }

  .chat-panel {
    right: 0;
    width: calc(100vw - 32px);
  }

  .messages {
    height: 300px;
  }
}
.loading-bubble {
  width: 78%;
  min-height: 92px;
}

.loading-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: var(--muted);
  font-size: 12px;
}

.typing-dots {
  display: flex;
  align-items: center;
  gap: 4px;
}

.typing-dots span {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--primary);
  animation: typing-bounce 1.2s infinite ease-in-out;
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.15s;
}

.typing-dots span:nth-child(3) {
  animation-delay: 0.3s;
}

.skeleton-lines {
  display: grid;
  gap: 8px;
}

.skeleton-lines span {
  position: relative;
  display: block;
  height: 9px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--surface-alt);
}

.skeleton-lines span:nth-child(1) {
  width: 95%;
}

.skeleton-lines span:nth-child(2) {
  width: 82%;
}

.skeleton-lines span:nth-child(3) {
  width: 60%;
}

.skeleton-lines span::after {
  position: absolute;
  inset: 0;
  content: '';
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(65, 104, 247, 0.18) 50%,
    transparent 100%
  );
  transform: translateX(-100%);
  animation: skeleton-shimmer 1.4s infinite;
}

.quick-list button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

@keyframes typing-bounce {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.4;
  }

  30% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

@keyframes skeleton-shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>

