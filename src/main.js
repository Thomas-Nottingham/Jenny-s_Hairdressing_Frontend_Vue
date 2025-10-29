import { createApp } from 'vue'
import Toast from 'vue-toastification'
import "vue-toastification/dist/index.css"
import App from './App.vue'
import './fanta.css'
import './bootstrap.css'
import router from './routes'


createApp(App).use(router).use(Toast).mount('#app')