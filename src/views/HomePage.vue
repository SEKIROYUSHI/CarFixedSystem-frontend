<template>
  <div class="user-dashboard">
    <!-- 顶部操作栏 -->
    <div class="header">
      <h2>我的车辆</h2>
      <el-button type="primary" @click="addVehicleDialogVisible = true">
        添加车辆
      </el-button>
      <!-- 查询用户所有工单按钮 -->
      <el-button type="info" style="margin-left: 10px" @click="viewAllOrdersDialogVisible = true">
        查询所有工单
      </el-button>
    </div>

    <!-- 车辆列表 -->
    <el-card>
      <el-table :data="vehicles" stripe border>
        <el-table-column prop="license_plate" label="车牌号" width="150" />
        <el-table-column prop="model" label="车型" width="180" />
        <el-table-column prop="manufacture_year" label="制造年份" width="120" />
        <el-table-column label="操作" width="240">
          <template #default="scope">
            <el-button type="success" size="small" @click="handleApplyRepair(scope.row)">
              申请维修
            </el-button>
            <el-button type="info" size="small" style="margin-left: 10px" @click="handleViewOrders(scope.row)">
              查看订单
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加车辆对话框 -->
    <el-dialog v-model="addVehicleDialogVisible" title="添加车辆" width="40%">
      <el-form ref="addVehicleFormRef" :model="addVehicleForm" :rules="addVehicleRules">
        <el-form-item label="车牌号" prop="license_plate">
          <el-input v-model="addVehicleForm.license_plate" placeholder="请输入车牌号" />
        </el-form-item>
        <el-form-item label="车型" prop="model">
          <el-input v-model="addVehicleForm.model" placeholder="请输入车型（如：奥迪A6）" />
        </el-form-item>
        <el-form-item label="制造年份" prop="manufacture_year">
          <el-input-number v-model="addVehicleForm.manufacture_year" :min="1900" :max="new Date().getFullYear()"
            placeholder="请输入制造年份" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addVehicleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAddVehicle">提交</el-button>
      </template>
    </el-dialog>

    <!-- 申请维修对话框 -->
    <el-dialog v-model="applyRepairDialogVisible" title="申请维修" width="40%">
      <el-form>
        <el-form-item label="选择维修类型" required>
          <el-checkbox-group v-model="selectedTaskTypes">
            <el-checkbox v-for="type in taskTypes" :key="type" :label="type">
              {{ typeLabelMap[type] }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="applyRepairDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitRepairApplication">提交</el-button>
      </template>
    </el-dialog>

    <!-- 查看订单对话框 -->
    <el-dialog v-model="orderDialogVisible" title="车辆订单" width="60%">
      <el-table :data="orders" stripe border>
        <el-table-column prop="order_id" label="订单ID" width="150" />
        <el-table-column label="创建时间" width="200">
          <template #default="scope">
            {{ scope.row.create_time }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.status? 'success' : 'info'">
              {{ scope.row.status? '已完成' : '进行中' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="总费用" width="120">
          <template #default="scope">
            {{ scope.row.total_cost }} 元
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 查询用户所有工单对话框 -->
<el-dialog v-model="viewAllOrdersDialogVisible" title="用户所有工单" width="80%">
  <el-table :data="allUserOrders" stripe border>
    <el-table-column prop="order_id" label="订单ID" width="150" />
    <el-table-column label="车辆信息" width="250">
      <template #default="scope">
        车牌号: {{ scope.row.vehicle_license_plate }} | 车型: {{ scope.row.vehicle_model }}
      </template>
    </el-table-column>
    <el-table-column label="状态" width="120">
      <template #default="scope">
        <el-tag :type="scope.row.status ? 'success' : 'info'">
          {{ scope.row.status ? '已完成' : '进行中' }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted ,watch} from 'vue';
import { ElMessage } from 'element-plus';
import { addVehicleApi, getVehicleByIdApi, getVehiclesApi } from '@/api/vehicle';
import { createOrderApi, getOrdersOfVehicleApi, getAllOrdersByUserApi } from '@/api/order';

// 从代码库 TaskType 枚举获取维修类型（与后端保持一致）
const taskTypes = ['PAINTER', 'WELDER', 'MECHANIC', 'ELECTRICIAN'];
const typeLabelMap = {
  PAINTER: '漆工',
  WELDER: '焊工',
  MECHANIC: '机修',
  ELECTRICIAN: '电工'
};

// 状态管理
const vehicles = ref([]); // 用户车辆列表
const addVehicleDialogVisible = ref(false); // 添加车辆对话框显示状态
const applyRepairDialogVisible = ref(false); // 申请维修对话框显示状态
const orderDialogVisible = ref(false); // 查看订单对话框显示状态
const selectedVehicle = ref(null); // 当前操作的车辆
const selectedTaskTypes = ref([]); // 选择的维修类型
const orders = ref([]); // 当前车辆的订单列表
const allUserOrders = ref([]); // 用户所有工单列表
const viewAllOrdersDialogVisible = ref(false); // 查询用户所有工单对话框显示状态

// 添加车辆表单
const addVehicleForm = reactive({
  license_plate: '',
  model: '',
  manufacture_year: null,
  user_id: 0
});

const userInfo = localStorage.getItem('userInfo');
const userId = ref(null);
if (userInfo) {
  const parsedUserInfo = JSON.parse(userInfo);
  userId.value = parsedUserInfo.user_id; // 假设用户信息对象中有 id 属性
  console.log('userId:', userId.value);
} else {
  console.log('userInfo 不存在');
}

// 添加车辆表单验证规则
const addVehicleRules = reactive({
  license_plate: [
    { required: true, message: '请输入车牌号', trigger: 'blur' }
  ],
  model: [
    { required: true, message: '请输入车型', trigger: 'blur' }
  ],
  manufacture_year: [
    { required: true, message: '请输入制造年份', trigger: 'change' },
    { type: 'number', message: '制造年份必须为数字', trigger: 'change' }
  ]
});

const addVehicleFormRef = ref(null);

// 生命周期：加载用户车辆
onMounted(async () => {
  try {
    // 从登录用户信息中获取用户ID（示例：假设用户ID已存储在localStorage）
    const res = await getVehiclesApi(userId.value);
    vehicles.value = res.data;
  } catch (error) {
    ElMessage.error('加载车辆失败，请稍后再试');
  }
});

// 处理添加车辆提交
const submitAddVehicle = async () => {
  await addVehicleFormRef.value.validate(async (valid) => {
    if (!valid) return;
    try {
      addVehicleForm.user_id = userId.value;
      const res = await addVehicleApi(addVehicleForm);
      if (res.data > 0) {
        ElMessage.success('车辆添加成功');
        addVehicleDialogVisible.value = false;
        // 刷新车辆列表
        const newVehicles = await getVehiclesApi(userId.value);
        vehicles.value = newVehicles.data;
        // 清空表单
        addVehicleForm.license_plate = '';
        addVehicleForm.model = '';
        addVehicleForm.manufacture_year = null;
      } else {
        ElMessage.error('车辆添加失败');
      }
    } catch (error) {
      ElMessage.error('网络请求失败');
    }
  });
};

// 处理申请维修（打开对话框并记录当前车辆）
const handleApplyRepair = (vehicle) => {
  selectedVehicle.value = vehicle;
  selectedTaskTypes.value = []; // 清空上次选择
  applyRepairDialogVisible.value = true;
};

// 提交维修申请
const submitRepairApplication = async () => {
  if (selectedTaskTypes.value.length === 0) {
    ElMessage.warning('请至少选择一个维修类型');
    return;
  }
  try {
    // 构造 OrderCreationRequest
    const request = {
      order: {
        user_id: userId.value, // 从登录信息获取用户ID
        vehicle_id: selectedVehicle.value.vehicle_id // 当前车辆ID
      },
      taskTypes: selectedTaskTypes.value // 选择的维修类型列表
    };
    const res = await createOrderApi(request);
    if (res.data > 0) {
      ElMessage.success('维修申请提交成功');
      applyRepairDialogVisible.value = false;
    } else {
      ElMessage.error('维修申请提交失败');
    }
  } catch (error) {
    ElMessage.error('网络请求失败');
  }
};

// 处理查看订单（打开对话框并加载车辆订单）
const handleViewOrders = async (vehicle) => {
  selectedVehicle.value = vehicle;
  try {
    const res = await getOrdersOfVehicleApi(vehicle);
    orders.value = res.data;
    orderDialogVisible.value = true;
  } catch (error) {
    ElMessage.error('加载订单失败');
  }
};

// 处理查询用户所有工单（打开对话框并加载用户所有工单及其关联车辆信息）
const handleViewAllOrders = async () => {
  try {
    const res = await getAllOrdersByUserApi(userId.value);
    // 假设 getAllOrdersByUserApi 返回的每条工单数据中包含 vehicle_id
    // 我们需要根据 vehicle_id 获取车辆的详细信息
    const orderPromises = res.data.map(async (order) => {
      const vehicleRes = await getVehicleByIdApi(order.vehicle_id) // 假设存在这个API
      return {
        ...order,
        vehicle_license_plate: vehicleRes.data.license_plate,
        vehicle_model: vehicleRes.data.model
      };
    });
    const enhancedOrders = await Promise.all(orderPromises);
    allUserOrders.value = enhancedOrders;
    viewAllOrdersDialogVisible.value = true;
  } catch (error) {
    ElMessage.error('加载用户所有工单失败');
  }
};

// 监听查询用户所有工单对话框显示状态变化，确保每次打开时重新获取数据
watch(viewAllOrdersDialogVisible, (newVal) => {
  if (newVal) {
    handleViewAllOrders();
  }
});
</script>

<style scoped>
.user-dashboard {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  margin: 0;
  color: #303133;
}
</style>