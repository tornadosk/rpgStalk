<template>
    <q-page class="flex q-pa-md">
    <q-list
    class="full-width"
    separator>
      <q-item
        v-for="contact in contacts"
        :key="contact"
        class="q-my-sm text-white"
        :to="'/chat/' + contact"
        clickable
        v-ripple
      >
        <q-item-section>
          <q-item-label>{{ contact }}</q-item-label>
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
import { onMounted, ref } from 'vue'
export default {
  setup () {
    const store = useStatusStore()
    const contacts = ref([])
    onMounted(() => {
      store.getChats()
      contacts.value = store.contacts
    })
    return {
      contacts
    }
  }
}
</script>
