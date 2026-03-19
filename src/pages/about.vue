<template>
  <v-container class="tea-history-page py-12">
    <v-row class="mb-16" justify="center">
      <v-col class="text-center" cols="12" lg="9" md="11">
        <span class="text-overline color-gold font-weight-bold letter-spacing-2">
          SINCE ANCIENT TIMES</span>

        <h1 class="text-h3 font-weight-bold mt-2 mb-8 tea-title">茶文化的起源與發展</h1>

        <v-sheet class="pa-8 pa-md-12 rounded-be-xl rounded-ts-xl introduction-box" elevation="0">
          <v-icon class="quote-icon-left" color="#C19A6B" size="48">mdi-format-quote-open</v-icon>

          <p class="text-h6 leading-loose text-grey-darken-3 px-md-10 font-serif">
            茶，不僅是一種飲品，更是中華文明中最溫柔的陪伴與哲學。<br class="d-none d-md-block" />
            從神農嚐百草的傳說到現代生活的創新，茶文化跨越千年，藏著人與自然的對話。
          </p>

          <v-icon class="quote-icon-right" color="#C19A6B" size="48">mdi-format-quote-close</v-icon>
        </v-sheet>
      </v-col>
    </v-row>

    <v-timeline
      align="start"
      class="custom-timeline"
      :density="$vuetify.display.smAndDown ? 'comfortable' : 'default'"
      side="end"
    >
      <v-timeline-item dot-color="green-darken-2" size="small">
        <template #opposite>
          <div class="text-h5 font-weight-bold text-green-darken-3">上古傳說</div>
        </template>
        <v-hover v-slot="{ isHovering, props }">
          <v-card
            v-bind="props"
            class="history-card rounded-xl overflow-hidden transition-swing d-flex flex-column h-100"
            :elevation="isHovering ? 8 : 2"
          >
            <v-img cover height="300" src="../assets/Origin.webp">
              <v-expand-transition>
                <div
                  v-if="isHovering"
                  class="d-flex transition-fast-in-fast-out bg-green-darken-4 v-card--reveal text-white"
                  style="height: 100%; opacity: 0.8"
                >
                  <div class="pa-6 text-body-1 font-serif">
                    神農嚐百草，日遇七十二毒，得荼而解之。
                  </div>
                </div>
              </v-expand-transition>
            </v-img>
            <div class="fixed-card-content">
              <v-card-item>
                <v-chip class="mb-2" color="green-darken-2" size="small" variant="tonal">起源｜從藥用到飲品</v-chip>
                <v-card-title class="text-h6 font-weight-bold">神農時代：茶的序幕</v-card-title>
                <v-card-text class="text-body-2 text-grey-darken-2 line-clamp-desc">
                  茶的歷史可追溯至數千年前。相傳神農氏在嚐百草時發現茶葉煮水能解毒，揭開了茶的序幕。早期主要作為清熱解毒的藥用植物。
                </v-card-text>
              </v-card-item>
            </div>
          </v-card>
        </v-hover>
      </v-timeline-item>

      <v-timeline-item dot-color="brown-lighten-1" size="small">
        <template #opposite>
          <div class="text-h5 font-weight-bold text-brown">魏晉南北朝</div>
        </template>
        <v-card class="history-card rounded-xl elevation-2 d-flex flex-column h-100">
          <v-img cover height="300" src="../assets/sixDynasties.webp"></v-img>
          <div class="fixed-card-content">
            <v-card-item>
              <v-chip class="mb-2" color="brown-lighten-1" size="small" variant="tonal">形成｜文人與禪意</v-chip>
              <v-card-title class="text-h6 font-weight-bold">魏晉：清淡守志的風骨</v-card-title>
              <v-card-text class="text-body-2 text-grey-darken-2 line-clamp-desc">
                茶逐漸從藥用轉為飲用，並與文人談玄及佛教修行結合。飲茶象徵清淨、內省，奠定了茶文化的精神基礎。
              </v-card-text>
            </v-card-item>
          </div>
        </v-card>
      </v-timeline-item>

      <v-timeline-item dot-color="amber-darken-3" size="small">
        <template #opposite>
          <div class="text-h5 font-weight-bold text-amber-darken-4">唐代</div>
        </template>
        <v-card class="history-card rounded-xl elevation-2 d-flex flex-column h-100">
          <v-img cover height="300" src="../assets/tangDynasty.webp"></v-img>
          <div class="fixed-card-content">
            <v-card-item>
              <v-chip class="mb-2" color="amber-darken-3" size="small" variant="tonal">成熟｜茶聖陸羽</v-chip>
              <v-card-title class="text-h6 font-weight-bold">唐代：全民飲茶的盛世</v-card-title>
              <v-card-text class="text-body-2 text-grey-darken-2 line-clamp-desc">
                陸羽撰寫《茶經》，系統性地規範了製茶與飲茶藝術。茶從貴族走向民間，茶道精神正式確立。
              </v-card-text>
            </v-card-item>
          </div>
        </v-card>
      </v-timeline-item>

      <v-timeline-item dot-color="teal-darken-1" size="small">
        <template #opposite>
          <div class="text-h5 font-weight-bold text-teal-darken-3">宋代</div>
        </template>
        <v-card class="history-card rounded-xl elevation-2 d-flex flex-column h-100">
          <v-img cover height="300" src="../assets/songDynasty.webp"></v-img>
          <div class="fixed-card-content">
            <v-card-item>
              <v-chip class="mb-2" color="teal-darken-1" size="small" variant="tonal">巔峰｜極致美學</v-chip>
              <v-card-title class="text-h6 font-weight-bold">宋代：點茶與鬥茶之樂</v-card-title>
              <v-card-text class="text-body-2 text-grey-darken-2 line-clamp-desc">
                飲茶成為一種融合審美、社交與生活品味的頂級藝術。點茶技法與精緻建盞，展現了宋人雅致的生活美學。
              </v-card-text>
            </v-card-item>
          </div>
        </v-card>
      </v-timeline-item>

      <v-timeline-item dot-color="brown-darken-3" size="small">
        <template #opposite>
          <div class="text-h5 font-weight-bold text-brown-darken-4">明朝至現代</div>
        </template>
        <v-card class="history-card rounded-xl elevation-2 d-flex flex-column h-100">
          <v-img cover height="300" src="../assets/mingDynastyNow.webp"></v-img>
          <div class="fixed-card-content">
            <v-card-item>
              <v-chip class="mb-2" color="brown-darken-3" size="small" variant="tonal">轉變｜散茶與世界</v-chip>
              <v-card-title class="text-h6 font-weight-bold">明代以降：回歸生活本味</v-card-title>
              <v-card-text class="text-body-2 text-grey-darken-2 line-clamp-desc">
                明代廢團茶改散茶，奠定了現代沖泡方式。隨後茶葉出口全球，六大茶類定型，成為連結世界的文化語言。
              </v-card-text>
            </v-card-item>
          </div>
        </v-card>
      </v-timeline-item>
    </v-timeline>

    <v-row class="mt-16" justify="center">
      <v-col cols="12" md="10">
        <v-sheet
          class="pa-10 text-center rounded-xl border-dashed"
          color="brown-lighten-5"
          elevation="0"
          style="border: 2px dashed #8d6e63"
        >
          <h2 class="text-h4 font-weight-bold brown--text mb-6">續寫一杯茶的故事</h2>
          <p class="text-body-1 mb-8 text-brown-darken-1">
            千年來，茶始終靜靜陪伴。今天，茶依然在我們手中，療癒忙碌的靈魂。<br />
            讓我們一起，把這份千年靜心帶進生活。
          </p>
          <v-btn
            class="px-10 rounded-pill elevation-4"
            color="brown-darken-2"
            prepend-icon="mdi-tea"
            size="x-large"
            to="/products"
          >
            品一杯千年好茶
          </v-btn>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
  .introduction-box {
    background-color: #ffffff !important;
    border: 1px solid rgba(193, 154, 107, 0.3);
    position: relative;
  }

  .color-gold {
    color: #c19a6b;
  }

  .letter-spacing-2 {
    letter-spacing: 4px;
  }

  .font-serif {
    font-family: 'Noto Serif TC', serif !important;
  }

  .quote-icon-left {
    position: absolute;
    top: 10px;
    left: 10px;
    opacity: 0.2;
  }

  .quote-icon-right {
    position: absolute;
    bottom: 10px;
    right: 10px;
    opacity: 0.2;
  }

  .tea-title {
    color: #2d3e33;
    text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.05);
    font-family: 'Noto Serif TC', serif;
  }

  .transition-swing {
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  /* 統一卡片寬度：調大至 600px */
  .history-card {
    width: 600px;
    max-width: 100%;
  }

  .fixed-card-content {
    min-height: 160px;
    display: flex;
    flex-direction: column;
    background: white;
  }

  .line-clamp-desc {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.8; /* 寬度變大，稍微增加行高更易閱讀 */
  }

  .v-card--reveal {
    align-items: center;
    bottom: 0;
    justify-content: center;
    position: absolute;
    width: 100%;
  }

  /* Timeline Item 佈局 */
  :deep(.v-timeline-item__body) {
    align-self: center; /* 改為置中，大卡片看起來更平衡 */
    flex: none !important;
  }

  @media (max-width: 1264px) {
    .history-card {
      width: 500px; /* 在中大螢幕稍微縮小一點避免擁擠 */
    }
  }

  @media (max-width: 960px) {
    .history-card {
      width: 100%;
    }
    :deep(.v-timeline-item__body) {
      align-self: stretch;
    }
  }

  @media (max-width: 600px) {
    .v-timeline-item__opposite {
      display: none;
    }
    .fixed-card-content {
      min-height: auto;
    }
  }
</style>
