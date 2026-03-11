<template>
  <v-app>
    <AppHeader />

    <v-main>
      <!-- <router-view /> -->
      <slot />
    </v-main>

    <!-- 全域 Snackbar（放在這裡讓所有頁面都能看到） -->
    <v-snackbar
      v-model="snackbar.show"
      centered
      :color="snackbar.color"
      elevation="24"
      location="top"
      multi-line
      :timeout="snackbar.timeout"
    >
      {{ snackbar.message }}

      <template #actions>
        <v-btn v-if="snackbar.showLogin" color="white" variant="text" @click="goToLogin">
          立即登入
        </v-btn>
        <v-btn color="white" variant="text" @click="snackbar.show = false"> 關閉 </v-btn>
      </template>
    </v-snackbar>

    <v-fab-transition>
      <v-btn
        v-show="showBackToTop"
        v-scroll="onScroll"
        class="back-to-top-btn"
        color="teal-darken-2"
        elevation="8"
        icon="mdi-chevron-up"
        size="large"
        @click="scrollToTop"
      ></v-btn>
    </v-fab-transition>

    <AppFooter />
  </v-app>
</template>

<script setup>
  import { provide, ref } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  // Snackbar 狀態
  const snackbar = ref({
    show: false,
    message: '',
    color: 'success',
    timeout: 4000,
    showLogin: false,
  })

  // 提供一個通用的函式來顯示 Snackbar，讓子元件可以呼叫
  const showSnackbar = (message, color = 'success', showLogin = false, timeout = 4000) => {
    snackbar.value = {
      show: true,
      message,
      color,
      timeout,
      showLogin,
    }
  }

  // 專門用來提示需要登入的快捷函式
  const showRequireLogin = (msg = '請先登入會員，才能加入購物車') => {
    showSnackbar(msg, 'warning', true, 6000)
  }

  // 點擊立即登入時的跳轉
  const goToLogin = () => {
    snackbar.value.show = false
    // 可帶上當前頁面，登入後跳回
    const currentPath = router.currentRoute.value.fullPath
    router.push(`/login?redirect=${encodeURIComponent(currentPath)}`)
  }

  // 把兩個函式提供給所有子元件
  provide('showSnackbar', showSnackbar)
  provide('showRequireLogin', showRequireLogin)

  // 控制按鈕是否顯示
  const showBackToTop = ref(false)

  // 監聽捲動事件
  const onScroll = () => {
    // 當捲動超過 200px 時顯示按鈕
    showBackToTop.value = window.scrollY > 200
  }

  // 點擊置頂功能
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // 平滑捲動
    })
  }
</script>

<style scoped>
  /* 設定按鈕固定在右下角 */
  .back-to-top-btn {
    position: fixed !important;
    bottom: 30px;
    right: 30px;
    z-index: 99; /* 確保在最上層 */
  }

  body,
  .v-application {
    background-color: #F5F5DC !important;
    /* 墨綠色 */
    color: #2d3e33;
  }
</style>
