<script setup lang="ts">
const {color='yellow'} = defineProps<{color?: 'yellow'|'green'}>()
const emit = defineEmits(["click"])


const clickOnButton = () => {
  emit('click')
}
</script>

<template>
<button @click="clickOnButton" class="btn" :class="color==='yellow'?'btn__yellow':'btn__green'">
  <slot/>
</button>
</template>

<style scoped lang="scss">
.btn{
  padding: 6px 18px;
  border: none;
  border-radius: 10px;
  transition: opacity 0.3s;
  color: var(--black);
  &:hover{
    opacity: 0.8;
  }
  &__yellow{
    background-color: var(--yellow);
    &:focus{
      outline-color: var(--yellow);
    }
  }
  &__green{
    background-color: var(--light-green);
    &:focus{
      outline-color: var(--light-green);
    }
  }
}
</style>
