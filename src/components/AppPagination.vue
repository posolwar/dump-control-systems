<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const props = defineProps<{
  totalItems: number;
  itemsPerPage: number;
  modelValue?: number;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
}>();

const currentPage = ref(props.modelValue || 1);

const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage));

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    emit('update:modelValue', currentPage.value);
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    emit('update:modelValue', currentPage.value);
  }
};

const goToPage = (page: number) => {
  currentPage.value = page;
  emit('update:modelValue', currentPage.value);
};

watch(() => props.modelValue, (newVal) => {
  if (newVal ) {
    currentPage.value = newVal;
  }
});
</script>

<template>
  <div class="pagination">
    <button @click="prevPage" :disabled="currentPage === 1"><svg class="prev" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9.00015 4.58569L16.4144 11.9999L9.00015 19.4141L7.58594 17.9999L13.5859 11.9999L7.58594 5.99991L9.00015 4.58569Z" fill="black"/></svg>
    </button>
    <button
      v-for="page in totalPages"
      :key="page"
      @click="goToPage(page)"
      :class="{ active: page === currentPage }"
    >
      {{ page }}
    </button>
    <button @click="nextPage" :disabled="currentPage === totalPages">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9.00015 4.58569L16.4144 11.9999L9.00015 19.4141L7.58594 17.9999L13.5859 11.9999L7.58594 5.99991L9.00015 4.58569Z" fill="black"/></svg>
    </button>
  </div>
</template>



<style scoped>
.pagination {
  display: flex;
  gap: 5px;
}

.pagination button {
  padding: 5px 10px;
  border: 1px solid #ccc;
  background-color: var(--ligty-gray);
  cursor: pointer;
}

.pagination button.active {
  background-color: var(--yellow);
  color: var(--white);
  border-color: var(--yellow);
}

.pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
.prev{
  transform: rotateY(-145deg);
}
</style>
