import { defineStore } from "pinia";

export const usePropertyStore = defineStore("property", {
  state: () => ({
    properties: [
      {
        id: 1,
        title: "Apartamento moderno",
        location: "Cali",
        price: 120,
        rating: 4.8,
        image: "https://via.placeholder.com/400",
      },
      {
        id: 2,
        title: "Casa campestre",
        location: "Jamundí",
        price: 200,
        rating: 4.9,
        image: "https://via.placeholder.com/400",
      },
    ],
  }),
});