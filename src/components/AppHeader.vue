<template>
  <v-navigation-drawer
    v-model="drawer"
    class="bg-paper-dark"
    elevation="5"
    location="left"
    temporary
  >
    <v-list class="font-serif px-2">
      <v-list-item class="text-h6 py-6 color-gold nav-header" title="🍵 緩慢茶事"></v-list-item>
      <v-divider class="mb-4" color="rgba(255,255,255,0.1)"></v-divider>

      <v-list-item link prepend-icon="mdi-leaf" title="茶之起源" to="/about"></v-list-item>
      <v-list-item link prepend-icon="mdi-palette" title="六色茶韻" to="/types"></v-list-item>
      <v-list-item link prepend-icon="mdi-mower" title="製茶之旅" to="/process"></v-list-item>

      <v-list-group value="guide">
        <template #activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-book-open-variant"
            title="品茗指南"
          ></v-list-item>
        </template>
        <v-list-item class="ml-4" title="泡茶心法" to="/brew"></v-list-item>
        <v-list-item class="ml-4" title="茶器賞析" to="/teaware"></v-list-item>
      </v-list-group>

      <v-list-item link prepend-icon="mdi-storefront" title="茶事選物" to="/products"></v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-app-bar class="custom-header" elevation="2">
    <v-app-bar-nav-icon class="d-md-none text-white" @click="drawer = !drawer"></v-app-bar-nav-icon>

    <v-app-bar-title class="font-weight-bold logo-text font-serif" @click="$router.push('/')">
      <span class="d-flex align-center"> 🍵 <span class="ml-2">緩慢茶事</span> </span>
    </v-app-bar-title>

    <v-spacer></v-spacer>

    <div class="d-none d-md-flex nav-links font-serif">
      <v-btn to="/about" variant="text">茶之起源</v-btn>
      <v-btn to="/types" variant="text">六色茶韻</v-btn>
      <v-btn to="/process" variant="text">製茶之旅</v-btn>

      <v-menu open-on-hover>
        <template #activator="{ props }">
          <v-btn v-bind="props" append-icon="mdi-chevron-down" variant="text">品茗指南</v-btn>
        </template>
        <v-list class="bg-paper-light">
          <v-list-item title="泡茶心法" @click="$router.push('/brew')"></v-list-item>
          <v-list-item title="茶器賞析" @click="$router.push('/teaware')"></v-list-item>
        </v-list>
      </v-menu>

      <v-btn to="/products" variant="text">茶事選物</v-btn>
    </div>

    <v-spacer class="d-none d-md-block"></v-spacer>

    <div class="d-flex align-center right-icons">
      <div
        class="d-flex align-center position-relative search-container"
        @mouseenter="isSearchHover = true"
        @mouseleave="handleMouseLeave"
      >
        <transition name="search-slide">
          <v-text-field
            v-if="isSearchHover"
            v-model="searchQuery"
            autofocus
            class="search-input-absolute d-none d-sm-block"
            density="compact"
            hide-details
            placeholder="搜尋茶品名稱..."
            rounded="xl"
            variant="solo"
            @keyup.enter="onSearch"
          ></v-text-field>
        </transition>

        <v-btn icon style="z-index: 2" @click="toggleSearchMobile">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </div>

      <v-btn icon @click="handleCartClick">
        <v-badge
          color="#C19A6B"
          :content="cartStore.totalItems"
          :model-value="cartStore.totalItems > 0"
        >
          <v-icon>mdi-cart</v-icon>
        </v-badge>
      </v-btn>

      <v-btn id="member-menu-activator" icon @click="handleAccountClick">
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </div>
  </v-app-bar>

  <v-main>
    <router-view />
  </v-main>

  <v-overlay v-model="mobileSearchActive" class="align-center justify-center" scrim="#2d3e33">
    <v-card class="pa-4 rounded-lg" width="90vw">
      <v-text-field
        v-model="searchQuery"
        append-inner-icon="mdi-magnify"
        hide-details
        label="搜尋茶品名稱"
        variant="underlined"
        @click:append-inner="onSearch"
        @keyup.enter="onSearch"
      ></v-text-field>
      <v-btn block class="mt-4" color="#2d3e33" @click="mobileSearchActive = false">關閉</v-btn>
    </v-card>
  </v-overlay>

  <UserStatusDialog v-model:dialog="showUserDialog" activator="#member-menu-activator" />
