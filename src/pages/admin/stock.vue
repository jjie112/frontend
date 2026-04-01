<template>
  <v-container class="py-10">
    <v-row align="center" class="mb-8">
      <v-col cols="12" md="6">
        <h1 class="text-h4 font-weight-bold color-tea-green font-serif mb-2">
          <v-icon
            class="mr-2"
            color="green-darken-3"
            icon="mdi-archive-arrow-down-outline"
          ></v-icon>
          庫存管理中心
        </h1>
        <p class="text-subtitle-2 text-grey-darken-1">監控茶品存量與商品上架狀態</p>
      </v-col>

      <v-col class="d-flex justify-md-end align-center" cols="12" md="6">
        <v-text-field
          v-model="search"
          append-inner-icon="mdi-magnify"
          class="custom-search shadow-sm"
          clearable
          color="green-darken-3"
          density="comfortable"
          hide-details
          placeholder="搜尋商品名稱、分類..."
          rounded="pill"
          style="max-width: 300px"
          variant="solo-filled"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-expand-transition>
      <v-alert
        v-if="search"
        class="mb-6 rounded-xl border-dashed"
        color="green-darken-4"
        density="compact"
        icon="mdi-filter-variant"
        variant="tonal"
      >
        關鍵字搜尋：「<strong>{{ search }}</strong
        >」，共找到 <strong>{{ filteredProducts.length }}</strong> 件商品。
      </v-alert>
    </v-expand-transition>

    <v-card class="rounded-xl border shadow-sm" elevation="0">
      <v-data-table
        class="stock-table"
        :headers="headers"
        hover
        :items="filteredProducts"
        :items-per-page="10"
        :loading="loading"
        loading-text="正在盤點茶葉庫存..."
      >
        <template #[`item.image`]="{ item }">
          <v-avatar class="my-2 border bg-grey-lighten-4" rounded="lg" size="60">
            <v-img cover :src="getImageUrl(item.image)"></v-img>
          </v-avatar>
        </template>

        <template #[`item.name`]="{ item }">
          <div class="font-weight-bold color-tea-green">{{ item.name }}</div>
          <div class="text-caption text-grey">{{ item._id.toUpperCase() }}</div>
        </template>

        <template #[`item.category`]="{ item }">
          <v-chip
            class="text-white font-weight-bold"
            :color="getCategoryColor(item.category)"
            size="small"
            variant="flat"
          >
            {{ item.category }}
          </v-chip>
        </template>

        <template #[`item.stock`]="{ item }">
          <v-chip
            class="font-weight-black"
            :class="item.stock < 10 ? 'text-red-darken-3' : 'text-grey-darken-2'"
            :color="item.stock < 10 ? 'red-lighten-4' : 'grey-lighten-4'"
            size="x-small"
          >
            {{ item.stock }}
          </v-chip>
        </template>

        <template #[`item.isAvailable`]="{ item }">
          <v-badge :color="item.isAvailable ? 'success' : 'grey'" dot offset-x="-5" offset-y="10">
            <span
              class="text-body-2 font-weight-bold ml-2"
              :class="item.isAvailable ? 'text-success' : 'text-grey'"
            >
              {{ item.isAvailable ? '上架中' : '已下架' }}
            </span>
          </v-badge>
          <v-switch
            v-model="item.isAvailable"
            class="d-inline-flex ml-2"
            color="green-darken-2"
            density="compact"
            hide-details
            inset
            :loading="item.loadingStatus"
            @change="toggleStatus(item)"
          ></v-switch>
        </template>

        <template #[`item.actions`]="{ item }">
          <v-btn
            color="brown-lighten-1"
            icon="mdi-pencil-box-multiple-outline"
            variant="text"
            @click="openEditDialog(item)"
          ></v-btn>
        </template>

        <template #no-data>
          <div class="pa-10 text-center text-grey">目前沒有符合條件的商品庫存</div>
        </template>
      </v-data-table>
    </v-card>

    <v-btn
      class="mt-6 text-grey-darken-1"
      prepend-icon="mdi-arrow-left"
      variant="text"
      @click="router.back()"
    >
      返回上一頁
    </v-btn>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card class="rounded-xl overflow-hidden shadow-24">
        <v-card-title class="bg-tea-green text-white py-4 px-6 font-serif">
          快速調整庫存
        </v-card-title>
        <v-card-text class="pa-8">
          <div class="mb-6 d-flex align-center">
            <v-avatar class="mr-4 border bg-grey-lighten-4" rounded="lg" size="80">
              <v-img cover :src="getImageUrl(editingProduct?.image)"></v-img>
            </v-avatar>
            <div>
              <div class="text-h6 color-tea-green font-weight-bold">{{ editingProduct?.name }}</div>
              <v-chip class="mt-1" color="grey-lighten-3" size="x-small">{{
                editingProduct._id?.toUpperCase()
              }}</v-chip>
            </div>
          </div>

          <v-text-field
            v-model.number="editingProduct.stock"
            color="green-darken-3"
            density="comfortable"
            label="新的庫存數量"
            min="0"
            type="number"
            variant="outlined"
          ></v-text-field>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions class="pa-4 bg-grey-lighten-5">
          <v-spacer></v-spacer>
          <v-btn class="px-6" variant="text" @click="dialog = false">取消</v-btn>
          <v-btn
            class="px-10 font-weight-bold"
            color="green-darken-3"
            rounded="pill"
            variant="flat"
            @click="saveStock"
          >
            儲存庫存
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
  import { computed, inject, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import api from '@/composables/api'

  const router = useRouter()
  const products = ref([])
  const search = ref('')
  const loading = ref(false)
  const dialog = ref(false)
  const editingProduct = ref({ _id: '', name: '', stock: 0, image: '' })
  const showSnackbar = inject('showSnackbar')

  // 表格標頭：加入「視覺」欄位
  const headers = [
    { title: '視覺', key: 'image', sortable: false, width: '100px' },
    { title: '商品名稱', key: 'name' },
    { title: '分類', key: 'category', align: 'center' },
    { title: '剩餘庫存', key: 'stock', align: 'center' },
    { title: '銷售狀態', key: 'isAvailable' },
    { title: '快速調整', key: 'actions', align: 'center', sortable: false },
  ]

  const getImageUrl = (image) => {
    if (!image) return 'https://via.placeholder.com/150'
    return image.startsWith('http') ? image : `${import.meta.env.VITE_API_URL}/${image}`
  }

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

  const fetchProducts = async () => {
    loading.value = true
    try {
      const { data } = await api.get('/products?admin=true')
      if (data.success) products.value = data.data
    } catch {
      showSnackbar('讀取庫存失敗', 'error')
    } finally {
      loading.value = false
    }
  }

  const filteredProducts = computed(() => {
    if (!search.value) return products.value
    const query = search.value.toLowerCase()
    return products.value.filter(
      (p) => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query),
    )
  })

  const openEditDialog = (product) => {
    editingProduct.value = { ...product }
    dialog.value = true
  }

  const saveStock = async () => {
    try {
      const { data } = await api.patch(`/products/${editingProduct.value._id}`, {
        stock: Number(editingProduct.value.stock),
      })
      if (data.success) {
        showSnackbar('庫存已更新')
        await fetchProducts()
        dialog.value = false
      }
    } catch (error) {
      showSnackbar(error.response?.data?.message || '更新失敗', 'error')
    }
  }

  const toggleStatus = async (product) => {
    product.loadingStatus = true
    try {
      await api.patch(`/products/${product._id}`, {
        isAvailable: product.isAvailable,
      })
      showSnackbar('狀態已更新')
    } catch {
      product.isAvailable = !product.isAvailable
      showSnackbar('更新失敗', 'error')
    } finally {
      product.loadingStatus = false
    }
  }

  onMounted(fetchProducts)
</script>

<style scoped>
  /* 引用 products.vue 的核心樣式 */
  .font-serif {
    font-family: 'Noto Serif TC', serif !important;
  }
  .color-tea-green {
    color: #2d3e33;
  }
  .bg-tea-green {
    background-color: #2d3e33 !important;
  }
  .shadow-sm {
    box-shadow: 0 4px 20px rgba(45, 62, 51, 0.05) !important;
  }

  /* 搜尋框樣式統一 */
  .custom-search :deep(.v-field) {
    border: 1px solid #e0e0e0 !important;
    transition: all 0.3s;
  }
  .custom-search :deep(.v-field--focused) {
    border-color: #2d3e33 !important;
  }

  /* 表格標頭樣式統一 */
  :deep(.v-data-table-header) {
    background-color: #fcfcfc;
  }
  :deep(.v-data-table__th) {
    font-weight: 800 !important;
    color: #444 !important;
    text-transform: uppercase;
    font-size: 0.85rem !important;
    letter-spacing: 1px;
  }

  .border-dashed {
    border: 1px dashed #2d3e33 !important;
  }
</style>

<route lang="yaml">
meta:
  title: '庫存管理'
  login: true
  admin: true
</route>
