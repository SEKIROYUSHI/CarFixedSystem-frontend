<!-- <template>
  <el-container>
    <el-header>
      <el-button type="primary" @click="createOrder">新建订单</el-button>
    </el-header>
    <el-main>
      <el-table :data="orderList" border stripe>
        <el-table-column prop="order_id" label="订单ID" width="120" />
        <el-table-column prop="vehicle_id" label="车辆ID" width="120" />
        <el-table-column prop="create_time" label="创建时间" width="200" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.status ? 'success' : 'info'">
              {{ scope.row.status ? '已完成' : '进行中' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="text" @click="viewDetail(scope.row)">查看详情</el-button>
            <el-button type="text" v-if="!scope.row.status" @click="updateStatus(scope.row)">标记完成</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getOrdersByUserIdApi, updateOrderStatusApi } from '@/api/repairOrder';
import { useRouter } from 'vue-router';

const orderList = ref([]);
const router = useRouter();

// 获取当前用户ID（示例，实际需从登录状态获取）
const currentUserId = 123;

onMounted(async () => {
  const res = await getOrdersByUserIdApi(currentUserId);
  orderList.value = res;
});

const viewDetail = (order) => {
  router.push(`/order-detail/${order.order_id}`);
};

const updateStatus = async (order) => {
  const newOrder = { ...order, status: true };
  const res = await updateOrderStatusApi(newOrder);
  if (res) {
    ElMessage.success('订单状态更新成功');
    orderList.value = orderList.value.map(item => 
      item.order_id === order.order_id ? newOrder : item
    );
  }
};
</script> -->