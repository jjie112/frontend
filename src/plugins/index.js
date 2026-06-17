/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins 插件
import VuetifyUseDialog from 'vuetify-use-dialog'
import router from '@/router'
import pinia from '@/stores'
import vuetify from './vuetify'

// registerPlugins 註冊插件
export function registerPlugins(app) {
  app.use(vuetify).use(VuetifyUseDialog).use(router).use(pinia)
}
