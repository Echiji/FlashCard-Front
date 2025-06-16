import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

// Création de l'application Vue
const app = createApp(App)

// Ajout du routeur
app.use(router)

// Montage de l'application sur l'élément #app
app.mount('#app')