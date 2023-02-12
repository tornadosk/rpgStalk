
<template>
  <div>
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
<q-dialog v-model="prompt" persistent maximized>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Your response to: {{ item.sender }}</div>
          <div class="q-gutter-y-md">
      <q-btn-toggle
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
      />
      <q-input v-if="model === 'one'" v-model="username"></q-input>
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
