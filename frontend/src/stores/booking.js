import { defineStore } from "pinia";
import api from "../services/api";

export const useBookingStore = defineStore("booking", {
  state: () => ({
    bookings: [],
    loading: false,
    error: null,
  }),

  actions: {
    async getBookings() {
      this.loading = true;
      try {
        const res = await api.get("/bookings");
        this.bookings = res.data;
      } catch (err) {
        this.error = "Error cargando reservas";
      } finally {
        this.loading = false;
      }
    },

    async createBooking(data) {
      try {
        await api.post("/bookings", data);
      } catch (err) {
        this.error = "Error creando reserva";
      }
    },
  },
});