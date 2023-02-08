
<template>
    <q-page class="flex q-pa-md">
    <q-list
    class="full-width"
    separator>
      <q-item
        v-for="message in messages"
        :key="message.id"
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
import { useStatusStore } from 'src/stores/example-store'
import { onMounted, ref, watchEffect } from 'vue'
export default {
  preFetch () {
    console.log('from prefetch')
  },
  setup () {
    const store = useStatusStore()
    const messages = ref(store.messages)
    onMounted(() => {
      store.getMessages()
    })
    console.log(messages)
    console.log(store.messages)
    watchEffect(() => {
      messages.value = store.messages
    })
    console.log(messages)
    return {
      messages
    }
  }
}
</script>

<style>

</style>
