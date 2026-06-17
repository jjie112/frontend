<template>
  <v-container class="py-16">
    <v-row class="mb-10 text-center" justify="center">
      <v-col cols="12" md="8">
        <h1 class="text-h3 font-weight-bold font-serif color-tea-green mb-4">茶事選物</h1>
        <p class="text-subtitle-1 text-grey-darken-1 font-serif">
          —— 尋找一口屬於山頭的自然氣息 ——
        </p>
        <v-divider
          class="mx-auto mt-6"
          color="brown-lighten-2"
          thickness="2"
          width="60"
        ></v-divider>
      </v-col>
    </v-row>

    <v-row align="center" class="mb-12">
      <v-col cols="12" md="5">
        <v-text-field
          v-model="searchQuery"
          class="bg-white"
          clearable
          color="brown-darken-1"
          hide-details
          placeholder="搜尋茶品名稱..."
          prepend-inner-icon="mdi-magnify"
          rounded="lg"
          variant="outlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="7">
        <v-tabs
          v-model="selectedCategory"
          align-tabs="start"
          class="category-tabs"
          color="brown-darken-2"
        >
          <v-tab
            v-for="sort in categories"
            :key="sort"
            class="font-weight-bold"
            :value="sort"
            @click="clearSearch"
          >
            {{ sort }}
          </v-tab>
        </v-tabs>
      </v-col>
    </v-row>

    <v-row v-if="displayProducts.length > 0">
      <v-col v-for="product in displayProducts" :key="product._id" cols="12" lg="4" md="4" sm="6">
        <v-card
          class="product-card h-100 d-flex flex-column"
          elevation="0"
          @click="$router.push(`/products/${product._id}`)"
        >
          <div class="product-img-container bg-grey-lighten-4 overflow-hidden position-relative">
            <v-img class="product-img" contain height="280px" :src="getImageUrl(product.image)">
              <v-chip
                class="ma-3 font-weight-bold"
                :color="getCategoryColor(product.category)"
                size="small"
                style="z-index: 2"
                variant="flat"
              >
                {{ product.category }}
              </v-chip>

              <v-overlay
                v-if="product.stock <= 0"
                class="align-center justify-center"
                contained
                model-value
                persistent
                scrim="grey-darken-4"
              >
                <div class="sold-out-tag">SOLD OUT</div>
              </v-overlay>

              <template #placeholder>
                <v-row align="center" class="fill-height ma-0" justify="center">
                  <v-progress-circular color="brown-lighten-4" indeterminate></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </div>

          <v-card-item class="pt-4">
            <div class="d-flex justify-space-between align-center mb-1">
              <v-card-title class="text-h6 font-weight-bold font-serif pa-0">
                {{ product.name }}
              </v-card-title>
            </div>
            <v-card-subtitle class="pa-0 text-grey-darken-1">
              <v-icon class="mr-1" size="small">mdi-map-marker-outline</v-icon>
              {{ product.origin }}
            </v-card-subtitle>
          </v-card-item>

          <v-card-text class="flex-grow-1">
            <div class="text-h6 price-text font-weight-bold mb-2">
              NT$ {{ product.price.toLocaleString() }}
            </div>
            <p class="text-body-2 text-grey-darken-1 line-clamp-2">
              {{ product.description }}
            </p>
          </v-card-text>

          <v-divider class="mx-4"></v-divider>

          <v-card-actions class="pa-4">
            <v-btn
              block
              class="font-weight-bold"
              :color="product.stock > 0 ? 'brown-darken-2' : 'grey-lighten-1'"
              :disabled="product.stock <= 0"
              rounded="pill"
              variant="flat"
              @click.stop="addToCart(product)"
            >
              <v-icon start>{{
                product.stock > 0 ? 'mdi-basket-plus' : 'mdi-clock-outline'
              }}</v-icon>
              {{ product.stock > 0 ? '加入購物車' : '補貨中' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else class="text-center py-16">
      <v-col cols="12">
        <v-icon color="grey-lighten-2" size="80">mdi-leaf-off</v-icon>
        <p class="mt-4 text-h6 text-grey">目前沒有符合條件的茶品</p>
      </v-col>
    </v-row>

    <v-pagination
      v-if="totalPages > 1"
      v-model="currentPage"
      class="mt-12"
      color="brown-darken-2"
      :length="totalPages"
      rounded="circle"
    ></v-pagination>
  </v-container>
</template>

<script setup>
  import { inject, onMounted } from 'vue'
  import { useProductList } from '@/composables/useProduct'
  import { useCartStore } from '@/stores/cartStore'

  const cartStore = useCartStore()
  const showSnackbar = inject('showSnackbar')
  const showRequireLogin = inject('showRequireLogin')

  const {
    selectedCategory,
    searchQuery,
    currentPage,
    categories,
    displayProducts,
    totalPages,
    fetchProducts,
    getImageUrl,
    getCategoryColor,
  } = useProductList()

  const addToCart = async (product) => {
    try {
      await cartStore.updateCart(product._id, 1)
      showSnackbar?.(`已將「${product.name}」加入購物車`, 'success')
    } catch (error) {
      if (error.code === 'AUTH_REQUIRED') {
        showRequireLogin?.('請先登入會員再進行購物喔～')
      } else {
        showSnackbar?.(error.message || '加入失敗', 'error')
      }
    }
  }

  // 分類 tab 點擊時清空搜尋（template 的 @click="clearSearch" 改成這裡）
  const clearSearch = () => {
    searchQuery.value = ''
  }

  onMounted(fetchProducts)
</script>

<style scoped>
  .font-serif {
    font-family: 'Noto Serif TC', serif !important;
    color: #2d3e33;
  }

  .color-tea-green {
    color: #2d3e33;
  }

  .price-text {
    color: #8d6e63;
  }

  /* 商品卡片基礎 */
  .product-card {
    border: 1px solid #eee !important;
    border-radius: 16px !important;
    transition: all 0.4s ease;
    background-color: #fff;
    cursor: pointer;
  }

  .product-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.06) !important;
    border-color: #8d6e63 !important;
  }

  /* 圖片容器優化 */
  .product-img-container {
    border-radius: 16px 16px 0 0;
    /* 僅上方圓角 */
  }

  .product-img {
    transition: transform 0.6s ease;
    /* padding 確保圖片文字不被邊框切到 */
    padding: 8px;
  }

  /* 即使是 contain 模式，hover 仍保有縮放動效 */
  .product-card:hover .product-img {
    transform: scale(1.05);
  }

  .sold-out-tag {
    border: 2px solid white;
    padding: 8px 16px;
    font-weight: 900;
    letter-spacing: 2px;
    color: white;
  }

  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .category-tabs :deep(.v-tab) {
    text-transform: none;
    letter-spacing: 0;
  }
</style>

<route lang="yaml">
meta:
  title: '茶事選物'
</route>
