<template>
  <div>
  <q-page class="flex column">
    <q-card dark bordered class="q-pa-md">
      <q-card-section>
        <div class="text-h6">
          {{ item.sender }}
        </div>
        <div class="text-subtitle2">
          {{ formatDate(item.timestamp)}}
        </div>
      </q-card-section>
      <q-card-section>
        {{ item.message }}
      </q-card-section>
      <q-card-section>
        <q-btn outline style="color:white" @click="prompt = true">Respond</q-btn>
      </q-card-section>
    </q-card>
    <q-footer elevated>
      <q-btn to="/mailbox" class="full-width" dense color="white" flat label="back" />
    </q-footer>
  </q-page>
  <q-dialog v-model="prompt" persistent maximized>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Your response to: {{ item.sender }}</div>
          <div class="q-gutter-y-md">
      <!-- <q-btn-toggle
        v-model="model"
        spread
        no-caps
        toggle-color="purple"
        color="primary"
        text-color="white"
        :options="[
          {label: 'Write to', value: 'one'},
          {label: 'Write to your fraction', value: 'two'}
        ]"
      /> -->
      <!-- <q-input v-if="model === 'one'" v-model="username"></q-input> -->
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="textOfMessage" type="textarea" autofocus @keyup.enter="prompt = false" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Send response" @click="sendResponse(item.sender, textOfMessage)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { showErrorNotification, showSuccessNotification } from 'src/functions/function-show-notifications'
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
    message.recipient_read = true
    const item = JSON.parse(JSON.stringify(message))
    function formatDate (date) {
      const formatDate = new Date(
        date.seconds * 1000 + date.nanoseconds / 1000000
      )
      return formatDate.toLocaleTimeString('en-us', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    }
    function sendResponse (username, textOfMessage) {
      const data = {
        admin: false,
        sender: store.callsign,
        recipient: username,
        text: textOfMessage
      }
      console.log(textOfMessage)
      console.log(username)
      if (store.is_alive) {
        store.sendMessage(data)
        showSuccessNotification('Your message have been sent.')
      } else {
        showErrorNotification("Can't sent message.")
      }
      this.prompt = false
      this.textOfMessage = ''
    }
    return {
      formatDate,
      item,
      newMessage,
      myself,
      textOfMessage: ref(''),
      prompt: ref(false),
      address: ref(''),
      model: ref('one'),
      username: ref(''),
      sendResponse
    }
  }
}
</script>

<style></style>
