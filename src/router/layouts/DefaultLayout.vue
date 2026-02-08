<script setup lang="ts">
import ThemeModeToggle from '@/components/theme/ThemeModeToggle.vue';
import { Icon } from '@iconify/vue';
</script>

<template>
  <header class="flex items-center container mx-auto p-4 gap-2">
    <router-link :to="{ path: '/' }" class="flex items-center gap-2">
      <Icon icon="radix-icons:home"/>
      <span>Wirestamp Test</span>
    </router-link>

    <div class="flex-1"/>
    <ThemeModeToggle/>
  </header>

  <div>
    <main>
      <router-view/>
    </main>
  </div>
</template>
