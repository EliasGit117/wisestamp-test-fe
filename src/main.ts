import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { VueQueryPlugin } from '@tanstack/vue-query';
import { HTTPError } from 'ky';
import 'vue-sonner/style.css';
import './styles.css';


declare module '@tanstack/vue-query' {
  interface Register {
    defaultError: HTTPError;
  }
}

const app = createApp(App);

app.use(createPinia());
app.use(VueQueryPlugin);
app.use(router);

app.mount('#app');
