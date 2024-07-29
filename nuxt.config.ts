import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@vueuse/nuxt'
  ],
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    //...
  ],
  vite: {
    plugins: [
      nodePolyfills(),
    ],
    optimizeDeps: {
      // include: ['ccxt'],
    },
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
})
