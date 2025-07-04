<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { computed, ref } from 'vue';


const router = useRouter();
const authStore = useAuthStore();
const isMobileMenuOpen = ref(false);

const isLoggedIn = computed(() => authStore.isLoggedIn);
const currentUser = computed(() => authStore.currentUser);

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
  isMobileMenuOpen.value = false;
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const handleHome = () => {
  if (isLoggedIn.value) {
    router.push('/');
  } else {
    router.push('/NewUser');
  }
};
</script>

<template>
  <header class="header">
    <div class="header-content container">
      <div class="logo">
        <h1 @click="handleHome" class="title">Learning App</h1>
      </div>
      
      <!-- Menu hamburger pour mobile -->
      <button 
        @click="toggleMobileMenu" 
        class="mobile-menu-toggle"
        :class="{ 'active': isMobileMenuOpen }"
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <!-- Navigation desktop -->
      <nav class="nav desktop-nav">
        <button v-if="isLoggedIn" @click="router.push('/')" class="nav-button">Home</button>
        <button v-else @click="router.push('/homeNewUser')" class="nav-button">Home</button>
        <template v-if="isLoggedIn">
          <button @click="router.push('/profile')" class="nav-button">Profile</button>
          <div class="user-menu">
            <button @click="handleLogout" class="nav-button logout">Logout</button>
          </div>
        </template>
        <template v-else>
          <button @click="router.push('/login')" class="nav-button">Login</button>
          <button @click="router.push('/register')" class="nav-button register">Register</button>
        </template>
      </nav>

      <!-- Navigation mobile -->
      <nav class="nav mobile-nav" :class="{ 'open': isMobileMenuOpen }">
        <button @click="() => { router.push('/'); closeMobileMenu(); }" class="nav-button">Home</button>
        <template v-if="isLoggedIn">
          <button @click="() => { router.push('/profile'); closeMobileMenu(); }" class="nav-button">Profile</button>
          <div class="user-menu-mobile">
            <span class="username">{{ currentUser?.username }}</span>
            <button @click="handleLogout" class="nav-button logout">Logout</button>
          </div>
        </template>
        <template v-else>
          <button @click="() => { router.push('/login'); closeMobileMenu(); }" class="nav-button">Login</button>
          <button @click="() => { router.push('/register'); closeMobileMenu(); }" class="nav-button register">Register</button>
        </template>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  background-color: var(--white);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.logo {
  cursor: pointer;
  z-index: 1001;
}

.title {
  font-size: var(--font-size-2xl);
  color: var(--secondary-color);
  margin: 0;
  font-weight: 600;
}

.nav {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.nav-button {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-base);
  cursor: pointer;
  background-color: transparent;
  color: var(--secondary-color);
  border: none;
  border-radius: var(--border-radius-md);
  transition: all var(--transition-normal);
  font-weight: 500;
  white-space: nowrap;
}

.nav-button:hover {
  background-color: var(--light-gray);
  color: var(--primary-color);
}

.register {
  background-color: var(--primary-color);
  color: var(--white);
}

.register:hover {
  background-color: var(--primary-hover);
  color: var(--white);
}

.logout {
  color: var(--accent-color);
}

.logout:hover {
  background-color: var(--accent-color);
  color: var(--white);
}

.user-menu {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.username {
  color: var(--secondary-color);
  font-weight: 500;
}

/* Menu hamburger */
.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 30px;
  height: 30px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;
}

.mobile-menu-toggle span {
  width: 100%;
  height: 3px;
  background-color: var(--secondary-color);
  border-radius: 2px;
  transition: all var(--transition-normal);
  transform-origin: center;
}

.mobile-menu-toggle.active span:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.mobile-menu-toggle.active span:nth-child(2) {
  opacity: 0;
}

.mobile-menu-toggle.active span:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

/* Navigation mobile */
.mobile-nav {
  display: none;
}

.user-menu-mobile {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  width: 100%;
  padding: var(--spacing-md);
  border-top: 1px solid var(--border-color);
  margin-top: var(--spacing-md);
}

/* Media queries */
@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }

  .mobile-menu-toggle {
    display: flex;
  }

  .mobile-nav {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--white);
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: var(--spacing-lg);
    z-index: 1000;
  }

  .mobile-nav.open {
    display: flex;
  }

  .mobile-nav .nav-button {
    font-size: var(--font-size-lg);
    padding: var(--spacing-md) var(--spacing-lg);
    width: 200px;
    text-align: center;
  }

  .title {
    font-size: var(--font-size-xl);
  }
}

@media (max-width: 480px) {
  .header {
    padding: var(--spacing-sm);
  }

  .title {
    font-size: var(--font-size-lg);
  }

  .mobile-nav .nav-button {
    width: 180px;
    font-size: var(--font-size-base);
  }
}
</style>
