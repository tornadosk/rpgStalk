<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
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
        PDA {{$t('welcome')}}
        <div class="q-pa-md">
          <q-linear-progress class="" size="15px" :value="progress1" color="red">
            <div class="absolute-full flex flex-center">
              <q-badge color="white" text-color="accent" :label="progressLabel1" />
            </div>
          </q-linear-progress>
        </div>
        </q-toolbar-title>
        <q-btn color="primary" icon="check" label="українська" @click="$i18n.locale ='uk-UK'" />
        <div>Quasar v {{$t('version')}}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Essential Links
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import { colors, setCssVar } from 'quasar'
import { useCounterStore } from '../stores/example-store'

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
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: '/link-to-discord'
  },
  {
    title: 'Your Health',
    caption: 'Radiation, poison level, health bars',
    icon: 'record_voice_over',
    link: '/params'
  }
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup () {
    const store = useCounterStore()
    const leftDrawerOpen = ref(false)
    const progress1 = ref(store.health)
    console.log(progress1)
    const newPrimaryColor = '#933' // portion to autochange color on the go
    setCssVar('primary', newPrimaryColor)
    setCssVar('primary-darkened', lighten(newPrimaryColor, -10))

    return {
      progress1,
      progressLabel1: computed(() => (progress1.value * 100).toFixed(2) + '%'),
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>
