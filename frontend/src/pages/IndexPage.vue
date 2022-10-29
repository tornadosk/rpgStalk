<template>
  <q-page class="flex flex-center">
    <q-btn color="primary" icon="check" label="" @click="store.increment()">{{store.counter}}</q-btn>
    <q-btn color="primary" icon="home" label="" @click="changeToZone()">change to zone</q-btn>
  <div style="height: 500px; width: 500px">
      <!-- 🤿 Vue, please render the Google Map Component here -->
        <GMapMap
        ref="myMapRef"
        :center="center"
        :zoom="17"
        :options="options"
        width="500px"
        height="500px"
        class="map"
        map-id="15b7b8e2b926c2ae"
      >
      <GMapMarker
      :key="index"
      v-for="(m, index) in markers"
      :position="m.position"
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
  </q-page>
</template>

<style scoped>
  .map {
    height: 500px;
    width: 500px;
  }
</style>

<script>
import {
  defineComponent,
  ref
// watch
} from 'vue'
// import { GoogleMap } from 'vue3-google-map'
// import { googleMap } from '@fawmi/vue-google-maps'
// import VueGoogleMaps from '../boot/google-maps'
import { useCounterStore } from '../stores/example-store'

export default defineComponent({
  components: {
  },
  name: 'IndexPage',
  setup () {
    const center = ref({ lat: 42.25839043021693, lng: -71.72179090075265 })
    const zonePosition = { lat: 42.25839043021693, lng: -71.72179090075265 }
    navigator.geolocation.getCurrentPosition(position)
    function position (pos) {
      console.log(pos)
      center.value.lat = pos.coords.latitude
      center.value.lng = pos.coords.longitude
    }
    function changeToZone () {
      center.value = zonePosition
    }

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
    const store = useCounterStore()
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
    return { center, markers, options, germanCities, myMapRef, heatData, store, changeToZone }
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
