/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Composables
import { createVuetify } from 'vuetify'
// Styles
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          background: '#F5F5DC', // 米色背景，對應 layouts/default.vue 裡寫的 body 背景色
          offwhite: '#F9F7F2', // 米白
          darkgreen: '#2D3E33', // 墨綠
          coffeebrown: '#8D6E63', // 咖啡棕
          ambergold: '#C19A6B', // 琥珀金
          // error: '#B00020',
          // info: '#2196F3',
          // success: '#4CAF50',
          // warning: '#FB8C00',
        },
      },
    },
  },
})
