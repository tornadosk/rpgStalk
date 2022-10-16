<template>
  <q-page padding>
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
  </q-page>
</template>

<script>
import { ref, computed } from 'vue'
import { useCounterStore } from '../stores/example-store'
export default {
  name: 'paramsPage',
  setup () {
    const store = useCounterStore()
    const progress1 = ref(store.health)
    const progress2 = ref(store.radiation)
    const progress3 = ref(store.poison)
    return {
      progress1,
      progress2,
      progress3,
      progressLabel1: computed(() => (progress1.value * 100).toFixed(2) + '%'),
      progressLabel2: computed(() => (progress2.value * 100).toFixed(2) + '%'),
      progressLabel3: computed(() => (progress3.value * 100).toFixed(2) + '%')
    }
  }
}
</script>
