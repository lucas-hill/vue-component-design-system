<script setup lang="ts">
import { computed } from 'vue'
import Toast from './Toast.vue'
import { toasts } from './useToast'
import type { ToastPosition } from './useToast'

const positions: ToastPosition[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right']

function toastsForPosition(position: ToastPosition) {
  return toasts.filter((t) => t.position === position)
}

function transitionName(position: ToastPosition) {
  return position.includes('right') ? 'lucas-ui-toast-slide-right' : 'lucas-ui-toast-slide-left'
}
</script>

<template>
  <div class="lucas-ui-toast-container" aria-live="polite">
    <div
      v-for="position in positions"
      :key="position"
      class="lucas-ui-toast-container__corner"
      :class="`lucas-ui-toast-container__corner--${position}`"
    >
      <TransitionGroup :name="transitionName(position)">
        <Toast
          v-for="toast in toastsForPosition(position)"
          :key="toast.id"
          :toast="toast"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<style>
/* ── Container ───────────────────────────────────────────────────────────── */

.lucas-ui-toast-container {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: var(--lucas-ui-toast-z-index, 9999);
}

/* ── Corner regions ──────────────────────────────────────────────────────── */

.lucas-ui-toast-container__corner {
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: var(--lucas-ui-space-2);
  padding: var(--lucas-ui-space-4);
  max-height: 100vh;
  overflow: hidden;
}

/* Top corners: newest on top → column-reverse so last-pushed appears first */
.lucas-ui-toast-container__corner--top-left {
  top: 0;
  left: 0;
  flex-direction: column-reverse;
  justify-content: flex-end;
}

.lucas-ui-toast-container__corner--top-right {
  top: 0;
  right: 0;
  flex-direction: column-reverse;
  justify-content: flex-end;
}

/* Bottom corners: newest on bottom → normal column, anchored to bottom */
.lucas-ui-toast-container__corner--bottom-left {
  bottom: 0;
  left: 0;
}

.lucas-ui-toast-container__corner--bottom-right {
  bottom: 0;
  right: 0;
}

/* ── Slide-right transition (for right-side corners) ─────────────────────── */

.lucas-ui-toast-slide-right-enter-active,
.lucas-ui-toast-slide-right-leave-active {
  transition:
    transform 300ms var(--lucas-ui-motion-easing-standard, ease),
    opacity 300ms var(--lucas-ui-motion-easing-standard, ease);
}

.lucas-ui-toast-slide-right-enter-from,
.lucas-ui-toast-slide-right-leave-to {
  transform: translateX(calc(100% + 24px));
  opacity: 0;
}

/* ── Slide-left transition (for left-side corners) ───────────────────────── */

.lucas-ui-toast-slide-left-enter-active,
.lucas-ui-toast-slide-left-leave-active {
  transition:
    transform 300ms var(--lucas-ui-motion-easing-standard, ease),
    opacity 300ms var(--lucas-ui-motion-easing-standard, ease);
}

.lucas-ui-toast-slide-left-enter-from,
.lucas-ui-toast-slide-left-leave-to {
  transform: translateX(calc(-100% - 24px));
  opacity: 0;
}

/* Smooth reflow when toasts are added/removed in the middle of a stack */
.lucas-ui-toast-slide-right-move,
.lucas-ui-toast-slide-left-move {
  transition: transform 300ms var(--lucas-ui-motion-easing-standard, ease);
}
</style>
