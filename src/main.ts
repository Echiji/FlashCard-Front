import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

// Création de l'application Vue
const app = createApp(App)
const pinia = createPinia()

// Ajout du routeur et de Pinia
app.use(router)
app.use(pinia)

// Montage de l'application sur l'élément #app
app.mount('#app')