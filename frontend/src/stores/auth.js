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
          this.user = res.data.user;
          this.isAuthenticated = true;

          localStorage.setItem("token", this.token);

          return true; 

        } catch (error) {
          console.error(error.response?.data);

          this.token = null;
          this.user = null;
          this.isAuthenticated = false;

          localStorage.removeItem("token");

          throw error; 
        }
    },

    async register(data, role = "guest") {
      try {
        await api.post("/users/register", {
          ...data,
          role
        });

        alert("Usuario registrado 🔥");
      } catch (error) {
        console.error(error.response?.data);
        alert(error.response?.data?.message || "Error en registro");
      }
    }, 

    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      localStorage.removeItem("token");
    }
  }
});