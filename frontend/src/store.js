import { reactive, watch } from 'vue'

const storedProfile = JSON.parse(localStorage.getItem('findash-profile')) || {
  fullName: 'John Doe',
  email: 'john@example.com',
  phone: '+66 81 234 5678',
  occupation: 'Software Developer',
  bio: 'Tracking finances to reach financial independence.',
}

const storedSettings = JSON.parse(localStorage.getItem('findash-settings')) || {
  currency: 'USD',
  dateFormat: 'MM/DD/YYYY',
  darkMode: true,
  notifications: true,
  autoSave: true
}

export const profileState = reactive(storedProfile)
export const settingsState = reactive(storedSettings)

watch(profileState, (newVal) => {
  localStorage.setItem('findash-profile', JSON.stringify(newVal))
}, { deep: true })

watch(settingsState, (newVal) => {
  localStorage.setItem('findash-settings', JSON.stringify(newVal))
  
  if (newVal.darkMode) {
    document.documentElement.classList.remove('light-mode')
  } else {
    document.documentElement.classList.add('light-mode')
  }
}, { deep: true, immediate: true })
