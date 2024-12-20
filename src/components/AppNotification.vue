<script setup lang="ts">
import { ref, onMounted } from 'vue'

const { message, duration } = defineProps<{ message: string; duration?: number }>()

const visible = ref(false)

onMounted(() => {
  visible.value = true
  setTimeout(() => {
    visible.value = false
  }, duration || 3000)
})
</script>

<template>
  <div v-if="visible" class="notification">
    {{ message }}
  </div>
</template>

<style scoped>
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #4caf50;
  color: var(--white);
  padding: 10px 20px;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}
</style>
