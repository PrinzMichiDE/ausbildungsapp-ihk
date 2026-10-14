<script setup lang="ts">
import { ref, watch } from 'vue'
import { formatMinutes, parseDuration } from '@/utils/report-time'

const props = defineProps<{
  modelValue: number
  id: string
  label: string
  disabled?: boolean
  invalid?: boolean
  describedBy?: string
}>()

const emit = defineEmits<{ 'update:modelValue': [value: number] }>()

const text = ref(props.modelValue > 0 ? formatMinutes(props.modelValue) : '')
const parseError = ref(false)

watch(
  () => props.modelValue,
  (value) => {
    if (parseDuration(text.value) !== value) {
      text.value = value > 0 ? formatMinutes(value) : ''
    }
  },
)

function onInput(event: Event) {
  text.value = (event.target as HTMLInputElement).value
  const minutes = parseDuration(text.value)
  parseError.value = text.value.trim() !== '' && minutes === null
  if (minutes !== null) emit('update:modelValue', minutes)
}

function onBlur() {
  const minutes = parseDuration(text.value)
  if (minutes !== null) {
    text.value = minutes > 0 ? formatMinutes(minutes) : ''
    parseError.value = false
  }
}
</script>

<template>
  <div class="relative">
    <label :for="id" class="sr-only">{{ label }}</label>
    <input
      :id="id"
      :value="text"
      type="text"
      inputmode="numeric"
      autocomplete="off"
      placeholder="hh:mm"
      maxlength="5"
      :disabled="disabled"
      :aria-invalid="invalid || parseError"
      :aria-describedby="describedBy"
      class="w-[5.5rem] rounded-lg border bg-white px-2.5 py-2 text-center font-mono text-sm tabular-nums text-slate-900 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500 dark:disabled:bg-slate-800 dark:disabled:text-slate-400"
      :class="
        invalid || parseError
          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/25 dark:border-red-400'
          : 'border-slate-300 focus:border-brand-500 focus:ring-brand-500/25 dark:border-slate-600'
      "
      @input="onInput"
      @blur="onBlur"
    />
  </div>
</template>
