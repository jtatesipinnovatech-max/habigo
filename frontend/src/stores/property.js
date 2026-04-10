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
        image: "/Apartamento_sur.jpg"
      },
      {
        id: 2,
        title: "Casa campestre con piscina",
        location: "Jamundí",
        price: 250,
        rating: 4.9,
        image: "/Casa_campestre.jpg"
      },
      {
        id: 3,
        title: "Hotel boutique en el centro",
        location: "Cali",
        price: 180,
        rating: 4.7,
        image: "/Hotel_centro.jpg"
      },
      {
        id: 4,
        title: "Cabaña en la montaña",
        location: "Dapa",
        price: 300,
        rating: 5.0,
        image: "/Cabaña_motaña.jpg"
      },
      {
        id: 5,
        title: "Loft moderno con vista",
        location: "Cali",
        price: 150,
        rating: 4.6,
        image: "/Loft_modern.jpeg"
      },
      {
        id: 6,
        title: "Finca tradicional con zonas verdes",
        location: "Palmira",
        price: 280,
        rating: 4.9,
        image: "/Finca.jpg"
      },
      {
        id: 7,
        title: "Glamping de lujo en la naturaleza",
        location: "Dapa",
        price: 350,
        rating: 5.0,
        image: "/Glamping.jpg"
      },
      {
        id: 8,
        title: "Hotel con vista a la ciudad",
        location: "Cali",
        price: 200,
        rating: 4.5,
        image: "Hotel_cuidad.jpg"
      },
      {
        id: 9,
        title: "Apartamento acogedor en el norte",
        location: "Cali",
        price: 100,
        rating: 4.4,
        image: "/Apt_norte.jpeg"
      },
      {
        id: 10,
        title: "Casa familiar amplia",
        location: "Jamundí",
        price: 220,
        rating: 4.7,
        image: "/Casa_familiar.jpeg"
      },
      {
        id: 11,
        title: "Apartamento con jacuzzi",
        location: "Cali",
        price: 300,
        rating: 4.9,
        image: "/Apt_jacuzzi.jpeg"
      },
      {
        id: 12,
        title: "Glamping romántico para parejas",
        location: "Dapa",
        price: 320,
        rating: 4.9,
        image: "/Glamping_parejas.webp"
      },
      {
        id: 13,
        title: "Hotel económico céntrico",
        location: "Cali",
        price: 90,
        rating: 4.2,
        image: "/Hotel_economico.jpg"
      },
      {
        id: 14,
        title: "Apartamento moderno premium",
        location: "Cali",
        price: 160,
        rating: 4.8,
        image: "/Apt_moderno.jpeg"
      },
      {
        id: 15,
        title: "Apartamento con jacuzzi moderno",
        location: "Cali",
        price: 500,
        rating: 5.0,
        image: "/Apt_jacuzzi.jpeg"
      }
    ]
  }),

  actions: {
    addProperty(property) {
      this.properties.push(property);
    }
  }
});