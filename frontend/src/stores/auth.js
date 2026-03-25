import { defineStore } from "pinia";
import api from "../services/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || null,
    isAuthenticated: !!localStorage.getItem("token"),
    loading: false,
    error: null,
  }),

  actions: {
    async login(credentials) {
      this.loading = true;
      this.error = null;

      try {
        const res = await api.post("/auth/login", credentials);

        this.token = res.data.token;
        this.user = res.data.user;
        this.isAuthenticated = true;

        localStorage.setItem("token", this.token);
      } catch (err) {
        this.error = "Credenciales incorrectas";
      } finally {
        this.loading = false;
      }
    },

    async register(data) {
      this.loading = true;
      this.error = null;

      try {
        await api.post("/auth/register", data);
      } catch (err) {
        this.error = "Error en registro";
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      localStorage.removeItem("token");
    },
  },
});