<template>
  <v-container class="fill-height login-bg">
    <v-row align="center" justify="center">
      <v-col cols="12" lg="4" md="5" sm="8">
        <div class="text-center mb-8">
          <v-icon class="mb-2" color="green-darken-3" icon="mdi-leaf" size="x-large"></v-icon>
          <h2 class="text-h4 font-weight-black color-tea-green font-serif">茶事選物</h2>
          <p class="text-subtitle-2 text-grey-darken-1 mt-2">一盞茶的時間，與美好不期而遇</p>
        </div>

        <v-card class="pa-8 rounded-xl border shadow-24" elevation="0">
          <v-card-title class="text-h5 font-weight-bold text-center color-tea-green mb-6">
            會員登入
          </v-card-title>

          <v-form @submit.prevent="handleLogin">
            <v-text-field
              v-model="form.account"
              class="mb-3 custom-input"
              color="green-darken-3"
              label="帳號或電子信箱"
              placeholder="請輸入帳號或 Email"
              prepend-inner-icon="mdi-account-outline"
              rounded="lg"
              :rules="[(v) => !!v || '請輸入帳號或 Email']"
              variant="outlined"
            ></v-text-field>

            <v-text-field
              v-model="form.password"
              class="mb-4 custom-input"
              color="green-darken-3"
              label="密碼"
              prepend-inner-icon="mdi-lock-outline"
              rounded="lg"
              :rules="[(v) => !!v || '請輸入密碼']"
              type="password"
              variant="outlined"
            ></v-text-field>

            <v-btn
              block
              class="rounded-pill font-weight-bold mb-4"
              color="green-darken-3"
              elevation="0"
              :loading="loading"
              size="x-large"
              type="submit"
            >
              進入茶事
            </v-btn>

            <div class="d-flex align-center my-6">
              <v-divider class="border-opacity-25"></v-divider>
              <span
                class="mx-4 text-caption text-grey-darken-1 flex-shrink-0"
                style="white-space: nowrap"
              >
                初次來訪？
              </span>
              <v-divider class="border-opacity-25"></v-divider>
            </div>

            <v-btn
              block
              class="rounded-pill font-weight-bold"
              color="brown-darken-1"
              to="/register"
              variant="outlined"
            >
              註冊新帳號
            </v-btn>
          </v-form>
        </v-card>

        <div class="text-center mt-10">
          <v-btn color="grey" size="small" to="/" variant="text">返回首頁</v-btn>
        </div>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" location="top" timeout="2000">
      {{ snackbar.text }}
      <template #actions>
        <v-btn variant="text" @click="snackbar.show = false">關閉</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
  import { ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import api from '@/composables/api'
  import { useUserStore } from '@/stores/user'

  const userStore = useUserStore()
  const router = useRouter()
  const route = useRoute()

  const form = ref({ account: '', password: '' })
  const loading = ref(false)

  const snackbar = ref({
    show: false,
    text: '',
    color: 'success',
  })

  const handleLogin = async () => {
    if (!form.value.account || !form.value.password) return
    loading.value = true
    try {
      const { data } = await api.post('/users/login', form.value)
      if (data.success) {
        userStore.login(data.data)
        snackbar.value = {
          show: true,
          text: '歡迎回來，' + data.data.user.account,
          color: 'success',
        }
        setTimeout(() => {
          const redirectPath = route.query.redirect || '/'
          router.push(redirectPath)
        }, 1200)
      }
    } catch (error) {
      snackbar.value = {
        show: true,
        text: error.response?.data?.message || '登入失敗，帳號或密碼錯誤',
        color: 'error',
      }
    } finally {
      loading.value = false
    }
  }
</script>

<style scoped>
  /* 導入與其他頁面一致的字體 */
  .font-serif {
    font-family: 'Noto Serif TC', serif !important;
  }

  .color-tea-green {
    color: #2d3e33;
  }

  /* 輸入框微調 */
  .custom-input :deep(.v-field__outline) {
    --v-field-border-opacity: 0.15;
  }

  .custom-input :deep(.v-field--focused .v-field__outline) {
    --v-field-border-opacity: 1;
  }

  /* 卡片陰影 */
  .shadow-24 {
    box-shadow: 0 10px 40px rgba(45, 62, 51, 0.1) !important;
  }

  .rounded-xl {
    border-radius: 24px !important;
  }
</style>

<route lang="yaml">
meta:
  title: '會員登入'
  login: no-login-only
</route>
