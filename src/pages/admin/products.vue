<template>
  <v-container class="py-10">
    <v-row align="center" class="mb-8">
      <v-col cols="12" md="6">
        <h1 class="text-h4 font-weight-bold color-tea-green font-serif mb-2">
          <v-icon class="mr-2" color="green-darken-3" icon="mdi-archive-cog-outline"></v-icon
          >商品管理系統
        </h1>
        <p class="text-subtitle-2 text-grey-darken-1">策劃與編製每一款茶品的獨特故事</p>
      </v-col>

      <v-col class="d-flex justify-md-end align-center" cols="12" md="6">
        <v-text-field
          v-model="search"
          append-inner-icon="mdi-magnify"
          class="custom-search shadow-sm mr-4"
          clearable
          color="green-darken-3"
          density="comfortable"
          hide-details
          placeholder="搜尋商品名稱、分類..."
          rounded="pill"
          style="max-width: 300px"
          variant="solo-filled"
        ></v-text-field>
        <v-btn
          class="rounded-pill px-6 shadow-sm"
          color="green-darken-3"
          elevation="2"
          prepend-icon="mdi-plus"
          size="large"
          @click="openDialog()"
        >
          新增商品
        </v-btn>
      </v-col>
    </v-row>

    <v-card class="rounded-xl border shadow-sm" elevation="0">
      <v-data-table
        class="product-table"
        :headers="headers"
        hover
        :items="filteredProducts"
        :items-per-page="10"
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

        <template #[`item.price`]="{ item }">
          <span class="font-weight-bold color-brown">NT$ {{ item.price.toLocaleString() }}</span>
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
        </template>

        <template #[`item.actions`]="{ item }">
          <div class="d-flex align-center justify-center">
            <v-btn
              color="blue-darken-2"
              icon="mdi-pencil-outline"
              size="small"
              variant="text"
              @click="openDialog(item)"
            ></v-btn>
            <v-btn
              color="red-darken-2"
              icon="mdi-delete-outline"
              size="small"
              variant="text"
              @click="deleteItem(item)"
            ></v-btn>
          </div>
        </template>

        <template #no-data>
          <div class="pa-10 text-center text-grey">目前沒有商品，來親自挑選幾款好茶吧</div>
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

    <v-dialog v-model="dialog.open" max-width="700px" persistent scrollable>
      <v-form :disabled="dialog.loading" @submit.prevent="submitForm">
        <v-card class="rounded-xl overflow-hidden shadow-24">
          <v-card-title
            class="bg-tea-green text-white d-flex justify-space-between align-center py-4 px-6 flex-none"
          >
            <span class="font-serif text-h6">{{
              dialog.id ? '編輯商品詳情' : '新增茶事單品'
            }}</span>
            <v-btn
              density="comfortable"
              icon="mdi-close"
              variant="text"
              @click="dialog.open = false"
            ></v-btn>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="pa-8 scrollable-content" style="max-height: 600px">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="form.name"
                  color="green-darken-3"
                  density="comfortable"
                  label="商品名稱"
                  required
                  variant="outlined"
                ></v-text-field>
              </v-col>

              <v-col cols="6">
                <v-text-field
                  v-model.number="form.price"
                  color="green-darken-3"
                  density="comfortable"
                  label="定價"
                  prefix="NT$"
                  type="number"
                  variant="outlined"
                ></v-text-field>
              </v-col>

              <v-col cols="6">
                <v-text-field
                  v-model.number="form.stock"
                  color="green-darken-3"
                  density="comfortable"
                  label="在庫庫存"
                  type="number"
                  variant="outlined"
                ></v-text-field>
              </v-col>

              <v-col cols="6">
                <v-select
                  v-model="form.category"
                  color="green-darken-3"
                  density="comfortable"
                  :items="categories"
                  label="茶葉類別"
                  variant="outlined"
                ></v-select>
              </v-col>

              <v-col cols="6">
                <v-text-field
                  v-model="form.origin"
                  color="green-darken-3"
                  density="comfortable"
                  label="原產地"
                  placeholder="例如：南投、阿里山..."
                  variant="outlined"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="form.description"
                  color="green-darken-3"
                  density="comfortable"
                  label="商品故事/描述"
                  rows="3"
                  variant="outlined"
                ></v-textarea>
              </v-col>

              <v-col cols="12">
                <v-file-input
                  v-model="form.imageFile"
                  accept="image/*"
                  color="green-darken-3"
                  density="comfortable"
                  hint="建議比例 1:1，格式支援 JPG/PNG/JPEG/WEBP"
                  label="更換商品視覺圖"
                  persistent-hint
                  prepend-icon=""
                  prepend-inner-icon="mdi-camera"
                  variant="outlined"
                ></v-file-input>
              </v-col>

              <v-col cols="12">
                <v-switch
                  v-model="form.isAvailable"
                  class="font-weight-bold"
                  color="green-darken-3"
                  inset
                  label="開啟上架狀態"
                ></v-switch>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions class="pa-4 bg-grey-lighten-5">
            <v-spacer></v-spacer>
            <v-btn class="px-6" variant="text" @click="dialog.open = false">捨棄變更</v-btn>
            <v-btn
              class="px-10 font-weight-bold"
              color="green-darken-3"
              :loading="dialog.loading"
              rounded="pill"
              type="submit"
              variant="flat"
            >
              儲存內容
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </v-container>
</template>

