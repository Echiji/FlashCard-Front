import { createRouter, createWebHistory } from 'vue-router';
import FlashCard from './views/FlashCard.vue';
import LessonContent from './views/LessonContent.vue';
import FinalScreen from './views/FinalScreen.vue';
import LogIn from './views/LogIn.vue';
import Register from './views/Register.vue';
import Profile from './views/Profile.vue';
import CourseLessons from './views/CourseLessons.vue';
import Home from './views/Home.vue';
import HomeNewUser from './views/HomeNewUser.vue';
import QuestionnaireGestion from './views/QuestionnaireGestion.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/NewUser',
      component: HomeNewUser
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
      path: '/lesson-content/:id',
      component: LessonContent,
    },
    {
      path: '/flashcard/:id',
      component: FlashCard,
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
      path: '/courses/:id',
      component: CourseLessons
    },
    {
      path: `/questionnaire-gestion/lessons/:id`,
      component: QuestionnaireGestion
    }
  ]
});

export default router;