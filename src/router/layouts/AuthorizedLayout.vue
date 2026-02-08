<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.ts';
import { Icon } from '@iconify/vue';
import ThemeModeToggle from '@/components/theme/ThemeModeToggle.vue';
import { Button } from '@/components/ui/button';

const { isAuthenticated, signOut, isSigningOut } = useAuthStore();
</script>

<template>
  <header class="flex items-center container mx-auto p-4 gap-2">
    <router-link :to="{ path: '/' }" class="flex items-center gap-2">
      <Icon icon="radix-icons:home"/>
      <span>Wirestamp Test</span>
    </router-link>

    <div class="flex-1"/>
    <ThemeModeToggle/>

    <div v-if="isAuthenticated" class="flex items-center gap-2">
      <Button variant="ghost" size="sm" v-bind:disabled="isSigningOut" @click="signOut">
        <Icon icon="radix-icons:exit"/>
        <span>Sign Out</span>
      </Button>
    </div>
  </header>

  <main>
    <router-view/>
  </main>
</template>
