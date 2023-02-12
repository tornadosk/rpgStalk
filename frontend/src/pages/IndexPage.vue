<template>
  <q-page class="fit row wrap justify-around items-center content-center">
    <!-- <q-btn color="primary" icon="check" label="" @click="store.increment()">{{store.counter}}</q-btn>
    <q-btn color="primary" icon="home" label="" @click="changeToZone()">change to zone</q-btn> -->
    <div>
      {{ center.lat + ' ' +center.lng }}
    </div>
    <div>
      {{ store.uid }}
    </div>
  <div class="self-center normal border">
      <!-- 🤿 Vue, please render the Google Map Component here -->
        <GMapMap
        ref="myMapRef"
        :center="center"
        :zoom="17"
        :options="options"
        map-id="15b7b8e2b926c2ae"
        class="map"
      >
      <GMapMarker
      :key="index"
      v-for="(m, index) in markers"
      :position="m.position"
      >
      </GMapMarker>
      <GMapMarker
      :position="center"
      >
      </GMapMarker>
      <GMapCircle
        :key="city.id"
        v-for="city in germanCities"
        :radius="Math.sqrt(city.population) * 100"
        :center="{ lat: city.position.lat, lng: city.position.lng}"
    />
    <GMapHeatmap :data="heatData.value"></GMapHeatmap>
      </GMapMap>
  </div>
  <!-- <div>tetetfgegfqwe</div>
  <div class="q-ml-sm text-body2" v-for="message in mess"
  :key=message.id>{{message.message}}</div> -->
  </q-page>
</template>

<style scoped>
  .map {
    height: 250px;
    width: 600px;
  }
  .border {
    border: 1px solid black;
  }
  .alert {
-webkit-box-shadow: 4px -4px 15px 0px #FF1F1F, 12px -11px 7px 0px #FF9376, 20px -5px 7px 0px #FFE264, 20px 6px 7px 0px #F6FF33, 13px 12px 17px 0px #FF9527, 2px 17px 17px 0px #FF0000, -9px 21px 18px 0px #FFF212, -9px 6px 11px 0px #FF0808, -11px -9px 11px 0px #FFFA17, -11px -9px 11px 0px #FFFA17, -2px 0px 21px 10px rgba(0,0,0,0);
box-shadow: 4px -4px 15px 0px #FF1F1F, 12px -11px 7px 0px #FF9376, 20px -5px 7px 0px #FFE264, 20px 6px 7px 0px #F6FF33, 13px 12px 17px 0px #FF9527, 2px 17px 17px 0px #FF0000, -9px 21px 18px 0px #FFF212, -9px 6px 11px 0px #FF0808, -11px -9px 11px 0px #FFFA17, -11px -9px 11px 0px #FFFA17, -2px 0px 21px 10px rgba(0,0,0,0);
}
.normal {
  box-shadow: -7px 2px 129px 74px rgba(150,140,140,1);
}
.alert {
  box-shadow: -7px 2px 129px 74px rgba(235,33,33,1);
}

</style>

<script>
import {
  defineComponent,
  onMounted,
  ref,
  watchEffect
// watch
} from 'vue'
// import { GoogleMap } from 'vue3-google-map'
// import { googleMap } from '@fawmi/vue-google-maps'
// import VueGoogleMaps from '../boot/google-maps'
/* eslint-disable */
import { useStatusStore } from '../stores/example-store'
import { collection, query, where, onSnapshot, getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

export default defineComponent({
  components: {
  },
  name: 'IndexPage',
  setup () {
    const store = useStatusStore()
    const center = ref({ lat: 42.25839043021693, lng: -71.72179090075265 })
    const zonePosition = { lat: 42.25839043021693, lng: -71.72179090075265 }
    // center.value.lat = store.coordinates._lat
    // center.value.lng = store.coordinates._long 
    // console.log(center)
    // navigator.geolocation.getCurrentPosition(position)
    // function position (pos) {
    //   console.log(pos)
    //   center.value.lat = pos.coords.latitude
    //   center.value.lng = pos.coords.longitude
      
    // }
    const optionsForGeo = {
      enableHighAccuracy: true,
      maximumAge: 30000,
      timeout: 27000
    }
    function error() {
      console.log('Sorry, no position available.');
    }
    function doSomething(lat, long) {
      console.log(lat + " " + long)
        center.value.lat = lat
        center.value.long = long
        console.log("position change")
    }
    watchEffect (() => {
      center
    })
    function success(position) {
      doSomething(position.coords.latitude, position.coords.longitude);
    }
    watchEffect (() => {
      console.log('watchin id')
      const watchID = navigator.geolocation.watchPosition(success, error, optionsForGeo) 
    })
    
    
    function changeToZone () {
      center.value = zonePosition
    }
    const db = getFirestore()
    const q = query(collection(db, "messages"), where("recepient", "==", `${getAuth().currentUser.uid}}`));
    const mess = ref([
      {id:0, message: "ргу"}
    ])
    onMounted(() => {
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let messages = [];
      querySnapshot.forEach((doc) => {
        
        const toDo = {
          id: doc.id,
          message: doc.data().message,
          sender: doc.data().sender,
          recepient: doc.data().recepient
        }
        messages.push(toDo)
      })
      mess.value = messages
    })
  })
    
    const options = {
      mapId: '12fd41bea9f82686',
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      disableDefaultUi: true
    } //  here comes your map id
    const markers = [
      {
        position: {
          lat: 42.259021798391785,
          lng: -71.72179090075265
        }
      },
      {
        position: {
          lat: 51.198429,
          lng: 6.69529
        }
      },
      {
        position: {
          lat: 51.165218,
          lng: 7.067116
        }
      },
      {
        position: {
          lat: 51.09256,
          lng: 6.84074
        }
      }
    ]
    const germanCities = [
      {
        id: 'duesseldorf',
        population: 612178,
        position: {
          lat: 51.233334, lng: 6.783333
        }
      },
      {
        id: 'koeln',
        position: {
          lat: 50.935173, lng: 6.953101
        },
        population: 1087863
      },
      {
        id: 'Hamburg',
        position: {
          lat: 53.551086,
          lng: 9.993682
        },
        population: 1899160
      },
      {
        id: 'trap',
        position: {
          lat: 42.2595,
          lng: -71.721
        },
        population: 0.01
      }
    ]
    const myMapRef = ref()
    const heatData = { lat: 42.259021798391785, lng: -71.72179090075265 }

    // const counterOf = useCounterStore().counter
    // watch(myMapRef, googleMap => {
    //   if (googleMap) {
    //     googleMap.$mapPromise.then(map => {
    //       heatData.value = [
    //         { location: new google.maps.LatLng({ lat: 42.259021798391785, lng: -71.72179090075265 }) }
    //       ]
    //     })
    //   }
    // })
    return { center, markers, options, germanCities, myMapRef, heatData, store, changeToZone, 
      mess}
  }
})
</script>
<!-- <GoogleMap
  api-key="AIzaSyBS8HcWrYSSPSTfoLQoSiPNJNm6s143PsY"
  style="width: 500px; height: 300px"
  map-id="15b7b8e2b926c2ae"
  :center="center"
  :zoom="17"
  >
    <Marker :options="{ position: center }" />
  </GoogleMap> -->
