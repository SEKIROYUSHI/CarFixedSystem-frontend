// src/router/index.js
import { createRouter, createWebHashHistory } from 'vue-router'
import LoginPage from '@/views/LoginPage.vue'
import RegisterPage from '@/views/RegisterPage.vue';
import HomePage from '@/views/HomePage.vue';
import RepairPersonHomePage from '@/views/RepairPersonHomePage.vue';
// import VehiclePage from '@/views/VehiclePage.vue'
// import RepairOrdersPage from '@/views/RepairOrdersPage.vue'

const routes = [
  { path: '/login', component: () => LoginPage},
  {path:'/register',component:() =>RegisterPage},
  {path:'/user/home',component:() =>HomePage},
  {path:'/repair/home',component:()=>RepairPersonHomePage}
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router