<template>
  <v-container class="py-16">
    <v-btn
      class="mb-8"
      color="brown-darken-1"
      prepend-icon="mdi-chevron-left"
      variant="text"
      @click="$router.back()"
    >
      返回選物清單
    </v-btn>

    <v-row v-if="product" gutter="lg">
      <v-col cols="12" md="6">
        <v-card class="border overflow-hidden" elevation="0" rounded="xl">
          <v-img class="rounded-xl product-main-img" cover height="550" :src="product.image">
            <template #placeholder>
              <v-row align="center" class="fill-height ma-0" justify="center">
                <v-progress-circular color="brown-lighten-3" indeterminate></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </v-card>
      </v-col>

      <v-col class="pl-md-10" cols="12" md="6">
        <v-chip
          class="mb-4 font-weight-bold"
          :color="getCategoryColor(product.category)"
          variant="flat"
        >
          {{ product.category }}
        </v-chip>

        <h1 class="text-h3 font-weight-bold font-serif color-tea-green mb-4">{{ product.name }}</h1>

        <div class="d-flex align-center mb-8">
          <div class="text-h4 font-weight-bold price-text">
            NT$ {{ product.price?.toLocaleString() }}
          </div>
          <v-spacer></v-spacer>
          <v-chip
            class="font-weight-bold"
            :color="
              product.stock > 0
                ? product.stock < 10
                  ? 'orange-darken-2'
                  : 'green-darken-1'
                : 'red'
            "
            size="small"
            variant="tonal"
          >
            {{ product.stock > 0 ? `限量供應中 (剩餘 ${product.stock})` : '目前缺貨' }}
          </v-chip>
        </div>

        <v-divider class="mb-8"></v-divider>

        <v-row class="mb-8 text-center bg-grey-lighten-4 rounded-lg pa-2 mx-0">
          <v-col cols="4">
            <div class="text-caption text-grey">海拔</div>
            <div class="font-weight-bold text-body-2">{{ product.altitude || '1200m' }}</div>
          </v-col>
          <v-col class="border-s border-e" cols="4">
            <div class="text-caption text-grey">發酵</div>
            <div class="font-weight-bold text-body-2">{{ product.fermentation || '適中' }}</div>
          </v-col>
          <v-col cols="4">
            <div class="text-caption text-grey">焙火</div>
            <div class="font-weight-bold text-body-2">{{ product.roasting || '低焙火' }}</div>
          </v-col>
        </v-row>

        <h3 class="text-h6 font-weight-bold mb-3 font-serif">茶品描述</h3>
        <p class="text-body-1 text-grey-darken-2 mb-10 leading-relaxed font-serif white-space-pre">
          {{ product.description }}
        </p>

        <div class="pa-6 border rounded-xl bg-white shadow-sm">
          <div class="d-flex align-center mb-6">
            <span class="text-subtitle-1 font-weight-bold mr-4">選擇數量</span>
            <div class="d-flex align-center border rounded-pill px-2 bg-grey-lighten-5">
              <v-btn
                :disabled="quantity <= 1"
                icon="mdi-minus"
                size="small"
                variant="text"
                @click="quantity--"
              ></v-btn>
              <div class="px-6 font-weight-bold text-h6">{{ quantity }}</div>
              <v-btn
                :disabled="quantity >= product.stock"
                icon="mdi-plus"
                size="small"
                variant="text"
                @click="quantity++"
              ></v-btn>
            </div>
          </div>

          <v-btn
            block
            class="font-weight-bold action-btn"
            color="brown-darken-2"
            :disabled="isSubmitting || product.stock <= 0"
            elevation="0"
            :loading="isSubmitting"
            rounded="pill"
            size="x-large"
            @click="handleAddToCart"
          >
            {{ product.stock > 0 ? '立即加入購物車' : '商品補貨中' }}
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-row v-else class="text-center py-16">
      <v-col
        ><v-progress-circular color="brown" indeterminate size="64"></v-progress-circular
      ></v-col>
    </v-row>

    <v-dialog v-model="showConfirmDialog" max-width="360" rounded="xl">
      <v-card class="pa-4 text-center">
        <v-card-text class="pt-6">
          <v-icon class="mb-4" color="brown-lighten-1" size="64">mdi-cart-heart</v-icon>
          <div class="text-h6 font-weight-bold mb-2">確認加入購物車？</div>
          <div class="text-body-2 text-grey">您選擇了 {{ quantity }} 份 {{ product?.name }}</div>
        </v-card-text>
        <v-card-actions class="justify-center pb-6">
          <v-btn
            class="px-6"
            color="grey"
            rounded="pill"
            variant="text"
            @click="showConfirmDialog = false"
            >取消</v-btn
          >
          <v-btn
            class="px-8"
            color="brown-darken-2"
            rounded="pill"
            variant="flat"
            @click="confirmAdd"
            >確定</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
  import { inject, onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import api from '@/composables/api'
  import { useCartStore } from '@/stores/cartStore'

  const route = useRoute()
  const cartStore = useCartStore()
  const showSnackbar = inject('showSnackbar')
  const showRequireLogin = inject('showRequireLogin')

  const product = ref(null)
  const quantity = ref(1)
  const showConfirmDialog = ref(false)
  const isSubmitting = ref(false)

  // 💡 這裡是同步過來的顏色邏輯函式
  const colorMap = {
    '綠茶': 'green-darken-3',
    '白茶': 'blue-grey-darken-1',
    '黃茶': 'orange-darken-1',
    '青茶(烏龍茶)': 'teal-darken-2',
    '紅茶': 'red-darken-4',
    '黑茶(普洱茶)': 'brown-darken-4',
  }

  const getCategoryColor = (category) => {
    return colorMap[category] || 'brown-darken-3'
  }

  const fetchProduct = async () => {
    try {
      const id = route.params.id
      const response = await api.get(`/products/${id}`)
      if (response.data?.success) {
        product.value = response.data.data
        if (product.value.stock <= 0) quantity.value = 0
      }
    } catch {
      showSnackbar?.('載入失敗', 'error')
    }
  }

  onMounted(fetchProduct)

  const handleAddToCart = () => {
    if (!product.value || quantity.value < 1) return
    showConfirmDialog.value = true
  }

  const confirmAdd = async () => {
    isSubmitting.value = true
    try {
      await cartStore.updateCart(product.value._id, quantity.value)
      showConfirmDialog.value = false
      showSnackbar?.(`已將 ${quantity.value} 份商品加入購物車`, 'success')
    } catch (error) {
      showConfirmDialog.value = false
      if (error.code === 'AUTH_REQUIRED') {
        showRequireLogin?.('請先登入會員喔～')
      } else {
        showSnackbar?.(error.message || '加入失敗', 'error')
      }
    } finally {
      isSubmitting.value = false
    }
  }
</script>

<style scoped>
  .font-serif {
    font-family: 'Noto Serif TC', serif !important;
  }
  .color-tea-green {
    color: #2d3e33;
  }
  .price-text {
    color: #8d6e63;
  }
  .leading-relaxed {
    line-height: 1.9 !important;
  }
  .border-s {
    border-left: 1px solid #ddd !important;
  }
  .border-e {
    border-right: 1px solid #ddd !important;
  }
  .white-space-pre {
    white-space: pre-line;
  }

  /* 圖片微調，增加質感 */
  .product-main-img {
    transition: transform 0.5s ease;
  }
  .product-main-img:hover {
    transform: scale(1.02);
  }

  /* 操作按鈕懸浮感 */
  .action-btn {
    transition: all 0.3s ease;
  }
  .action-btn:hover {
    box-shadow: 0 4px 15px rgba(78, 52, 46, 0.3) !important;
  }
</style>
