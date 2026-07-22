import axios from 'axios'
import { useUserStore } from '@/stores/userStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// 請求攔截器：自動附加 JWT Token
api.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// 響應攔截器：自動處理 401 錯誤並嘗試續期
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const userStore = useUserStore()

    // 如果是 401 錯誤，嘗試續期
    // error.response(錯誤回應)：Axios 錯誤物件中，後端真正回傳的回應
    // error.response.status(錯誤回應狀態)：後端回傳的 HTTP 狀態碼（例如 401、403、500）
    // error.response 和 error.response.status 可能為 undefined(未定義)，需先檢查
    if (error.response && error.response.status === 401) {
      // 使用 includes 判斷，避免路徑前綴 (如 /api) 造成的比對失敗；且統一使用 /users/ (複數) 以對應後端路由
      // 如果是 /users/extend(續期) 或 /users/profile(個人資料) 直接登出
      if (
        error.config.url.includes('/users/extend') ||
        error.config.url.includes('/users/profile')
      ) {
        userStore.logout()
        throw error
      }

      try {
        // 嘗試執行續期
        const { data } = await api.patch('/users/extend')

        // 1. 續期成功，更新 Pinia 的使用者資料中的 Token
        userStore.token = data.result

        // 2. 更新失敗請求的 Authorization Header，使用新的 Token
        error.config.headers.Authorization = `Bearer ${userStore.token}`
        // 3. 重新發送失敗的請求，並回傳結果
        return api(error.config)
      } catch (extendError) {
        // 如果續期失敗(如 404 或 Refresh 逾期)，徹底登出使用者(清除 Pinia 的使用者資料)並拋出錯誤
        userStore.logout()
        throw extendError
      }
    }
    throw error
  },
)

export default api
