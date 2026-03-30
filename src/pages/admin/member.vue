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
    </v-row>

    <v-card class="rounded-xl border shadow-sm" elevation="0">
      <v-table class="admin-table">
        <thead>
          <tr class="bg-grey-lighten-5">
            <th class="text-grey-darken-2 font-weight-bold">帳號名稱</th>
            <th class="text-grey-darken-2 font-weight-bold">電子信箱</th>
            <th class="text-grey-darken-2 font-weight-bold">權限角色</th>
            <th class="text-grey-darken-2 font-weight-bold">註冊時間</th>
            <th class="text-grey-darken-2 font-weight-bold text-center">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="users.length === 0" class="text-center">
            <td class="py-12" colspan="5">
              <v-icon color="grey-lighten-2" size="48">mdi-account-off-outline</v-icon>
              <div class="text-grey mt-2">目前尚無會員資料</div>
            </td>
          </tr>

          <tr v-for="user in users" :key="user._id" class="table-row-hover">
            <td class="font-weight-bold color-tea-green">{{ user.account }}</td>
            <td class="text-grey-darken-1">{{ user.email }}</td>
            <td>
              <v-chip
                class="font-weight-black"
                :color="user.role === 'admin' ? 'red-darken-1' : 'green-darken-2'"
                size="small"
                variant="flat"
              >
                {{ user.role === 'admin' ? '管理員' : '一般會員' }}
              </v-chip>
            </td>
            <td class="text-caption text-grey-darken-1">
              {{ formatDate(user.createdAt) }}
            </td>
            <td class="text-center">
              <v-btn
                color="red-lighten-1"
                :disabled="user.role === 'admin'"
                icon="mdi-delete-sweep-outline"
                variant="text"
                @click="delUser(user._id)"
              ></v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
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
  import { inject, onMounted, ref } from 'vue'
  import api from '@/composables/api'

  const showSnackbar = inject('showSnackbar')
  const users = ref([])

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
    try {
      const { data } = await api.get('/users/all')
      users.value = data.data
    } catch {
      showSnackbar?.({ text: '無法取得會員清單', snackbarProps: { color: 'red' } })
    }
  }

  const delUser = async (id) => {
    if (!confirm('🚨 警告：確定要刪除此會員嗎？此動作無法復原。')) return
    try {
      await api.delete(`/users/${id}`)
      showSnackbar?.({ text: '會員已成功刪除', snackbarProps: { color: 'success' } })
      fetchUsers()
    } catch {
      showSnackbar?.({ text: '刪除失敗', snackbarProps: { color: 'red' } })
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
  .admin-table :deep(th) {
    height: 60px !important;
    font-size: 0.9rem !important;
    letter-spacing: 1px;
  }
  .admin-table :deep(td) {
    height: 70px !important;
  }
  .table-row-hover:hover {
    background-color: #fcfaf8;
    transition: background-color 0.3s;
  }
</style>
