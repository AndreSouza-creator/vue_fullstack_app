/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App
 */

// - ANDRESOUZA : Plugins
import { registerPlugins } from '@/plugins'

// - ANDRESOUZA : Components
import App from './App.vue'

// - ANDRESOUZA : Composables
import { createApp } from 'vue'

const app = createApp(App)

// Registra os plugins, incluindo o Vuetify
registerPlugins(app)

// Monta o aplicativo
app.mount('#app')
