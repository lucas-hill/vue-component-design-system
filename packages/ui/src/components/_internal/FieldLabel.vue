<script setup lang="ts">
defineProps<{
  htmlFor: string
}>()
</script>

<template>
  <label :for="htmlFor" class="lucas-ui-field__label">
    <slot />
  </label>
</template>

<style>
.lucas-ui-field__label {
  display: block;
  font-size: var(--lucas-ui-font-size-sm);
  font-weight: var(--lucas-ui-field-label-font-weight);
  color: var(--lucas-ui-field-label-color);
  margin-bottom: var(--lucas-ui-field-label-gap);
}
</style>
