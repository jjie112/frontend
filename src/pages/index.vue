<template>
  <carousel />

  <v-container class="py-12">
    <v-row class="mb-10" justify="center">
      <v-col class="text-center" cols="auto">
        <h2 class="text-h4 font-weight-bold mb-2 font-serif color-primary">深度茶旅</h2>
        <div class="divider-gold mx-auto"></div>
        <p class="mt-4 text-grey-darken-1">從一片葉到一盞茶，探索緩慢時光中的韻味</p>
      </v-col>
    </v-row>

    <v-row class="mb-10">
      <v-col cols="12">
        <v-card
          class="d-flex flex-column flex-md-row clickable-card overflow-hidden"
          elevation="2"
          @click="$router.push('/about')"
        >
          <v-img class="v-col-md-6" cover height="350px" src="../assets/teaCulture.webp"></v-img>
          <div class="v-col-md-6 pa-10 d-flex flex-column justify-center bg-paper">
            <span class="text-overline color-gold font-weight-bold">SINCE ANCIENT TIMES</span>
            <v-card-title class="text-h5 font-weight-bold font-serif px-0 mb-4">
              茶之起源：神農遺風</v-card-title
            >
            <v-card-text class="px-0 text-body-1 text-grey-darken-2 font-serif">
              「茶之為飲，發乎神農氏。」追溯數千年的歷史長河，探索第一片茶葉如何從野生的生命，轉化為溫潤靈魂的藥飲與藝術。
            </v-card-text>
            <v-card-actions class="px-0">
              <v-btn append-icon="mdi-arrow-right" color="#C19A6B" variant="text">探尋傳說</v-btn>
            </v-card-actions>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mb-10">
      <v-col cols="12">
        <v-card
          class="d-flex flex-column flex-md-row-reverse clickable-card overflow-hidden"
          elevation="2"
          @click="$router.push('/types')"
        >
          <v-img class="v-col-md-6" cover height="350px" src="../assets/sixTea.webp"></v-img>
          <div class="v-col-md-6 pa-10 d-flex flex-column justify-center bg-paper">
            <span class="text-overline color-gold font-weight-bold">SIX TEA CATEGORIES</span>
            <v-card-title class="text-h5 font-weight-bold font-serif px-0 mb-4">
              六色茶韻：感官盛宴</v-card-title
            >
            <v-card-text class="px-0 text-body-1 text-grey-darken-2 font-serif">
              綠茶的鮮爽、紅茶的醇甜、烏龍的岩骨花香...
              透過發酵度的變化，一葉茶演繹出六種截然不同的生命色彩。
            </v-card-text>
            <v-card-actions class="px-0">
              <v-btn append-icon="mdi-arrow-right" color="#C19A6B" variant="text">品味色標</v-btn>
            </v-card-actions>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card
          class="d-flex flex-column flex-md-row clickable-card overflow-hidden"
          elevation="2"
          @click="$router.push('/process')"
        >
          <v-img class="v-col-md-6" cover height="350px" src="../assets/teaCrafting.webp"></v-img>
          <div class="v-col-md-6 pa-10 d-flex flex-column justify-center bg-paper">
            <span class="text-overline color-gold font-weight-bold">CRAFTSMANSHIP</span>
            <v-card-title class="text-h5 font-weight-bold font-serif px-0 mb-4">
              製茶之旅：職人之心</v-card-title
            >
            <v-card-text class="px-0 text-body-1 text-grey-darken-2 font-serif">
              揉捻、發酵、烘焙。每一道工序都是與時間的博弈，帶你走進茶園後方，看見那些決定茶湯靈魂的關鍵時刻。
            </v-card-text>
            <v-card-actions class="px-0">
              <v-btn append-icon="mdi-arrow-right" color="#C19A6B" variant="text">探索工法</v-btn>
            </v-card-actions>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
  .font-serif {
    font-family: 'Noto Serif TC', serif;
  }

  /* 品牌主色與琥珀色 */
  .color-primary {
    color: #2d3e33;
  }
  .color-gold {
    color: #c19a6b;
  }

  /* 紙質感背景，呼應之前討論的背景色 */
  .bg-paper {
    background-color: #f9f7f2 !important;
  }

  /* 金色裝飾線 */
  .divider-gold {
    width: 40px;
    height: 3px;
    background-color: #c19a6b;
  }

  /* 卡片懸停與過渡 */
  .clickable-card {
    cursor: pointer;
    transition:
      transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1),
      box-shadow 0.4s ease;
    border-radius: 12px !important;
  }

  .clickable-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(45, 62, 51, 0.15) !important;
  }

  /* 文字細節調整 */
  .v-card-title {
    color: #2d3e33;
  }

  /* 手機版排版修正：在手機上圖片高度縮減 */
  @media (max-width: 960px) {
    .v-img {
      width: 100% !important;
      height: 250px !important;
    }
    .v-col-md-6 {
      width: 100% !important;
    }
  }
</style>
