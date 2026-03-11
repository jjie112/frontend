import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import api from '@/composables/api'
import { useCartStore } from '@/stores/cartStore'

export const useUserStore = defineStore(
  'user',
  () => {
    // --- State (資料) ---
    const _id = ref('')
    const account = ref('')
    const email = ref('')
    const role = ref('user')
    const token = ref('')

    // Getters (計算屬性)
    const isLoggedIn = computed(() => {
      return token.value.length > 0
    })
    const isAdmin = computed(() => role.value === 'admin')

    // Actions (方法)
    const login = userData => {
      _id.value = userData.user.id
      account.value = userData.user.account
      email.value = userData.user.email || ''
      role.value = userData.user.role
      token.value = userData.token
    }

    const logout = async () => {
      try {
        // 根據你後端的設定，登出可能是 DELETE 或 PATCH
        await api.delete('/users/logout')
      } catch (error) {
        console.error('後端登出失敗:', error)
      } finally {
        // 清空所有狀態
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
    persist: true, // 保持持久化
  },
)
