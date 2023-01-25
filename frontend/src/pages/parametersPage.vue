<template>
  <q-page padding class="bg-green-8">
    <div class="q-pa-md">
      <q-badge color="{1:orange}" text-color="{2:black}" label="Health level" />
          <q-linear-progress class="" size="15px" :value="progress1" color="red">
            <div class="absolute-full flex flex-center">
              <q-badge color="white" text-color="accent" :label="progressLabel1" />
            </div>
          </q-linear-progress>
        </div>
        <div class="q-pa-md">
      <q-badge color="{1:orange}" text-color="{2:black}" label="Radiation" />
          <q-linear-progress class="" size="15px" :value="progress2" color="green">
            <div class="absolute-full flex flex-center">
              <q-badge color="white" text-color="accent" :label="progressLabel2" />
            </div>
          </q-linear-progress>
        </div><div class="q-pa-md">
      <q-badge color="{1:orange}" text-color="{2:black}" label="Poison level" />
          <q-linear-progress class="" size="15px" :value="progress3" color="yellow">
            <div class="absolute-full flex flex-center">
              <q-badge color="white" text-color="accent" :label="progressLabel3" />
            </div>
          </q-linear-progress>
        </div>
    <!-- content -->
    <div class="fit row no-wrap justify-between items-center content-center">
          <q-btn color="red-10" icon="health_and_safety" icon-right="send" label="Medpack" @click="addMedpack"/>
    <br>
    <q-btn color="yellow-10" icon="medication_liquid" icon-right="send" label="Antidote" @click="addAntidote"/>
    <br>
    <q-btn color="green-10" icon="vaccines" icon-right="send" label="Anti-radiation drug" @click="addDrug"/>
    <br>
        </div>
  </q-page>
</template>

<script>
import { api } from 'src/boot/axios'
import { showErrorNotification, showSuccessNotification } from 'src/functions/function-show-notifications'
import { ref, computed, watchEffect } from 'vue'
import { useStatusStore } from '../stores/example-store'

export default {
  name: 'paramsPage',
  setup () {
    const store = useStatusStore()
    const progress1 = ref(store.health / 100)
    const progress2 = ref(store.radiation)
    const progress3 = ref(store.poison)
    const messages = ref(store.messages)
    const addMedpack = () => {
      api.get(`/api/health?id=${store.id}&heal_phys=1`, { headers: { 'Content-type': 'application/json' } })
        .then((response) => {
          console.log(response.status)
          if (response.status === 204) {
            showErrorNotification('Something wrong with your Medpack.')
          } else {
            showSuccessNotification('Medpack have been used.')
          }
        })
        .catch(() => {
          showErrorNotification('Something is wrong with your Medpack.')
        })
    }
    const addAntidote = () => {
      api.get(`/api/health?id=${store.id}&heal_tox=1`, { headers: { 'Content-type': 'application/json' } })
        .then((response) => {
          if (response.status === 204) {
            showErrorNotification('Something wrong with your Antidote.')
          }
          showSuccessNotification('Antidote have been used.')
        })
        .catch(() => {
          showErrorNotification('Something is wrong with your Anidote.')
        })
    }
    const addDrug = () => {
      api.get(`/api/health?id=${store.id}&heal_rad=1`, { headers: { 'Content-type': 'application/json' } })
        .then((response) => {
          if (response.status === 204) {
            showErrorNotification('Something wrong with your Anti-rad drug.')
          } else {
            showSuccessNotification('Anti-radiation drug have been used.')
          }
        })
        .catch(() => {
          showErrorNotification('Something wrong with your Anti-rad drug.')
        })
    }
    watchEffect(() => {
      progress1.value = store.health / 100
      progress2.value = store.radiation / 100
      progress3.value = store.poison / 100
    })

    return {
      addMedpack,
      addAntidote,
      addDrug,
      progress1,
      progress2,
      progress3,
      messages,
      progressLabel1: computed(() => (progress1.value * 100).toFixed(2) + '%'),
      progressLabel2: computed(() => (progress2.value * 100).toFixed(2) + '%'),
      progressLabel3: computed(() => (progress3.value * 100).toFixed(2) + '%')
    }
  }
}
</script>
