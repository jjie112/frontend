<template>
  <v-container class="fill-height login-bg">
    <v-row align="center" justify="center">
      <v-col cols="12" lg="4" md="5" sm="8">
        <div class="text-center mb-8">
          <v-icon
            class="mb-2"
            color="green-darken-3"
            icon="mdi-leaf-circle-outline"
            size="x-large"
          ></v-icon>
          <h2 class="text-h4 font-weight-black color-tea-green font-serif">加入緩慢茶事</h2>
          <p class="text-subtitle-2 text-grey-darken-1 mt-2">
            建立您的專屬品茗帳號，探索茶文化之美
          </p>
        </div>

        <v-card class="pa-8 rounded-xl border shadow-24" elevation="0">
          <v-card-title class="text-h5 font-weight-bold text-center color-tea-green mb-6">
            會員註冊
          </v-card-title>

          <v-form ref="formRef" v-model="isFormValid" @submit.prevent="handleRegister">
            <v-text-field
              v-model="form.account"
              class="mb-3 custom-input"
              color="green-darken-3"
              label="使用者帳號"
              placeholder="請輸入 4-20 碼英數帳號"
              prepend-inner-icon="mdi-account-outline"
              rounded="lg"
              :rules="[
                (v) => !!v || '請輸入帳號',
                (v) => (v && v.length >= 4) || '帳號至少需要 4 個字',
                (v) => /^[a-zA-Z0-9]+$/.test(v) || '帳號只能由英文字母或數字組成',
              ]"
              variant="outlined"
            ></v-text-field>

            <v-text-field
              v-model="form.email"
              class="mb-3 custom-input"
              color="green-darken-3"
              label="電子信箱"
              placeholder="example@mail.com"
              prepend-inner-icon="mdi-email-outline"
              rounded="lg"
              :rules="[
                (v) => !!v || '請輸入電子信箱',
                (v) => /.+@.+\..+/.test(v) || '請輸入有效的 Email 格式',
              ]"
              variant="outlined"
            ></v-text-field>

            <v-text-field
              v-model="form.password"
              class="mb-4 custom-input"
              color="green-darken-3"
              label="設定密碼"
              placeholder="至少 6 位字元"
              prepend-inner-icon="mdi-lock-outline"
              rounded="lg"
              :rules="[
                (v) => !!v || '請輸入密碼',
                (v) => (v && v.length >= 6) || '密碼至少需要 6 個字',
              ]"
              type="password"
              variant="outlined"
            ></v-text-field>

            <v-btn
              block
              class="rounded-pill font-weight-bold mb-4"
              color="green-darken-3"
              :disabled="!isFormValid"
              elevation="0"
              :loading="loading"
              size="x-large"
              type="submit"
            >
              立即開啟茶事之旅
            </v-btn>

            <div class="d-flex align-center my-6">
              <v-divider class="border-opacity-25"></v-divider>
              <span
                class="mx-4 text-caption text-grey-darken-1 flex-shrink-0"
                style="white-space: nowrap"
              >
                已有品茗帳號？
              </span>
              <v-divider class="border-opacity-25"></v-divider>
            </div>

            <v-btn
              block
              class="rounded-pill font-weight-bold"
              color="brown-darken-1"
              to="/login"
              variant="outlined"
            >
              前往登入
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
  import { reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import api from '@/composables/api'

  const router = useRouter()
  const loading = ref(false)
  const isFormValid = ref(false)
  const formRef = ref(null)

  const form = reactive({
    account: '',
    email: '',
    password: '',
  })

  const snackbar = reactive({
    show: false,
    text: '',
    color: 'success',
  })

  const handleRegister = async () => {
    if (!isFormValid.value) return

    loading.value = true
    try {
      const { data } = await api.post('/users/register', form)
      if (data.success) {
        snackbar.text = '註冊成功！快來開啟您的茶事之旅'
        snackbar.color = 'success'
        snackbar.show = true

        setTimeout(() => {
          router.push('/login')
        }, 1500)
      }
    } catch (error) {
      snackbar.text = error.response?.data?.message || '註冊失敗，請稍後再試'
      snackbar.color = 'error'
      snackbar.show = true
    } finally {
      loading.value = false
    }
  }
</script>

<style scoped>
  .font-serif {
    font-family: 'Noto Serif TC', serif !important;
  }

  .color-tea-green {
    color: #2d3e33;
  }

  .custom-input :deep(.v-field__outline) {
    --v-field-border-opacity: 0.15;
  }

  .custom-input :deep(.v-field--focused .v-field__outline) {
    --v-field-border-opacity: 1;
  }

  .shadow-24 {
    box-shadow: 0 10px 40px rgba(45, 62, 51, 0.1) !important;
  }

  .rounded-xl {
    border-radius: 24px !important;
  }
</style>

<route lang="yaml">
meta:
  title: '會員註冊'
  login: no-login-only
</route>
