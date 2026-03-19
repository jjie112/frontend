<template>
  <v-menu
    v-model="dialog"
    :activator="activator"
    :close-on-content-click="false"
    location="bottom end"
    offset="12"
    :open-on-click="false"
    transition="slide-y-transition"
  >
    <v-card class="overflow-hidden border-card" elevation="24" rounded="xl" width="320">
      <template v-if="userStore.isLoggedIn">
        <v-list bg-color="green-darken-4" class="pa-4">
          <v-list-item
            class="text-white"
            prepend-icon="mdi-account-circle"
            :subtitle="userStore.role === 'admin' ? '品茗管理員' : '品茗正式會員'"
          >
            <template #title>
              <span class="font-weight-bold font-serif text-h6">{{ userStore.account }}</span>
            </template>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-card-text class="pa-4 bg-grey-lighten-5">
          <p class="text-caption text-grey-darken-1 mb-4 px-2 d-flex align-center">
            <v-icon class="mr-1" color="green-darken-3" size="small">mdi-leaf</v-icon>
            歡迎回到您的茶事空間
          </p>

          <v-list class="bg-transparent pa-0" density="comfortable" nav>
            <v-list-item
              v-if="userStore.role === 'admin'"
              class="mb-2 shadow-sm bg-white"
              color="orange-darken-4"
              prepend-icon="mdi-view-dashboard-outline"
              rounded="lg"
              title="進入管理後台"
              to="/admin"
              @click="dialog = false"
            ></v-list-item>

            <v-list-item
              v-if="userStore.role !== 'admin'"
              class="mb-2 shadow-sm bg-white"
              color="green-darken-3"
              prepend-icon="mdi-calendar-text-outline"
              rounded="lg"
              title="我的訂單查詢"
              to="/orders"
              @click="dialog = false"
            ></v-list-item>

            <v-list-item
              class="shadow-sm bg-white"
              color="green-darken-3"
              prepend-icon="mdi-account-edit-outline"
              rounded="lg"
              title="修改個人資料"
              to="/profile"
              @click="dialog = false"
            ></v-list-item>
          </v-list>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4 bg-white">
          <v-btn
            class="px-4"
            color="grey-darken-1"
            rounded="pill"
            variant="text"
            @click="dialog = false"
          >
            關閉
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            class="px-6 font-weight-bold"
            color="red-lighten-1"
            prepend-icon="mdi-logout-variant"
            rounded="pill"
            variant="flat"
            @click="handleLogout"
          >
            登出
          </v-btn>
        </v-card-actions>
      </template>
    </v-card>
  </v-menu>

  <v-snackbar
    v-model="snackbar.show"
    :color="snackbar.color"
    elevation="12"
    location="top"
    rounded="pill"
    :timeout="1000"
  >
    <div class="text-center w-100 font-weight-bold">
      <v-icon class="mr-2">mdi-check-circle</v-icon>
      {{ snackbar.text }}
    </div>
  </v-snackbar>
</template>

<script setup>
  import { reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import { useCartStore } from '@/stores/cartStore'
  import { useUserStore } from '@/stores/user'

  // 定義組件接收的 props 和內部狀態
  const props = defineProps(['activator'])
  const dialog = defineModel('dialog', { type: Boolean, default: false })

  const userStore = useUserStore()
  const cartStore = useCartStore()
  const router = useRouter()

  const snackbar = reactive({
    show: false,
    text: '',
    color: 'success',
  })

  // 處理登出邏輯
  const handleLogout = async () => {
    try {
      await userStore.logout()
      cartStore.cartItems = [] // 清空購物車
      dialog.value = false

      snackbar.text = '您已安全登出，期待下次與您品茗'
      snackbar.color = 'green-darken-3'
      snackbar.show = true

      // 導頁時間設為 1000ms，讓 Snackbar 關閉後（1000ms）再跳轉
      setTimeout(() => {
        router.push('/')
      }, 1000)
    } catch {
      snackbar.text = '登出過程中發生錯誤'
      snackbar.color = 'error'
      snackbar.show = true
    }
  }
</script>

<style scoped>
  /* 明體字 */
  .font-serif {
    font-family: 'Noto Serif TC', serif !important;
  }

  /* 卡片邊框與陰影 */
  .border-card {
    border: 1px solid rgba(45, 62, 51, 0.05) !important;
  }

  /* 選單項目的輕微陰影 */
  .shadow-sm {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04) !important;
  }

  /* 登出按鈕 */
  :deep(.v-btn--variant-flat) {
    letter-spacing: 1px;
  }
</style>
