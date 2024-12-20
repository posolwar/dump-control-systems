<script setup lang="ts">
import type { ISelectOption } from '@/types/select';
import { watch } from 'vue'


interface Props {
  modelValue: string | null;
  options: ISelectOption[]
  label?: string
  id?: string
  placeholder?: string
}

const { modelValue, options, label, id, placeholder } = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
}>()

const onChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}

// Optional: Watch for changes in props.modelValue to update the select value
watch(
  () => modelValue,
  (newValue) => {
    console.log('modelValue changed to:', newValue)
  },
)
</script>

<template>
  <div class="select">
    <label v-if="label" :for="id" class="select-label">{{ label }}</label>
    <select :id="id" :value="modelValue" @change="onChange" class="select-content">
      <option v-if="placeholder" :value="null" disabled >{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<style scoped lang="scss">
.select{
  &-content{
    width: 100%;
    background-color: var(--gray);
    color: var(--dark-blue);
  }
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

select {
  padding: 0.5rem;
  font-size: 1rem;
}
</style>
