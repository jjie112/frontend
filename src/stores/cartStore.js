import { defineStore } from 'pinia'
import api from '@/composables/api'
import { useUserStore } from '@/stores/user'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cartItems: [],
  }),

  getters: {
    totalItems: (state) => state.cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0),
    totalPrice: (state) =>
      state.cartItems.reduce(
        (sum, item) => sum + (item.p_id?.price || 0) * (item.quantity || 0),
        0,
      ),
  },

  actions: {
    async fetchCart() {
      try {
        const { data } = await api.get('/users/cart')
        if (data.success) {
          this.cartItems = data.data || []
        } else {
          console.warn('fetchCart 回傳非 success', data)
        }
      } catch (error) {
        console.error('獲取購物車失敗', error)
      }
    },

    async updateCart(p_id, delta) {
      const userStore = useUserStore()

      if (!userStore.isLoggedIn) {
        throw Object.assign(new Error('請先登入會員'), { code: 'AUTH_REQUIRED' })
      }

      // 1. 找到目前該商品在購物車的數量
      const item = this.cartItems.find((i) => i.p_id._id === p_id)

      // 2. 計算目標數量 (目前的數量 + 增量)
      // 如果是從商品頁加入，原本沒商品，數量就是 delta；如果在購物車加減，就是現有量 + delta
      const targetQty = (item ? item.quantity : 0) + delta

      // 3. 驗證最終數量：必須大於等於 1
      if (!Number.isInteger(targetQty) || targetQty < 1) {
        throw Object.assign(new Error('數量必須為正整數'), { code: 'INVALID_QUANTITY' })
      }

      try {
        // 4. 發送給後端的數量應該是計算後的「最終總量」targetQty
        const { data } = await api.post('/users/cart', { p_id, quantity: targetQty })

        if (data.success) {
          await this.fetchCart() // 重新拉取最新的購物車狀態
          return data // 可以回傳後端資料給呼叫端使用
        }

        throw new Error(data.message || '更新購物車失敗')
      } catch (error) {
        console.error('updateCart 失敗', error)
        throw error // 保持拋出，讓上層處理顯示
      }
    },

    async removeItem(p_id) {
      try {
        const { data } = await api.delete(`/users/cart/${p_id}`)
        if (data.success) {
          await this.fetchCart()
          return true
        }
        throw new Error(data.message || '刪除失敗')
      } catch (error) {
        console.error('removeItem 失敗', error)
        throw error
      }
    },

    // 清空購物車
    async clearCart() {
      // 視後端是否有提供批量刪除 API，如果沒有，就逐一刪除
      this.cartItems = []
      // await api.delete('/users/cart') // 如果後端支援
    },
  },
})
