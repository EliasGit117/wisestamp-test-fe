<script setup lang="ts">
import { useDark } from '@vueuse/core';
import { Toaster } from '@/components/ui/sonner'

useDark({});

</script>

<template>
  <router-view />

  <Toaster />
</template>
