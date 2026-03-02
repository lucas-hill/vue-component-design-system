<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import { Button } from '@vue-design-system/ui'
</script>

<template>
  <div style="padding: 40px;">
    <Button variant="banana">Primary</Button>
    <Button variant="outline" style="margin-left: 12px;">
      Outline
    </Button>
    <Button variant="ghost" style="margin-left: 12px;">
      Ghost
    </Button>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
