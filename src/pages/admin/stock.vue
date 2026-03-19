<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold mb-6">庫存管理中心</h1>
      </v-col>
    </v-row>

    <v-row class="mb-4">
      <v-col cols="12" md="4">
        <v-text-field
          v-model="search"
          hide-details
          label="搜尋商品名稱"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-card border elevation="0">
      <v-table>
        <thead>
          <tr>
            <th class="text-left">商品名稱</th>
            <th class="text-left">分類</th>
            <th class="text-center">剩餘庫存</th>
            <th class="text-center">狀態</th>
            <th class="text-right">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in filteredProducts || []" :key="product._id">
            <td>{{ product.name }}</td>
            <td>
              <v-chip
                class="font-weight-bold"
                :color="getCategoryColor(product.category)"
                size="small"
                variant="flat"
              >
                {{ product.category }}
              </v-chip>
            </td>
            <td class="text-center">
              <v-chip class="font-weight-bold" :color="getStockColor(product.stock)" variant="flat">
                {{ product.stock }}
              </v-chip>
            </td>
            <td class="text-center">
              <v-switch
                v-model="product.isAvailable"
                class="d-inline-flex"
                color="green"
                density="compact"
                hide-details
                inset
                :loading="product.loadingStatus"
                @change="toggleStatus(product)"
              >
                <template #label>
                  <span :class="product.isAvailable ? 'text-green' : 'text-grey'">
                    {{ product.isAvailable ? '已上架' : '未上架' }}
                  </span>
                </template>
              </v-switch>
            </td>
            <td class="text-right">
              <v-btn
                color="brown"
                icon="mdi-pencil-outline"
                variant="text"
                @click="openEditDialog(product)"
              ></v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <v-dialog v-model="dialog" max-width="400px">
      <v-card title="快速調整庫存">
        <v-card-text>
          <div class="mb-4 text-subtitle-1">{{ editingProduct?.name }}</div>
          <v-text-field
            v-model.number="editingProduct.stock"
            label="調整庫存數量"
            min="0"
            type="number"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="dialog = false">取消</v-btn>
          <v-btn color="brown" variant="flat" @click="saveStock">儲存修改</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-btn
      class="mt-6 text-grey-darken-1"
      prepend-icon="mdi-arrow-left"
      variant="text"
      @click="router.back()"
    >
      返回上一頁
    </v-btn>
  </v-container>
</template>

<script setup>
  import { computed, inject, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import api from '@/composables/api'

  const router = useRouter()
  const products = ref([])
  const search = ref('')
  const dialog = ref(false)
  const editingProduct = ref({ _id: '', name: '', stock: 0 })
  const showSnackbar = inject('showSnackbar')

  const getCategoryColor = (category) => {
    const colorMap = {
      綠茶: 'green-darken-2',
      白茶: 'blue-grey-darken-1',
      黃茶: 'orange-darken-1',
      '青茶(烏龍茶)': 'teal-darken-3',
      紅茶: 'red-darken-3',
      '黑茶(普洱茶)': 'grey-darken-4',
    }
    return colorMap[category] || 'brown-darken-2'
  }

  // 取得庫存顏色邏輯
  const getStockColor = (stock) => {
    if (stock <= 0) return 'red-darken-1' // 沒貨
    if (stock < 10) return 'orange-darken-1' // 警告
    return 'green-darken-1' // 充足
  }

  const fetchProducts = async () => {
    try {
      // 這裡直接用 api.get
      // 注意：路徑改為 /products，並加上 admin=true
      const { data } = await api.get('/products?admin=true')
      if (data.success) {
        products.value = data.data
      }
    } catch (error) {
      console.error('取得庫存失敗:', error)
    }
  }

  const filteredProducts = computed(() => {
    return products.value.filter((p) => p.name.includes(search.value))
  })

  const openEditDialog = (product) => {
    editingProduct.value = { ...product }
    dialog.value = true
  }

  const saveStock = async () => {
    try {
      // 只需要傳送要修改的欄位 (stock)
      const { data } = await api.patch(`/products/${editingProduct.value._id}`, {
        stock: Number(editingProduct.value.stock),
      })

      if (data.success) {
        // 成功後的提示 (假設你有安裝 snackbar 或可以用 alert)
        alert('庫存更新成功！')

        // 關鍵：重新獲取清單，讓畫面上的數字更新
        await fetchProducts()

        // 關閉彈窗
        dialog.value = false
      }
    } catch (error) {
      console.error('更新失敗:', error)
      const message = error.response?.data?.message || '更新失敗，請檢查權限或網路'
      alert(message)
    }
  }

  const toggleStatus = async (product) => {
    // 在產品物件上動態加入 loading 狀態，防止重複點擊
    product.loadingStatus = true

    try {
      // 呼叫後端 PATCH 介面，只更新 isAvailable 欄位
      // 這裡呼叫 apiAuth (需要 Token)
      const { data } = await api.patch(`/products/${product._id}`, {
        isAvailable: product.isAvailable, // 此時 v-model 已經把值變了
      })

      if (data.success) {
        // 如果你有封裝 showSnackbar
        showSnackbar?.('狀態更新成功', 'success')
      } else {
        // 失敗時把狀態變回來
        product.isAvailable = !product.isAvailable
        showSnackbar?.('更新失敗', 'error')
      }
    } catch (error) {
      console.error('更新狀態失敗:', error)
      // 失敗時把狀態變回來
      product.isAvailable = !product.isAvailable
      alert('更新失敗，請檢查權限或網路')
    } finally {
      // 關閉 loading 狀態
      product.loadingStatus = false
    }
  }

  onMounted(fetchProducts)
</script>

<route lang="yaml">
meta:
  title: '庫存管理'
  login: true
  admin: true
</route>
