<template>
  <div class="create-view">
    <header class="create-header">
      <router-link to="/home" class="create-header__logo">HabiGo</router-link>
      <span class="create-header__step">
        Paso {{ formStore.currentStep }} de {{ formStore.totalSteps }}
      </span>
      <button class="create-header__save" type="button" @click="saveAndExit">
        Guardar y salir
      </button>
    </header>

    <main class="create-main">
      <section v-if="formStore.currentStep === 1" class="step">
        <h1 class="step__title">¿Qué tipo de espacio vas a publicar?</h1>
        <p class="step__subtitle">Selecciona la opción que mejor describa tu propiedad.</p>
        <SpaceTypeSelector v-model="formStore.spaceType" />
      </section>

      <section v-if="formStore.currentStep === 2" class="step">
        <h1 class="step__title">¿Cuántos huéspedes puede recibir tu espacio?</h1>
        <p class="step__subtitle">Puedes ajustarlo más adelante.</p>
        <div class="steppers-group">
          <NumericStepper label="Huéspedes" v-model="formStore.maxGuests" :min="1" :max="20" />
          <NumericStepper label="Habitaciones" v-model="formStore.rooms" :min="1" :max="20" />
          <NumericStepper label="Baños" v-model="formStore.bathrooms" :min="1" :max="10" />
        </div>
      </section>

      <section v-if="formStore.currentStep === 3" class="step">
        <h1 class="step__title">¿Dónde está ubicada tu propiedad?</h1>
        <p class="step__subtitle">Ingresa la ciudad. Las coordenadas son opcionales.</p>

        <div class="form-group">
          <label class="form-label">Ciudad *</label>
          <input
            class="form-input"
            type="text"
            placeholder="Ej: Medellín, Cali, Jamundí"
            :value="formStore.form.city"
            @input="formStore.updateField('city', $event.target.value)"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Latitud (opcional)</label>
            <input
              class="form-input"
              type="number"
              step="0.000001"
              placeholder="3.4516"
              :value="formStore.form.lat"
              @input="formStore.updateField('lat', $event.target.value)"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Longitud (opcional)</label>
            <input
              class="form-input"
              type="number"
              step="0.000001"
              placeholder="-76.5320"
              :value="formStore.form.lng"
              @input="formStore.updateField('lng', $event.target.value)"
            />
          </div>
        </div>
      </section>

      <section v-if="formStore.currentStep === 4" class="step">
        <h1 class="step__title">Agrega una imagen de tu propiedad</h1>
        <p class="step__subtitle">
          Ingresa la ruta relativa de la imagen. Ej: <code>/images/casa1.jpg</code>
        </p>

        <div class="form-group">
          <label class="form-label">Ruta de imagen</label>
          <input
            class="form-input"
            type="text"
            placeholder="/images/mi-propiedad.jpg"
            :value="formStore.form.image"
            @input="formStore.updateField('image', $event.target.value)"
          />
        </div>

        <div v-if="formStore.form.image" class="image-preview">
          <img
            :src="formStore.form.image"
            alt="Vista previa"
            @error="imageError = true"
          />
          <p v-if="imageError" class="image-preview__error">
            No se encontró la imagen en esa ruta.
          </p>
        </div>
      </section>

      <section v-if="formStore.currentStep === 5" class="step">
        <h1 class="step__title">Describe tu propiedad</h1>
        <p class="step__subtitle">
          Cuéntale a los huéspedes qué hace especial tu espacio.
        </p>

        <div class="form-group">
          <label class="form-label">Descripción *</label>
          <textarea
            class="form-input form-textarea"
            rows="6"
            placeholder="Mi propiedad tiene una vista increíble, está cerca de…"
            :value="formStore.form.description"
            @input="formStore.updateField('description', $event.target.value)"
          />
          <span class="form-hint">{{ formStore.form.description.length }} / 500 caracteres</span>
        </div>
      </section>

      <section v-if="formStore.currentStep === 6" class="step">
        <h1 class="step__title">Ponle nombre y precio a tu propiedad</h1>
        <p class="step__subtitle">
          Estos serán los primeros datos que verán los huéspedes.
        </p>

        <div class="form-group">
          <label class="form-label">Título *</label>
          <input
            class="form-input"
            type="text"
            placeholder="Ej: Apartamento acogedor en el centro de Cali"
            maxlength="100"
            :value="formStore.form.title"
            @input="formStore.updateField('title', $event.target.value)"
          />
          <span class="form-hint">{{ formStore.form.title.length }} / 100 caracteres</span>
        </div>

        <div class="form-group">
          <label class="form-label">Precio por noche (COP) *</label>
          <div class="input-prefix-wrap">
            <span class="input-prefix">$</span>
            <input
              class="form-input form-input--prefix"
              type="number"
              min="0"
              placeholder="150000"
              :value="formStore.form.price"
              @input="formStore.updateField('price', $event.target.value)"
            />
          </div>
        </div>

        <div class="summary-card">
          <h3 class="summary-card__title">Resumen de tu publicación</h3>
          <p><strong>Tipo:</strong> {{ formStore.spaceType || '—' }}</p>
          <p><strong>Ciudad:</strong> {{ formStore.form.city || '—' }}</p>
          <p><strong>Huéspedes:</strong> {{ formStore.maxGuests }}</p>
          <p><strong>Habitaciones:</strong> {{ formStore.rooms }} · <strong>Baños:</strong> {{ formStore.bathrooms }}</p>
          <p><strong>Precio:</strong> {{ formStore.form.price ? '$' + Number(formStore.form.price).toLocaleString('es-CO') : '—' }}</p>
        </div>
      </section>
    </main>

    <div v-if="errorMsg" class="error-toast">{{ errorMsg }}</div>

    <StepNavigation
      :isFirstStep="formStore.isFirstStep"
      :isLastStep="formStore.isLastStep"
      :progressPercent="formStore.progressPercent"
      :canContinue="canContinue"
      :loading="loading"
      @back="formStore.prevStep"
      @next="handleNext"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { usePropertyFormStore } from '../stores/propertyForm';
