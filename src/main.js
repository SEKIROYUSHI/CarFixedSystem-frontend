import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import App from './App.vue'
import './assets/styles/global.css'

const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.mount('#app')