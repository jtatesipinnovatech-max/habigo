import { defineStore } from "pinia";
import api from "../services/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token"),
    isAuthenticated: !!localStorage.getItem("token"),
  }),

  actions: {
    async login(data) {
      try {
        const res = await api.post("/users/login", data);

        this.token = res.data.token;
        this.user = { email: data.email };
        this.isAuthenticated = true;

        localStorage.setItem("token", this.token);
      } catch (error) {
        console.error(error.response?.data);
        alert(error.response?.data?.message || "Error en login");
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