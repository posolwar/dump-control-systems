<script setup lang="ts">
import { ref, watch } from 'vue';


const { modelValue,label } = defineProps<{ modelValue: boolean,label?:string }>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const isChecked = ref(modelValue);

watch(() => modelValue, (newValue) => {
  isChecked.value = newValue;
});

const toggle = () => {
  isChecked.value = !isChecked.value;
  emit('update:modelValue', isChecked.value);
};
</script>

<template>
  <div class="switch-container">
    <label v-if="label" class="switch-label">{{ label }}</label>
  <div class="switch" :class="{ 'is-checked': modelValue }" @click="toggle">
    <div class="switch-handle"></div>
  </div>
</div>
</template>


<style scoped lang="scss">
.switch {
  width: 40px;
  height: 20px;
  background-color: var(--gray);
  border-radius: 10px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s;
}

.switch.is-checked {
  background-color: var(--border);
}

.switch-handle {
  width: 20px;
  height: 20px;
  background-color: #fff;
  border-radius: 50%;
  position: absolute;
  top: 0;
  transition: transform 0.3s;
}

.switch.is-checked .switch-handle {
  transform: translateX(20px);
}
.switch-label {
  display: block;
  margin-bottom: 8px;
  font-size: 16px;
  color: var(--dark-blue);
}
</style>
