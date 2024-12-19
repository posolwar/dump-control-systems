<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <slot></slot>
      <button class="modal-button" @click="closeModal">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="36px" height="36px">
          <path
            d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const { modelValue = false, id } = defineProps<{ modelValue: boolean; id?: string }>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean, id?: string): void
}>()

const isOpen = ref(modelValue)

watch(
  () => modelValue,
  (newVal) => {
    isOpen.value = newVal
  },
)

const closeModal = () => {
  isOpen.value = false
  emit('update:modelValue', false, id)
}
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: var(--ligty-gray);
  padding: 60px 20px 20px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  color: var(--dark-blue);
  position: relative;
  max-width: 600px;
  width: 100%;
}
.modal-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--dark-blue);
}
</style>
