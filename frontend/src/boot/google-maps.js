import { boot } from 'quasar/wrappers'
import VueGoogleMaps from '@fawmi/vue-google-maps'

export default boot(async ({ app }) => {
  app.use(VueGoogleMaps, { // 🤿 Vue App. Please install Vue Google Maps
    load: {
      key: process.env.APIMAP,
      libraries: 'visualization' // 🤿 I don't have a google key, so leave it blank for now
    }
  })
})
