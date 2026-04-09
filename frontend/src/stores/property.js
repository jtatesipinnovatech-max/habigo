import { defineStore } from 'pinia';

export const usePropertyStore = defineStore('property', {
  state: () => ({
    properties: [
  {
    id: 1,
    title: "Apartamento moderno en el sur",
    location: "Cali",
    price: 120,
    rating: 4.8,
    image: "/Public/Apartamento_sur.jpg"
  },
  {
    id: 2,
    title: "Casa campestre con piscina",
    location: "Jamundí",
    price: 250,
    rating: 4.9,
    image: "/Public/Casa_campestre.jpg"
  },
  {
    id: 3,
    title: "Hotel boutique en el centro",
    location: "Cali",
    price: 180,
    rating: 4.7,
    image: "/Public/Hotel_centro.jpg"
  },
  {
    id: 4,
    title: "Cabaña en la montaña",
    location: "Dapa",
    price: 300,
    rating: 5.0,
    image: "/Public/Cabaña_montaña.jpg"
  },
  {
    id: 5,
    title: "Loft moderno con vista",
    location: "Cali",
    price: 150,
    rating: 4.6,
    image: "/Public/Loft_modern.jpg"
  },
  {
    id: 6,
    title: "Finca tradicional con zonas verdes",
    location: "Palmira",
    price: 280,
    rating: 4.9,
    image: "/Public/Finca.jpg"
  },
  {
    id: 7,
    title: "Glamping de lujo en la naturaleza",
    location: "Dapa",
    price: 350,
    rating: 5.0,
    image: "/Public/Glamping.jpg"
  },
  {
    id: 8,
    title: "Hotel con vista a la ciudad",
    location: "Cali",
    price: 200,
    rating: 4.5,
    image: "/Public/Hotel_cuidad.jpg"
  },
  {
    id: 9,
    title: "Apartamento acogedor en el norte",
    location: "Cali",
    price: 100,
    rating: 4.4,
    image: "/Public/Apt_norte.jpg"
  },
  {
    id: 10,
    title: "Casa familiar amplia",
    location: "Jamundí",
    price: 220,
    rating: 4.7,
    image: "/Public/Casa_familiar.jpg"
  },
  {
    id: 11,
    title: "Finca con lago y caballos",
    location: "Palmira",
    price: 400,
    rating: 5.0,
    image: "/Public/Caballos_lago.jpg"
  },
  {
    id: 12,
    title: "Glamping romántico para parejas",
    location: "Dapa",
    price: 320,
    rating: 4.9,
    image: "/Public/Glamping_parejas.webp"
  },
  {
    id: 13,
    title: "Hotel económico céntrico",
    location: "Cali",
    price: 90,
    rating: 4.2,
    image: "/Public/Hotel_economico.jpg"
  },
  {
    id: 14,
    title: "Apartamento premium",
    location: "Cali",
    price: 160,
    rating: 4.8,
    image: "/Public/Apt_moderno.jpg"
  },
  {
    id: 15,
    title: "Casa de lujo con jacuzzi",
    location: "Pance",
    price: 500,
    rating: 5.0,
    image: "/Public/Apt_jacuzzi.jpg"
  },

]
  }),

  actions: {
    addProperty(property) {
      this.properties.push(property);
    }
  }
});