</template>

<script setup>
  import { inject, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { useCartStore } from '@/stores/cartStore'
  import { useUserStore } from '@/stores/user'
  import UserStatusDialog from './UserStatusDialog.vue'

  const userStore = useUserStore()
  const cartStore = useCartStore()
  const router = useRouter()

  const drawer = ref(false)
  const isSearchHover = ref(false)
  const mobileSearchActive = ref(false)
  const searchQuery = ref('')
  const showUserDialog = ref(false)

  const showRequireLogin = inject('showRequireLogin')

  watch(searchQuery, (newVal) => {
    if (newVal === '') {
      router.push({ path: '/products', query: {} })
    }
  })

  const onSearch = () => {
    if (searchQuery.value.trim()) {
      router.push({ path: '/products', query: { q: searchQuery.value } })
    } else {
      router.push('/products')
    }
    isSearchHover.value = false
    mobileSearchActive.value = false
  }

  const toggleSearchMobile = () => {
    if (window.innerWidth < 600) {
      mobileSearchActive.value = true
    } else {
      onSearch()
    }
  }

  const handleMouseLeave = () => {
    if (!searchQuery.value) isSearchHover.value = false
  }

  const handleAccountClick = () => {
    userStore.isLoggedIn ? (showUserDialog.value = true) : router.push('/login')
  }

  const handleCartClick = () => {
    if (!userStore.isLoggedIn) {
      return showRequireLogin?.('您尚未登入，無法使用購物車功能')
    }
    router.push('/cart')
  }
</script>

<style scoped>
  .font-serif {
    font-family: 'Noto Serif TC', serif !important;
    color: #c19a6b !important;
  }

  /* --- 側邊欄樣式 --- */
  .bg-paper-dark {
    background-color: #2d3e33 !important;
    color: #f9f7f2 !important;
  }

  /* 預設選單項目顏色 */
  .bg-paper-dark :deep(.v-list-item) {
    transition: color 0.3s ease;
    color: #f9f7f2 !important;
  }

  /* 側邊欄滑過變色：排除掉 .nav-header */
  .bg-paper-dark :deep(.v-list-item:not(.nav-header):hover) {
    color: #c19a6b !important;
  }

  /* 圖示滑過也變金色 */
  .bg-paper-dark :deep(.v-list-item:not(.nav-header):hover .v-icon) {
    color: #c19a6b !important;
  }

  /* 標題固定顏色，不隨 hover 改變 */
  .color-gold {
    color: #c19a6b !important;
  }

  /* 下拉群組標題滑過效果 */
  .bg-paper-dark :deep(.v-list-group__header:hover) {
    color: #c19a6b !important;
  }

  /* --- 導覽列與其他樣式 --- */
  .custom-header {
    background-color: #2d3e33 !important;
    color: #f9f7f2 !important;
  }

  .logo-text {
    cursor: pointer;
    letter-spacing: 2px;
    color: #f9f7f2;
  }

  .nav-links :deep(.v-btn) {
    transition: color 0.3s;
    color: #f9f7f2;
  }

  .nav-links :deep(.v-btn:hover) {
    color: #c19a6b !important;
  }

  .bg-paper-light {
    background-color: #f5f5dc !important;
    color: #c19a6b !important;
  }

  .search-input-absolute {
    position: absolute;
    right: 48px;
    width: 200px;
    z-index: 1;
  }

  .search-slide-enter-active,
  .search-slide-leave-active {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .search-slide-enter-from,
  .search-slide-leave-to {
    width: 0;
    opacity: 0;
  }
</style>
