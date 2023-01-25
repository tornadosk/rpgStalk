import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { firebaseConfig } from './firebaseConfig'

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: `${process.env.API}` })

export default boot(({ router, app }) => {
  initializeApp(firebaseConfig)
  // for use inside Vue files (Options API) through this.$axios and this.$api
  const auth = getAuth()
  router.beforeEach((to, from, next) => {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, function (user) {
        unsubscribe()
        if (!user && to.path !== '/auth/login') {
          next('/auth/login')
        } else if (user) {
          if (to.path === '/auth/login') {
            next('/')
          } else {
            next()
          }
        } else {
          next()
        }
        resolve(user)
      }, reject)
    })
  })

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api }
