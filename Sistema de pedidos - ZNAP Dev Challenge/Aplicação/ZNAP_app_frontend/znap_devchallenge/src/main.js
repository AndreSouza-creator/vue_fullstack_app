/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// - ANDRESOUZA : Plugins
import { registerPlugins } from '@/plugins'

// - ANDRESOUZA : Components
import App from './App.vue'

// - ANDRESOUZA : Composables
import { createApp } from 'vue'

const app = createApp(App)

registerPlugins(app)

app.mount('#app')




