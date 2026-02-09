import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth.ts';

import DefaultLayout from '@/router/layouts/DefaultLayout.vue';
import AuthorizedLayout from '@/router/layouts/AuthorizedLayout.vue';

import IndexPage from '@/router/pages/IndexPage.vue';
import AuthSignInPage from '@/router/pages/auth/AuthSignInPage.vue';
import AuthSignUpPage from '@/router/pages/auth/AuthSignUpPage.vue';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth',
      component: DefaultLayout,
      meta: { guestOnly: true },
      children: [
        {
          path: 'sign-in',
          name: 'sign-in',
          component: AuthSignInPage
        },
        {
          path: 'sign-up',
          name: 'sign-up',
          component: AuthSignUpPage
        }
      ]
    },
    {
      path: '/',
      component: AuthorizedLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'home',
          component: IndexPage
        }
      ]
    }
  ]
});

router.beforeEach((to) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.user) {
    return { name: 'sign-in' };
  }

  if (to.meta.guestOnly && auth.user) {
    return { name: 'home' };
  }
});

export default router;