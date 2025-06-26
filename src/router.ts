import { createRouter, createWebHistory } from 'vue-router';
import Lesson from './views/Lesson.vue';
import FinalScreen from './views/FinalScreen.vue';
import LogIn from './views/LogIn.vue';
import Register from './views/Register.vue';
import CreateLesson from './views/CreateLesson.vue';  
import NewUser from './views/NewUser.vue';
import Profile from './views/Profile.vue';
import Course from './views/Course.vue';
import CourseLessons from './views/CourseLessons.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Course
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
      path: '/lessons/:id',
      component: Lesson,
    },
    {
      path: '/final-screen/:id',
      component: FinalScreen
    },
    {
      path: '/profile',
      component: Profile
    },
    {
      path: '/courses',
      component: Course
    },
    {
      path: '/courses/:id',
      component: CourseLessons
    }
  ]
});

export default router;