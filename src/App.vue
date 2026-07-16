<script setup lang="ts">
import AppNav from '@/components/AppNav.vue'
import ChatBot from '@/components/ChatBot.vue'
import AppFooter from '@/components/AppFooter.vue'
import { useStaticPageI18n } from '@/composables/useStaticPageI18n'

useStaticPageI18n()
</script>

<template>
  <div class="app-shell">
    <AppNav />
    <main>
      <RouterView />
    </main>
    <ChatBot />
    <AppFooter />
  </div>
</template>
