<template>
  <v-container class="six-tea-page py-12">
    <v-row class="mb-12 align-center" justify="center">
      <v-col class="text-md-right text-center" cols="12" md="4">
        <h1 class="text-h3 font-weight-bold font-serif color-primary tea-title-vertical">
          六色<br class="d-none d-md-block" />茶韻
        </h1>
      </v-col>

      <v-col class="d-none d-md-flex justify-center" cols="12" md="1">
        <v-divider color="#C19A6B" style="height: 100px" thickness="2" vertical></v-divider>
      </v-col>

      <v-col class="text-md-left text-center" cols="12" md="5">
        <p class="text-body-1 leading-loose text-grey-darken-2 font-serif">
          茶湯的顏色，從翠綠如春，到深褐如陳年歲月，<br />
          藏著發酵的秘密與大自然的詩意。<br />
          每一種顏色都是一段獨特的旅程。
        </p>
      </v-col>
    </v-row>

    <v-row class="align-stretch">
      <v-col v-for="tea in teaCategories" :key="tea.id" class="mb-6 d-flex" cols="12" lg="4" sm="6">
        <v-hover v-slot="{ isHovering, props }">
          <v-card
            v-bind="props"
            class="tea-card h-100 d-flex flex-column rounded-xl overflow-hidden"
            :elevation="isHovering ? 8 : 2"
          >
            <v-img class="align-end text-white" cover height="220" :src="tea.image">
              <div class="pa-4 bg-gradient-overlay">
                <span class="text-overline font-weight-bold">{{ tea.fermentation }}</span>
              </div>
            </v-img>

            <v-card-item>
              <template #prepend>
                <v-icon class="me-2" :color="tea.darkColor" size="large">{{ tea.icon }}</v-icon>
              </template>
              <v-card-title
                class="text-h5 font-weight-bold font-serif"
                :style="{ color: tea.darkColor }"
              >
                {{ tea.name }}
              </v-card-title>
            </v-card-item>

            <v-card-text class="flex-grow-1 d-flex flex-column tea-content-body">
              <div class="d-flex align-center mb-2">
                <v-icon class="me-2" color="brown-lighten-1" size="small">mdi-palette</v-icon>
                <span class="text-body-2 d-flex align-center">湯色：{{ tea.soupColor }}</span>
              </div>

              <div class="d-flex align-start mb-4">
                <v-icon class="me-2 mt-1" color="brown-lighten-1" size="small">mdi-hammer-wrench</v-icon>
                <span class="text-body-2 text-grey-darken-2 flex-grow-1 leading-normal">
                  {{ tea.process }}
                </span>
              </div>

              <v-sheet
                class="pa-3 rounded-lg mb-4 bg-grey-lighten-4 key-point-box"
                style="border-left: 4px solid #c19a6b"
              >
                <div class="d-flex align-center mb-1">
                  <v-icon class="me-1" color="#C19A6B" size="small">mdi-star-circle</v-icon>
                  <span class="text-caption font-weight-bold text-brown-darken-2">關鍵工藝</span>
                </div>
                <div class="text-body-2 text-grey-darken-3 font-weight-medium">
                  {{ tea.keyPoint }}
                </div>
              </v-sheet>

              <div class="d-flex flex-wrap gap-1 mt-auto">
                <v-chip
                  v-for="item in tea.varieties"
                  :key="item"
                  class="text-white opacity-90"
                  :color="tea.darkColor"
                  size="x-small"
                  variant="flat"
                >
                  {{ item }}
                </v-chip>
              </div>
            </v-card-text>

            <v-divider class="mx-4"></v-divider>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>

    <v-row class="mt-16">
      <v-col cols="12">
        <v-card class="pa-8 rounded-xl shadow-leaf" color="#2D3E33" theme="dark">
          <v-card-title class="text-h4 text-center mb-8 font-weight-bold color-gold font-serif">
            六色茶韻的溫柔陪伴
          </v-card-title>
          <v-row>
            <v-col v-for="benefit in teaHealthData" :key="benefit.teaName" cols="12" lg="4" sm="6">
              <v-card border class="h-100 pa-4" color="rgba(255,255,255,0.08)" variant="flat">
                <div class="d-flex align-center mb-3">
                  <v-avatar class="me-3" :color="benefit.color" size="32"></v-avatar>
                  <span class="text-h6">{{ benefit.teaName }}</span>
                </div>
                <div class="text-body-2 mb-2 text-amber-lighten-4">
                  <v-icon class="me-1" size="x-small">mdi-sparkles</v-icon>{{ benefit.effect }}
                </div>
                <div class="text-caption text-grey-lighten-1">
                  <v-icon class="me-1" size="x-small">mdi-account-check</v-icon>
                  適合：{{ benefit.person }}
                </div>
              </v-card>
            </v-col>
          </v-row>
          <div class="text-center mt-12">
            <p class="text-h6 mb-6 font-italic font-serif">「慢下來，好茶自來。」</p>
            <v-btn
              class="px-10 rounded-pill font-weight-bold"
              color="#C19A6B"
              size="x-large"
              to="/products"
            >
              選購優質好茶
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { ref } from 'vue'
  import blackTeaImg from '@/assets/blackTea.webp'
  import darkTeaImg from '@/assets/darkTea.webp'
  import greenTeaImg from '@/assets/greenTea.webp'
  import oolongTeaImg from '@/assets/oolongTea.webp'
  import whiteTeaImg from '@/assets/whiteTea.webp'
  import yellowTeaImg from '@/assets/yellowTea.webp'

  const teaCategories = ref([
    {
      id: 'green',
      name: '綠茶 (不發酵)',
      darkColor: '#2E7D32',
      icon: 'mdi-leaf',
      fermentation: '不發酵茶 (0%)',
      image: greenTeaImg,
      process: '採菁 → 殺菁 → 揉捻 → 乾燥',
      keyPoint: '殺菁：以高溫破壞酵素活性，保持茶葉鮮綠與原始豆香。',
      soupColor: '碧綠、黃綠、嫩黃',
      varieties: ['西湖龍井', '洞庭碧螺春', '黃山毛峰', '日式抹茶'],
    },
    {
      id: 'white',
      name: '白茶 (微發酵)',
      darkColor: '#757575',
      icon: 'mdi-cloud-outline',
      fermentation: '5-15% 微發酵茶',
      image: whiteTeaImg,
      process: '採菁 → 萎凋 → 乾燥',
      keyPoint: '萎凋：不揉不炒，僅透過長時間日光或自然風乾，保留毫香。',
      soupColor: '淺杏黃、象牙白',
      varieties: ['白毫銀針', '白牡丹', '壽眉'],
    },
    {
      id: 'yellow',
      name: '黃茶 (輕發酵)',
      darkColor: '#F57F17',
      icon: 'mdi-shimmer',
      fermentation: '10-20% 輕發酵茶',
      image: yellowTeaImg,
      process: '採菁 → 殺菁 → 悶黃 → 揉捻 → 乾燥',
      keyPoint: '悶黃：關鍵工序。在濕熱下靜置使葉片黃變，口感甜順無苦澀。',
      soupColor: '明亮黃、杏黃',
      varieties: ['君山銀針', '蒙頂黃芽', '霍山黃芽'],
    },
    {
      id: 'oolong',
      name: '青茶 (半發酵)',
      darkColor: '#00695C',
      icon: 'mdi-waves',
      fermentation: '10-80% 半發酵茶',
      image: oolongTeaImg,
      process: '採菁 → 萎凋 → 浪菁 → 殺菁 → 揉捻 → 乾燥 → 烘焙',
      keyPoint: '浪菁：藉由翻動摩擦使葉緣氧化，產生獨特的「綠葉紅鑲邊」。',
      soupColor: '蜜綠、金黃、琥珀',
      varieties: ['鐵觀音', '大紅袍', '凍頂烏龍', '高山茶'],
    },
    {
      id: 'black',
      name: '紅茶 (全發酵)',
      darkColor: '#C62828',
      icon: 'mdi-fire',
      fermentation: '80-100% 全發酵茶',
      image: blackTeaImg,
      process: '採菁 → 萎凋 → 揉捻 → 發酵 → 乾燥',
      keyPoint: '全發酵：使多酚類完全氧化，轉化出艷麗紅湯與濃郁蜜果香。',
      soupColor: '艷紅、橙紅、深紅',
      varieties: ['祁門紅茶', '台茶18號紅玉', '金駿眉'],
    },
    {
      id: 'dark',
      name: '黑茶 (後發酵)',
      darkColor: '#212121',
      icon: 'mdi-clock-outline',
      fermentation: '100% 後發酵茶',
      image: darkTeaImg,
      process: '採菁 → 殺菁 → 揉捻 → 渥堆 → 乾燥',
      keyPoint: '渥堆：利用微生物進行後發酵，賦予茶湯醇厚質感與獨特陳香。',
      soupColor: '褐紅、酒紅、深褐',
      varieties: ['雲南普洱(熟茶)', '安化黑茶', '六堡茶'],
    },
  ])

  const teaHealthData = ref([
    { teaName: '綠茶', color: '#81C784', effect: '抗氧化、提升注意力', person: '壓力大的工作族' },
    {
      teaName: '白茶',
      color: '#E0E0E0',
      effect: '溫和抗炎、護心血管',
      person: '不耐刺激的中高齡者',
    },
    { teaName: '黃茶', color: '#FFF176', effect: '清熱解毒、助消化', person: '容易胃火旺盛者' },
    { teaName: '青茶/烏龍', color: '#4DB6AC', effect: '促進代謝、去油膩', person: '欲維持體態者' },
    { teaName: '紅茶', color: '#E57373', effect: '溫和提神、護心胃', person: '手腳冰冷、胃較弱者' },
    {
      teaName: '黑茶',
      color: '#424242',
      effect: '代謝調理、血糖平穩',
      person: '飲食油膩、應酬多者',
    },
  ])
</script>

<style scoped>
  .font-serif {
    font-family: 'Noto Serif TC', serif !important;
  }

  .tea-title-vertical {
    line-height: 1.2;
    color: #2d3e33;
    letter-spacing: 8px;
  }

  .color-primary {
    color: #2d3e33;
  }

  .color-gold {
    color: #c19a6b !important;
  }

  .tea-card {
    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  /* 統一高度 */
  .tea-content-body {
    min-height: 230px;
  }

  .leading-normal {
    line-height: 1.5 !important;
  }

  .key-point-box {
    min-height: 95px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .bg-gradient-overlay {
    background: linear-gradient(to top, rgba(45, 62, 51, 0.9), transparent);
    width: 100%;
  }

  .gap-1 {
    gap: 4px;
  }

  .v-card:hover .v-img :deep(img) {
    transform: scale(1.08);
  }

  .shadow-leaf {
    box-shadow: 0 10px 30px rgba(45, 62, 51, 0.2) !important;
  }

  .leading-loose {
    line-height: 2 !important;
  }
</style>
