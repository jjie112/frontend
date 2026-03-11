<template>
  <v-container class="py-10">
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card class="rounded-lg shadow-lg">
          <v-toolbar color="teal-darken-3" dark>
            <v-btn icon @click="router.back()">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-toolbar-title>個人資料設定</v-toolbar-title>
          </v-toolbar>

          <v-card-text class="pa-6">
            <v-list lines="two">
              <v-list-item prepend-icon="mdi-account" title="帳號名稱">
                <template #subtitle>{{ userStore.account }}</template>
              </v-list-item>
              <v-list-item prepend-icon="mdi-email" title="電子信箱">
                <template #subtitle>{{ userStore.email }}</template>
              </v-list-item>
              <v-list-item prepend-icon="mdi-shield-account" title="會員等級">
                <template #subtitle>
                  <v-chip :color="userStore.isAdmin ? 'red' : 'blue'" size="small">
                    {{ userStore.isAdmin ? '管理員' : '一般會員' }}
                  </v-chip>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>

          <v-divider></v-divider>
          <v-card-actions class="pa-4">
            <v-spacer></v-spacer>
            <v-btn
              prepend-icon="mdi-undo"
              variant="text"
              @click="router.back()"
            >
              返回上一頁
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/stores/user'

  const userStore = useUserStore()
  const router = useRouter() // 初始化 router
</script>

<route lang="yaml">
meta:
  title: '個人資料'
  login: true
</route>
