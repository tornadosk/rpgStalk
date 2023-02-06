<template>
    <q-page padding class="bg-green-8">
      <div class="q-pa-md">
        <q-btn-dropdown
            flat
            color="white"
            label="logout"
          >
            <q-list class="bg-green">
              <q-item class="">
                  Logged in as <br><b>{{email}}</b>
              </q-item>
              <q-item clickable v-close-popup @click="logout">
                <q-item-section>
                  <q-item-label>Logout</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
      </div>
    </q-page>
</template>

<script>
import { ref } from 'vue'
import { useStatusStore } from '../stores/example-store'
import { useQuasar } from 'quasar'
import { getAuth, onAuthStateChanged } from '@firebase/auth'
import router from '../router/index'

export default {
  name: 'settingsPage',
  setup () {
    const $q = useQuasar()
    // eslint-disable-next-line
    const store = useStatusStore()
    const auth = getAuth()
    const email = ref('')
    const name = ref('')
    onAuthStateChanged(auth, (user) => {
      if (user) {
        email.value = user.email
        name.value = user.displayName
      }
    })
    const logout = () => {
      getAuth().signOut()
      router.push('/auth/login')
        .then(() => {
          store.logout()
          $q.notify({ message: 'Sign Out Success.' })
        })
        .catch(error => console.log('error', error))
    }
    return {
      logout,
      email,
      name
    }
  }
}
</script>
