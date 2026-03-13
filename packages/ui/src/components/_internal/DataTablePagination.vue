<script setup lang="ts">
import { computed } from 'vue'
import Button from '../Button/Button.vue'

const props = defineProps<{
  page: number
  totalPages: number
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:page': [page: number]
}>()

const pageNumbers = computed(() => {
  const pages: (number | '...')[] = []
  const total = props.totalPages
  const current = props.page

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
    return pages
  }

  pages.push(1)

  if (current > 3) {
    pages.push('...')
  }

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (current < total - 2) {
    pages.push('...')
  }

  pages.push(total)
  return pages
})

function goToPage(page: number) {
  if (page >= 1 && page <= props.totalPages) {
    emit('update:page', page)
  }
}
</script>

<template>
  <nav class="lucas-ui-data-table-pagination" aria-label="Table pagination">
    <Button
      variant="ghost"
      color="neutral"
      size="sm"
      :disabled="disabled || page <= 1"
      aria-label="First page"
      @click="goToPage(1)"
    >
      &laquo;
    </Button>
    <Button
      variant="ghost"
      color="neutral"
      size="sm"
      :disabled="disabled || page <= 1"
      aria-label="Previous page"
      @click="goToPage(page - 1)"
    >
      &lsaquo;
    </Button>

    <template v-for="(item, i) in pageNumbers" :key="i">
      <span v-if="item === '...'" class="lucas-ui-data-table-pagination__ellipsis">&hellip;</span>
      <Button
        v-else
        :variant="item === page ? 'solid' : 'ghost'"
        :color="item === page ? 'primary' : 'neutral'"
        size="sm"
        :disabled="disabled"
        :aria-label="`Page ${item}`"
        :aria-current="item === page ? 'page' : undefined"
        @click="goToPage(item)"
      >
        {{ item }}
      </Button>
    </template>

    <Button
      variant="ghost"
      color="neutral"
      size="sm"
      :disabled="disabled || page >= totalPages"
      aria-label="Next page"
      @click="goToPage(page + 1)"
    >
      &rsaquo;
    </Button>
    <Button
      variant="ghost"
      color="neutral"
      size="sm"
      :disabled="disabled || page >= totalPages"
      aria-label="Last page"
      @click="goToPage(totalPages)"
    >
      &raquo;
    </Button>
  </nav>
</template>

<style>
.lucas-ui-data-table-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--lucas-ui-data-table-pagination-gap);
  padding: var(--lucas-ui-space-3) 0;
}

.lucas-ui-data-table-pagination__ellipsis {
  padding: 0 var(--lucas-ui-space-1);
  color: var(--lucas-ui-data-table-empty-color);
  user-select: none;
}
</style>
