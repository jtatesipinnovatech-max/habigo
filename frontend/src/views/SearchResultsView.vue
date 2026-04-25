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
import { onMounted, nextTick, watch, provide } from 'vue';
import { useRoute } from 'vue-router';
import { usePropertyStore } from '../stores/property';
import PropertyCard from '../components/PropertyCard.vue';

const propertyStore = usePropertyStore();
const route = useRoute();

let map = null;
let overlays = []; //

const loadMap = () => {
  if (!window.google) return;

  const mapContainer = document.getElementById("map");
  if (!mapContainer) return;

  mapContainer.innerHTML = "";
  overlays = [];

  map = new google.maps.Map(mapContainer, {
    center: { lat: 4.7110, lng: -74.0721 },
    zoom: 12,
  });

  const geocoder = new google.maps.Geocoder();

  if (propertyStore.searchQuery) {
    geocoder.geocode(
      { address: propertyStore.searchQuery },
      (results, status) => {
        if (status === "OK") {
          map.setCenter(results[0].geometry.location);
          map.setZoom(12);
        }
      }
    );
  }

  const propsCiudad = propertyStore.filteredProperties.filter(p =>
    p.city?.toLowerCase().includes(propertyStore.searchQuery?.toLowerCase())
  );

  propsCiudad.forEach((p) => {
    if (p.lat && p.lng) {

      const position = new google.maps.LatLng(
        Number(p.lat),
        Number(p.lng)
      );

      const overlay = new google.maps.OverlayView();

      overlay.onAdd = function () {
        const div = document.createElement("div");
        div.className = "airbnb-marker";
        div.innerHTML = `
          <div class="marker-content">
            $${new Intl.NumberFormat('es-CO').format(p.price)}
          </div>
        `;

        div.dataset.id = p.id;

        div.addEventListener("click", () => {
          map.setCenter(position);
          map.setZoom(15);

          document.querySelectorAll(".airbnb-marker").forEach(el => {
            el.classList.remove("active");
          });
          div.classList.add("active");
        });

        this.div = div;
        const panes = this.getPanes();
        panes.overlayMouseTarget.appendChild(div);
      };

      overlay.draw = function () {
        const projection = this.getProjection();
        const pos = projection.fromLatLngToDivPixel(position);

        if (this.div) {
          this.div.style.left = pos.x + "px";
          this.div.style.top = pos.y + "px";
        }
      };

      overlay.onRemove = function () {
        if (this.div) {
          this.div.remove();
          this.div = null;
        }
      };

      overlay.setMap(map);

      overlay.__id = p.id;
      overlays.push(overlay);
    }
  });

  const bounds = new google.maps.LatLngBounds();

  propsCiudad.forEach((p) => {
    if (p.lat && p.lng) {
      bounds.extend({
        lat: Number(p.lat),
        lng: Number(p.lng)
      });
    }
  });

  if (!bounds.isEmpty() && propsCiudad.length > 0) {
    map.fitBounds(bounds);
  }
};

const highlightMarker = (id) => {
  overlays.forEach((o) => {
    if (o.div) {
      if (o.__id === id) {
        o.div.classList.add("active");
      } else {
        o.div.classList.remove("active");
      }
    }
  });
};   

const focusMarker = (p) => {
  if (!map) return;

  map.setCenter({
    lat: Number(p.lat),
    lng: Number(p.lng)
  });

  map.setZoom(15);
};

provide("highlightMarker", highlightMarker);
provide("focusMarker", focusMarker);

onMounted(async () => {
  if (route.query.q) {
    propertyStore.setSearchQuery(route.query.q);
  }

  await propertyStore.fetchProperties();
  await nextTick();

  if (!window.google) {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC06MTwnXuYgvRi-0cpVhUWpaYU9RW1t_o`;
    script.async = true;

    script.onload = loadMap;
    document.head.appendChild(script);
  } else {
    loadMap();
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

defineExpose({
  highlightMarker,
  focusMarker
});
</script>

<style scoped>
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
  box-shadow: 0 6px 18px rgba(0,0,0,0.25);
  white-space: nowrap;
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