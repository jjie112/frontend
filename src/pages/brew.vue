<template>
  <v-container class="py-10">
    <v-row class="mb-12" justify="center">
      <v-col cols="12" lg="8" md="10">
        <v-card class="pa-10 pa-md-16 rounded-be-xl rounded-ts-xl intro-card-zen" elevation="0">
          <div class="text-overline mb-2 text-brown-lighten-2 text-center">BREWING ART</div>
          <h1 class="text-h3 text-center font-weight-bold mb-8 color-zen-green font-serif">
            泡茶心法
          </h1>
          <v-divider
            class="mx-auto mb-8"
            color="brown-lighten-3"
            thickness="3"
            width="50"
          ></v-divider>
          <div class="text-h6 font-serif leading-loose text-grey-darken-2 text-center">
            泡茶，從來不是單純的加熱與浸泡，而是與茶葉的一場靜默對話。<br />
            水溫決定香氣，時間掌握平衡。
            <span class="text-brown-darken-2 font-weight-bold">
              用溫度，泡出一杯屬於自己的溫柔。</span>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="mb-10 pa-0 rounded-xl overflow-hidden border-brown-lighten-4" variant="outlined">
      <div class="bg-orange-lighten-5 pa-6 d-flex align-center">
        <v-icon class="mr-3" color="orange-darken-3" size="32">mdi-thermometer-high</v-icon>
        <div>
          <h2 class="text-h5 font-weight-bold mb-1">熱泡法：掌握溫度的藝術</h2>
          <p class="text-body-2 text-grey-darken-1 mb-0">發酵程度越輕的茶，越需要溫柔對待</p>
        </div>
      </div>

      <v-table class="brew-table" hover>
        <thead>
          <tr>
            <th class="text-center font-weight-bold" style="width: 15%">茶系</th>
            <th class="text-center font-weight-bold" style="width: 20%">建議水溫</th>
            <th class="text-center font-weight-bold" style="width: 20%">浸泡時間</th>
            <th class="font-weight-bold" style="width: 45%">沖泡重點</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in brewHot" :key="item.teaName">
            <td class="text-center font-weight-bold text-brown">{{ item.teaName }}</td>
            <td class="text-center">
              <v-chip
                class="font-weight-medium"
                color="orange-darken-4"
                size="small"
                variant="flat"
              >
                {{ item.waterTemperature }}
              </v-chip>
            </td>
            <td class="text-center text-body-2">{{ item.time }}</td>
            <td class="text-body-2 py-4 text-grey-darken-2">{{ item.keyElements }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <v-card class="mb-10 pa-0 rounded-xl overflow-hidden border-blue-lighten-4" variant="outlined">
      <div class="bg-blue-lighten-5 pa-6 d-flex align-center">
        <v-icon class="mr-3" color="blue-darken-3" size="32">mdi-snowflake</v-icon>
        <div>
          <h2 class="text-h5 font-weight-bold mb-1">冷泡法：時間萃取的溫柔美學</h2>
          <p class="text-body-2 text-grey-darken-1 mb-0">低溫慢萃，釋放茶葉最純粹的甘甜</p>
        </div>
      </div>

      <v-table class="brew-table" hover>
        <thead>
          <tr>
            <th class="text-center font-weight-bold" style="width: 15%">茶系</th>
            <th class="text-center font-weight-bold" style="width: 20%">建議水溫</th>
            <th class="text-center font-weight-bold" style="width: 20%">浸泡時間</th>
            <th class="font-weight-bold" style="width: 45%">沖泡重點</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in brewCold" :key="item.teaName">
            <td class="text-center font-weight-bold text-blue-darken-3">{{ item.teaName }}</td>
            <td class="text-center">
              <v-chip class="font-weight-medium" color="blue-darken-2" size="small" variant="flat">
                {{ item.waterTemperature }}
              </v-chip>
            </td>
            <td class="text-center text-body-2">{{ item.time }}</td>
            <td class="text-body-2 py-4 text-grey-darken-2">{{ item.keyElements }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <div class="text-center mt-12 pb-10">
      <v-btn
        class="px-10"
        color="brown-darken-2"
        elevation="4"
        prepend-icon="mdi-leaf"
        rounded="pill"
        size="x-large"
        to="/products"
      >
        選一包適合你的茶
      </v-btn>
    </div>
  </v-container>
</template>

<script setup>
  import { ref } from 'vue'

  const brewHot = ref([
    {
      teaName: '綠茶',
      waterTemperature: '70°C–80°C',
      time: '1–2 分鐘',
      keyElements: '避免沸水燙傷嫩葉產生苦澀。建議先倒水再放茶葉（下投法）。',
    },
    {
      teaName: '白茶',
      waterTemperature: '85°C–90°C',
      time: '3–5 分鐘',
      keyElements: '新茶水溫宜低，老白茶可用沸水甚至煮飲，風味更濃。',
    },
    {
      teaName: '黃茶',
      waterTemperature: '80°C–85°C',
      time: '2–3 分鐘',
      keyElements: '特有「悶黃」工藝，口感醇厚，適合用透明玻璃杯賞茶。',
    },
    {
      teaName: '青茶',
      waterTemperature: '90°C–98°C',
      time: '1 分鐘內',
      keyElements: '球型茶需先潤茶（洗茶）喚醒茶味，後續每泡增加 15 秒。',
    },
    {
      teaName: '紅茶',
      waterTemperature: '90°C–95°C',
      time: '3–5 分鐘',
      keyElements: '高水溫能激發果蜜香，建議蓋杯悶泡，避免香氣散失。',
    },
    {
      teaName: '黑茶',
      waterTemperature: '100°C',
      time: '1–2 分鐘',
      keyElements: '必須沸水沖泡並洗茶 1-2 次，去除陳味並利於茶質滲出。',
    },
  ])

  const brewCold = ref([
    {
      teaName: '綠茶',
      waterTemperature: '5°C–10°C',
      time: '4–8 小時',
      keyElements: '低溫抑制單寧酸釋放，口感極致清爽。',
    },
    {
      teaName: '白茶',
      waterTemperature: '5°C–10°C',
      time: '6–12 小時',
      keyElements: '白茶冷泡極為甘甜，適合在炎熱午後飲用。',
    },
    {
      teaName: '黃茶',
      waterTemperature: '5°C–10°C',
      time: '5–8 小時',
      keyElements: '青澀味在低溫中消失，轉化為溫潤的豆香。',
    },
    {
      teaName: '青茶',
      waterTemperature: '5°C–10°C',
      time: '8–12 小時',
      keyElements: '如為球型烏龍，建議先用少許熱水搖晃 10 秒再加冷水。',
    },
    {
      teaName: '紅茶',
      waterTemperature: '5°C–10°C',
      time: '6–10 小時',
      keyElements: '冷泡紅茶具有濃郁花果香，且完全不苦澀。',
    },
    {
      teaName: '黑茶',
      waterTemperature: '5°C–10°C',
      time: '10–24 小時',
      keyElements: '先用熱水快速洗茶後冷卻再冷泡，風味沉穩。',
    },
  ])
</script>

<style scoped>
  .font-serif {
    font-family: 'Noto Serif TC', serif !important;
  }

  .intro-card-zen {
    background: #ffffff;
    border: 1px solid #e0e0e0;
    box-shadow: 20px 20px 0px rgba(141, 110, 99, 0.05) !important;
  }

  .color-zen-green {
    color: #2d3e33;
  }

  .brew-table {
    /* 確保表格內容垂直居中 */
    :deep(td) {
      height: 72px !important;
      vertical-align: middle !important;
    }
  }

  .border-brown-lighten-4 {
    border: 1px solid #efebe9 !important;
  }

  .border-blue-lighten-4 {
    border: 1px solid #e3f2fd !important;
  }

  /* 移除預設的表格下劃線最後一條 */
  :deep(.v-table__wrapper) {
    border-radius: 0 0 16px 16px;
  }
</style>
