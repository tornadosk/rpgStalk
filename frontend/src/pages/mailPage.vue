<template>
  <q-page class="flex column">
    <q-card dark bordered class="q-pa-md">
      <q-card-section>
        <div class="text-h6">
          {{ item.sender }}
        </div>
        <div class="text-subtitle2">
          {{ item.timestamp }}
        </div>
      </q-card-section>
      <q-card-section>
        {{ item.message }}
      </q-card-section>
      <q-card-section>
        <q-btn outline style="color:white">Respond</q-btn>
        <q-btn outline>Mark as read</q-btn>
      </q-card-section>
    </q-card>
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
            <q-btn to="/mailbox" dense color="white" flat label="back" />
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
    const message = store.getMailById(route.params.otherUserMail)
    console.log(store.messages)
    console.log(message)
    // const messages = store.getChatById(route.params.otherUserCall)
    const item = JSON.parse(JSON.stringify(message))
    return {
      item,
      newMessage,
      myself
    }
  }
}
</script>

<style></style>
