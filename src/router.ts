import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
<<<<<<< HEAD
import Lesson from './views/Lesson.vue';
import FinalScreen from './views/FinalScreen.vue';
import { lessons } from './data/LessonsStore';

=======
>>>>>>> c3f321bb5155019cee0c2bbe86aa41defb81a566
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Home
<<<<<<< HEAD
    },
    {
      path: '/lesson/:id',
      component: Lesson,
      props: (route) => {
        const lesson = lessons.find((l) => l.id === parseInt(route.params.id as string));
        return {
          questions: lesson?.questions || [],
          answers: lesson?.answers || []
        };
      }
    },
    {
      path: '/final-screen',
      component: FinalScreen
    }
  ]
});

=======
    }
  ]
});
>>>>>>> c3f321bb5155019cee0c2bbe86aa41defb81a566
export default router;