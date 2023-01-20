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
    is_alive: 'false'
  }),
  getters: {
    doubleCount: (state) => state.counter * 2
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
        })
      })
    },

    async getHealth () {
      await api.get('/api/health?id=golobog', { headers: { 'Content-type': 'application/json' } })
      .then((response) => {
        showSuccessNotification('something arrived')
        console.log(response.data)
        this.health = response.data.health
        this.callsign = response.data.callsign
      })
      
    },
    async getMessages (data) { //eslint-disable-next-line
      const db = getFirestore()
    const q = query(collection(db, "messages"), where("recepient", "==", `${getAuth().currentUser.uid}`));
    let mess = []
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let messages = [];
      querySnapshot.forEach((doc) => {
        
        messages.push(doc.data().message)
        mess.push(doc.data())
        this.messages = messages
      })
      console.log("current: ", messages.join(", "))
    })
    }
  }
})
