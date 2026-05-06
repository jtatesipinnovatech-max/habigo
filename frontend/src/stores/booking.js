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
    async fetchMyBookings() {
        const res = await api.get("/bookings/my-bookings");

        this.bookings = res.data;
    },

    async createBooking(data) {
      console.log("📦 FRONT ENVÍA:", data);
      try {
        await api.post("/bookings", data);
      } catch (err) {
        this.error = "Error creando reserva";
      }
    },
    async cancelBooking(id) {
      try {
        await api.delete(`/bookings/${id}`);

        //  refrescar lista
        await this.fetchMyBookings();

      } catch (error) {
        throw error;
      }
    },
  },
});