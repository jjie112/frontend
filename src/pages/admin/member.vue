<template>
  <v-container>
    <h1 class="text-h4 mb-6 font-weight-black color-tea-green font-serif">會員管理</h1>
    <v-card class="rounded-xl border-card shadow-sm" elevation="0">
      <v-table>
        <thead>
          <tr>
            <th>帳號</th>
            <th>Email</th>
            <th>角色</th>
            <th>註冊日期</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user._id">
            <td>{{ user.account }}</td>
            <td>{{ user.email }}</td>
            <td>
              <v-chip :color="user.role === 'admin' ? 'red' : 'green'" size="small">
                {{ user.role }}
              </v-chip>
            </td>
            <td>{{ new Date(user.createdAt).toLocaleDateString() }}</td>
            <td>
              <v-btn
                color="red"
                :disabled="user.role === 'admin'"
                icon="mdi-delete"
                variant="text"
                @click="delUser(user._id)"
              ></v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </v-container>
</template>

<script setup>
  import { inject, onMounted, ref } from 'vue'
  import api from '@/composables/api'

  const showSnackbar = inject('showSnackbar')
  const users = ref([])

  const fetchUsers = async () => {
    try {
      // 因為 api 本身通常就帶有 auth (或是你定義的 api 變數)
      const { data } = await api.get('/users/all')
      users.value = data.data
    } catch {
      showSnackbar?.({ text: '載入會員失敗', snackbarProps: { color: 'red' } })
    }
  }

  const delUser = async (id) => {
    if (!confirm('確定要刪除此會員嗎？此動作無法復原')) return
    try {
      // 這裡也統一使用 api
      await api.delete(`/users/${id}`)
      showSnackbar?.({ text: '刪除成功', snackbarProps: { color: 'success' } })
      fetchUsers()
    } catch {
      showSnackbar?.({ text: '刪除失敗', snackbarProps: { color: 'red' } })
    }
  }

  onMounted(fetchUsers)
</script>

<route lang="yaml">
meta:
  title: '會員管理'
  layout: admin
  login: true
  admin: true
</route>
