<template>
  <v-carousel
    class="tea-carousel bg-scrim-dark"
    crossfade
    cycle
    height="600"
    hide-delimiter-background
    show-arrows="hover"
  >
    <v-carousel-item
      v-for="(slide, i) in teaSlides"
      :key="i"
      class="cursor-pointer"
      @click="handleNavigate(slide.link)"
    >
      <div class="carousel-item-wrapper h-100 position-relative overflow-hidden">
        <v-img class="blur-background" cover height="600" :src="slide.src"></v-img>

        <v-img :alt="slide.title" class="main-thread-image" contain height="600" :src="slide.src">
          <template #placeholder>
            <v-row align="center" class="fill-height ma-0" justify="center">
              <v-progress-circular color="brown-lighten-4" indeterminate></v-progress-circular>
            </v-row>
          </template>
        </v-img>
      </div>

      <v-overlay
        class="align-center justify-center"
        contained
        :model-value="true"
        opacity="0.4"
        scrim="#2D3E33"
      >
        <div class="text-center slide-content">
          <h2 class="text-h2 font-weight-bold mb-4 slide-title font-serif">
            {{ slide.title }}
          </h2>
          <div class="divider mb-5"></div>
          <p class="text-h6 slide-subtitle tracking-wide">{{ slide.subtitle }}</p>

          <v-btn
            class="mt-8 action-btn"
            color="white"
            prepend-icon="mdi-leaf"
            size="large"
            variant="outlined"
          >
            探索詳情
          </v-btn>
        </div>
      </v-overlay>
    </v-carousel-item>
  </v-carousel>
</template>

<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  // 定義輪播圖資料
  const teaSlides = ref([
    {
      title: '茶之起源',
      subtitle: '探尋神農氏與第一片落葉的故事',
      // 透過 URL 建構子動態解析路徑，確保在不同部署環境下都能正確載入圖片
      src: new URL('../assets/Shennong.webp', import.meta.url).href,
      link: '/about',
    },
    {
      title: '六色茶韻',
      subtitle: '綠、黃、白、青、紅、黑的感官饗宴',
      src: new URL('../assets/teaTypes.webp', import.meta.url).href,
      link: '/types',
    },
    {
      title: '製茶之旅',
      subtitle: '從採摘到揉捻，職人精神的傳遞',
      src: new URL('../assets/teaManufacture.webp', import.meta.url).href,
      link: '/process',
    },
    {
      title: '泡茶心法',
      subtitle: '水溫與時間交織出的最佳湯色',
      src: new URL('../assets/teaBrew.webp', import.meta.url).href,
      link: '/brew',
    },
    {
      title: '茶事選物',
      subtitle: '精選六大茶系，品味生活每一刻',
      src: new URL('../assets/teaProducts.webp', import.meta.url).href,
      link: '/products',
    },
  ])

  // 處理輪播圖點擊導航
  const handleNavigate = (path) => {
    router.push(path)
  }
</script>

<style scoped>
  .font-serif {
    font-family: 'Noto Serif TC', serif !important;
  }
  .cursor-pointer {
    cursor: pointer;
  }

  /* 背景襯底與主圖樣式 */
  .bg-scrim-dark {
    background-color: #2d3e33 !important; /* 確保與Scrim一致 */
  }

  .carousel-item-wrapper {
    position: relative;
    width: 100%;
  }

  /* 模糊背景：負責填滿，並保持色調 */
  .blur-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    filter: blur(20px) brightness(0.7); /* 模糊並稍微變暗 */
    transform: scale(1.1); /* 稍微放大防止邊緣留白 */
    z-index: 1;
  }

  /* 主圖片：負責全圖顯示 */
  .main-thread-image {
    position: relative;
    z-index: 2; /* 放在模糊背景上方 */
  }

  /* 文字內容排版 */
  .slide-content {
    padding: 40px;
    max-width: 800px;
    position: relative;
    z-index: 3; /* 確保文字在最上層 */
  }

  .slide-title {
    letter-spacing: 8px !important;
    color: #fcfbf9; /* 米白色 */
    text-shadow: 0 4px 15px rgba(0, 0, 0, 0.6);
  }

  .divider {
    width: 80px; /* 稍微加長 */
    height: 2px;
    background-color: #c19a6b; /* 琥珀金 */
    margin: 0 auto;
  }

  .slide-subtitle {
    color: #fcfbf9;
    font-weight: 400;
    letter-spacing: 2px;
    text-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
  }

  .tracking-wide {
    letter-spacing: 3px;
  }

  /* 按鈕效果 */
  .action-btn {
    border-color: rgba(252, 251, 249, 0.6) !important;
    color: #fcfbf9 !important;
    letter-spacing: 2px;
    transition: all 0.4s ease;
    background-color: rgba(255, 255, 255, 0.1);
  }

  .action-btn:hover {
    background-color: #c19a6b !important; /* 懸停轉琥珀金 */
    border-color: #c19a6b !important;
    color: white !important;
    transform: scale(1.05);
  }

  /* 分頁點點與箭頭 */
  :deep(.v-btn--icon.v-btn--active) {
    color: #c19a6b !important;
  }

  :deep(.v-window__left),
  :deep(.v-window__right) {
    background: rgba(45, 62, 51, 0.3) !important;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    margin: 0 10px;
  }
</style>
