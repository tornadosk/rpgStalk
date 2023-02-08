<template>
  <q-layout view="lHh Lpr lFf" class="bg">
    <q-header elevated class="bg">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
        <div class="q-pa-md">
          <q-linear-progress class="" size="15px" :value="progress1" color="red">
            <div class="absolute-full flex flex-center">
              <q-badge color="white" text-color="accent" :label="progressLabel1" />
            </div>
          </q-linear-progress>
        </div>
        </q-toolbar-title>
        <div>
          <q-btn color="primary" icon="chevron_right" label="Got hit" @click="gotHit" />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-green-4"
    >
      <q-list class="">
        <q-item-label
          header
        >
          {{email}}
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
          class="border"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import { colors, setCssVar } from 'quasar'
import { useStatusStore } from '../stores/example-store'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { collection, query, where, onSnapshot, getFirestore } from 'firebase/firestore'

import { alertOnHealthLoss } from 'src/functions/function-show-notifications'
import { api } from 'src/boot/axios'

const { lighten } = colors

const linksList = [
  {
    title: 'Task',
    caption: 'Tasks related info',
    icon: 'school',
    link: '/tasks'
  },
  {
    title: 'Map',
    caption: 'Map around',
    icon: 'code',
    link: '/'
  },
  {
    title: 'Mailbox',
    caption: 'Spread the word',
    icon: 'chat',
    link: '/mailbox'
  },
  {
    title: 'Your Health',
    caption: 'Radiation, poison level, health bars',
    icon: 'record_voice_over',
    link: '/params'
  },
  {
    title: 'Inventory',
    caption: 'All your current items',
    icon: 'bag',
    link: '/inventory'
  },
  {
    title: 'Settings',
    caption: 'Change preferences, logout',
    icon: 'settings',
    link: '/settings'
  }
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },
  async preFetch () {
    const store = useStatusStore()
    await store.getUser()
    await store.getMessages()
    console.log('mainLAyout prefetc')
    console.log(store.messages)
  },
  setup () {
    const store = useStatusStore()
    const leftDrawerOpen = ref(false)
    // store.getHealth()
    store.getUser()
    // store.getMessages()
    const progress1 = ref(store.health / 100)
    const newPrimaryColor = '#933' // portion to autochange color on the go
    setCssVar('primary', newPrimaryColor)
    setCssVar('primary-darkened', lighten(newPrimaryColor, -10))
    const auth = getAuth()
    const email = ref('')
    const name = ref('')
    onAuthStateChanged(auth, (user) => {
      if (user) {
        email.value = user.email
        name.value = user.displayName
      }
    })
    /* eslint-disable */
    const db = getFirestore()
    const qPath = store.uid
    const qStatus = query(collection(db, 'entities'), where('uid', '==', `${qPath}`))
    const gotHit = () => {
      api.get(`api/hit?id=${store.id}&hit=1`, { headers: { 'Content-type': 'application/json' } })
      .then(() => {
        alertOnHealthLoss('You got hit, we are not sure if you are alive.')
      })
      .catch((err) => {
        console.log(err)
      })
    }
    const mess = ref([
      {}
    ])
    onMounted(() => {
      const unsubscribe = onSnapshot(qStatus, (querySnapshot) => {
      let messages = [];
      querySnapshot.forEach((doc) => {
        if(store.health > doc.data().health) {
          alertOnHealthLoss('You are lossing health!')
        }
        store.health = doc.data().health
        console.log(doc.data())
        progress1.value = doc.data().health /100
      })
    })
    console.log(progress1)
  }) 
    return {
      progress1,
      progressLabel1: computed(() => (progress1.value * 100).toFixed(2) + '%'),
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      email,
      name,
      gotHit
    }
  }
})
</script>
<style lang="sass" scoped>
.bigNotification
  width: 500px
  height: 500px
.border
  border-style: solid
  border-width: 1px 1px 1px 0
  border-color: rgba(0,0,0,.24)
.bg
  background: linear-gradient(to right, #0f9b0f, #000000) //* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
.YL
  &__toolbar-input-container
    min-width: 100px
    width: 55%
    border-radius: 20
  &__toolbar-input-btn

    border-style: solid
    border-width: 1px 1px 1px 0
    border-color: rgba(0,0,0,.24)
    max-width: 60px
    width: 100%
  &__drawer-footer-link
    color: inherit
    text-decoration: none
    font-weight: 500
    font-size: .75rem
    &:hover
      color: #000
</style>
