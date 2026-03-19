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
              <div class="text-h4 font-weight-black color-tea-green">{{ card.value }}</div>
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
              <tr v-for="i in 5" :key="i" class="table-row-hover">
                <td class="font-weight-medium">#ORD-2024-00{{ i }}</td>
                <td class="text-right color-brown font-weight-bold">
                  NT$ {{ (1500 * i).toLocaleString() }}
                </td>
                <td class="text-center">
                  <v-chip
                    class="font-weight-bold"
                    color="orange-darken-1"
                    size="small"
                    variant="flat"
                    >待處理</v-chip
                  >
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
  import { ref } from 'vue'

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
    { title: '查看銷售報表', icon: 'mdi-chart-line', link: '/admin' },
  ]
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
    /* background-color: #f8f9f8; */
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
