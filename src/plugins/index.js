/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import VuetifyUseDialog from 'vuetify-use-dialog'
import router from '@/router'
import pinia from '@/stores'
import vuetify from './vuetify'

export function registerPlugins (app) {
  app.use(vuetify).use(VuetifyUseDialog).use(router).use(pinia)
}
