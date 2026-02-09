<script setup lang="ts">
import { computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { signaturesService } from '@/api/signatures/signatures-service';


const props = defineProps<{ id?: number; }>();
const emit = defineEmits<{ (e: 'update:id', value: number | undefined): void; }>();

const open = computed({
  get: () => props.id !== undefined,
  set: (value: boolean) => {
    if (!value) emit('update:id', undefined);
  }
});

const {
  data,
  isLoading,
  isError,
  error
} = useQuery({
  queryKey: computed(() => signaturesService.getGenerated.queryKey(props.id!)),
  queryFn: () => signaturesService.getGenerated.call(props.id!),
  enabled: computed(() => props.id !== undefined)
});
</script>

<template>
  <Sheet v-model:open="open">
    <SheetContent class="max-w-2xl!">
      <SheetHeader>
        <SheetTitle>Preview signature</SheetTitle>
      </SheetHeader>

      <div class="px-4 space-y-4">
        <div v-if="isLoading">Loading…</div>

        <div v-else-if="isError">
          {{ (error as Error).message }}
        </div>

        <p class="text-lg font-semibold">Text</p>
        <div class="w-full max-h-100 border p-4 rounded-lg">
          <p>{{ data?.text }}</p>
        </div>

        <p class="text-lg font-semibold">Html</p>
        <iframe
            class="w-full max-h-100 border p-4 rounded-lg"
            :srcdoc="data?.html"
            sandbox="allow-same-origin"
        />
      </div>
    </SheetContent>
  </Sheet>
</template>