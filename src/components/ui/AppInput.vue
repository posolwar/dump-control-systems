<script setup lang="ts">
const {
  id,
  label,
  type = 'text',
  modelValue,
  placeholder,
  disabled,
} = defineProps<{
  id?: string
  label?: string
  type?: 'text' | 'password' | 'email' | 'number'
  placeholder?: string
  modelValue?: string | number
  disabled?: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="app-input-container">
    <label :for="id" v-if="label" class="app-label">{{ label }}</label>
    <input
      class="app-input"
      :id="id"
      :type="type"
      :value="modelValue"
      @input="updateValue"
      :placeholder="placeholder"
      :disabled="disabled"
    />
  </div>
</template>

<style scoped lang="scss">
.app-input-container {
  @media screen and (max-width: 580px) {
    width: 100%;
  }
}
.app-label {
  display: block;
  margin-bottom: 0.5rem;
}

.app-input {
  width: 100%;
  padding: 6px 9px;
  border: 1px solid var(--dark-blue);
  border-radius: 10px;
  background-color: var(--gray);
  font-size: 16px;
  line-height: 18px;
  &:focus {
    outline-color: var(--dark-blue);
  }
}

.app-input:disabled {
  background-color: #f0f0f0;
}
</style>
