import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { productApi } from '@/api/productApi'

const ITEMS_PER_PAGE = 9

// 商品列表
export function useProductList() {
  const route = useRoute()

  const products = ref([])
  const selectedCategory = ref('全部')
  const searchQuery = ref('')
  const currentPage = ref(1)
  const loading = ref(false)
  const error = ref(null)

  const categories = ['全部', '綠茶', '白茶', '黃茶', '青茶(烏龍茶)', '紅茶', '黑茶(普洱茶)']

  const colorMap = {
    綠茶: 'green-darken-3',
    白茶: 'blue-grey-darken-1',
    黃茶: 'orange-darken-1',
    '青茶(烏龍茶)': 'teal-darken-2',
    紅茶: 'red-darken-4',
    '黑茶(普洱茶)': 'brown-darken-4',
  }

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

  // 計算過濾後的商品列表
  const filteredProducts = computed(() =>
    products.value.filter((p) => {
      const matchCategory =
        selectedCategory.value === '全部' || p.category === selectedCategory.value
      const matchSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      return matchCategory && matchSearch
    }),
  )

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
      const response = await productApi.getAllPoudcts()
      if (response.data?.success) {
        products.value = response.data.data || []
        // console.log('商品資料:', products.value) // 方便除錯查看實際商品資料
        // console.log('完整 response:', response.data) // 方便除錯查看後端回傳的結構
      }
    } catch (error) {
      error.value = '取得商品列表失敗'
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  const getImageUrl = (image) => {
    if (!image) {
      return 'https://via.placeholder.com/300'
    }
    if (image.startsWith('http')) {
      return image
    }
    return `${import.meta.env.VITE_API_URL}/${image}`
  }

  const getCategoryColor = (category) => colorMap[category] || 'brown-darken-3'

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
  }
}

// 單一商品詳情
export function useProductDetail() {
  const route = useRoute()

  const product = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const colorMap = {
    綠茶: 'green-darken-3',
    白茶: 'blue-grey-darken-1',
    黃茶: 'orange-darken-1',
    '青茶(烏龍茶)': 'teal-darken-2',
    紅茶: 'red-darken-4',
    '黑茶(普洱茶)': 'brown-darken-4',
  }

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
      const response = await productApi.getPoudctId(route.params.id)
      if (response.data?.success) {
        product.value = response.data.data
      }
    } catch (error_) {
      error.value = '載入失敗'
      console.error(error_)
    } finally {
      loading.value = false
    }
  }

  const getImageUrl = (image) => {
    if (!image) {
      return 'https://via.placeholder.com/500'
    }
    if (image.startsWith('http')) {
      return image
    }
    return `${import.meta.env.VITE_API_URL}/${image}`
  }

  const getCategoryColor = (category) => colorMap[category] || 'brown-darken-3'

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
