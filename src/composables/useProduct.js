import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productApi } from '@/api/productApi'
import { useCategory } from './useCategory'

const ITEMS_PER_PAGE = 9

// 商品列表
export function useProductList() {
  const route = useRoute()
  const router = useRouter()
  const { getCategoryColor } = useCategory()

  const products = ref([])
  const selectedCategory = ref('全部')
  const searchQuery = ref('')
  const currentPage = ref(1)
  const loading = ref(false)
  const error = ref(null)

  const categories = ['全部', '綠茶', '白茶', '黃茶', '青茶(烏龍茶)', '紅茶', '黑茶(普洱茶)']

  // 從 URL 恢復頁碼
  watch(
    () => route.query.page,
    (newVal) => {
      const page = Number.parseInt(newVal)
      currentPage.value = !isNaN(page) && page > 0 ? page : 1
    },
    { immediate: true },
  )

  // 監聽路由搜尋參數（首頁搜尋跳轉過來）
  watch(
    () => route.query.q,
    (newVal) => {
      if (newVal !== searchQuery.value) {
        searchQuery.value = newVal || ''
      }
    },
    { immediate: true },
  )

  // 切換分類時清空搜尋
  watch(selectedCategory, () => {
    searchQuery.value = ''
  })

  // 搜尋或分類變動時重置頁碼
  watch([searchQuery, selectedCategory], () => {
    currentPage.value = 1
  })

  // 頁碼改變時更新 URL（但不觸發額外導航，使用 replace 避免歷史記錄過多）
  watch(
    currentPage,
    (newPage) => {
      const query = { ...route.query }
      if (newPage > 1) {
        if (query.page !== newPage.toString()) {
          query.page = newPage
          router.replace({ query })
        }
      } else if ('page' in query) {
        delete query.page
        router.replace({ query }) // 使用 replace 而不是 push，避免瀏覽器歷史堆太多
      }
    },
    { immediate: false },
  )

  // 計算過濾後的商品列表
  const filteredProducts = computed(() => {
    const query = searchQuery.value.trim().toLowerCase()

    return products.value.filter((p) => {
      const matchCategory =
        selectedCategory.value === '全部' || p.category === selectedCategory.value

      const matchSearch = !query || p.name.toLowerCase().includes(query)

      return matchCategory && matchSearch
    })
  })

  // 計算當前頁面要顯示的商品
  const displayProducts = computed(() => {
    const start = (currentPage.value - 1) * ITEMS_PER_PAGE
    return filteredProducts.value.slice(start, start + ITEMS_PER_PAGE)
  })

  // 計算總頁數
  const totalPages = computed(() => Math.ceil(filteredProducts.value.length / ITEMS_PER_PAGE))

  // 取得商品列表
  const fetchProducts = async () => {
    loading.value = true // 開始載入
    error.value = null // 重置錯誤狀態
    try {
      const response = await productApi.getAllProducts()
      if (response.data?.success) {
        products.value = response.data.data || []
        // console.log('商品資料:', products.value) // 方便除錯查看實際商品資料
        // console.log('完整 response:', response.data) // 方便除錯查看後端回傳的結構
      } else {
        error.value = response.data?.message || '取得商品列表失敗'
      }
    } catch (error) {
      error.value = '取得商品列表失敗'
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  // 取得商品圖片 URL
  const getImageUrl = (image) => {
    if (!image) {
      return 'https://via.placeholder.com/300'
    }
    if (image.startsWith('http')) {
      return image
    }
    return `${import.meta.env.VITE_API_URL}/${image}`
  }

  // 清空搜尋關鍵字
  const clearSearch = () => {
    searchQuery.value = ''
    currentPage.value = 1 // 確保回到第一頁
  }

  // 滾動到頁面頂部(分頁切換時)
  const onPageChange = () => {
    document.activeElement?.blur()
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  // 初始載入商品列表
  return {
    selectedCategory, // 外部使用選擇的分類
    searchQuery, // 外部使用搜尋關鍵字
    currentPage, // 外部使用當前頁碼
    loading, // 外部使用載入狀態
    error, // 外部使用錯誤訊息
    categories, // 外部使用分類列表
    displayProducts, // 外部使用當前頁面顯示的商品
    totalPages, // 外部使用總頁數
    fetchProducts, // 外部觸發載入
    getImageUrl, // 外部使用圖片 URL 轉換
    getCategoryColor, // 外部使用分類顏色轉換
    clearSearch,
    onPageChange,
  }
}

// 單一商品詳情
export function useProductDetail() {
  const route = useRoute()
  const { getCategoryColor } = useCategory()

  const product = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const stockStatus = computed(() => {
    if (!product.value) {
      return { text: '載入中', color: 'grey', icon: 'mdi-dots-horizontal' }
    }
    const stock = product.value.stock
    if (stock <= 0) {
      return { text: '目前缺貨', color: 'red-darken-1', icon: 'mdi-alert-circle' }
    }
    if (stock < 10) {
      return { text: `限量供應 (剩餘 ${stock})`, color: 'orange-darken-2', icon: 'mdi-clock-fast' }
    }
    return { text: `庫存充足 (剩餘 ${stock})`, color: 'green-darken-1', icon: 'mdi-check-circle' }
  })

  const fetchProduct = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await productApi.getProductById(route.params.id)
      if (response.data?.success) {
        product.value = response.data.data
      } else {
        error.value = response.data?.message || '載入失敗'
      }
    } catch (error_) {
      error.value = '載入失敗'
      console.error(error_)
    } finally {
      loading.value = false
    }
  }

  // 監聽路由 id 變化（支援在同頁切換不同商品）
  watch(() => route.params.id, fetchProduct, { immediate: true })

  const getImageUrl = (image) => {
    if (!image) {
      return 'https://via.placeholder.com/500'
    }
    if (image.startsWith('http')) {
      return image
    }
    return `${import.meta.env.VITE_API_URL}/${image}`
  }

  return {
    product,
    loading,
    error,
    stockStatus,
    fetchProduct,
    getImageUrl,
    getCategoryColor,
  }
}
