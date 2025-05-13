<template>
  <el-container class="login-container">
    <el-main>
      <el-card class="login-card">
        <h2 class="title">汽车维修系统登录</h2>
        <el-form 
          ref="loginFormRef" 
          :model="loginForm" 
          :rules="validationRules" 
          label-width="80px"
          class="login-form"
        >
          <!-- 用户名输入 -->
          <el-form-item label="用户名" prop="username">
            <el-input 
              v-model.trim="loginForm.username" 
              placeholder="请输入用户名" 
              clearable
            />
          </el-form-item>

          <!-- 密码输入 -->
          <el-form-item label="密码" prop="password">
            <el-input 
              v-model="loginForm.password" 
              type="password" 
              placeholder="请输入密码" 
              show-password
              clearable
            />
          </el-form-item>

          <!-- 登录按钮 -->
          <el-form-item>
            <el-button 
              type="primary" 
              :loading="isLoading" 
              @click="handleLogin"
              class="login-btn"
            >
              登录
            </el-button>
          </el-form-item>

          <!-- 注册按钮 -->
          <el-form-item>
            <el-button 
              type="text" 
              @click="handleRegister"
              class="register-btn"
            >
              注册
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // 引入路由
import { ElMessage } from 'element-plus';
import { loginApi, getUserByUserNameApi } from '../api/user.js'

// 表单数据
const loginForm = ref({
  username: '',
  password: ''
});

// 表单验证规则
const validationRules = ref({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在3-20位之间', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6-20位之间', trigger: 'blur' }
  ]
});

// 表单引用
const loginFormRef = ref(null);
// 加载状态
const isLoading = ref(false);
// 路由实例
const router = useRouter();

// 登录逻辑
const handleLogin = async () => {
  // 1. 表单校验
  const isValid = await loginFormRef.value.validate();
  if (!isValid) return;

  // 2. 调用登录接口
  isLoading.value = true;
  try {
    const res = await loginApi(loginForm.value);
    
    // 3. 处理登录结果（根据后端返回调整）
    if (res.data) {
      // 登录成功：获取用户信息并存储（示例）
      const userInfo = await getUserByUserNameApi(loginForm.value.username);
      
      // 存储用户信息到 localStorage（实际项目建议用 Pinia）
      localStorage.setItem('userInfo', JSON.stringify(userInfo.data));
      
      // 根据用户角色跳转不同页面（示例）
      const role = userInfo.data.userRole;
      switch (role) {
        // case 'ADMINISTRATOR':
        //   router.push('/admin/dashboard');
        //   break;
        case 'REPAIR_PERSON':
          router.push('/repair/home');
          break;
        default: // USER
          router.push('/user/home');
      }
      
      ElMessage.success('登录成功！');
    } else {
      ElMessage.error('用户名或密码错误');
    }
  } catch (error) {
    ElMessage.error('登录失败，请稍后再试');
  } finally {
    isLoading.value = false;
  }
};

// 注册逻辑
const handleRegister = () => {
  // 跳转到注册页面
  router.push('/register');
};
</script>

<style scoped>
.login-container {
  height: 100vh;
  background: #f0f2f5;
  display: flex;
  justify-content: center;
  min-height: 100vh;
  align-items: center;

}

.login-card {
  max-width: 400px;
  margin: 0 auto;
  padding: 30px 40px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  margin-bottom: 30px;
  color: #1890ff;
  font-weight: 500;
}

.login-form {
  margin-top: 20px;
}

.login-btn {
  width: 100%;
  height: 40px;
  font-size: 16px;
}

.register-btn {
  width: 100%;
  height: 40px;
  font-size: 16px;
  text-align: center;
}
</style>