import { usePropertyStore } from '../stores/property';
import StepNavigation from '../components/StepNavigation.vue';
import NumericStepper from '../components/NumericStepper.vue';
import SpaceTypeSelector from '../components/SpaceTypeSelector.vue';

const router = useRouter();
const formStore = usePropertyFormStore();
const propertyStore = usePropertyStore();

const loading = ref(false);
const errorMsg = ref('');
const imageError = ref(false);

watch(() => formStore.form.image, () => { imageError.value = false; });

const canContinue = computed(() => {
  switch (formStore.currentStep) {
    case 1: return !!formStore.spaceType;
    case 2: return formStore.maxGuests >= 1;
    case 3: return formStore.form.city.trim().length >= 2;
    case 4: return true;
    case 5: return formStore.form.description.trim().length >= 10;
    case 6:
      return (
        formStore.form.title.trim().length >= 4 &&
        Number(formStore.form.price) > 0
      );
    default: return true;
  }
});

function handleNext() {
  if (!canContinue.value) return;
  formStore.nextStep();
}

async function handleSubmit() {
  if (!canContinue.value) return;

  loading.value = true;
  errorMsg.value = '';

  const result = await propertyStore.createProperty(formStore.payload);

  loading.value = false;

  if (result.success) {
    formStore.reset();
    router.push('/dashboard');
  } else {
    errorMsg.value = result.message;
  }
}

function saveAndExit() {
  router.push('/home');
}
</script>

<style scoped>
.create-view {
  min-height: 100vh;
  background: #fff;
  padding-bottom: 100px;
}

.create-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 40;
}

.create-header__logo {
  font-size: 20px;
  font-weight: 700;
  color: #e8404a;
  text-decoration: none;
}

.create-header__step {
  font-size: 13px;
  color: #6b7280;
}

.create-header__save {
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 500;
  text-decoration: underline;
  cursor: pointer;
  color: #222;
}

.create-main {
  max-width: 720px;
  margin: 0 auto;
  padding: 48px 24px 32px;
}

.step__title {
  font-size: 26px;
  font-weight: 600;
  color: #111;
  margin-bottom: 8px;
  line-height: 1.3;
}

.step__subtitle {
  font-size: 15px;
  color: #6b7280;
  margin-bottom: 32px;
}

.steppers-group {
  display: flex;
  flex-direction: column;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  padding: 0 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.form-input {
  padding: 12px 14px;
  border: 1.5px solid #d1d5db;
  border-radius: 10px;
  font-size: 15px;
  color: #111;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;
  box-sizing: border-box;
}

.form-input:focus { border-color: #222; }

.form-textarea { resize: vertical; }

.form-hint {
  font-size: 12px;
  color: #9ca3af;
  text-align: right;
}

.input-prefix-wrap {
  display: flex;
  align-items: center;
  border: 1.5px solid #d1d5db;
  border-radius: 10px;
  overflow: hidden;
  transition: border-color 0.2s;
}

.input-prefix-wrap:focus-within { border-color: #222; }

.input-prefix {
  padding: 12px 14px;
  background: #f3f4f6;
  font-size: 15px;
  color: #6b7280;
  border-right: 1.5px solid #d1d5db;
}

.form-input--prefix {
  border: none;
  border-radius: 0;
  flex: 1;
}

.form-input--prefix:focus { border-color: transparent; }

.image-preview {
  margin-top: 16px;
  border-radius: 12px;
  overflow: hidden;
  max-height: 280px;
}

.image-preview img {
  width: 100%;
  height: 280px;
  object-fit: cover;
  display: block;
}

.image-preview__error {
  margin-top: 8px;
  font-size: 13px;
  color: #e8404a;
}

.summary-card {
  margin-top: 28px;
  padding: 20px 24px;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  background: #fafafa;
}

.summary-card__title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #111;
}

.summary-card p {
  font-size: 14px;
  color: #374151;
  margin: 4px 0;
}

.error-toast {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  background: #e8404a;
  color: #fff;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 14px;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

@media (max-width: 600px) {
  .create-header { padding: 12px 16px; }
  .create-main { padding: 32px 16px 24px; }
  .step__title { font-size: 20px; }
  .form-row { grid-template-columns: 1fr; }
}
</style>