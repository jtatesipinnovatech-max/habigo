<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
    <div class="bg-white rounded-2xl p-6 w-full max-w-[420px] shadow-xl">

      <!-- HEADER -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold">Confirmar pago</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-black transition">
          <X :size="20" />
        </button>
      </div>

      <!-- TOTAL -->
      <div class="bg-gray-50 rounded-xl p-4 mb-6">
        <p class="text-sm text-gray-500">Total a pagar</p>
        <p class="text-2xl font-bold text-gray-900">
          {{ formatPrice(total) }}
        </p>
      </div>

      <form @submit.prevent="handlePayment" class="space-y-3">

        <div>
          <label class="text-xs font-bold uppercase text-gray-500 mb-1 block">
            Número de tarjeta
          </label>
          <input
            v-model="cardNumber"
            placeholder="1234 5678 9012 3456"
            maxlength="16"
            class="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
          />
        </div>

        <div>
          <label class="text-xs font-bold uppercase text-gray-500 mb-1 block">
            Nombre en la tarjeta
          </label>
          <input
            v-model="name"
            placeholder="Juan Pérez"
            class="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
          />
        </div>

        <div class="flex gap-3">
          <div class="flex-1">
            <label class="text-xs font-bold uppercase text-gray-500 mb-1 block">
              Vencimiento
            </label>
            <input
              v-model="expiry"
              placeholder="MM/YY"
              maxlength="5"
              class="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
            />
          </div>
          <div class="flex-1">
            <label class="text-xs font-bold uppercase text-gray-500 mb-1 block">
              CVV
            </label>
            <input
              v-model="cvv"
              placeholder="123"
              maxlength="3"
              class="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
            />
          </div>
        </div>

        <!-- ERROR -->
        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>

        <!-- BOTONES -->
        <div class="flex gap-3 mt-2">
          <button
            type="button"
            @click="$emit('close')"
            class="w-1/2 border rounded-xl py-3 text-sm font-medium hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="w-1/2 bg-[#0d9488] hover:bg-[#0f766e] text-white rounded-xl py-3 text-sm font-bold transition"
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
import { X } from 'lucide-vue-next';

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

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(price);
};

const handlePayment = () => {
  error.value = '';

  if (cardNumber.value.length < 16) { error.value = 'Tarjeta inválida'; return; }
  if (!name.value) { error.value = 'Nombre requerido'; return; }
  if (!expiry.value) { error.value = 'Fecha inválida'; return; }
  if (cvv.value.length < 3) { error.value = 'CVV inválido'; return; }

  loading.value = true;

  setTimeout(() => {
    loading.value = false;
    emit('success');
  }, 2000);
};
</script>