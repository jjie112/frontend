// Utilities
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' // 1. 引入插件

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate) // 2. 使用插件

export default pinia
