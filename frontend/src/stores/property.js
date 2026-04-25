import { defineStore } from 'pinia';
import { getProperties, createProperty } from "../services/properties";

export const usePropertyStore = defineStore('property', {
  state: () => ({
    searchQuery: '',
    dateRange: {
      start: null,
      end: null
    },
    guests: {
      adultos: 0,
      ninos: 0,
      bebes: 0,
      mascotas: 0
    },
    properties: [],
  }),

  getters: {
    filteredProperties: (state) => {
      if (!state.searchQuery) return state.properties;

  const normalize = (text) =>
    text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

      const query = normalize(state.searchQuery);

  return state.properties.filter(p =>
    normalize(p.location).includes(query) ||
    normalize(p.title).includes(query)
  );
},

    totalGuests: (state) => {
      return state.guests.adultos + state.guests.ninos + state.guests.bebes;
    },

    formattedDateRange: (state) => {
      if (!state.dateRange.start || !state.dateRange.end)
        return 'Agrega fechas';

      const start = new Date(state.dateRange.start).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short'
      });

      const end = new Date(state.dateRange.end).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short'
      });

      return `${start} - ${end}`;
    }
  },

  actions: {
    setSearchQuery(val) {
      this.searchQuery = val;
    },

    updateGuests(type, amount) {
      const newValue = this.guests[type] + amount;
      if (newValue >= 0) {
        this.guests[type] = newValue;
      }
    },

  async fetchProperties() {
    try {
      const data = await getProperties();

      console.log("DATA BACKEND:", data);

      this.properties = data.map(p => ({
        id: p.id,
        title: p.title,
        location: p.city,
        price: p.price,
        rating: 4.5,
        image: p.image || "/default.jpg"
      }));

    } catch (error) {
      console.error("Error cargando propiedades", error);
    }
  }
}
});
