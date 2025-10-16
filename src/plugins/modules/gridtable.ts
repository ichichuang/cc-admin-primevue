// 导入并注册 AG Grid 模块
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import type { App } from 'vue'

// 全局注册所有社区模块（必须在创建网格前）
ModuleRegistry.registerModules([AllCommunityModule])
export const setupGridTable = (_app: App) => {}
