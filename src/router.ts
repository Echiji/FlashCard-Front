import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import Lesson from './views/Lesson.vue';
import FinalScreen from './views/FinalScreen.vue';
import LogIn from './views/LogIn.vue';
import Register from './views/Register.vue';
import CreateLesson from './views/CreateLesson.vue';  
import NewUser from './views/NewUser.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/NewUser',
      component: NewUser
    },
    {
      path: '/login',
      component: LogIn
    },
    {
      path: '/register',
      component: Register
    },
    {
      path: '/create-lesson/:id',
      component: CreateLesson
    },
    {
      path: '/lesson/:id',
      component: Lesson,
    },
    {
      path: '/final-screen',
      component: FinalScreen
    }
  ]
});

export default router;