<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const isLoggedIn = computed(() => authStore.isLoggedIn);

const router = useRouter();
const currentYear = new Date().getFullYear();

const handleHome2 = () => {
  if (isLoggedIn.value) {
    router.push('/');
  } else {
    router.push('/NewUser');
  }
};
</script>

<template>
  <footer class="footer">
    <div class="footer-content container">
      <div class="footer-section">
        <h3 class="footer-title">Learning App</h3>
        <p class="footer-description">
          Votre plateforme d'apprentissage interactive pour créer et partager des leçons.
        </p>
      </div>
      
      <div class="footer-section">
        <h4 class="footer-subtitle">Navigation</h4>
        <ul class="footer-links">
          <li><button @click="handleHome2" class="footer-link">Accueil</button></li>
          <li><button @click="router.push('/login')" class="footer-link">Connexion</button></li>
          <li><button @click="router.push('/register')" class="footer-link">Inscription</button></li>
        </ul>
      </div>
      
      <div class="footer-section">
        <h4 class="footer-subtitle">Support</h4>
        <ul class="footer-links">
          <li><a href="#" class="footer-link">Aide</a></li>
          <li><a href="#" class="footer-link">Contact</a></li>
          <li><a href="#" class="footer-link">À propos</a></li>
        </ul>
      </div>
    </div>
    
    <div class="footer-bottom">
      <div class="container">
        <p class="copyright">
          © {{ currentYear }} Learning App. Tous droits réservés.
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--secondary-color);
  color: var(--white);
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-xl);
  padding: var(--spacing-2xl) 0;
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.footer-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin: 0;
  color: var(--white);
}

.footer-subtitle {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin: 0;
  color: var(--white);
}

.footer-description {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin: 0;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.footer-link {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  cursor: pointer;
  font-size: var(--font-size-base);
  transition: color var(--transition-normal);
  text-align: left;
  padding: 0;
}

.footer-link:hover {
  color: var(--white);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: var(--spacing-lg) 0;
}

.copyright {
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  font-size: var(--font-size-sm);
}

/* Media queries */
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
    padding: var(--spacing-xl) 0;
  }

  .footer-section {
    text-align: center;
  }

  .footer-links {
    align-items: center;
  }

  .footer-link {
    text-align: center;
  }
}

@media (max-width: 480px) {
  .footer-content {
    padding: var(--spacing-lg) 0;
  }

  .footer-title {
    font-size: var(--font-size-lg);
  }

  .footer-subtitle {
    font-size: var(--font-size-base);
  }

  .footer-description {
    font-size: var(--font-size-sm);
  }
}
</style>