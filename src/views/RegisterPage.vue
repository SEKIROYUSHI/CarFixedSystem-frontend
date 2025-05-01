<template>
    <div class="register-container">
      <el-card class="register-card">
        <h2 class="title">车辆维修系统</h2>
        <el-form 
          ref="registerForm" 
          :model="form" 
          :rules="rules" 
          label-width="80px"
          class="form-content"
        >
          <!-- 用户名 -->
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名" />
          </el-form-item>
  
          <!-- 密码 -->
          <el-form-item label="密码" prop="password">
            <el-input 
              v-model="form.password" 
              type="password" 
              placeholder="请输入6-20位密码"
            />
          </el-form-item>
  
          <!-- 确认密码 -->
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input 
              v-model="form.confirmPassword" 
              type="password" 
              placeholder="请再次输入密码"
            />
          </el-form-item>
  
          <!-- 提交按钮 -->
          <el-form-item>
            <el-button 
              type="primary" 
              style="width: 100%"
              @click="handleRegister"
            >
              注册
            </el-button>
          </el-form-item>
  
          <!-- 跳转登录 -->
          <div class="login-link">
            已有账号？<el-link @click="goLogin">立即登录</el-link>
          </div>
        </el-form>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  
  const router = useRouter()
  
  // 表单数据（纯前端）
  const form = ref({
    username: '',
    password: '',
    confirmPassword: ''
  })
  
  // 前端验证规则（保留）
  const rules = ref({
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, max: 20, message: '密码长度6-20位', trigger: 'blur' }
    ],
    confirmPassword: [
      { required: true, message: '请确认密码', trigger: 'blur' },
      { 
        validator: (rule, value, callback) => {
          if (value !== form.value.password) {
            callback(new Error('两次输入的密码不一致'))
          }
          callback()
        }, 
        trigger: 'blur' 
      }
    ]
  })
  
  // 注册交互（纯前端提示）
  const handleRegister = () => {
    // 手动触发表单验证
    const validateForm = async () => {
      const isValid = await new Promise(resolve => {
        document.querySelector('.el-form').validate(resolve)
      })
      if (isValid) {
        ElMessage.success('注册信息格式正确！')
        router.push('/login') // 跳转登录页（纯UI跳转）
      }
    }
    validateForm()
  }
  
  // 跳转登录页（纯UI跳转）
  const goLogin = () => {
    router.push('/login')
  }
  </script>
  
  
  <style scoped>
  .register-container {
    min-height: 100vh;
    background: #f5f7fa;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .register-card {
    width: 400px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  }
  
  .title {
    text-align: center;
    margin-bottom: 30px;
    color: #303133;
    font-weight: 500;
  }
  
  .form-content {
    padding: 0 30px 20px;
  }
  
  .login-link {
    text-align: center;
    margin-top: 15px;
    color: #606266;
  }
  </style>