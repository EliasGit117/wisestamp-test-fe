<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { useColorMode, useDark } from '@vueuse/core';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const mode = useColorMode();

const options = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'System', value: 'auto' }
] as const;

</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon-sm">
        <Icon
            icon="radix-icons:moon"
            class="transition-all hidden dark:block"
        />
        <Icon
            icon="radix-icons:sun"
            class="absolute transition-all dark:hidden"
        />
        <span class="sr-only">Toggle theme</span>
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end">
      <DropdownMenuItem
          v-for="option in options"
          :key="option.value"
          @click="mode = option.value"
          class="flex items-center"
      >
        <span>{{ option.label }}</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
