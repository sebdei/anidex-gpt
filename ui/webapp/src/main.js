import { createApp } from 'vue'
import router from '@/router'

import '@/assets/css/fonts/material-icons.css'

import App from './App.vue'

const app = createApp(App)
app.use(router)

app.mount('#app')
