<template>
  <div class="p-6 max-w-xl mx-auto">

    <h1 class="text-2xl font-bold mb-4">
      Editar propiedad
    </h1>

    <form @submit.prevent="submit">

      <input v-model="form.title" placeholder="Título" class="input mb-3" />

      <input v-model="form.city" placeholder="Ciudad" class="input mb-3" />

      <input v-model="form.price" type="number" placeholder="Precio" class="input mb-3" />

      <input v-model="form.max_guests" type="number" placeholder="Huéspedes" class="input mb-3" />

      <textarea v-model="form.description" placeholder="Descripción" class="input mb-3"></textarea>

      <button class="btn-primary w-full py-2">
        Guardar cambios
      </button>

    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePropertyStore } from "../stores/property";

const route = useRoute();
const router = useRouter();
const store = usePropertyStore();

const form = ref({
  title: "",
  city: "",
  price: "",
  description: "",
  max_guests: 1
});

// 🔥 cargar propiedad
onMounted(async () => {
  await store.fetchMyProperties();

  const prop = store.properties.find(
    p => p.id === Number(route.params.id)
  );

  if (prop) {
    form.value = {
      title: prop.title,
      city: prop.location,
      price: prop.price,
      description: prop.description,
      max_guests: prop.max_guests
    };
  }
});

// 🔥 guardar
const submit = async () => {
  const res = await store.updateProperty(route.params.id, form.value);

  if (res.success) {
    alert("Propiedad actualizada");
    router.push("/my-properties");
  } else {
    alert(res.message);
  }
};
</script>