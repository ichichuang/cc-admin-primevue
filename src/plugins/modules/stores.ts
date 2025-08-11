import store, {
  useColorStore,
  useLayoutStore,
  useLocaleStore,
  usePostcssStore,
  useSizeStore,
} from '@/stores'
import type { App } from 'vue'

export const setupStores = (app: App) => {
  app.use(store)

  // 在 Pinia 实例创建并安装后再初始化 stores
  const colorStore = useColorStore()
  const layoutStore = useLayoutStore()
  const localeStore = useLocaleStore()
  const postcssStore = usePostcssStore()
  const sizeStore = useSizeStore()

  colorStore.init()
  layoutStore.init()
  localeStore.initLocale()
  postcssStore.initRemAdapter()
  sizeStore.init()
}
