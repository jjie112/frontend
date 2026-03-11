<template>
  <v-container class="py-10">
    <v-row class="mb-12" justify="center">
      <v-col class="text-center py-10 position-relative" cols="12">
        <div class="journey-watermark">THE JOURNEY</div>
        <div class="position-relative" style="z-index: 2">
          <h1 class="text-h3 font-weight-bold tea-main-title mb-4">製茶之旅</h1>
          <v-chip class="mb-6 px-6" color="brown-darken-1" variant="outlined">
            一葉從山野到杯中的蛻變
          </v-chip>
          <v-responsive class="mx-auto" max-width="800">
            <p class="text-h6 font-serif leading-loose text-grey-darken-3 px-4">
              從採摘到乾燥，12 道嚴謹工序，是匠人對風味的執著。每一道關卡都決定了茶湯最終的靈魂。
            </p>
          </v-responsive>
          <div class="scroll-line mt-8"></div>
        </div>
      </v-col>
    </v-row>

    <v-timeline
      align="start"
      class="custom-process-timeline"
      line-color="brown-lighten-3"
      line-thickness="2"
      side="end"
    >
      <v-timeline-item
        v-for="(step, index) in steps"
        :key="index"
        :dot-color="index % 2 === 0 ? 'brown-darken-1' : 'brown-lighten-1'"
        size="small"
      >
        <template #opposite>
          <div class="text-h2 font-weight-black timeline-num">0{{ index + 1 }}</div>
        </template>

        <v-hover v-slot="{ isHovering, props }">
          <v-card
            v-bind="props"
            class="step-card rounded-xl mb-8 transition-swing overflow-hidden"
            :elevation="isHovering ? 8 : 1"
          >
            <v-row class="fill-height" no-gutters>
              <v-col cols="12" sm="4">
                <v-img :alt="step.title" class="h-100" cover height="220" :src="step.img">
                  <template #placeholder>
                    <v-row align="center" class="fill-height ma-0" justify="center">
                      <v-progress-circular
                        color="brown-lighten-4"
                        indeterminate
                      ></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
              </v-col>

              <v-col class="d-flex align-center" cols="12" sm="8">
                <div class="pa-8">
                  <h3 class="text-h5 font-weight-bold mb-3 font-serif color-tea-green">
                    {{ step.title }}
                  </h3>
                  <p class="text-body-1 text-grey-darken-2 font-serif leading-relaxed">
                    {{ step.desc }}
                  </p>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-hover>
      </v-timeline-item>
    </v-timeline>

    <v-card class="pa-10 rounded-xl bg-grey-lighten-4 mt-16" elevation="0">
      <h3 class="text-h5 font-weight-bold mb-8 text-center font-serif">工藝圖：六大茶系之別</h3>
      <v-row>
        <v-col v-for="tea in teaTypes" :key="tea.name" cols="12" md="4" sm="6">
          <v-card class="pa-4 bg-white rounded-lg border-s-lg border-brown h-100" variant="flat">
            <div class="text-subtitle-1 font-weight-bold mb-2">{{ tea.name }}</div>
            <div class="text-caption text-grey-darken-1">{{ tea.process }}</div>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <v-row class="mt-16" justify="center">
      <v-col cols="12" md="10">
        <v-card
          class="pa-12 text-center rounded-xl footer-gradient position-relative overflow-hidden"
          elevation="10"
          theme="dark"
        >
          <div class="footer-watermark">CRAFT</div>
          <v-card-text class="position-relative" style="z-index: 2">
            <h2 class="text-h4 font-weight-bold mb-6 font-serif">從深山到案頭，只為這一口醇香</h2>
            <v-responsive class="mx-auto" max-width="700">
              <p class="text-h6 font-serif mb-10 opacity-80 leading-loose">
                這 12 道工序，是時間與溫度的淬鍊，更是匠人指尖的溫暖。<br />
                每一葉乾茶，都縮影了山川的靈氣與職人的心意。<br />
                現在，就讓這份跨越千里的製茶工藝，走入您的日常。
              </p>
            </v-responsive>
            <v-btn
              append-icon="mdi-arrow-right"
              class="px-12 py-4 text-brown-darken-3 font-weight-bold"
              color="white"
              elevation="6"
              rounded="pill"
              size="x-large"
              to="/products"
            >
              挑選職人手作茶
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  const getAssetUrl = (name) => {
    return new URL(`../assets/${name}`, import.meta.url).href
  }

  const steps = [
    {
      title: '採菁',
      desc: '手工或機械採摘枝頭嫩芽，這是決定茶葉風味與品質分級的關鍵第一步。',
      img: getAssetUrl('01.webp'),
    },
    {
      title: '日光萎凋',
      desc: '藉由陽光熱能均勻散失水分，觸發葉片生化變化，為茶湯注入初步清香。',
      img: getAssetUrl('02.webp'),
    },
    {
      title: '室內萎凋',
      desc: '在靜置中讓水分平衡分佈，促進葉內質轉化，逐步發展出層次分明的滋味。',
      img: getAssetUrl('03.webp'),
    },
    {
      title: '浪菁/攪拌',
      desc: '翻動使葉緣摩擦破損以帶動氧化，喚醒迷人的花果香氣，決定風味走向。',
      img: getAssetUrl('04.webp'),
    },
    {
      title: '殺菁',
      desc: '以高溫釜炒破壞酵素活性，停止發酵過程，鎖住茶葉當下的鮮亮色澤與特徵。',
      img: getAssetUrl('05.webp'),
    },
    {
      title: '悶黃',
      desc: '黃茶特有工序，在熱濕狀態下讓葉片自然變黃，使口感更加甜潤、溫和不澀。',
      img: getAssetUrl('06.webp'),
    },
    {
      title: '回潤',
      desc: '殺菁後讓茶葉靜置回軟，吸收周圍微量水分，增加葉片韌性以便於後續揉捻。',
      img: getAssetUrl('07.webp'),
    },
    {
      title: '揉捻',
      desc: '捲縮葉片並破壞細胞組織，使茶汁附著於葉表，確保沖泡時能快速釋放風味。',
      img: getAssetUrl('08.webp'),
    },
    {
      title: '發酵',
      desc: '紅茶核心技術，讓多酚類完全氧化，成就其艷麗紅潤的湯色與醇厚蜜香味。',
      img: getAssetUrl('09.webp'),
    },
    {
      title: '渥堆',
      desc: '黑茶關鍵工序，在濕熱環境中進行長期後發酵，轉化出醇厚且獨有的陳香。',
      img: getAssetUrl('10.webp'),
    },
    {
      title: '乾燥',
      desc: '將水分降至 5% 以下鎖住精華，讓茶葉轉為穩定狀態，確保風味能長期保存。',
      img: getAssetUrl('11.webp'),
    },
    {
      title: '烘焙',
      desc: '最後火候的淬鍊，蒸發剩餘水分並穩定品質，賦予茶葉溫潤迷人的焙火層次。',
      img: getAssetUrl('12.webp'),
    },
  ]

  const teaTypes = [
    { name: '綠茶', process: '採菁 → 殺菁 → 揉捻 → 乾燥' },
    { name: '白茶', process: '採菁 → 萎凋 → 乾燥' },
    { name: '黃茶', process: '採菁 → 殺菁 → 悶黃 → 揉捻 → 乾燥' },
    { name: '青茶', process: '採菁 → 萎凋 → 浪菁 → 殺菁 → 揉捻 → 乾燥 → 烘焙' },
    { name: '紅茶', process: '採菁 → 萎凋 → 揉捻 → 發酵 → 乾燥' },
    { name: '黑茶', process: '採菁 → 殺菁 → 揉捻 → 渥堆 → 乾燥' },
  ]
