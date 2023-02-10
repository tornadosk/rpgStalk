import { defineStore } from 'pinia'
import { getFirestore, query, collection, where, onSnapshot, getDocs } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { api } from 'src/boot/axios'
import { showSuccessNotification } from 'src/functions/function-show-notifications'
import { reactive } from 'vue'

export const useStatusStore = defineStore('status', {
  state: () => ({
    counter: 0,
    health: 0,
    radiation: 0,
    poison: 0,
    messages: reactive([]),
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
    },
    getMailById: (state) => {
      return (mailId) => state.messages.find((message) => message.id === mailId)
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
      const req = await getDocs(q) 
      req.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        this.callsign = doc.data().callsign
        this.health = doc.data().health
      });
      
    },
    async getUserUpdates () {
      const db = getFirestore()
      const q = query(collection(db, 'entities'), where('uid', '==', `${getAuth().currentUser.uid}`))
      const unsub = (q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log('=============' + doc.data())
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
    // async getChats () {
    //   const db = getFirestore()
    //   const q = query(collection(db, "chats"), where("chatUsers", "array-contains", `${this.callsign}`))
    //   let chats = []
    //   const unsub = onSnapshot(q, (querySnapshot) => {
    //     querySnapshot.forEach((doc) => {
    //       chats.push(doc.data())
    //     })
    //   this.messages = chats
    //   })
    // },
    async getMessages () { //eslint-disable-next-line
      const db = getFirestore()
      const q = query(collection(db, "messages"), where("recipient", "==", "*"));
      let mess = []
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
          querySnapshot.docChanges().forEach((doc) => {
            console.log('this is what we need from all=> ' + doc.type)
            if (doc.type === 'added') {
              mess.push({...doc.doc.data()})   
            }
            this.messages = mess
        })
      })
      console.log(mess)
      console.log(this.callsign)
      const eq = query(collection(db, "messages"), where("recipient", "==", `${this.callsign}`))
      const unsub = onSnapshot(eq, (querySnapshot) => {
        querySnapshot.docChanges().forEach((doc) => {
          console.log('this is what we need => ' + doc.type)
          if (doc.type === 'added') {
            mess.push({...doc.doc.data()})   
          }
          this.messages = mess
        })
      })
      this.messages = mess
      console.log(this.messages)
    },
    logout() {
      this.counter = 0,
      this.health = 0,
      this.radiation = 0,
      this.poison = 0,
      this.messages = [],
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
