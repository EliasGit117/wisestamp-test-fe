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


const form = useForm({
  validationSchema: toTypedSchema(signInRequestSchema),
  initialValues: { email: '', password: '' }
});

const { signIn, isSigningIn } = useAuthStore();

const onSubmit = form.handleSubmit((values) => {
  void signIn(values)
});

</script>


<template>
  <div class='container mx-auto p-4 space-y-4'>
    <Card class="max-w-sm mx-auto mt-12 sm:mt-16 md:mt-20">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
      </CardHeader>

      <CardContent>
        <form @submit.prevent="onSubmit">
          <fieldset class="space-y-4" :disabled="isSigningIn">
          <FormField name="email" v-slot="{ componentField }">
            <FormItem>
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
            <FormItem>
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
                <router-link :to="{ name: 'sign-up' }">
                  Don't have account?
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