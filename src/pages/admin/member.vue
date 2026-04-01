<template>
  <v-container class="py-10">
    <v-row align="center" class="mb-8">
      <v-col cols="12" md="6">
        <h1 class="text-h4 font-weight-bold color-tea-green font-serif mb-2">
          <v-icon class="mr-2" color="green-darken-3" icon="mdi-account-group-outline"></v-icon>
          會員管理系統
        </h1>
        <p class="text-subtitle-2 text-grey-darken-1">管理平台使用者權限與帳號狀態</p>
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          append-inner-icon="mdi-magnify"
          class="custom-search shadow-sm"
          clearable
          color="green-darken-3"
          density="comfortable"
          hide-details
          placeholder="搜尋帳號名稱或 Email..."
          rounded="pill"
          variant="solo-filled"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-expand-transition>
      <v-alert
        v-if="search"
        class="mb-6 rounded-xl border-dashed"
        color="green-darken-4"
        density="compact"
        icon="mdi-filter-variant"
        variant="tonal"
      >
        關鍵字搜尋：「<strong>{{ search }}</strong
        >」，共找到 <strong>{{ filteredUsers.length }}</strong> 位會員。
      </v-alert>
    </v-expand-transition>

    <v-card class="rounded-xl border shadow-sm" elevation="0">
      <v-data-table
        class="member-table"
        :headers="headers"
        hover
        :items="filteredUsers"
        :items-per-page="10"
        :loading="loading"
        loading-text="正在讀取會員名冊..."
      >
        <template #[`item.account`]="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar class="mr-3" color="green-lighten-5" size="36">
              <span class="text-subtitle-2 font-weight-bold color-tea-green">
                {{ item.account.charAt(0).toUpperCase() }}
              </span>
            </v-avatar>
            <span class="font-weight-bold color-tea-green">{{ item.account }}</span>
          </div>
        </template>

        <template #[`item.email`]="{ item }">
          <span class="text-grey-darken-1">{{ item.email }}</span>
        </template>

        <template #[`item.role`]="{ item }">
          <v-chip
            class="font-weight-black"
            :color="item.role === 'admin' ? 'red-darken-1' : 'green-darken-2'"
            size="small"
            variant="flat"
          >
            {{ item.role === 'admin' ? '管理員' : '一般會員' }}
          </v-chip>
        </template>

        <template #[`item.createdAt`]="{ item }">
          <span class="text-caption text-grey-darken-1">
            {{ formatDate(item.createdAt) }}
          </span>
        </template>

        <template #[`item.actions`]="{ item }">
          <v-btn
            color="red-lighten-1"
            :disabled="item.role === 'admin'"
            icon="mdi-delete-alert-outline"
            title="刪除會員"
            variant="text"
            @click="delUser(item._id, item.name)"
          ></v-btn>
        </template>

        <template #no-data>
          <div class="pa-10 text-center text-grey">目前沒有符合條件的會員資料</div>
        </template>
      </v-data-table>
    </v-card>

    <v-btn
      class="mt-6 text-grey-darken-1"
      prepend-icon="mdi-arrow-left"
      variant="text"
      @click="$router.back()"
    >
      返回上一頁
    </v-btn>
  </v-container>
</template>

<script setup>
  import { computed, inject, onMounted, ref } from 'vue'
  import api from '@/composables/api'

  const showSnackbar = inject('showSnackbar')
  const users = ref([])
  const search = ref('')
  const loading = ref(false)

  // 表格標頭定義
  const headers = [
    { title: '帳號名稱', key: 'account', sortable: true },
    { title: '電子信箱', key: 'email', sortable: true },
    { title: '權限角色', key: 'role', align: 'center', sortable: true },
    { title: '註冊時間', key: 'createdAt', align: 'center', sortable: true },
    { title: '操作', key: 'actions', align: 'center', sortable: false },
  ]

  // 🔍 搜尋過濾邏輯
  const filteredUsers = computed(() => {
    if (!search.value) return users.value
    const query = search.value.toLowerCase()
    return users.value.filter((user) => {
      return user.account.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)
    })
  })

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }

  const fetchUsers = async () => {
    loading.value = true
    try {
      const { data } = await api.get('/users/all')
      users.value = data.data
    } catch {
      showSnackbar?.({ text: '無法取得會員清單', snackbarProps: { color: 'red' } })
    } finally {
      loading.value = false
    }
  }

  const delUser = async (id, name) => {
    // 傳入 name 讓提示更具體
    const message = `🚨 嚴重警告：確定要刪除會員「${name}」嗎？\n\n這將會移除該會員的所有個人資料，且此動作無法復原。`

    if (!confirm(message)) return

    try {
      const { data } = await api.delete(`/users/${id}`)
      if (data.success) {
        showSnackbar?.({ text: '該會員資料已從系統移除', snackbarProps: { color: 'success' } })
        fetchUsers()
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || '刪除失敗，請檢查權限'
      showSnackbar?.({ text: errorMsg, snackbarProps: { color: 'red' } })
    }
  }

  onMounted(fetchUsers)
</script>

<style scoped>
  .font-serif {
    font-family: 'Noto Serif TC', serif !important;
  }
  .color-tea-green {
    color: #2d3e33;
  }
  .shadow-sm {
    box-shadow: 0 4px 20px rgba(45, 62, 51, 0.05) !important;
  }

  .custom-search :deep(.v-field) {
    border: 1px solid #e0e0e0 !important;
    transition: all 0.3s;
  }
  .custom-search :deep(.v-field--focused) {
    border-color: #2d3e33 !important;
  }

  :deep(.v-data-table-header) {
    background-color: #fcfcfc;
  }
  :deep(.v-data-table__th) {
    font-weight: 800 !important;
    color: #444 !important;
    text-transform: uppercase;
    font-size: 0.85rem !important;
    letter-spacing: 1px;
  }

  .border-dashed {
    border: 1px dashed #2d3e33 !important;
  }
</style>

<route lang="yaml">
meta:
  title: '會員管理'
  login: true
  admin: true
</route>
