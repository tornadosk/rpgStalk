<template>
  <q-page class="flex column">
    <div class="column q-pa-md col justify-end">
      <q-chat-message
        v-for="message in items.chatMessages"
        :key="message.id"
        :name="message.sender"
        :text="[message.message]"
        :sent="message.sender == myself ? true : false"
      />
    </div>
    <q-footer elevated>
      <q-form @submit="sendMessage" class="full-width">
        <q-input
        rounded
        bg-color="white"
        outlined
        v-model="newMessage"
        label="Message"
        dense
        >
        <template v-slot:before>
          <q-btn to="/messages" dense color="white" flat label="back" />
        </template>
        <template v-slot:after>
          <q-btn round dense flat type="submit" color="white" icon="send" />
        </template>
      </q-input>
    </q-form>
  </q-footer>
</q-page>
</template>

<script>
import { useStatusStore } from 'src/stores/example-store'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

export default {
  setup () {
    const store = useStatusStore()
    const route = useRoute()
    const myself = store.callsign
    const newMessage = ref('')
    const messages = store.getChatById(route.params.otherUserCall)
    const items = JSON.parse(JSON.stringify(messages))
    return {
      items,
      newMessage,
      myself
    }
  }
}
</script>

<style></style>
