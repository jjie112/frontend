<template>
  <v-footer class="custom-footer py-12">
    <v-container>
      <v-row>
        <v-col cols="12" md="4">
          <h2 class="text-h5 font-weight-bold mb-4 footer-logo" @click="$router.push('/')">
            🍵 緩慢茶事
          </h2>
          <p class="text-body-2 footer-desc">
            我們致力於尋找台灣最純粹的茶香。從茶園到茶杯，每一道工序都承載著茶農的匠心與堅持。
          </p>
          <div class="mt-6">
            <v-btn color="#C19A6B" icon="mdi-facebook" variant="text"></v-btn>
            <v-btn color="#C19A6B" icon="mdi-instagram" variant="text"></v-btn>
            <v-btn color="#C19A6B" icon="mdi-line" variant="text"></v-btn>
          </div>
        </v-col>

        <v-col cols="12" md="2" sm="6">
          <h3 class="footer-title mb-4">關於我們</h3>
          <v-list bg-color="transparent" class="footer-list" density="compact" nav>
            <v-list-item title="茶的故事" @click="$router.push('/about')"></v-list-item>
            <v-list-item title="茶品介紹" @click="$router.push('/types')"></v-list-item>
            <v-list-item title="製茶工藝" @click="$router.push('/process')"></v-list-item>
          </v-list>
        </v-col>

        <v-col class="ml-auto" cols="12" md="4">
          <h3 class="footer-title mb-4">聯絡我們</h3>
          <v-list bg-color="transparent" class="contact-list" density="compact">
            <v-list-item prepend-icon="mdi-phone" title="02-2345-6789"></v-list-item>
            <v-list-item prepend-icon="mdi-email" title="service@slowtea.com"></v-list-item>
            <v-list-item prepend-icon="mdi-map-marker" title="新北市泰山區貴子里"></v-list-item>
          </v-list>
        </v-col>
      </v-row>
      <v-divider class="my-8 footer-divider"></v-divider>
      <div class="text-center text-caption opacity-60">
        © {{ new Date().getFullYear() }} 緩慢茶事 All rights reserved.
      </div>
    </v-container>
  </v-footer>
</template>

<style scoped>
  .custom-footer {
    background-color: #2d3e33 !important;
    color: #f9f7f2 !important;
  }

  .footer-logo {
    color: #c19a6b;
    cursor: pointer;
    letter-spacing: 2px;
  }

  .footer-title {
    color: #f9f7f2;
    font-size: 1.1rem;
    border-bottom: 1px solid rgba(193, 154, 107, 0.3);
    padding-bottom: 5px;
    display: inline-block;
  }

  .footer-desc {
    color: rgba(249, 247, 242, 0.7);
    line-height: 2;
  }

  .footer-list :deep(.v-list-item-title),
  .contact-list :deep(.v-list-item-title) {
    font-family: 'Noto Serif TC', serif !important;
    transition: 0.3s;
  }

  .custom-footer,
  .footer-logo,
  .footer-desc {
    font-family: 'Noto Serif TC', serif !important;
  }

  .footer-list :deep(.v-list-item:hover .v-list-item-title) {
    color: #c19a6b !important;
    transform: translateX(5px);
  }

  .contact-list :deep(.v-icon) {
    color: #c19a6b !important;
  }

  .footer-divider {
    border-color: rgba(193, 154, 107, 0.2) !important;
  }
</style>
