// Utilities
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' // 引入插件

// 建立 Pinia store，並套用持久化插件
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate) // 使用插件

export default pinia
