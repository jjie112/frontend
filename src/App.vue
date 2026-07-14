<template>
  <v-app>
    <router-view />
    <!-- <router-view v-slot="{ Component, route }">
      <component :is="Component" :key="route.fullPath" />
    </router-view> -->
  </v-app>
</template>

<script setup>
  // import { watch } from 'vue'
  // import { useRoute } from 'vue-router'

  // const route = useRoute()
  // watch(
  //   () => route.fullPath,
  //   (newVal, oldVal) => {
  //     console.log('[真實 route 變化]', oldVal, '->', newVal)
  //   },
  // )
</script>
