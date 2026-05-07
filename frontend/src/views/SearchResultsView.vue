<template>
  <div class="flex flex-col h-screen overflow-hidden">

    <main class="flex flex-1 overflow-hidden bg-white">

      <!-- LISTA -->
      <section class="w-full lg:w-3/5 overflow-y-auto p-6 scrollbar-hide">

        <!-- TITULO -->
        <div class="mb-6">

          <p class="text-sm text-gray-500 mb-1">
            {{ filteredResults.length }} alojamientos encontrados
          </p>

          <h1 class="text-2xl font-bold text-gray-900">
            Resultados en "{{ propertyStore.searchQuery || 'Todos los destinos' }}"
          </h1>

        </div>

        <!-- RESULTADOS -->
        <div
          v-if="filteredResults.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 gap-8"
        >

          <PropertyCard
            v-for="p in filteredResults"
            :key="p.id"
            :property="p"
          />

        </div>

        <!-- SIN RESULTADOS -->
        <div
          v-else
          class="text-center py-20"
        >

          <p class="text-2xl mb-4">
            🏠
          </p>

          <p class="text-xl text-gray-600">
            No encontramos alojamientos
          </p>

        </div>

      </section>

      <!-- MAPA -->
      <section class="hidden lg:block lg:w-2/5 border-l">

        <div
          id="map"
          style="width: 100%; height: 100vh;"
        ></div>

      </section>

    </main>

  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
  nextTick,
  watch,
  provide
} from 'vue';

import { useRoute } from 'vue-router';

import { usePropertyStore } from '../stores/property';

import PropertyCard from '../components/PropertyCard.vue';

import 'leaflet/dist/leaflet.css';

import L from 'leaflet';

const propertyStore = usePropertyStore();
const route = useRoute();

let map = null;
let markers = [];


// ===============================
// FILTROS
// ===============================

const totalGuests = computed(() => {
  return Number(route.query.adultos || 1)
    + Number(route.query.ninos || 0)
    + Number(route.query.bebes || 0);
});

const filteredResults = computed(() => {

  return propertyStore.properties.filter(p => {

    // 🔹 ciudad
    const cityMatch =
      !route.query.q ||
      p.location?.toLowerCase().includes(
        route.query.q.toLowerCase()
      );

    // 🔹 huéspedes
    const guestsMatch =
      Number(p.max_guests || 1) >= totalGuests.value;

    return cityMatch && guestsMatch;
  });

});


// ===============================
// GEOCODER
// ===============================

const geocodeCity = async (cityName) => {

  const url =
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`;

  const res = await fetch(url, {
    headers: { 'Accept-Language': 'es' }
  });

  const data = await res.json();

  if (data.length > 0) {

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon)
    };
  }

  return null;
};


// ===============================
// ICONOS MAPA
// ===============================

const createAirbnbIcon = (price, active = false) => {

  const formattedPrice =
    new Intl.NumberFormat('es-CO').format(price);

  const bgColor = active ? '#000' : '#fff';
  const textColor = active ? '#fff' : '#222';
  const borderColor = active ? '#000' : '#ddd';

  return L.divIcon({

    className: '',

    html: `
      <div class="airbnb-marker">
        <div class="marker-content" style="
          background:${bgColor};
          color:${textColor};
          border:1px solid ${borderColor};
          border-radius:999px;
          padding:8px 12px;
          font-weight:700;
          box-shadow:0 2px 6px rgba(0,0,0,0.15);
        ">
          $${formattedPrice}
        </div>
      </div>
    `,

    iconAnchor: [0, 0],
  });
};


// ===============================
// MAPA
// ===============================

const loadMap = async () => {

  const mapContainer =
    document.getElementById('map');

  if (!mapContainer) return;

  // destruir mapa viejo
  if (map) {
    map.remove();
    map = null;
  }

  markers = [];

  // crear mapa
  map = L.map('map', {
    center: [4.7110, -74.0721],
    zoom: 12,
    zoomControl: true,
  });

  // tiles
  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: '© OpenStreetMap',
      maxZoom: 19,
    }
  ).addTo(map);

  // centrar ciudad
  if (route.query.q) {

    const coords =
      await geocodeCity(route.query.q);

    if (coords) {
      map.setView([coords.lat, coords.lng], 12);
    }
  }

  const bounds = L.latLngBounds();

  // markers
  for (const p of filteredResults.value) {

    const coords =
      await geocodeCity(p.location);

    if (!coords) continue;

    // pequeño desplazamiento
    const jitter = () =>
      (Math.random() - 0.5) * 0.01;

    const lat = coords.lat + jitter();
    const lng = coords.lng + jitter();

    const marker = L.marker(
      [lat, lng],
      {
        icon: createAirbnbIcon(p.price),
      }
    ).addTo(map);

    marker.__id = p.id;

    marker.on('click', () => {
      map.setView([lat, lng], 15);
    });

    markers.push(marker);

    bounds.extend([lat, lng]);
  }

  // ajustar vista
  if (markers.length > 0 && bounds.isValid()) {

    map.fitBounds(bounds, {
      padding: [40, 40]
    });
  }
};


// ===============================
// HIGHLIGHT
// ===============================

const highlightMarker = (id) => {

  markers.forEach((m) => {

    const isActive = m.__id === id;

    const p =
      filteredResults.value.find(
        prop => prop.id === m.__id
      );

    if (p) {
      m.setIcon(
        createAirbnbIcon(
          p.price,
          isActive
        )
      );
    }
  });
};


// ===============================
// FOCUS
// ===============================

const focusMarker = (p) => {

  if (!map) return;

  const marker =
    markers.find(m => m.__id === p.id);

  if (marker) {

    const latlng = marker.getLatLng();

    map.setView(latlng, 15);
  }
};

provide('highlightMarker', highlightMarker);
provide('focusMarker', focusMarker);


// ===============================
// MOUNT
// ===============================

onMounted(async () => {

  if (route.query.q) {
    propertyStore.setSearchQuery(route.query.q);
  }

  await propertyStore.fetchProperties();

  await nextTick();

  await loadMap();
});


// ===============================
// UNMOUNT
// ===============================

onUnmounted(() => {

  if (map) {

    map.remove();

    map = null;
  }
});


// ===============================
// WATCH
// ===============================

watch(
  () => route.fullPath,

  async () => {

    await propertyStore.fetchProperties();

    await nextTick();

    await loadMap();
  }
);

defineExpose({
  highlightMarker,
  focusMarker
});
</script>

<style scoped>
#map {
  z-index: 0;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  scrollbar-width: none;
}
</style>