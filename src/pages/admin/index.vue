<template>
  <v-container class="py-8 bg-stone-light">
    <div class="d-flex align-center mb-8">
      <v-avatar class="mr-4 shadow-sm" color="green-darken-4" size="48">
        <v-icon color="white">mdi-leaf</v-icon>
      </v-avatar>
      <div>
        <h1 class="text-h4 font-weight-black color-tea-green font-serif">營運概覽</h1>
        <p class="text-caption text-grey-darken-1 mt-1">即時掌握茶事營運數據與訂單狀態</p>
      </div>
    </div>

    <v-row>
      <v-col v-for="card in summaryCards" :key="card.title" cols="12" md="3" sm="6">
        <v-card class="rounded-xl pa-5 border-card shadow-sm" elevation="0">
          <div class="d-flex justify-space-between align-start">
            <div>
              <div class="text-caption font-weight-bold text-grey-darken-1 mb-1">
                {{ card.title }}
              </div>
              <div class="text-h4 font-weight-black color-tea-green">
                <v-progress-circular
                  v-if="loading"
                  class="mr-2"
                  indeterminate
                  size="20"
                  width="2"
                ></v-progress-circular>
                {{ card.value }}
              </div>
            </div>
            <v-avatar :color="card.bgColor" rounded="lg" size="48">
              <v-icon :color="card.iconColor" size="28">{{ card.icon }}</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-8">
      <v-col cols="12" md="8">
        <v-card class="rounded-xl border-card shadow-sm" elevation="0">
          <v-card-title class="font-weight-bold pa-6 d-flex align-center">
            <v-icon class="mr-2" color="green-darken-3">mdi-history</v-icon>
            最近 5 筆訂單
            <v-spacer></v-spacer>
            <v-btn
              class="text-caption"
              color="green-darken-3"
              density="compact"
              to="/admin/orders"
              variant="text"
              >查看全部</v-btn
            >
          </v-card-title>

          <v-divider class="border-opacity-25"></v-divider>

          <v-table class="admin-table">
            <thead>
              <tr class="bg-grey-lighten-5">
                <th class="text-grey-darken-2">訂單編號</th>
                <th class="text-grey-darken-2 text-right">訂單金額</th>
                <th class="text-grey-darken-2 text-center">處理狀態</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="orders?.length === 0 && !loading">
                <td class="text-center py-8 text-grey" colspan="3">目前尚無訂單資料</td>
              </tr>
              <tr v-for="order in orders" :key="order._id" class="table-row-hover">
                <td class="font-weight-medium text-uppercase">#{{ order._id.slice(-8) }}</td>
                <td class="text-right color-brown font-weight-bold">
                  NT$ {{ order.totalPrice.toLocaleString() }}
                </td>
                <td class="text-center">
                  <v-chip
                    class="font-weight-bold"
                    :color="getStatusColor(order.status)"
                    size="small"
                    variant="flat"
                  >
                    {{ getStatusText(order.status) }}
                  </v-chip>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="rounded-xl border-card shadow-sm mb-6" elevation="0">
          <v-card-title class="font-weight-bold pa-6">快速導覽</v-card-title>
          <v-list class="pa-4 bg-transparent" density="comfortable" nav>
            <v-list-item
              v-for="item in quickActions"
              :key="item.title"
              class="mb-2 quick-action-item"
              color="green-darken-3"
              :prepend-icon="item.icon"
              rounded="lg"
              :title="item.title"
              :to="item.link"
            ></v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { inject, onMounted, ref } from 'vue'
  import api from '@/composables/api'

  const showSnackbar = inject('showSnackbar')
  const orders = ref([])
  const loading = ref(true)

  const summaryCards = ref([
    {
      title: '今日營業額',
      value: 'NT$ 0',
      icon: 'mdi-currency-usd',
      iconColor: 'green-darken-3',
      bgColor: 'green-lighten-5',
    },
    {
      title: '待處理訂單',
      value: '0',
      icon: 'mdi-clock-outline',
      iconColor: 'orange-darken-3',
      bgColor: 'orange-lighten-5',
    },
    {
      title: '累積會員數',
      value: '0',
      icon: 'mdi-account-group-outline',
      iconColor: 'indigo-darken-3',
      bgColor: 'indigo-lighten-5',
    },
    {
      title: '缺貨商品',
      value: '0',
      icon: 'mdi-alert-circle-outline',
      iconColor: 'red-darken-3',
      bgColor: 'red-lighten-5',
    },
  ])

  const quickActions = [
    { title: '商品上架管理', icon: 'mdi-plus-box-outline', link: '/admin/products' },
    { title: '商品庫存管理', icon: 'mdi-package-variant-closed', link: '/admin/stock' },
    { title: '訂單流程追蹤', icon: 'mdi-truck-delivery-outline', link: '/admin/orders' },
    { title: '會員資料管理', icon: 'mdi-account-group-outline', link: '/admin/member' },
  ]

  // 獲取狀態顏色
  const getStatusColor = (status) => {
    const colors = ['orange-darken-1', 'blue-darken-1', 'green-darken-1', 'red-darken-1']
    return colors[status] || 'grey'
  }

  // 獲取狀態文字
  const getStatusText = (status) => {
    const texts = ['待處理', '已出貨', '已完成', '已取消']
    return texts[status] || '未知'
  }

  // 獲取數據與計算統計
  const fetchDashboardData = async () => {
    try {
      loading.value = true

      // 建議寫法：直接解構出 data 並重新命名
      const [resOrders, resUsers, resProducts] = await Promise.all([
        api.get('/orders/all'),
        api.get('/users/all'),
        // 路徑改為 /products，並加上 ?admin=true
        api.get('/products', { params: { admin: true } }),
      ])

      // 1.處理訂單相關數據
      if (resOrders.data.success) {
        const allOrders = resOrders.data.data
        // 取最近 5 筆
        orders.value = allOrders.slice(0, 5)

        // 待處理訂單
        summaryCards.value[1].value = allOrders.filter((o) => o.status === 0).length.toString()

        // 今日營業額
        const todayStr = new Date().toLocaleDateString()
        const todayRevenue = allOrders
          .filter((o) => new Date(o.createdAt).toLocaleDateString() === todayStr)
          .reduce((sum, o) => sum + o.totalPrice, 0)
        summaryCards.value[0].value = `NT$ ${todayRevenue.toLocaleString()}`
      }

      // 2. 處理會員
      if (resUsers.data.success) {
        summaryCards.value[2].value = resUsers.data.data.length.toString()
      }

      // 3. 處理缺貨商品
      if (resProducts.data.success) {
        // 這裡會拿到所有商品（因為用了 admin=true）
        const outOfStockCount = resProducts.data.data.filter((p) => p.stock <= 0).length
        summaryCards.value[3].value = outOfStockCount.toString()
      }
    } catch (error) {
      console.error('抓取儀表板失敗', error)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchDashboardData()
  })
</script>

<style scoped>
  .font-serif {
    font-family: 'Noto Serif TC', serif !important;
  }
  .color-tea-green {
    color: #2d3e33;
  }
  .color-brown {
    color: #8d6e63;
  }
  .bg-stone-light {
    min-height: 100vh;
  }
  .border-card {
    border: 1px solid rgba(45, 62, 51, 0.08) !important;
  }
  .shadow-sm {
    box-shadow: 0 4px 20px rgba(45, 62, 51, 0.05) !important;
  }
  .admin-table :deep(th) {
    height: 56px !important;
    font-size: 0.85rem !important;
    letter-spacing: 1px;
  }
  .admin-table :deep(td) {
    height: 64px !important;
  }
  .table-row-hover:hover {
    background-color: #fdfdfd;
  }
  .quick-action-item {
    transition: transform 0.2s;
  }
  .quick-action-item:hover {
    transform: translateX(5px);
  }
</style>

<route lang="yaml">
meta:
  title: '營運概覽'
  login: true
  admin: true
</route>
