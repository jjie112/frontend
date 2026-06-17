import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import api from '@/api/instance'
import { useUserStore } from '@/stores/user'

export const useCartStore = defineStore('cart', () => {
  // State (狀態資料)
  const cartItems = ref([])

  // Getters (計算屬性)
  const totalItems = computed(() => {
    return cartItems.value.reduce((sum, item) => {
      return sum + (item.quantity || 0)
    }, 0)
  })

  const totalPrice = computed(() => {
    return cartItems.value.reduce((sum, item) => {
      return sum + (item.p_id?.price || 0) * (item.quantity || 0)
    }, 0)
  })

  // Actions（行為 / 方法）
  // 取得最新購物車資料
  const fetchCart = async () => {
    try {
      const { data } = await api.get('/users/cart')
      if (data.success) {
        cartItems.value = data.data || []
      } else {
        console.warn('fetchCart 回傳非 success', data)
      }
    } catch (error) {
      console.error('獲取購物車失敗', error)
    }
  }

  // 更新購物車數量（新增、增加、減少）
  const updateCart = async (p_id, delta) => {
    const userStore = useUserStore()

    if (!userStore.isLoggedIn) {
      throw Object.assign(new Error('請先登入會員'), { code: 'AUTH_REQUIRED' })
    }

    // 找到目前商品
    const item = cartItems.value.find((i) => i.p_id._id === p_id)
    const targetQty = (item ? item.quantity : 0) + delta

    if (!Number.isInteger(targetQty) || targetQty < 1) {
      throw Object.assign(new Error('數量必須為正整數'), { code: 'INVALID_QUANTITY' })
    }

    try {
      const { data } = await api.post('/users/cart', {
        p_id,
        quantity: targetQty,
      })

      if (data.success) {
        await fetchCart() // 重新拉取最新資料
        return data
      }

      throw new Error(data.message || '更新購物車失敗')
    } catch (error) {
      console.error('updateCart 失敗', error)
      throw error
    }
  }

  // 移除單一商品
  const removeItem = async (p_id) => {
    try {
      const { data } = await api.delete(`/users/cart/${p_id}`)
      if (data.success) {
        await fetchCart()
        return true
      }
      throw new Error(data.message || '刪除失敗')
    } catch (error) {
      console.error('removeItem 失敗', error)
      throw error
    }
  }

  // 清空購物車
  const clearCart = () => {
    cartItems.value = []
    // 如果後端有提供清空 API，可在此呼叫
    // await api.delete('/users/cart')
  }

  // Return（暴露給外部）
  return {
    // State
    cartItems,

    // Getters
    totalItems,
    totalPrice,

    // Actions
    fetchCart,
    updateCart,
    removeItem,
    clearCart,
  }
})
