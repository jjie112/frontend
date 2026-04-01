<template>
  <v-container class="py-10">
    <v-row align="center" class="mb-8">
      <v-col cols="12" md="6">
        <h1 class="text-h4 font-weight-bold color-tea-green font-serif mb-2">
          <v-icon class="mr-2" color="green-darken-3" icon="mdi-leaf"></v-icon>訂單管理系統
        </h1>
        <p class="text-subtitle-2 text-grey-darken-1">管理茶事選物的每一筆顧客情誼</p>
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          append-inner-icon="mdi-magnify"
          class="custom-search shadow-sm"
          clearable
          color="green-darken-3"
          density="comfortable"
          hide-details
          placeholder="搜尋編號、帳號或 Email..."
          rounded="pill"
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
        >」，共找到 <strong>{{ filteredItems.length }}</strong> 筆訂單。
      </v-alert>
    </v-expand-transition>

    <v-card class="rounded-xl border shadow-sm" elevation="0">
      <v-data-table
        class="order-table"
        :headers="headers"
        hover
        :items="filteredItems"
        :items-per-page="10"
        :loading="loading"
        loading-text="正在泡茶，請稍候載入資料..."
      >
        <template #[`item._id`]="{ item }">
          <span class="order-id-code">#{{ item._id.toUpperCase() }}</span>
        </template>

        <template #[`item.u_id`]="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar class="mr-3 shadow-sm" color="green-lighten-5" size="36">
              <span class="text-subtitle-2 font-weight-bold color-tea-green">
                {{ item.u_id?.account?.charAt(0).toUpperCase() || '?' }}
              </span>
            </v-avatar>
            <div>
              <div class="font-weight-bold color-tea-green text-body-2">
                {{ item.u_id?.account || '未知用戶' }}
              </div>
              <div class="text-caption text-grey-darken-1">{{ item.u_id?.email }}</div>
            </div>
          </div>
        </template>

        <template #[`item.totalPrice`]="{ item }">
          <span class="font-weight-bold color-brown text-body-1">
            NT$ {{ item.totalPrice.toLocaleString() }}
          </span>
        </template>

        <template #[`item.status`]="{ item }">
          <v-chip
            class="text-white font-weight-bold"
            :color="getStatusColor(item.status)"
            size="small"
            variant="flat"
          >
            {{ orderStatusMap[item.status] }}
          </v-chip>
        </template>

        <template #[`item.view`]="{ item }">
          <v-btn
            color="#c19a6b"
            icon="mdi-eye-outline"
            variant="text"
            @click="openDetails(item)"
          ></v-btn>
        </template>

        <template #[`item.actions`]="{ item }">
          <v-menu location="bottom end">
            <template #activator="{ props }">
              <v-btn v-bind="props" color="grey" icon="mdi-dots-horizontal" variant="text"></v-btn>
            </template>
            <v-list border class="rounded-lg pa-1">
              <v-list-item
                v-if="item.status === 0"
                color="green-darken-2"
                prepend-icon="mdi-check-circle-outline"
                rounded="md"
                title="完成訂單"
                @click="updateStatus(item._id, 1)"
              ></v-list-item>
              <v-list-item
                v-if="item.status !== 2"
                color="orange-darken-3"
                prepend-icon="mdi-close-circle-outline"
                rounded="md"
                title="取消訂單"
                @click="updateStatus(item._id, 2)"
              ></v-list-item>
              <v-divider v-if="item.status === 2" class="my-1"></v-divider>
              <v-list-item
                v-if="item.status === 2"
                color="red"
                prepend-icon="mdi-delete-forever"
                rounded="md"
                title="永久刪除"
                @click="deleteOrder(item._id)"
              ></v-list-item>
            </v-list>
          </v-menu>
        </template>

        <template #no-data>
          <div class="pa-10 text-center text-grey">目前沒有任何訂單紀錄</div>
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

    <v-dialog v-model="detailsDialog" max-width="850px" scrollable>
      <v-card class="rounded-xl overflow-hidden shadow-24">
        <v-card-title
          class="bg-tea-green text-white d-flex justify-space-between align-center py-4 px-6 flex-none"
        >
          <div class="d-flex align-baseline">
            <span class="font-serif text-h6 mr-3">訂單詳細內容</span>
            <span class="text-caption opacity-70 font-weight-regular"
              >#{{ selectedOrder?._id.toUpperCase() }}</span
            >
          </div>
          <v-btn
            density="comfortable"
            icon="mdi-close"
            variant="text"
            @click="detailsDialog = false"
          ></v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-0 scrollable-content" style="max-height: 500px">
          <v-data-table
            v-if="selectedOrder"
            class="detail-table"
            density="comfortable"
            :headers="detailHeaders"
            :items="selectedOrder.cart"
            :items-per-page="10"
          >
            <template #[`item.image`]="{ item }">
              <v-avatar class="my-2 border bg-grey-lighten-4" rounded="lg" size="50">
                <v-img cover :src="getImageUrl(item.p_id.image)"></v-img>
              </v-avatar>
            </template>

            <template #[`item.name`]="{ item }">
              <div class="font-weight-bold color-tea-green line-clamp-1">{{ item.p_id.name }}</div>
              <v-chip
                class="text-white mt-1 font-weight-bold"
                :color="getCategoryColor(item.p_id.category)"
                size="x-small"
                variant="flat"
              >
                {{ item.p_id.category }}
              </v-chip>
            </template>

            <template #[`item.p_id.price`]="{ item }">
              NT$ {{ item.p_id.price.toLocaleString() }}
            </template>

            <template #[`item.subtotal`]="{ item }">
              <span class="font-weight-bold color-brown">
                NT$ {{ (item.p_id.price * item.quantity).toLocaleString() }}
              </span>
            </template>
          </v-data-table>
        </v-card-text>

        <v-divider></v-divider>
        <div class="bg-grey-lighten-5 px-8 py-4">
          <div class="d-flex justify-space-between align-end">
            <div>
              <div class="text-caption text-grey mb-1">下單時間</div>
              <div class="text-body-2 font-weight-medium">
                {{ new Date(selectedOrder?.createdAt).toLocaleString() }}
              </div>
            </div>
            <div class="text-right">
              <div class="text-subtitle-1 text-grey-darken-1">結帳總金額</div>
              <div class="text-h4 font-weight-black color-tea-green">
                NT$ {{ selectedOrder?.totalPrice.toLocaleString() }}
              </div>
            </div>
          </div>
        </div>

        <v-card-actions class="pa-4 border-t bg-white">
          <v-spacer></v-spacer>
          <v-btn
            class="px-8 font-weight-bold"
            color="brown-darken-2"
            rounded="pill"
            variant="flat"
            @click="detailsDialog = false"
          >
            確認並關閉
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
  const allOrders = ref([])
  const loading = ref(false)
  const search = ref('')
  const showSnackbar = inject('showSnackbar')

  const orderStatusMap = {
    0: '待處理',
    1: '已完成',
    2: '已取消',
  }

  const getImageUrl = (image) => {
    if (!image) return 'https://via.placeholder.com/150'
    if (image.startsWith('http')) return image
    return `${import.meta.env.VITE_API_URL}/${image}`
  }

  const getCategoryColor = (category) => {
    const colorMap = {
      綠茶: 'green-darken-2',
      白茶: 'blue-grey-darken-1',
      黃茶: 'orange-darken-1',
      '青茶(烏龍茶)': 'teal-darken-3',
      青茶: 'teal-darken-3',
      紅茶: 'red-darken-3',
      '黑茶(普洱茶)': 'grey-darken-4',
      黑茶: 'grey-darken-4',
    }
    return colorMap[category] || 'brown-darken-2'
  }

  const filteredItems = computed(() => {
    if (!search.value) return allOrders.value
    const query = search.value.toLowerCase()
    return allOrders.value.filter((item) => {
      return (
        item._id.toLowerCase().includes(query) ||
        (item.u_id?.account && item.u_id.account.toLowerCase().includes(query)) ||
        (item.u_id?.email && item.u_id.email.toLowerCase().includes(query))
      )
    })
  })

  const headers = [
    { title: '訂單編號', key: '_id', sortable: true, width: '150px' },
    { title: '訂購會員', key: 'u_id', sortable: false },
    { title: '總金額', key: 'totalPrice', align: 'end', sortable: true },
    { title: '目前狀態', key: 'status', align: 'center', sortable: true },
    { title: '詳情', key: 'view', align: 'center', sortable: false },
    { title: '操作', key: 'actions', align: 'center', sortable: false },
  ]

  const detailHeaders = [
    { title: '預覽', key: 'image', width: '80px', sortable: false },
    { title: '商品名稱', key: 'name', sortable: false },
    { title: '單價', key: 'p_id.price', align: 'end' },
    { title: '數量', key: 'quantity', align: 'center' },
    { title: '小計', key: 'subtotal', align: 'end' },
  ]

  const detailsDialog = ref(false)
  const selectedOrder = ref(null)

  const openDetails = (order) => {
    selectedOrder.value = order
    detailsDialog.value = true
  }

  const fetchAllOrders = async () => {
    loading.value = true
    try {
      const { data } = await api.get('/orders/all')
      if (data.success) allOrders.value = data.data
    } catch {
      showSnackbar?.('系統讀取訂單失敗', 'error')
    } finally {
      loading.value = false
    }
  }

  const updateStatus = async (id, status) => {
    const actionText = orderStatusMap[status]
    if (!confirm(`確定要將此訂單標記為「${actionText}」嗎？`)) return
    try {
      const { data } = await api.patch(`/orders/admin/${id}`, { status })
      if (data.success) {
        showSnackbar?.(`訂單已更新為：${actionText}`, 'success')
        fetchAllOrders()
      }
    } catch {
      showSnackbar?.('更新狀態失敗', 'error')
    }
  }

  const deleteOrder = async (id) => {
    if (!confirm('警告：確定要永久刪除這筆訂單嗎？此操作無法還原。')) return
    try {
      const { data } = await api.delete(`/orders/admin/${id}`)
      if (data.success) {
        showSnackbar?.('訂單已永久移除', 'success')
        fetchAllOrders()
      }
    } catch (error) {
      showSnackbar?.(error.response?.data?.message || '刪除失敗', 'error')
    }
  }

  const getStatusColor = (status) => {
    if (status === 0) return 'orange-darken-3'
    if (status === 1) return 'green-darken-2'
    return 'grey-darken-1'
  }

  onMounted(fetchAllOrders)
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

  .order-id-code {
    font-family: 'Courier New', Courier, monospace;
    background: #f0f0f0;
    padding: 4px 8px;
    border-radius: 6px;
    color: #666;
    font-size: 0.9rem;
  }

  .custom-search :deep(.v-field) {
    border: 1px solid #e0e0e0 !important;
    transition: all 0.3s;
  }

  .custom-search :deep(.v-field--focused) {
    border-color: #2d3e33 !important;
  }

  .line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .detail-table :deep(.v-data-table-footer) {
    padding: 8px;
    background-color: #fcfcfc;
    border-top: 1px solid #eee;
  }

  /* 讓訂單詳情的內容區可以捲動，避免過長的訂單導致整個對話框過大 */
  .scrollable-content {
    overflow-y: auto;
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
  title: '訂單管理'
  login: true
  admin: true
</route>
