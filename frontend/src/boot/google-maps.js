import { boot } from 'quasar/wrappers'
import VueGoogleMaps from '@fawmi/vue-google-maps'

export default boot(async ({ app }) => {
  app.use(VueGoogleMaps, { // 🤿 Vue App. Please install Vue Google Maps
    load: {
      key: 'AIzaSyDU0u-cXakQ2sa5Oo-_zUiLuJ6eLbF6mWI',
      libraries: 'visualization' // 🤿 I don't have a google key, so leave it blank for now
    }
  })
})
