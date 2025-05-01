// src/router/index.js
import { createRouter, createWebHashHistory } from 'vue-router'
import LoginPage from '@/views/LoginPage.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import HomePage from '@/views/HomePage.vue'
// import VehiclePage from '@/views/VehiclePage.vue'
// import RepairOrdersPage from '@/views/RepairOrdersPage.vue'

const routes = [
  { path: '/login', component: LoginPage },
  { path: '/register', component:RegisterPage }, // 补充注册路由
//   { path: '/vehicle', component: VehiclePage },
//   { path: '/repairOrders', component: RepairOrdersPage },
  { path: '/', component:HomePage } // 默认跳转首页
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router