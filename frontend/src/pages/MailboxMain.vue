
<template>
    <q-page class="flex q-pa-md">
      {{ health }}
    <q-list
    class="full-width"
    separator>
      <q-item
        v-for="message in messages"
        :key="message"
        class="q-my-sm text-white"
        :to="'/mail/' + message.id"
        clickable
        v-ripple
      >
        <q-item-section>
          <q-item-label>{{ message.sender }}</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-icon name="chat_bubble" color="green" />
        </q-item-section>
      </q-item>
    </q-list>
</q-page>
</template>
<script>
// import { storeToRefs } from 'pinia'
import { useStatusStore } from 'src/stores/example-store'
import { computed } from 'vue'

export default {
  preFetch () {
    console.log('from prefetch')
  },
  setup () {
    const store = useStatusStore()
    // const messages = ref([store.messages])
    // const messages = ref(store.messages)
    // const health = ref(store.health)
    // onMounted(async () => {
    //   await store.getMessages()
    //   messages.value = store.messages
    //   health.value = store.health
    // })
    // store.$subscribe((mess) => {
    //   console.log(mess)
    //   messages.value = mess.payload.messages
    // })
    // console.log(messages)
    // console.log(store.messages)
    // watchEffect(() => {
    //   messages.value = store.messages
    // })
    // messages.value = computed(() => store.messages)
    // const newM = store.messages
    // console.log(messages)
    return {
      messages: computed(() => store.messages),
      health: computed(() => store.health)
    }
  }
}
</script>

<style>

</style>
