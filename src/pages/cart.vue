<template>
  <v-container class="py-10">
    <v-row align="center" class="mb-6">
      <v-col class="d-flex justify-space-between align-center" cols="12">
        <h1 class="text-h4 font-weight-bold text-teal-darken-4">🛒 我的購物車</h1>
        <v-btn color="teal" prepend-icon="mdi-undo" variant="outlined" @click="router.back()">
          返回上一頁
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-if="cartStore.cartItems.length > 0">
      <v-col cols="12" md="8">
        <v-card class="rounded-lg" variant="outlined">
          <v-table>
            <thead>
              <tr>
                <th class="text-left">商品</th>
                <th class="text-center">單價</th>
                <th class="text-center">數量</th>
                <th class="text-center">小計</th>
                <th class="text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in cartStore.cartItems" :key="item.p_id._id">
                <td class="py-4">
                  <div class="d-flex align-center">
                    <v-img
                      class="rounded mr-4"
                      cover
                      height="60"
                      :src="item.p_id.image"
                      width="60"
                    ></v-img>
                    <span class="font-weight-bold">{{ item.p_id.name }}</span>
                  </div>
                </td>
                <td class="text-center">NT$ {{ item.p_id.price.toLocaleString() }}</td>

                <td class="text-center" style="min-width: 150px">
                  <div class="d-flex align-center justify-center">
                    <v-btn
                      color="teal"
                      :disabled="item.quantity <= 1 || isUpdating"
                      icon="mdi-minus"
                      size="x-small"
                      variant="outlined"
                      @click="updateQty(item.p_id._id, -1)"
                    ></v-btn>

                    <span class="mx-4 font-weight-bold" style="min-width: 20px">
                      {{ item.quantity }}
                    </span>

                    <v-btn
                      color="teal"
                      :disabled="isUpdating"
                      icon="mdi-plus"
                      size="x-small"
                      variant="outlined"
                      @click="updateQty(item.p_id._id, 1)"
                    ></v-btn>
                  </div>
                </td>

                <td class="text-center font-weight-bold">
                  NT$ {{ (item.p_id.price * item.quantity).toLocaleString() }}
                </td>

                <td class="text-center">
                  <v-btn
                    color="red-lighten-1"
                    :disabled="isUpdating"
                    icon="mdi-delete-outline"
                    variant="text"
                    @click="removeProduct(item.p_id._id, item.p_id.name)"
                  ></v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-6 rounded-lg bg-grey-lighten-4" elevation="0">
          <h2 class="text-h6 mb-4 font-weight-bold">訂單摘要</h2>
          <v-divider class="mb-4"></v-divider>
          <div class="d-flex justify-space-between mb-2">
            <span>商品總計</span>
            <span>NT$ {{ cartStore.totalPrice.toLocaleString() }}</span>
          </div>
          <div class="d-flex justify-space-between mb-6">
            <span>運費</span>
            <span class="text-green-darken-1">免運</span>
          </div>
          <v-divider class="mb-4"></v-divider>
          <div
            class="d-flex justify-space-between mb-6 text-h5 font-weight-black text-teal-darken-4"
          >
            <span>總金額</span>
            <span>NT$ {{ cartStore.totalPrice.toLocaleString() }}</span>
          </div>
          <v-btn
            block
            color="teal-darken-3"
            :loading="isUpdating"
            size="x-large"
            @click="handleCheckout"
          >
            前往結帳
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else class="text-center py-10">
      <v-col cols="12">
        <v-icon color="grey-lighten-2" size="120">mdi-cart-off</v-icon>
        <p class="text-h6 text-grey mt-4">您的購物車目前是空的</p>
        <v-btn class="mt-6" color="teal" size="large" to="/products" variant="elevated">
          去挑選好茶 🍵
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { inject, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router' // 💡 引入 useRouter
  import api from '@/composables/api'
  import { useCartStore } from '@/stores/cartStore'

  const router = useRouter() // 💡 初始化
  const cartStore = useCartStore()
  const showSnackbar = inject('showSnackbar') // 注入全域通知函式
  const isUpdating = ref(false) // 全域更新狀態，防止連續點擊造成的 API 衝突

  // 初始載入購物車資料
  onMounted(async () => {
    try {
      await cartStore.fetchCart()
    } catch {
      showSnackbar?.('讀取購物車失敗，請稍後再試', 'error')
    }
  })

  // 更新數量
  const updateQty = async (p_id, delta) => {
    if (isUpdating.value) return

    isUpdating.value = true
    try {
      // 直接呼叫 store 的 updateCart，delta 為 1 或 -1
      await cartStore.updateCart(p_id, delta)
    } catch (error) {
      showSnackbar?.(error.message || '數量更新失敗', 'error')
    } finally {
      isUpdating.value = false
    }
  }

  // 刪除商品
  const removeProduct = async (p_id, name) => {
    if (!confirm(`確定要將「${name}」從購物車移除嗎？`)) return

    isUpdating.value = true
    try {
      await cartStore.removeItem(p_id)
      showSnackbar?.(`已將「${name}」從購物車移除`, 'success', false, 2000)
    } catch {
      showSnackbar?.('移除商品失敗', 'error')
    } finally {
      isUpdating.value = false
    }
  }

  // 結帳處理
  const handleCheckout = async () => {
    if (isUpdating.value) return
    if (cartStore.cartItems.length === 0) return

    // 1. 二次確認
    if (!confirm('確定要提交訂單並結帳嗎？')) return

    isUpdating.value = true
    try {
      // 💡 2. 呼叫後端 API 建立訂單
      // 注意：根據 index.js，你的路徑可能是 /api/orders 或 /orders
      // 如果你在 index.js 寫 app.use('/api/orders', orderRoute)，這裡就打 /orders (因為 api composable 通常有 baseURL)
      const { data } = await api.post('/orders')

      if (data.success) {
        showSnackbar?.('訂單已成功建立！🍵', 'success')

        // 3. 清空 Pinia Store 裡的購物車狀態（避免回到購物車還看到舊資料）
        await cartStore.fetchCart()

        // 4. 跳轉至訂單頁面 (注意檔案名稱，如果是 order.vue 則跳轉到 /order)
        router.push('/orders')
      }
    } catch (error) {
      console.error('結帳失敗:', error)
      const msg = error.response?.data?.message || '結帳失敗，請稍後再試'
      showSnackbar?.(msg, 'error')
    } finally {
      isUpdating.value = false
    }
  }
</script>

<style scoped>
  /* 讓表格在小螢幕時能水平滾動，避免破版 */
  .v-table {
    overflow-x: auto;
  }

  /* 懸停效果增強質感 */
  tbody tr:hover {
    background-color: rgba(0, 150, 136, 0.02);
  }
</style>

<route lang="yaml">
meta:
  title: '我的購物車'
  login: true
</route>
