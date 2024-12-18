import { ref, watch } from 'vue'
import { format } from 'date-fns'

export function useDateFormat(dateString: string) {
  const formattedDate = ref('')

  const updateFormattedDate = (date: string) => {
    const dateObj = new Date(date)
    formattedDate.value = format(dateObj, 'dd.MM.yyyy')
  }

  watch(() => dateString, updateFormattedDate, { immediate: true })

  return { formattedDate }
}
