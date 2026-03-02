<script setup lang="ts">
// No props — size is controlled via CSS (inherits 1em from parent font-size).
// Attrs (class, style, etc.) fall through to the <svg> root automatically.
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="lucas-ui-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <!-- Floppy disk body -->
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <!-- Data window and label area -->
    <path d="M17 21v-8H7v8M7 3v5h8" />
  </svg>
</template>
