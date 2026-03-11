<template>
  <v-container class="py-10">
    <v-row justify="center">
      <v-col cols="12" md="10">
        <div class="mb-6">
          <h1 class="text-h4 font-weight-bold font-serif color-tea-green">我的訂單紀錄</h1>
          <p class="text-grey-darken-1 font-serif">回味每一口回甘的時光</p>
        </div>

        <v-card class="rounded-xl border shadow-sm" elevation="0">
          <v-card-text class="pa-0">
            <v-expansion-panels v-if="orders.length > 0" class="custom-panels" variant="accordion">
              <v-expansion-panel v-for="order in orders" :key="order._id" elevation="0">
                <v-expansion-panel-title class="py-6">
                  <v-row align="center" no-gutters>
                    <v-col cols="6" sm="3">
                      <span class="text-caption text-grey-darken-1 d-block">訂單編號</span>
                      <span class="font-weight-bold">#{{ order._id.slice(-8).toUpperCase() }}</span>
                    </v-col>
                    <v-col cols="6" sm="3">
                      <span class="text-caption text-grey-darken-1 d-block">下單日期</span>
                      <span>{{ new Date(order.createdAt).toLocaleDateString() }}</span>
                    </v-col>
                    <v-col class="mt-2 mt-sm-0" cols="6" sm="3">
                      <span class="text-caption text-grey-darken-1 d-block">訂單總額</span>
                      <span class="font-weight-bold color-brown">
                        NT$ {{ order.totalPrice.toLocaleString() }}</span>
                    </v-col>
                    <v-col class="text-right mt-2 mt-sm-0" cols="6" sm="3">
                      <v-chip
                        class="text-white font-weight-bold"
                        :color="getStatusColor(order.status)"
                        size="small"
                        variant="flat"
                      >
                        {{
                          order.status === 0 ? '待處理' : order.status === 1 ? '已完成' : '已取消'
                        }}
                      </v-chip>
                    </v-col>
                  </v-row>
                </v-expansion-panel-title>

                <v-expansion-panel-text class="bg-grey-lighten-5 border-t">
                  <div
                    v-for="item in order.cart"
                    :key="item._id"
                    class="d-flex align-center py-4 border-b last-no-border"
                  >
                    <v-avatar class="mr-4 border" rounded="lg" size="60">
                      <v-img cover :src="item.p_id.image"></v-img>
                    </v-avatar>
                    <div class="flex-grow-1">
                      <div class="text-body-1 font-weight-bold color-tea-green">
                        {{ item.p_id.name }}
                      </div>
                      <div class="text-caption text-grey">
                        單價：NT$ {{ item.p_id.price }} | 數量：{{ item.quantity }}
                      </div>
                    </div>
                    <div class="text-body-1 font-weight-bold text-right">
                      NT$ {{ (item.p_id.price * item.quantity).toLocaleString() }}
                    </div>
                  </div>

                  <div class="d-flex justify-space-between align-center pt-6">
                    <div>
                      <v-btn
                        v-if="order.status === 0"
                        color="red-darken-1"
                        size="small"
                        variant="text"
                        @click="cancelOrder(order._id)"
                      >
                        取消訂單</v-btn>
                      <v-btn
                        v-if="order.status === 2"
                        color="grey-darken-1"
                        size="small"
                        variant="text"
                        @click="deleteOrder(order._id)"
                      >
                        刪除紀錄</v-btn>
                    </div>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>

        <v-btn
          class="mt-8"
          color="grey-darken-2"
          prepend-icon="mdi-arrow-left"
          variant="text"
          @click="router.back()"
        >
          返回上一頁</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { inject, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import api from '@/composables/api'

  const router = useRouter()
  const showSnackbar = inject('showSnackbar')
  const orders = ref([])

  // 取得訂單紀錄
  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders')
      if (data.success) {
        orders.value = data.data
      }
    } catch {
      showSnackbar('無法取得訂單紀錄', 'error')
    }
  }

  // 狀態顏色判斷 (根據後端定義，假設 0:待處理, 1:完成, 2:取消)
  const getStatusColor = status => {
    if (status === 0) return 'orange-darken-1'
    if (status === 1) return 'success'
    return 'grey'
  }

  // 取消訂單
  const cancelOrder = async id => {
    if (!confirm('確定要取消這筆訂單嗎？')) return
    try {
      // 假設後端 PATCH /orders/:id 是用來更改狀態
      const { data } = await api.patch(`/orders/${id}`, { status: 2 })
      if (data.success) {
        showSnackbar('訂單已取消')
        fetchOrders() // 重新整理
      }
    } catch {
      showSnackbar('取消失敗，請洽客服', 'error')
    }
  }

  // 刪除訂單紀錄
  const deleteOrder = async id => {
    if (!confirm('確定要從紀錄中刪除這筆訂單嗎？（刪除後無法恢復）')) return
    try {
      // 呼叫 DELETE 路由
      const { data } = await api.delete(`/orders/${id}`)
      if (data.success) {
        showSnackbar('訂單紀錄已刪除')
        fetchOrders() // 重新整理清單
      }
    } catch (error) {
      showSnackbar(error.response?.data?.message || '刪除失敗', 'error')
    }
  }

  onMounted(fetchOrders)
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

  .last-no-border:last-child {
    border-bottom: none !important;
  }

  /* 自定義面板樣式 */
  .custom-panels :deep(.v-expansion-panel-title--active) {
    /* 米色背景 */
    background-color: #fcfaf8;
  }
</style>
