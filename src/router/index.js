/**
 * router/index.js
 */
import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import { useUserStore } from '@/stores/userStore'

// 這裡的 router 是 Vue Router 的實例，會在 main.js 中被掛載到 Vue app 上
const router = createRouter({
  //* 因為使用 vuetify 所以這裡的 createWebHistory 要改成 createWebHashHistory
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 } // 預設就是瞬間跳頂,不是 smooth
  },
})

// 這裡會在每次路由變更前被呼叫，可以用來檢查使用者是否有權限訪問某些頁面
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // console.log('[nav]', {
  //   // 這裡可以看到每次路由變更的詳細資訊，方便除錯
  //   from: from.fullPath,
  //   to: to.fullPath,
  //   historyLength: window.history.length,
  //   historyState: window.history.state,
  // })

  // 更新標題
  document.title = to.meta.title ? `${to.meta.title} | 緩慢茶事` : '緩慢茶事'

  // 1. 針對「已登入者禁止進入」的頁面 (例如 login, register)
  if (to.meta.login === 'no-login-only' && userStore.isLoggedIn) {
    // 如果已經登入了，想進註冊或登入頁，直接導向首頁
    return next('/')
  }

  // 2. 檢查「必須登入」才能進入的頁面
  // 排除掉 'no-login-only' 的字串情況，確保 login 是 true (布林值)
  if (to.meta.login === true && !userStore.isLoggedIn) {
    alert('請先登入後再繼續操作')
    // 導向登入頁，並記錄原本想去的路徑 (redirect)，方便登入後跳轉回來
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }

  // 3. 檢查「管理員權限」才能進入的頁面
  // 這裡對應你在後端設定的 role: 'admin'
  // 只要路徑是以 /admin 開頭，或是 meta.admin 為 true
  if ((to.path.startsWith('/admin') || to.meta.admin === true) && userStore.role !== 'admin') {
    alert('權限不足，無法進入管理專區')
    return next('/')
  }

  // 若以上檢查都通過，放行
  next()
})

// // 這裡會在每次路由變更後被呼叫，可以用來做一些後續處理，例如記錄使用者行為、發送分析數據等
// router.afterEach((to, from, failure) => {
//   //
//   if (failure) {
//     console.log('[導航失敗] type:', failure.type)
//     console.log('[導航失敗] message:', failure.message)
//     console.log('[導航失敗] 完整物件:', failure)
//   }
// })

// 錯誤處理
router.onError((err, to) => {
  if (
    err?.message?.includes?.('Failed to fetch dynamically imported module') &&
    !localStorage.getItem('vuetify:dynamic-reload')
  ) {
    localStorage.setItem('vuetify:dynamic-reload', 'true')
    location.assign(to.fullPath)
  }
})

export default router
