<template>
    <!-- 顶部导航栏 -->
    <nav class="navbar">
      <div class="logo">汽车维修管理系统</div>
      <div class="nav-links">
        <!-- 静态角色显示（模拟用户/管理员） -->
        <router-link to="/vehicle" v-if="userRole === 'user'">我的车辆</router-link>
        <router-link to="/repairOrders" v-if="userRole === 'user'">维修订单</router-link>
        
        <router-link to="/users" v-if="userRole === 'admin'">用户管理</router-link>
        <router-link to="/parts" v-if="userRole === 'admin'">零件管理</router-link>
        
        <!-- 静态登录状态 -->
        <span v-if="isLoggedIn">{{ userInfo.username }}（{{ userRole }}）</span>
        <router-link to="/login" v-else>登录</router-link>
        <button @click="logout" v-if="isLoggedIn">退出</button>
      </div>
    </nav>
  
    <!-- 路由视图 -->
    <router-view/>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  // 静态用户状态（模拟已登录）
  const isLoggedIn = ref(true) 
  const userInfo = ref({ username: '测试用户' })
  const userRole = ref('user') // 可改为 'admin' 查看管理员导航
  
  // 退出交互（纯UI跳转）
  const logout = () => {
    //.success('已退出登录')
    router.push('/login')
  }
  </script>
  
  <style scoped>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
  
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: #42b983;
    color: white;
  }
  
  .nav-links {
    display: flex;
    gap: 2rem;
    align-items: center;
  }
  
  .nav-links router-link {
    color: white;
    text-decoration: none;
  }
  
  .nav-links router-link:hover {
    text-decoration: underline;
  }
  
  button {
    background: #fff;
    color: #42b983;
    border: none;
    padding: 0.3rem 0.8rem;
    border-radius: 4px;
    cursor: pointer;
  }
  </style>