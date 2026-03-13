<script setup lang="ts">
defineProps<{
  id: string
}>()
</script>

<template>
  <p :id="id" role="alert" class="lucas-ui-field__error">
    <slot />
  </p>
</template>

<style>
.lucas-ui-field__error {
  margin: var(--lucas-ui-space-1) 0 0;
  font-size: var(--lucas-ui-font-size-xs);
  color: var(--lucas-ui-field-error-color);
}
</style>
