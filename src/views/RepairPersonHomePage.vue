<template>
  <el-container>
    <!-- 侧边栏 -->
    <el-aside width="200px">
      <el-card>
        <h3>个人信息</h3>
        <el-descriptions :column="1">
          <el-descriptions-item label="维修人员ID">{{ repairPersonInfo.repair_person_id }}</el-descriptions-item>
          <el-descriptions-item label="用户名">{{ repairPersonInfo.username }}</el-descriptions-item>
          <el-descriptions-item label="技术能力">{{ repairPersonInfo.specialty }}</el-descriptions-item>
          <el-descriptions-item label="时薪">{{ repairPersonInfo.hourly_rate }} 元/小时</el-descriptions-item>
        </el-descriptions>
      </el-card>
    </el-aside>

    <!-- 主内容区域 -->
    <el-main>
      <h2>当前分配给我的工单</h2>
      <el-table :data="assignments" stripe border>
        <el-table-column prop="assignment_id" label="工单ID" width="120" />
        <el-table-column prop="order_id" label="订单ID" width="120" />
        <el-table-column prop="task_type" label="任务类型" width="120">
          <template #default="scope">
            {{ formatTaskType(scope.row.task_type) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="success" size="small" @click="acceptAssignment(scope.row.assignment_id)">同意</el-button>
            <el-button type="danger" size="small" @click="refuseAssignment(scope.row.assignment_id)" style="margin-left: 10px">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { getRepairPersonApi } from '@/api/user';
import { acceptAssignmentApi, getAssignmentsOfRepairPersonApi, refuseAssignmentApi } from '@/api/order';

// 从代码库 TaskType 枚举获取维修类型（与后端保持一致）
// const taskTypes = ['PAINTER', 'WELDER', 'MECHANIC', 'ELECTRICIAN'];
const typeLabelMap = {
  PAINTER: '漆工',
  WELDER: '焊工',
  MECHANIC: '机修',
  ELECTRICIAN: '电工'
};

const userInfo = localStorage.getItem('userInfo');
const userId = ref(null);
if (userInfo) {
  const parsedUserInfo = JSON.parse(userInfo);
  userId.value = parsedUserInfo.user_id; // 假设用户信息对象中有 id 属性
  console.log('userId:', userId.value);
} else {
  console.log('userInfo 不存在');
}

// 维修人员信息
const repairPersonInfo = ref({
  repair_person_id: 0,
  username: '',
  specialty: '',
  hourly_rate: 0
});

// 当前分配的工单列表
const assignments = ref([]);

// 格式化任务类型
const formatTaskType = (type) => {
  return typeLabelMap[type] || type;
};

// 生命周期：加载维修人员信息和工单
onMounted(async () => {
  try {
    // 获取维修人员信息
    const res1 = await getRepairPersonApi(userId.value);
    repairPersonInfo.value = res1.data;
    console.log(repairPersonInfo.value)

    // 获取分配的工单
    const res2 = await getAssignmentsOfRepairPersonApi(repairPersonInfo.value.repair_person_id);
    assignments.value = res2.data;
  } catch (error) {
    ElMessage.error('加载数据失败，请稍后再试');
  }
});

// 同意工单
const acceptAssignment = async (assignmentId) => {
  try {
     const res1 = await getRepairPersonApi(userId.value);
     repairPersonInfo.value = res1.data;
    const res = await acceptAssignmentApi(repairPersonInfo.value.repair_person_id,assignmentId);
    if (res.data) {
      ElMessage.success('已同意该工单');
      // 重新加载工单列表
      const newRes = await getAssignmentsOfRepairPersonApi(repairPersonInfo.value.repair_person_id);
      assignments.value = newRes.data;
    } else {
      ElMessage.error('同意工单失败');
    }
  } catch (error) {
    ElMessage.error('网络请求失败');
  }
};

// 拒绝工单
const refuseAssignment = async (assignmentId) => {
  try {
     const res1 = await getRepairPersonApi(userId.value);
     repairPersonInfo.value = res1.data;
    const res = await refuseAssignmentApi(repairPersonInfo.value.repair_person_id,assignmentId);
    if (res.data) {
      ElMessage.success('已拒绝该工单');
      // 重新加载工单列表
      const newRes = await getAssignmentsOfRepairPersonApi(repairPersonInfo.value.repair_person_id);
      assignments.value = newRes.data;
    } else {
      ElMessage.error('拒绝工单失败');
    }
  } catch (error) {
    ElMessage.error('网络请求失败');
  }3
};
</script>

<style scoped>
.el-aside {
  background-color: #f9f9f9;
  padding: 20px;
}

.el-main {
  padding: 20px;
}
</style>