/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// - ANDRESOUZA : Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// - ANDRESOUZA : Composables
import { createVuetify } from 'vuetify'

// - ANDRESOUZA : https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'dark',
  },
})