</script>

<style scoped>
  .font-serif {
    font-family: 'Noto Serif TC', serif !important;
  }

  .color-tea-green {
    color: #2d3e33;
  }

  /* 統一卡片寬度：設定固定寬度 800px */
  .step-card {
    width: 800px;
    max-width: 100%;
    border: 1px solid #f0f0f0;
    background-color: #ffffff; /* 改為純白更俐落 */
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  /* 統一卡片文字區塊高度 */
  .step-card .pa-8 {
    min-height: 220px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .step-card:hover {
    transform: translateY(-8px);
  }

  /* 讓 Timeline Item 主體不被壓縮並置中 */
  :deep(.v-timeline-item__body) {
    flex: none !important;
    align-self: center;
  }

  .timeline-num {
    color: rgba(80, 60, 55, 0.08);
    font-family: 'Georgia', serif;
  }

  .tea-main-title {
    color: #2d3e33;
    letter-spacing: 6px;
    font-family: 'Noto Serif TC', serif;
  }

  .journey-watermark {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: clamp(4rem, 15vw, 12rem);
    font-weight: 900;
    color: rgba(62, 39, 35, 0.03);
    white-space: nowrap;
    letter-spacing: 30px;
    z-index: 1;
    pointer-events: none;
  }

  .scroll-line {
    width: 1px;
    height: 100px;
    margin: 0 auto;
    background: linear-gradient(to bottom, #8d6e63, transparent);
    animation: drip 2s infinite ease-in-out;
  }

  @keyframes drip {
    0% {
      transform: scaleY(0.5);
      opacity: 0;
      transform-origin: top;
    }
    50% {
      transform: scaleY(1);
      opacity: 1;
    }
    100% {
      transform: scaleY(0.5);
      opacity: 0;
      transform-origin: bottom;
    }
  }

  .border-brown {
    border-left: 4px solid #8d6e63 !important;
  }

  .footer-gradient {
    background: linear-gradient(135deg, #2d3e33 0%, #4e342e 100%) !important;
  }

  .footer-watermark {
    position: absolute;
    bottom: -20px;
    right: -20px;
    font-size: 12rem;
    font-weight: 900;
    color: rgba(255, 255, 255, 0.05);
    font-family: 'Georgia', serif;
  }

  .leading-loose {
    line-height: 2 !important;
  }

  .opacity-80 {
    opacity: 0.8;
  }

  /* RWD 適應 */
  @media (max-width: 960px) {
    .step-card {
      width: 100%;
    }
    :deep(.v-timeline-item__body) {
      align-self: stretch;
    }
  }
</style>
