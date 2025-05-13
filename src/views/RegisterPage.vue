<template>
  <div class="register-container">
    <el-card class="register-card">
      <h2 class="title">用户注册</h2>
      <el-form 
        ref="formRef" 
        :model="form" 
        :rules="rules" 
        label-width="100px"
        @submit.prevent="handleSubmit"
      >
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input 
            v-model="form.username" 
            placeholder="请输入用户名"
            @blur="checkUsernameUnique"
          />
        </el-form-item>

        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input 
            v-model="form.password" 
            type="password" 
            placeholder="请输入6-16位密码"
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

        <!-- 用户角色 -->
        <el-form-item label="用户角色" prop="userRole">
          <el-select v-model="form.userRole" placeholder="请选择角色">
            <el-option 
              v-for="role in userRoles" 
              :key="role.value" 
              :label="role.label" 
              :value="role.value"
            />
          </el-select>
        </el-form-item>

        <!-- 提交按钮 -->
        <el-form-item>
          <el-button type="primary" native-type="submit">立即注册</el-button>
          <el-button style="margin-left: 10px" @click="goLogin">去登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { ElNotification } from 'element-plus';
import { registerApi } from '@/api/user';

// 用户角色选项（根据代码库 UserRole 枚举，排除 ADMINISTRATOR）
const userRoles = [
  { label: '普通用户', value: 'USER' },
  { label: '维修人员', value: 'REPAIR_PERSON' }
];

// 表单数据
const form = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  userRole: 'USER' // 默认普通用户
});

// 表单验证规则
const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度3-20位', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 16, message: '密码长度6-16位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (value !== form.password) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      }, 
      trigger: 'blur' 
    }
  ],
  userRole: [
    { required: true, message: '请选择用户角色', trigger: 'change' }
  ]
});

// 表单引用
const formRef = ref(null);
const router = useRouter();

// 检查用户名是否已存在（调用后端接口）
const checkUsernameUnique = async () => {
  if (!form.username) return;
  try {
    const res = await axios.getUserByUserName(form.username);
    if (res.data) {
      // 触发表单验证错误提示
      formRef.value.validateField('username', (err) => {
        if (!err) {
          formRef.value.setFieldError('username', '用户名已存在');
        }
      });
    }
  } catch (error) {
    console.error('检查用户名失败:', error);
  }
};

// 提交注册
const handleSubmit = async () => {
  await formRef.value.validate((valid) => {
    if (!valid) return;
    // 构造后端需要的 User 对象（根据代码库 User 实体）
    const user = {
      username: form.username,
      password: form.password,
      userRole: form.userRole
    };

    // 调用后端注册接口（/carsys/user/addNewUser）
    registerApi(user)
      .then((res) => {
        if (res.data > 0) { // 假设 addNewUser 成功返回 1
          ElNotification({
            type: 'success',
            title: '注册成功',
            message: '请使用新账号登录'
          });
          router.push('/login'); // 跳转登录页
        } else {
          ElNotification({
            type: 'error',
            title: '注册失败',
            message: '服务器异常，请稍后再试'
          });
        }
      })
      .catch((error) => {
        ElNotification({
          type: 'error',
          title: '注册失败',
          message: error.response?.data?.message || '网络请求失败'
        });
      });
  });
};

// 跳转登录页
const goLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
}

.register-card {
  width: 400px;
  padding: 30px;
}

.title {
  text-align: center;
  margin-bottom: 30px;
  color: #1890ff;
}
</style>