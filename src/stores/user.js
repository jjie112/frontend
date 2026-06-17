import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import api from '@/api/instance'
import { useCartStore } from '@/stores/cartStore'

export const useUserStore = defineStore(
  'user',
  () => {
    // State (狀態資料)
    const _id = ref('') // 使用者資料庫 ID
    const account = ref('')
    const email = ref('')
    const role = ref('user') // 角色：user | admin
    const token = ref('') // JWT Token（登入憑證）

    // Getters (計算屬性)
    // 是否已登入（依據 token 是否存在判斷）
    const isLoggedIn = computed(() => {
      return token.value.length > 0
    })
    // 是否為管理員
    const isAdmin = computed(() => role.value === 'admin')

    // Actions (行為/方法)
    // 使用者登入 ; @param {Object} userData - 後端回傳的使用者資料
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
        // 即使後端失敗，仍要清除前端狀態
      } finally {
        // 清空使用者狀態
        _id.value = ''
        account.value = ''
        email.value = ''
        role.value = 'user'
        token.value = ''

        // 清空購物車
        const cartStore = useCartStore()
        cartStore.cartItems = []
      }
    }

    // Return（暴露給外部使用的資料與方法）
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
