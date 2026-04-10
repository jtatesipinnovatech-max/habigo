import { defineStore } from 'pinia';

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
    properties: [
      { id: 1, title: "Apartamento moderno en el sur", location: "Cali", price: 120, rating: 4.8, image: "/Apartamento_sur.jpg" },
      { id: 2, title: "Casa campestre con piscina", location: "Jamundí", price: 250, rating: 4.9, image: "/Casa_campestre.jpg" },
      { id: 3, title: "Hotel boutique en el centro", location: "Cali", price: 180, rating: 4.7, image: "/Hotel_centro.jpg" },
      { id: 4, title: "Cabaña en la montaña", location: "Dapa", price: 300, rating: 5.0, image: "/Cabaña_montaña.jpg" },
      { id: 5, title: "Loft moderno con vista", location: "Cali", price: 150, rating: 4.6, image: "/Loft_modern.jpg" },
      { id: 6, title: "Finca tradicional con zonas verdes", location: "Palmira", price: 280, rating: 4.9, image: "/Finca_tradicional.jpg" },
      { id: 7, title: "Glamping de lujo en la naturaleza", location: "Dapa", price: 350, rating: 5.0, image: "/Glamping_lujo.jpg" },
      { id: 8, title: "Hotel con vista a la ciudad", location: "Cali", price: 200, rating: 4.5, image: "/Hotel_vista.jpg" },
      { id: 9, title: "Apartamento acogedor en el norte", location: "Cali", price: 100, rating: 4.4, image: "/Apartamento_norte.jpg" },
      { id: 10, title: "Casa familiar amplia", location: "Jamundí", price: 220, rating: 4.7, image: "/Casa_familiar.jpg" },
      { id: 11, title: "Finca con lago y caballos", location: "Palmira", price: 400, rating: 5.0, image: "/Finca_lago.jpg" },
      { id: 12, title: "Glamping romántico para parejas", location: "Dapa", price: 320, rating: 4.9, image: "/Glamping_romantico.jpg" },
      { id: 13, title: "Hotel económico céntrico", location: "Cali", price: 90, rating: 4.2, image: "/Hotel_economico.jpg" },
      { id: 14, title: "Apartamento premium", location: "Cali", price: 160, rating: 4.8, image: "/Apartamento_premium.jpg" },
      { id: 15, title: "Casa de lujo con jacuzzi", location: "Pance", price: 500, rating: 5.0, image: "/Casa_lujo.jpg" }
    ]
  }),
  getters: {
    filteredProperties: (state) => {
      const query = state.searchQuery.toLowerCase().trim();
      if (!query) return state.properties;
      return state.properties.filter(p => 
        p.location.toLowerCase().includes(query) || 
        p.title.toLowerCase().includes(query)
      );
    },
    totalGuests: (state) => {
      return state.guests.adultos + state.guests.ninos + state.guests.bebes;
    },
    formattedDateRange: (state) => {
      if (!state.dateRange || !state.dateRange.start || !state.dateRange.end) return 'Agrega fechas';
      const start = new Date(state.dateRange.start).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
      const end = new Date(state.dateRange.end).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
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
    }
  }
});