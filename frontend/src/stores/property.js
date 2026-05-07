import { defineStore } from 'pinia';
import { getProperties } from "../services/properties";
import api from "../services/api";

export const usePropertyStore = defineStore('property', {
  state: () => ({
    searchQuery: '',
    dateRange: {
      start: null,
      end: null
    },
    guests: {
      adultos: 1,
      ninos: 0,
      bebes: 0,
      mascotas: 0
    },
    properties: [],
    loading: false,
  }),

  getters: {
    filteredProperties: (state) => {
      if (!state.searchQuery) return state.properties;

      const normalize = (text) =>
        text?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() || '';

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

    //  CREAR PROPIEDAD
    async createProperty(data) {
      try {
        const res = await api.post("/properties", data, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });

        return {
          success: true,
          data: res.data
        };

      } catch (error) {
        console.error("Error creando propiedad:", error.response?.data || error);

        return {
          success: false,
          message: "Error creando propiedad"
        };
      }
    },

    //  TODAS LAS PROPIEDADES
      async fetchProperties(filters = {}) {
        try {
          this.loading = true;

          const data = await getProperties(filters);

          this.properties = data.map(p => ({
            id: p.id,
            title: p.title,
            description: p.description || '',
            location: p.city,
            address: p.address,
            price: Number(p.price),
            rating: 4.5,
            image: p.image || "/default.jpg",
            amenities: p.amenities || [],
            max_guests: p.max_guests || 1
          }));

        } catch (error) {
          console.error("Error cargando propiedades", error);

        } finally {
          this.loading = false;
        }
      },
        async updateProperty(id, data) {
      try {
        const res = await api.put(`/properties/${id}`, data, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });

        return {
          success: true,
          data: res.data
        };

      } catch (error) {
        console.error(error);
        return {
          success: false,
          message: "Error actualizando propiedad"
        };
  }
    },

    //  MIS PROPIEDADES (HOST)
    async fetchMyProperties() {
      try {
        const res = await api.get("/properties/my-properties");

        this.properties = res.data.map(p => ({
          id: p.id,
          title: p.title,
          description: p.description || '',
          location: p.city,
          address: p.address,
          price: Number(p.price),
          rating: 4.5,
          image: p.image || "/default.jpg",
          is_active: p.is_active,
        }));

      } catch (error) {
        console.error(error);
      }
    },

    //  SOFT DELETE
    async deleteProperty(id) {
      try {
        await api.delete(`/properties/${id}`);
        await this.fetchMyProperties();
      } catch (error) {
        console.error(error);
      }
    },

    //  REACTIVAR
    async reactivateProperty(id) {
      try {
        await api.put(`/properties/${id}/reactivate`);
        await this.fetchMyProperties();
      } catch (error) {
        console.error(error);
      }
    }

  }
});