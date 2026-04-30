<template>
  <div class="flex flex-col h-screen overflow-hidden">
    <main class="flex flex-1 overflow-hidden bg-white">

      <!-- LISTA -->
      <section class="w-full lg:w-3/5 overflow-y-auto p-6 scrollbar-hide">

        <!-- TITULO -->
        <div class="mb-6">
          <p class="text-sm text-gray-500 mb-1">
            {{ propertyStore.filteredProperties.length }} alojamientos encontrados
          </p>
          <h1 class="text-2xl font-bold text-gray-900">
            Resultados en "{{ propertyStore.searchQuery || 'Todos los destinos' }}"
          </h1>
        </div>

        <!-- TARJETAS -->
        <div
          v-if="propertyStore.filteredProperties.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <PropertyCard
            v-for="p in propertyStore.filteredProperties"
            :key="p.id"
            :property="p"
          />
        </div>

        <!-- SIN RESULTADOS -->
        <div
          v-if="propertyStore.filteredProperties.length === 0 && propertyStore.searchQuery"
          class="text-center py-10"
        >
          <p class="text-gray-500 text-xl">
            No hay resultados para "{{ propertyStore.searchQuery }}"
          </p>
        </div>

      </section>

      <!-- MAPA -->
      <section class="hidden lg:block lg:w-2/5 border-l">
        <div id="map" style="width: 100%; height: 100vh;"></div>
      </section>

    </main>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, nextTick, watch, provide } from 'vue';
import { useRoute } from 'vue-router';
import { usePropertyStore } from '../stores/property';
import PropertyCard from '../components/PropertyCard.vue';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const propertyStore = usePropertyStore();
const route = useRoute();

let map = null;
let markers = []; // Ahora son L.Marker con divIcon

const geocodeCity = async (cityName) => {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`;
  const res = await fetch(url, {
    headers: { 'Accept-Language': 'es' }
  });
  const data = await res.json();
  if (data.length > 0) {
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  }
  return null;
};

const createAirbnbIcon = (price, active = false) => {
  const formattedPrice = new Intl.NumberFormat('es-CO').format(price);
  const bgColor = active ? '#000' : '#fff';
  const textColor = active ? '#fff' : '#222';
  const borderColor = active ? '#000' : '#ddd';

  return L.divIcon({
    className: '', 
    html: `
      <div class="airbnb-marker ${active ? 'active' : ''}">
        <div class="marker-content" style="
          background: ${bgColor};
          color: ${textColor};
          border-color: ${borderColor};
        ">
          $${formattedPrice}
        </div>
      </div>
    `,
    iconAnchor: [0, 0], // se maneja con CSS transform en .airbnb-marker
  });
};

// ─── Carga / recarga el mapa ──────────────────────────────────────────────────
const loadMap = async () => {
  const mapContainer = document.getElementById('map');
  if (!mapContainer) return;

  // Destruir instancia anterior si existe
  if (map) {
    map.remove();
    map = null;
  }
  markers = [];

  // Inicializar mapa centrado en Colombia por defecto
  map = L.map('map', {
    center: [4.7110, -74.0721],
    zoom: 12,
    zoomControl: true,
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map);

  // Filtrar propiedades que coincidan con la búsqueda actual
  const propsCiudad = propertyStore.filteredProperties.filter(p =>
    p.city?.toLowerCase().includes(propertyStore.searchQuery?.toLowerCase() || '')
  );

  // Centrar mapa en la ciudad buscada
  if (propertyStore.searchQuery) {
    const coords = await geocodeCity(propertyStore.searchQuery);
    if (coords) {
      map.setView([coords.lat, coords.lng], 12);
    }
  }

  const bounds = L.latLngBounds();

  // Crear marcadores para cada propiedad usando Nominatim
  for (const p of propsCiudad) {
    const coords = await geocodeCity(p.city);
    if (!coords) continue;

    // Pequeño offset aleatorio para que no se apilen si hay varias propiedades en la misma ciudad
    const jitter = () => (Math.random() - 0.5) * 0.01;
    const lat = coords.lat + jitter();
    const lng = coords.lng + jitter();

    const marker = L.marker([lat, lng], {
      icon: createAirbnbIcon(p.price),
    }).addTo(map);

    // Guardar id para highlight
    marker.__id = p.id;

    marker.on('click', () => {
      map.setView([lat, lng], 15);
    });

    markers.push(marker);
    bounds.extend([lat, lng]);
  }

  // Ajustar vista a todos los marcadores
  if (markers.length > 0 && bounds.isValid()) {
    map.fitBounds(bounds, { padding: [40, 40] });
  }
};

const highlightMarker = (id) => {
  markers.forEach((m) => {
    const isActive = m.__id === id;
    const p = propertyStore.filteredProperties.find(prop => prop.id === m.__id);
    if (p) {
      m.setIcon(createAirbnbIcon(p.price, isActive));
    }
  });
};

const focusMarker = (p) => {
  if (!map) return;
  const marker = markers.find(m => m.__id === p.id);
  if (marker) {
    const latlng = marker.getLatLng();
    map.setView(latlng, 15);
  }
};

provide('highlightMarker', highlightMarker);
provide('focusMarker', focusMarker);

onMounted(async () => {
  if (route.query.q) {
    propertyStore.setSearchQuery(route.query.q);
  }
  await propertyStore.fetchProperties();
  await nextTick();
  loadMap();
});

// Limpiar mapa al desmontar el componente
onUnmounted(() => {
  if (map) {
    map.remove();
    map = null;
  }
});

watch(
  () => propertyStore.searchQuery,
  async () => {
    await propertyStore.fetchProperties();
    await nextTick();
    loadMap();
  }
);

defineExpose({ highlightMarker, focusMarker });
</script>

<style scoped>
/* El div#map necesita z-index base para que Leaflet funcione bien */
#map {
  z-index: 0;
}

.airbnb-marker {
  position: absolute;
  transform: translate(-50%, -100%);
  cursor: pointer;
  transition: transform 0.15s ease;
  z-index: 1;
}

.marker-content {
  background: white;
  padding: 6px 10px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 13px;
  color: #222;
  border: 1px solid #ddd;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
  white-space: nowrap;
  position: relative;
}

.marker-content::after {
  content: "";
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 6px;
  border-style: solid;
  border-color: white transparent transparent transparent;
}

.airbnb-marker:hover {
  transform: translate(-50%, -100%) scale(1.1);
  z-index: 999;
}

.airbnb-marker.active .marker-content {
  background: #000;
  color: white;
  border-color: #000;
}

.airbnb-marker.active .marker-content::after {
  border-color: #000 transparent transparent transparent;
}
</style>