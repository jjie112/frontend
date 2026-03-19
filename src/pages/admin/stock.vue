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
          <tr v-for="product in filteredProducts" :key="product._id">
            <td>{{ product.name }}</td>
            <td>
              <v-chip size="small">{{ product.category }}</v-chip>
            </td>
            <td class="text-center">
              <v-chip class="font-weight-bold" :color="getStockColor(product.stock)" variant="flat">
                {{ product.stock }}
              </v-chip>
            </td>
            <td class="text-center">
              <v-icon :color="product.sell ? 'green' : 'grey'">
                {{ product.sell ? 'mdi-check-circle' : 'mdi-minus-circle' }}
              </v-icon>
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
  </v-container>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue'
  import { useApi } from '@/composables/api'

  const { apiAuth } = useApi()
  const products = ref([])
  const search = ref('')
  const dialog = ref(false)
  const editingProduct = ref({ _id: '', name: '', stock: 0 })

  // 取得庫存顏色邏輯
  const getStockColor = (stock) => {
    if (stock <= 0) return 'red-darken-1' // 沒貨
    if (stock < 10) return 'orange-darken-1' // 警告
    return 'green-darken-1' // 充足
  }

  const fetchProducts = async () => {
    try {
      // 注意：路徑改為 /products，並加上 admin=true
      // 務必使用 apiAuth 以確保帶上管理員的 Token
      const { data } = await apiAuth.get('/products?admin=true')

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

  onMounted(fetchProducts)
</script>

<route lang="yaml">
meta:
  login: true
  admin: true
  title: '庫存管理'
</route>
