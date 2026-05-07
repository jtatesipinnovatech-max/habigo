import { defineStore } from 'pinia';

export const usePropertyFormStore = defineStore('propertyForm', {
  state: () => ({
    currentStep: 1,
    totalSteps: 7,

    form: {
      title: '',
      description: '',
      price: null,
      city: '',
      address: '',
      image: '',
      amenities: [] 
    },

    spaceType: '',
    rooms: 1,
    bathrooms: 1,
    maxGuests: 1,
  }),

  getters: {
    isFirstStep: (state) => state.currentStep === 1,
    isLastStep: (state) => state.currentStep === state.totalSteps,

    progressPercent: (state) =>
      Math.round((state.currentStep / state.totalSteps) * 100),

    payload: (state) => ({
      title: state.form.title.trim(),
      description: state.form.description.trim(),
      price: Number(state.form.price),
      city: state.form.city.trim(),
      address: state.form.address.trim(),
      image: state.form.image?.trim() || '/images/default.jpg',

      
      amenities: state.form.amenities,
      max_guests: state.maxGuests,
    }),
  },

  actions: {
    nextStep() {
      if (this.currentStep < this.totalSteps) this.currentStep++;
    },

    prevStep() {
      if (this.currentStep > 1) this.currentStep--;
    },

    goToStep(n) {
      if (n >= 1 && n <= this.totalSteps) this.currentStep = n;
    },

    updateField(field, value) {
      this.form[field] = value;
    },

    reset() {
      this.currentStep = 1;

      this.form = {
        title: '',
        description: '',
        price: null,
        city: '',
        address: '',
        image: '',
        amenities: [] 
      };

      this.spaceType = '';
      this.rooms = 1;
      this.bathrooms = 1;
      this.maxGuests = 1;
    },
  },
});