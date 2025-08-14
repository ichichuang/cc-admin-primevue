import store from '@/stores'
import { env } from '@/utils'
import { defineStore } from 'pinia'

const appTitle = env.appTitle

interface AppState {
  title: string
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    title: appTitle,
  }),

  getters: {
    getTitle: (state: AppState) => state.title,
  },

  actions: {},

  persist: {
    key: `${env.piniaKeyPrefix}-app`,
    storage: localStorage,
  },
})

export const useAppStoreWithOut = () => {
  return useAppStore(store)
}
