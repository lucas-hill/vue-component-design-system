<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import Icon from '../Icon/Icon.vue'
import type { ToastInstance } from './useToast'
import { useToast } from './useToast'

const props = defineProps<{
  toast: ToastInstance
}>()

const { dismiss } = useToast()

let timer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  if (!props.toast.closable && props.toast.duration > 0) {
    timer = setTimeout(() => {
      dismiss(props.toast.id)
    }, props.toast.duration)
  }
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <div
    class="lucas-ui-toast"
    :class="`lucas-ui-toast--color-${toast.color}`"
  >
    <div class="lucas-ui-toast__header">
      <Icon v-if="toast.icon" :name="toast.icon" class="lucas-ui-toast__icon" />
      <span class="lucas-ui-toast__title">{{ toast.title }}</span>
      <button
        v-if="toast.closable"
        type="button"
        class="lucas-ui-toast__close"
        aria-label="Dismiss"
        @click="dismiss(toast.id)"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M11 3L3 11M3 3L11 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </button>
    </div>
    <p v-if="toast.body" class="lucas-ui-toast__body">{{ toast.body }}</p>
  </div>
</template>

<style>
/* ── Base ────────────────────────────────────────────────────────────────── */

.lucas-ui-toast {
  --_toast-accent: var(--lucas-ui-color-brand-primary);

  background: var(--lucas-ui-toast-bg);
  color: var(--lucas-ui-toast-color);
  border-radius: var(--lucas-ui-radius-md);
  border-left: var(--lucas-ui-toast-accent-width) solid var(--_toast-accent);
  box-shadow: var(--lucas-ui-toast-shadow);
  padding: var(--lucas-ui-space-3) var(--lucas-ui-space-4);
  width: var(--lucas-ui-toast-max-width);
  max-width: 100%;
  pointer-events: auto;
}

/* ── Color modifiers ─────────────────────────────────────────────────────── */

.lucas-ui-toast--color-primary {
  --_toast-accent: var(--lucas-ui-color-brand-primary);
}

.lucas-ui-toast--color-danger {
  --_toast-accent: var(--lucas-ui-color-danger);
}

.lucas-ui-toast--color-success {
  --_toast-accent: var(--lucas-ui-color-success);
}

.lucas-ui-toast--color-warning {
  --_toast-accent: var(--lucas-ui-color-warning);
}

.lucas-ui-toast--color-neutral {
  --_toast-accent: var(--lucas-ui-color-neutral);
}

/* ── Header ──────────────────────────────────────────────────────────────── */

.lucas-ui-toast__header {
  display: flex;
  align-items: center;
  gap: var(--lucas-ui-space-2);
}

.lucas-ui-toast__icon {
  flex-shrink: 0;
  color: var(--_toast-accent);
}

.lucas-ui-toast__title {
  flex: 1;
  font-size: var(--lucas-ui-font-size-sm);
  font-weight: var(--lucas-ui-toast-title-font-weight);
  min-width: 0;
}

/* ── Close button ────────────────────────────────────────────────────────── */

.lucas-ui-toast__close {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--lucas-ui-space-1);
  border: none;
  background: transparent;
  color: var(--lucas-ui-toast-close-color);
  cursor: pointer;
  border-radius: var(--lucas-ui-radius-md);
  transition: color var(--lucas-ui-motion-duration-fast) var(--lucas-ui-motion-easing-standard);
}

.lucas-ui-toast__close:hover {
  color: var(--lucas-ui-toast-close-color-hover);
}

/* ── Body ────────────────────────────────────────────────────────────────── */

.lucas-ui-toast__body {
  margin: var(--lucas-ui-space-1) 0 0;
  font-size: var(--lucas-ui-font-size-xs);
  line-height: 1.4;
  opacity: 0.85;
}
</style>
