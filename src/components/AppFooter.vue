<script setup lang="ts">
import { useApp } from '@/composables/useApp'
const { t } = useApp()
</script>

<template>
  <footer class="footer">
    <div class="container">
      <strong>Soulrip</strong> · {{ t.footer }} · © 2026
    </div>
  </footer>
</template>

<style scoped>
.footer { border-top: 1px solid var(--border); padding: 38px 0; text-align: center; color: var(--subtle); font-size: 13px; }
.footer strong { color: var(--primary); font-family: 'Fredoka', sans-serif; font-size: 16px; }
.footer p { margin: 8px 0 0; }
</style>
