// Stores 统一管理入口
import { autoImportModulesSync } from '@/utils'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// 自动导入所有 Store 模块
const storeModules = import.meta.glob('./modules/**/*.ts', { eager: true })
const _importedStores = autoImportModulesSync(storeModules)

// 创建 Pinia 实例并配置持久化插件
const store = createPinia()
store.use(piniaPluginPersistedstate)

// 导出所有 Store 模块
export * from '@/stores/modules/app'
export * from '@/stores/modules/color'
export * from '@/stores/modules/layout'
export * from '@/stores/modules/locale'
export * from '@/stores/modules/permission'
export * from '@/stores/modules/postcss'
export * from '@/stores/modules/size'
export * from '@/stores/modules/user'

// 导出默认store实例
export default store

// 类型定义
export type StoreModules = typeof _importedStores
