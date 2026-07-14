import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import api from '@/api/instance'

// 這個 store 負責管理使用者的登入狀態、角色、以及相關資訊
export const useUserStore = defineStore(
  'user',
  () => {
    // State (狀態資料)
    const _id = ref('') // 使用者資料庫 ID
    const account = ref('')
    const email = ref('')
    const role = ref('user') // 角色：user | admin
    const token = ref('')

    // Getters (計算屬性) (有快取功能)
    // 是否已登入（依據 token 是否存在判斷）
    const isLoggedIn = computed(() => {
      return token.value.length > 0
    })

    const isAdmin = computed(() => role.value === 'admin')

    // Actions (行為/方法) (同步/非同步通通寫在這裡)
    // 使用者登入，並更新 store 的狀態；這裡的 userData 會包含使用者資訊以及 JWT token
    const login = (userData) => {
      _id.value = userData.user.id
      account.value = userData.user.account
      email.value = userData.user.email || ''
      role.value = userData.user.role
      token.value = userData.token
    }

    // 使用者登出
    const logout = async () => {
      try {
        // 呼叫後端登出 API
        await api.delete('/users/logout')
      } catch (error) {
        console.error('後端登出失敗:', error)
      } finally {
        // 清空使用者狀態
        _id.value = ''
        account.value = ''
        email.value = ''
        role.value = 'user'
        token.value = ''
      }
    }

    // Return（給外部使用的資料與方法）
    return {
      token,
      _id,
      account,
      email,
      role,
      isLoggedIn,
      isAdmin,
      login,
      logout,
    }
  },
  {
    persist: true, // 資料持久化（重新整理頁面不會登出）
  },
)
