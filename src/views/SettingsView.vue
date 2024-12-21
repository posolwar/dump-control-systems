<script setup lang="ts">
import { computed, ref } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import PageLayout from '@/components/layouts/PageLayout.vue'
import ContainerElement from '@/components/ContainerElement.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import { required } from '@/utils/i18n-validators'

import { useSettingsStore } from '@/stores/settings'
import AppNotification from '@/components/AppNotification.vue'

const settingsStore = useSettingsStore()

const tgToken = ref('')

const rules = computed(() => {
  return {
    tgToken: { required },
  }
})

const v$ = useVuelidate(rules, { tgToken })
const fetchTgToken = async () => {
  if (v$.value.$invalid) {
    v$.value.$touch()
    return
  }
  await settingsStore.fetchSettingsCreate(tgToken.value)
  tgToken.value = ''
  v$.value.$reset()
}
// onMounted(() => {
//   settingsStore.loadSettingsFromLocalStorage()
//   settingsStore.fetchSettings()
// })
</script>

<template>
  <PageLayout>
    <ContainerElement>
      <div class="info">
        <h1 class="info-title">Настройки</h1>
        <div class="info-content">
          <div class="info-content__wrapper">
            <div class="error" v-if="settingsStore.settingsError">Что-то пошло не так...</div>
            <form v-else class="info-content__footer" @submit.prevent="fetchTgToken">
              <div class="">
                <AppInput
                  id="token"
                  type="text"
                  v-model:model-value="tgToken"
                  placeholder="Api-token телеграмма"
                />
                <div v-if="v$.tgToken.$error" class="error-message">
                  <small v-for="(error, i) in v$.tgToken.$errors" :key="i">{{
                    error.$message
                  }}</small>
                </div>
              </div>
              <AppButton> Сохранить </AppButton>
            </form>
          </div>
        </div>
      </div>
    </ContainerElement>
    <AppNotification v-if="settingsStore.sucssess" message="Настройки сохранены!" />
  </PageLayout>
</template>

<style scoped lang="scss">
.info {
  color: var(--dark-blue);
  &-title {
    font-size: 16px;
    line-height: 18px;
    border-bottom: 1px solid var(--dark-blue);
    padding-bottom: 10px;
    color: var(--dark-blue);
  }
  &-content {
    //min-height: 304px;
    //display: flex;
    //flex-direction: column;
    &__title {
      font-size: 16px;
      line-height: 18px;
      margin-top: 20px;
      margin-bottom: 40px;
    }
    &__wrapper {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
    }
    &__footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      margin-top: 20px;
      @media screen and (max-width: 580px) {
        flex-direction: column;
      }
    }
  }
}
.error-message {
  color: red;
  padding: 5px;
}
</style>
