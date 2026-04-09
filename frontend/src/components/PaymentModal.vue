<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

    <div class="bg-white rounded-2xl p-6 w-[400px] shadow-xl">

      <h2 class="text-xl font-semibold mb-4">Confirmar pago</h2>

      <!-- TOTAL -->
      <p class="text-gray-600 mb-4">
        Total a pagar:
        <span class="font-bold text-lg">$ {{ total }}</span>
      </p>

      <form @submit.prevent="handlePayment" class="space-y-3">

        <input v-model="cardNumber" placeholder="Número de tarjeta"
          class="w-full border p-2 rounded" />

        <input v-model="name" placeholder="Nombre en la tarjeta"
          class="w-full border p-2 rounded" />

        <div class="flex gap-2">
          <input v-model="expiry" placeholder="MM/YY"
            class="w-1/2 border p-2 rounded" />
          <input v-model="cvv" placeholder="CVV"
            class="w-1/2 border p-2 rounded" />
        </div>

        <!-- ERROR -->
        <p v-if="error" class="text-red-500 text-sm">
          {{ error }}
        </p>

        <!-- BOTONES -->
        <div class="flex gap-2 mt-4">
          <button type="button"
            @click="$emit('close')"
            class="w-1/2 border rounded py-2">
            Cancelar
          </button>

          <button
            class="w-1/2 bg-teal-500 text-white rounded py-2"
            :disabled="loading"
          >
            {{ loading ? "Procesando..." : "Pagar" }}
          </button>
        </div>

      </form>

    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  total: Number,
  propertyId: Number
});

const emit = defineEmits(['close', 'success']);

const cardNumber = ref('');
const name = ref('');
const expiry = ref('');
const cvv = ref('');
const error = ref('');
const loading = ref(false);

const handlePayment = () => {
  error.value = '';

  // VALIDACIONES
  if (cardNumber.value.length < 16) {
    error.value = 'Tarjeta inválida';
    return;
  }

  if (!name.value) {
    error.value = 'Nombre requerido';
    return;
  }

  if (!expiry.value) {
    error.value = 'Fecha inválida';
    return;
  }

  if (cvv.value.length < 3) {
    error.value = 'CVV inválido';
    return;
  }

  loading.value = true;

  const payload = {
    cardNumber: cardNumber.value,
    name: name.value,
    expiry: expiry.value,
    cvv: cvv.value,
    amount: props.total,
    propertyId: props.propertyId
  };

  console.log("PAYMENT PAYLOAD", payload);

  // SIMULACIÓN (luego backend real)
  setTimeout(() => {
    loading.value = false;
    emit('success');
  }, 2000);
};
</script>