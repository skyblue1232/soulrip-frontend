import { nextTick, onBeforeUnmount, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { translateStatic } from '@/i18n/staticI18n'
import { useApp } from '@/composables/useApp'

const originals = new WeakMap<Text, string>()
const attributeOriginals = new WeakMap<Element, Map<string, string>>()

export function useStaticPageI18n() {
  const { state } = useApp()
  const route = useRoute()
  let observer: MutationObserver | undefined
  let scheduled = false

  function apply() {
    const root = document.querySelector('main')
    if (!root) return
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    let node = walker.nextNode() as Text | null
    while (node) {
      const parent = node.parentElement
      if (parent && !['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT'].includes(parent.tagName)) {
        if (!originals.has(node)) originals.set(node, node.data)
        const source = originals.get(node) ?? node.data
        const trimmed = source.trim()
        if (trimmed) node.data = source.replace(trimmed, translateStatic(trimmed, state.lang))
      }
      node = walker.nextNode() as Text | null
    }
    root.querySelectorAll('[placeholder], [title], [aria-label]').forEach((element) => {
      let saved = attributeOriginals.get(element)
      if (!saved) { saved = new Map(); attributeOriginals.set(element, saved) }
      for (const attribute of ['placeholder', 'title', 'aria-label']) {
        const current = element.getAttribute(attribute)
        if (!current) continue
        if (!saved.has(attribute)) saved.set(attribute, current)
        element.setAttribute(attribute, translateStatic(saved.get(attribute) ?? current, state.lang))
      }
    })
  }

  function schedule() {
    if (scheduled) return
    scheduled = true
    queueMicrotask(() => { scheduled = false; observer?.disconnect(); apply(); observe() })
  }

  function observe() {
    observer?.observe(document.querySelector('main') ?? document.body, { childList: true, subtree: true, characterData: true })
  }

  onMounted(() => { observer = new MutationObserver(schedule); apply(); observe() })
  onBeforeUnmount(() => observer?.disconnect())
  watch(() => state.lang, async () => { await nextTick(); apply() })
  watch(() => route.fullPath, async () => { await nextTick(); schedule() })
}
