import '@/assets/styles/custom-datepicker.scss'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import type { App } from 'vue'

export const setupDatepicker = (app: App) => {
  app.component('VueDatePicker', VueDatePicker)
}
