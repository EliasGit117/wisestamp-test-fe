<script setup lang="ts">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { signInRequestSchema } from '@/api/auth/types/sign-in-request-dto.ts';
import { Icon } from '@iconify/vue';
import { useAuthStore } from '@/stores/auth.ts';
import { useMutation } from '@tanstack/vue-query';
import { authService } from '@/api/auth/auth-service.ts';
import { signUpRequestSchema } from '@/api/auth/types/sign-up-request-dto.ts';
import { toast } from 'vue-sonner';
import router from '@/router';
import { normalizeError } from '@/api/client.ts';


const form = useForm({
  validationSchema: toTypedSchema(signUpRequestSchema),
  initialValues: { email: '', password: '', firstName: '', lastName: '' }
});

const { mutate: signUp, isPending: isSigningUp } = useMutation({
  mutationKey: authService.signUp.queryKey(),
  mutationFn: authService.signUp.call,
  onSuccess: () => {
    toast.success('Successfully signed up');
    router.replace({ name: 'sign-in'})
  },
  onError: async (error) => {
    let safeError: Error = new Error('Something went wrong');
    try {
      safeError = normalizeError(await error.response.json());
    } catch {}

    toast.error(safeError.name, { description: safeError.message });
  }
});

const onSubmit = form.handleSubmit((values) => {
  void signUp(values);
});

</script>


<template>
  <div class='container mx-auto p-4 space-y-4'>
    <Card class="max-w-sm mx-auto mt-12 sm:mt-16 md:mt-20">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
      </CardHeader>

      <CardContent>
        <form @submit.prevent="onSubmit">
          <fieldset class="grid grid-cols-2 gap-4" :disabled="isSigningUp">
            <FormField name="firstName" v-slot="{ componentField }">
              <FormItem class="col-span-full sm:col-span-1">
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input placeholder="John" v-bind="componentField"/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            </FormField>


            <FormField name="lastName" v-slot="{ componentField }">
              <FormItem class="col-span-full sm:col-span-1">
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" v-bind="componentField"/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            </FormField>

            <FormField name="email" v-slot="{ componentField }">
              <FormItem class="col-span-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                      type="email"
                      placeholder="you@example.com"
                      v-bind="componentField"
                  />
                </FormControl>
                <FormMessage/>
              </FormItem>
            </FormField>

            <FormField name="password" v-slot="{ componentField }">
              <FormItem class="col-span-full">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                      type="password"
                      placeholder="••••••••"
                      v-bind="componentField"
                  />
                </FormControl>
                <FormMessage/>
              </FormItem>
            </FormField>


            <div class="col-span-full flex flex-col sm:flex-row gap-4">
              <Button variant="link" size="sm" class="-ml-2 w-fit" as-child>
                <router-link :to="{ name: 'sign-in' }">
                  Already have account?
                </router-link>
              </Button>

              <Button
                  type="submit"
                  class="w-full sm:ml-auto sm:w-fit"
                  :disabled="form.isSubmitting.value"
              >
                <Icon icon="radix-icons:check"/>
                <span>Submit</span>
              </Button>
            </div>
          </fieldset>
        </form>
      </CardContent>
    </Card>

  </div>
</template>