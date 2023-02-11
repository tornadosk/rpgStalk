
<template>
    <q-page class="flex q-pa-md">
        <div class="q-pa-md content-center text-white">Your messages:</div>
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
            <q-item-label>
                Message from: {{ message.sender }} to {{ message.recipient === '*' ? 'all' : message.recipient }}
            </q-item-label>
        </q-item-section>

        <q-item-section side v-if="!message.recipient_read">
          <q-icon name="chat_bubble" color="red" />
        </q-item-section>
      </q-item>
    </q-list>
    <q-footer elevated>
        <q-btn class="full-width" type="button" round flat color="white" stack icon="send" label="Send Message"/>
    </q-footer>
</q-page>
</template>
<script>
// import { storeToRefs } from 'pinia'
import { useStatusStore } from 'src/stores/example-store'
import { computed } from 'vue'

export default {
  setup () {
    const store = useStatusStore()
    return {
      messages: computed(() => store.messages)
    }
  }
}
</script>

<style>

</style>
