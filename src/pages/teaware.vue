<template>
  <v-container class="py-10">
    <v-row class="mb-16 align-center" no-gutters>
      <v-col class="pa-4" cols="12" md="5">
        <v-img class="rounded-xl elevation-10" cover height="450" src="../assets/Teaware.webp">
          <template #placeholder>
            <v-row align="center" class="fill-height ma-0" justify="center">
              <v-progress-circular color="grey-lighten-5" indeterminate></v-progress-circular>
            </v-row>
          </template>
        </v-img>
      </v-col>

      <v-col class="pa-10" cols="12" md="7">
        <div class="text-overline mb-2 text-brown font-weight-bold">TEAWARE APPRECIATION</div>
        <h1 class="text-h3 font-weight-bold mb-6 font-serif" style="color: #2d3e33">茶器賞析</h1>
        <h3 class="text-h5 text-brown-darken-1 mb-6 font-italic font-serif">
          「器為茶之父，水為茶之母」
        </h3>

        <p class="text-h6 text-grey-darken-2 leading-loose font-serif">
          泡茶，從來不只是葉與水的交融，更是人、器、火、時光的細膩對話。
          一把好壺，能讓茶葉呼吸舒展；一隻品茗杯，能襯托湯色層次。
          <span class="text-brown-darken-2">選對茶器，就是給自己多一份溫柔與儀式感。</span>
        </p>

        <v-divider class="mt-8" color="brown" thickness="2" width="100"></v-divider>
      </v-col>
    </v-row>

    <v-row class="mb-12 align-center">
      <v-col cols="12" md="6">
        <v-hover v-slot="{ isHovering, props }">
          <v-card
            v-bind="props"
            class="rounded-xl overflow-hidden"
            :elevation="isHovering ? 12 : 2"
          >
            <v-img cover height="400" src="../assets/teaSet.webp"></v-img>
          </v-card>
        </v-hover>
      </v-col>
      <v-col class="pa-md-10" cols="12" md="6">
        <div class="d-flex align-center mb-4">
          <v-icon class="mr-2" color="brown" size="small">mdi-star-four-points</v-icon>
          <span class="text-subtitle-1 font-weight-bold text-brown">ESSENTIALS</span>
        </div>
        <h2 class="text-h4 font-weight-bold mb-6">核心泡茶茶具</h2>
        <v-list bg-color="transparent">
          <v-list-item v-for="(item, i) in coreTools" :key="i" class="px-0">
            <template #prepend>
              <div class="tool-number mr-4">{{ i + 1 }}</div>
            </template>
            <v-list-item-title class="text-h6 font-weight-bold">{{ item.title }}</v-list-item-title>
            <v-list-item-subtitle class="text-body-1 text-wrap mt-1">{{
              item.desc
            }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>

    <v-row class="mb-12 align-center flex-md-row-reverse">
      <v-col cols="12" md="6">
        <v-hover v-slot="{ isHovering, props }">
          <v-card
            v-bind="props"
            class="rounded-xl overflow-hidden"
            :elevation="isHovering ? 12 : 2"
          >
            <v-img cover height="400" src="../assets/teaUtensils.webp"></v-img>
          </v-card>
        </v-hover>
      </v-col>
      <v-col class="pa-md-10" cols="12" md="6">
        <div class="d-flex align-center mb-4">
          <v-icon class="mr-2" color="brown" size="small">mdi-leaf</v-icon>
          <span class="text-subtitle-1 font-weight-bold text-brown">TEA ACCESSORIES</span>
        </div>
        <h2 class="text-h4 font-weight-bold mb-6">茶道六君子</h2>
        <v-row>
          <v-col v-for="(tool, i) in assistantTools" :key="i" cols="12" sm="6">
            <h4 class="text-subtitle-1 font-weight-bold color-brown-dark mb-1">
              {{ i + 1 }}. {{ tool.title }}
            </h4>
            <p class="text-body-2 text-grey-darken-2">{{ tool.desc }}</p>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-card class="pa-12 mt-16 text-center rounded-xl teaware-footer" elevation="0">
      <v-responsive class="mx-auto" max-width="700">
        <p class="text-h6 font-serif mb-8 text-grey-darken-3 leading-loose">
          茶器如人，各有性情與故事。<br />
          紫砂溫潤、瓷器忠實、玻璃清新。<br />
          現在，就讓我們把這些雅物帶進生活。
        </p>
        <v-btn
          class="px-10 py-4"
          color="brown-darken-2"
          elevation="4"
          rounded="pill"
          size="x-large"
          to="/products"
        >
          選一款與好器相配的好茶
        </v-btn>
      </v-responsive>
    </v-card>
  </v-container>
</template>

<script setup>
  const coreTools = [
    { title: '茶壺（蓋碗）', desc: '泡茶主器，容納茶葉與熱水，讓茶葉充分舒展。' },
    { title: '茶海（公道杯）', desc: '將壺中茶湯倒出，統一濃度，避免悶苦。' },
    { title: '品茗杯', desc: '直接喝茶的杯子。' },
    { title: '聞香杯', desc: '先倒入茶湯聞香，再倒入品茗杯喝。' },
    { title: '茶盤', desc: '放置所有茶具並承接溢出的水。' },
  ]

  const assistantTools = [
    { title: '茶則', desc: '盛放茶葉、賞乾茶，方便撥入壺中。' },
    { title: '茶漏', desc: '引導乾茶進入壺內，避免散落。' },
    { title: '茶匙', desc: '將茶葉撥入壺中，或清理壺內茶渣。' },
    { title: '茶針', desc: '疏通壺嘴，防止茶渣堵塞。' },
    { title: '茶夾', desc: '夾取茶杯防燙衛生，或清理茶渣。' },
    { title: '茶筒', desc: '收納上述五件工具，整潔有序。' },
  ]
</script>

<style scoped>
  .font-serif {
    font-family: 'Noto Serif TC', serif !important;
  }

  .leading-loose {
    line-height: 2 !important;
  }

  .tool-number {
    width: 28px;
    height: 28px;
    background-color: #8d6e63;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 0.8rem;
  }

  .color-brown-dark {
    color: #4e342e;
  }

  .teaware-footer {
    background-color: #fdfaf8;
    border: 1px solid #efebe9;
  }

  /* 讓圖片在行動裝置上也能保持比例 */
  @media (max-width: 960px) {
    .text-h3 {
      font-size: 2.5rem !important;
    }
  }
</style>
