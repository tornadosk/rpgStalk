import { defineStore } from 'pinia'
import { getFirestore, query, collection, where, onSnapshot } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { api } from 'src/boot/axios'
import { showSuccessNotification } from 'src/functions/function-show-notifications'

export const useStatusStore = defineStore('status', {
  state: () => ({
    counter: 0,
    health: 0,
    radiation: 0.1,
    poison: 0.05,
    messages: [],
    callsign: '',
    id: '',
    uid: '',
    faction: '',
    type: '',
    coordinates: '',
    is_alive: 'false',
    contacts: []
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
    getChatById: (state) => {
      return (userId) => state.messages.find((chat) => chat.chatUsers.includes(userId))
    }
  },
  actions: {
    changeHelath (value) {
      this.health = value
    },
    assignUID (value) {
      this.uid = value
    },
    /* eslint-disable */
    async getUser () {
      const db = getFirestore()
      const q = query(collection(db, 'entities'), where('uid', '==', `${getAuth().currentUser.uid}`))
      const unsub = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.id = doc.id
          this.callsign = doc.data().callsign
          this.health = doc.data().health
          this.radiation = doc.data().damage_rad
          this.poison = doc.data().damage_tox
          this.faction = doc.data().faction
          this.type = doc.data().type
          this.coordinates = doc.data().coordinates
          this.is_alive = doc.data().is_alive
          this.contacts = doc.data().contacts
          this.chats = []
        })
      })
    },

    async getHealth () {
      await api.get('/api/health?id=golobog', { headers: { 'Content-type': 'application/json' } })
      .then((response) => {
        showSuccessNotification('something arrived')
        this.health = response.data.health
        this.callsign = response.data.callsign
      })
      
    },
    async getChats () {
      const db = getFirestore()
      const q = query(collection(db, "chats"), where("chatUsers", "array-contains", `${this.callsign}`))
      let chats = []
      const unsub = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          chats.push(doc.data())
        })
      this.messages = chats
      })
    },
    async getMessages (data) { //eslint-disable-next-line
      const db = getFirestore()
    const q = query(collection(db, "messages"), where("recipient", "==", "*"));
    let mess = []
    let cont = []
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let messages = [];
      let contacts = [];
      querySnapshot.forEach((doc) => {
        
        messages.push(doc.data())
        mess.push(doc.data())
        contacts.push(doc.data().sender)    
      })
      let unique = [...new Set(contacts)];
      this.messages = messages
      this.contacts = unique
    })
    },
    logout() {
      this.counter = 0,
      this.health = 0,
      this.radiation = 0,
      this.poison =  0,
      this.messages =  [],
      this.callsign = '',
      this.id =  '',
      this.uid =  '',
      this.faction = '',
      this.type =  '',
      this.coordinates = '',
      this.is_alive = 'false'
    }
  }
})
