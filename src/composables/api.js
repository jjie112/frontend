import axios from 'axios'
import { useUserStore } from '@/stores/user'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use(
  config => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    return config
  },
  error => Promise.reject(error),
)

api.interceptors.response.use(
  res => res,
  async error => {
    const userStore = useUserStore()

    if (error.response && error.response.status === 401) {
      // 使用 includes 判斷，避免路徑前綴 (如 /api) 造成的比對失敗
      // 且統一使用 /users/ (複數) 以對應後端路由
      if (
        error.config.url.includes('/users/extend') || error.config.url.includes('/users/profile')
      ) {
        userStore.logout()
        throw error
      }

      try {
        // 嘗試執行續期
        const { data } = await api.patch('/users/extend')

        // 1. 更新 Pinia
        userStore.token = data.result

        // 2. 更新失敗請求的 Header 並重發
        error.config.headers.Authorization = `Bearer ${userStore.token}`
        return api(error.config)
      } catch (extendError) {
        // 續期也失敗（如 404 或 Refresh 逾期），徹底登出
        userStore.logout()
        throw extendError
      }
    }
    throw error
  },
)

export default api
