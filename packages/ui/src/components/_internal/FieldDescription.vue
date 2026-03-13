<script setup lang="ts">
defineProps<{
  id: string
}>()
</script>

<template>
  <p :id="id" class="lucas-ui-field__description">
    <slot />
  </p>
</template>

<style>
.lucas-ui-field__description {
  margin: var(--lucas-ui-space-1) 0 0;
  font-size: var(--lucas-ui-font-size-xs);
  color: var(--lucas-ui-field-description-color);
}
</style>
