import { boot } from 'quasar/wrappers'
import * as VueGoogleMaps from 'vue3-google-map'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app }/* { app, router, ... } */) => {
  app.use(VueGoogleMaps, {
    load: {
      key: 'AIzaSyBS8HcWrYSSPSTfoLQoSiPNJNm6s143PsY',
      libraries: 'places'
    }
  })
})
