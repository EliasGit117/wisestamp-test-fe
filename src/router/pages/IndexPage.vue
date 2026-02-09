<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { signaturesService } from '@/api/signatures/signatures-service.ts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@iconify/vue';
import { Skeleton } from '@/components/ui/skeleton';
import { useRoute, useRouter } from 'vue-router';
import { computed, ref } from 'vue';
import { toTypedSchema } from '@vee-validate/zod';
import { createSignatureSchema } from '@/api/signatures/types/create-signature-request-dto';
import { useForm } from 'vee-validate';
import * as z from 'zod';
import { SignatureTemplateId } from '@/api/signatures/types/singature-template-id-enum.ts';
import { toast } from 'vue-sonner';
import { FormControl, FormItem, FormLabel, FormMessage, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import SignatureDetailsSheet from '@/router/pages/-components/SignatureDetailsSheet.vue';


const route = useRoute();
const router = useRouter();

const search = computed(() => ({
  page: Number(route.query.page ?? 1),
  limit: Number(route.query.limit ?? 10)
}));

const { data, isPending: isPendingSignatures } = useQuery({
  queryKey: signaturesService.list.queryKey(search.value),
  queryFn: () => signaturesService.list.call(search.value),
  placeholderData: keepPreviousData
});


const queryClient = useQueryClient();

const form = useForm({
  validationSchema: toTypedSchema(createSignatureSchema),
  initialValues: {
    templateId: SignatureTemplateId.LightSquared,
    fullName: '',
    email: '',
    phone: ''
  }
});

const { mutate: createSignature, isPending: isCreatingSignature } = useMutation({
  mutationFn: (values: z.infer<typeof createSignatureSchema>) => signaturesService.create.call({
    templateId: values.templateId,
    payload: {
      fullName: values.fullName,
      email: values.email,
      phone: values.phone
    }
  }),
  onSuccess: () => {
    toast.success('Signature created successfully!');
    queryClient.invalidateQueries({ queryKey: signaturesService.list.queryKey(search.value) });
    form.resetForm();
  }
});

function setPage(page: number) {
  router.push({ query: { ...route.query, page: page.toString() } });
}

function setLimit(limit: number) {
  router.push({ query: { ...route.query, limit: limit.toString(), page: '1' } });
}

const onSubmit = form.handleSubmit((values) => {
  createSignature(values);
});

const selectedId = ref<number | undefined>(undefined);

</script>

<template>
  <div class="container mx-auto p-4 flex flex-col gap-4 flex-1">

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

      <ul v-if="isPendingSignatures" class="space-y-4">
        <li v-for="n in 5" :key="n">
          <Card class="w-full flex-col lg:flex-row">
            <CardHeader class="space-y-2 w-full">
              <Skeleton class="h-6 w-full max-w-12"/>
              <div class="flex gap-4">
                <Skeleton class="h-4 w-28"/>
                <Skeleton class="h-4 w-28"/>
                <Skeleton class="h-4 w-28"/>
              </div>
            </CardHeader>

            <CardFooter class="ml-auto mb-auto">
              <Skeleton class="h-7 w-24"/>
            </CardFooter>
          </Card>
        </li>
      </ul>

      <ul v-else class="space-y-4">
        <li v-for="signature in data?.items" :key="signature.id">
          <Card class="w-full flex-col lg:flex-row">
            <CardHeader class="flex-1">
              <CardTitle>
                Id: {{ signature.id }}
              </CardTitle>

              <CardDescription class="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4 lg:mt-0">
                <div class="flex sm:flex-col gap-1">
                  <b>Template:</b>
                  <p class="capitalize">{{ signature.templateId.replace('-', ' ') }}</p>
                </div>

                <div class="flex sm:flex-col gap-1">
                  <b>Created:</b>
                  <p>{{ new Date(signature.createdAt).toLocaleDateString() }}</p>
                </div>

                <div class="flex sm:flex-col gap-1">
                  <b>Updated:</b>
                  <p>{{ new Date(signature.updatedAt).toLocaleDateString() }}</p>
                </div>
              </CardDescription>
            </CardHeader>

            <CardFooter class="flex gap-2 ml-auto mb-auto">
              <Button variant="outline" size="sm" class="ml-auto" @click="selectedId = signature.id">
                <Icon icon="radix-icons:info-circled"/>
                <span>Details</span>
              </Button>
            </CardFooter>
          </Card>
        </li>
      </ul>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Create signature</CardTitle>
          </CardHeader>

          <CardContent>
            <form @submit.prevent="onSubmit">
              <fieldset class="space-y-4" :disabled="isCreatingSignature">
                <!-- Template -->
                <FormField name="templateId" v-slot="{ componentField }">
                  <FormItem>
                    <FormLabel>Template</FormLabel>

                    <FormControl>
                      <Select
                          :model-value="String(componentField.modelValue)"
                          @update:model-value="value => componentField.onChange(value)"
                      >
                        <SelectTrigger class="w-full">
                          <SelectValue placeholder="Select template" class="capitalize"/>
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem
                              v-for="template in Object.values(SignatureTemplateId)"
                              :key="template"
                              :value="String(template)"
                              class="capitalize"
                          >
                            {{ template.replace('-', ' ') }}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>

                    <FormMessage/>
                  </FormItem>
                </FormField>

                <!-- Full name -->
                <FormField name="fullName" v-slot="{ componentField }">
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" v-bind="componentField"/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                </FormField>

                <!-- Email -->
                <FormField name="email" v-slot="{ componentField }">
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                          type="email"
                          placeholder="john@example.com"
                          v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                </FormField>

                <!-- Phone -->
                <FormField name="phone" v-slot="{ componentField }">
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                          placeholder="+1 234 567 890"
                          v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                </FormField>

                <CardFooter class="flex justify-end px-0">
                  <Button
                      type="submit"
                      :disabled="form.isSubmitting.value"
                  >
                    <Icon icon="radix-icons:check"/>
                    <span>Submit</span>
                  </Button>
                </CardFooter>
              </fieldset>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>

    <SignatureDetailsSheet v-model:id="selectedId"/>

    <div v-if="data" class="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4 mt-auto">
      <p class="text-sm text-muted-foreground ml-1">
        Page {{ search.page }} of {{ data?.totalPages ?? 1 }}
      </p>

      <div class="flex gap-2">
        <Button
            variant="outline"
            size="sm"
            :disabled="search.page === 1 || isPendingSignatures"
            @click="setPage(search.page - 1)"
        >
          <Icon icon="radix-icons:caret-left"/>
          <span>Previous</span>
        </Button>

        <Button
            variant="outline"
            size="sm"
            :disabled="search.page === (data?.totalPages ?? 1) || isPendingSignatures"
            @click="setPage(search.page + 1)"
        >
          <span>Next</span>
          <Icon icon="radix-icons:caret-right"/>
        </Button>
      </div>
    </div>
  </div>
</template>