<script setup>
  import { computed, inject, onMounted, reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import api from '@/composables/api'

  const router = useRouter()
  const showSnackbar = inject('showSnackbar')
  const products = ref([])
  const search = ref('')
  const categories = ['綠茶', '白茶', '黃茶', '青茶(烏龍茶)', '紅茶', '黑茶(普洱茶)']

  // 分類顏色映射
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

  // 搜尋過濾邏輯
  const filteredProducts = computed(() => {
    if (!search.value) return products.value
    const query = search.value.toLowerCase()
    return products.value.filter(
      (p) => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query),
    )
  })

  const headers = [
    { title: '視覺', key: 'image', sortable: false, width: '100px' },
    { title: '商品名稱', key: 'name' },
    { title: '產地', key: 'origin' },
    { title: '分類', key: 'category' },
    { title: '定價', key: 'price', align: 'center' },
    { title: '庫存', key: 'stock', align: 'center' },
    { title: '銷售狀態', key: 'isAvailable' },
    { title: '操作', key: 'actions', sortable: false, align: 'center' },
  ]

  const dialog = reactive({ open: false, id: '', loading: false })
  const form = reactive({
    name: '',
    price: 0,
    description: '',
    category: '',
    origin: '',
    stock: 0,
    isAvailable: true,
    imageFile: null,
  })

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products?admin=true')
      products.value = data.data
    } catch {
      showSnackbar('取得商品失敗', 'error')
    }
  }

  const getDefaultForm = () => ({
    name: '',
    price: 0,
    description: '',
    category: '',
    origin: '',
    stock: 0,
    isAvailable: true,
    imageFile: null,
  })

  const openDialog = (item = null) => {
    if (item) {
      dialog.id = item._id
      Object.assign(form, item)
      form.imageFile = null
    } else {
      dialog.id = ''
      Object.assign(form, getDefaultForm())
    }
    dialog.open = true
  }

  const submitForm = async () => {
    dialog.loading = true
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('price', Number(form.price))
      fd.append('description', form.description || '')
      fd.append('category', form.category)
      fd.append('origin', form.origin || '')
      fd.append('stock', Number(form.stock))
      fd.append('isAvailable', form.isAvailable)

      if (form.imageFile) {
        const file = Array.isArray(form.imageFile) ? form.imageFile[0] : form.imageFile
        if (file) fd.append('image', file)
      }

      if (dialog.id) {
        await api.patch(`/products/${dialog.id}`, fd)
        showSnackbar('商品內容已成功更新')
      } else {
        if (!form.imageFile) {
          showSnackbar('新增商品必須上傳圖片', 'error')
          dialog.loading = false
          return
        }
        await api.post('/products', fd)
        showSnackbar('新商品已成功加入清單')
      }
      dialog.open = false
      await fetchProducts()
    } catch (error) {
      showSnackbar(error.response?.data?.message || '操作失敗', 'error')
    } finally {
      dialog.loading = false
    }
  }

  const getImageUrl = (image) => {
    if (!image) return 'https://via.placeholder.com/150'
    return image.startsWith('http') ? image : `${import.meta.env.VITE_API_URL}/${image}`
  }

  const deleteItem = async (item) => {
    if (!confirm(`確定要將「${item.name}」從系統移除嗎？此操作無法恢復。`)) return
    try {
      await api.delete(`/products/${item._id}`)
      showSnackbar('商品已成功刪除')
      fetchProducts()
    } catch {
      showSnackbar('刪除失敗，請檢查權限', 'error')
    }
  }

  onMounted(fetchProducts)
</script>

<style scoped>
  .font-serif {
    font-family: 'Noto Serif TC', serif !important;
  }

  .color-tea-green {
    color: #2d3e33;
  }

  .bg-tea-green {
    background-color: #2d3e33 !important;
  }

  .color-brown {
    color: #8d6e63;
  }

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

  .custom-search :deep(.v-field) {
    border: 1px solid #e0e0e0 !important;
    transition: all 0.3s;
  }

  .custom-search :deep(.v-field--focused) {
    border-color: #2d3e33 !important;
  }

  .scrollable-content::-webkit-scrollbar {
    width: 6px;
  }

  .scrollable-content::-webkit-scrollbar-thumb {
    background: #e0e0e0;
    border-radius: 10px;
  }
</style>

<route lang="yaml">
meta:
  title: '商品管理'
  login: true
  admin: true
</route>
