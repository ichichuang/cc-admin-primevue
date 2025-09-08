// 导入所有类型声明模块
import { ToastService } from 'primevue/toastservice'
import '@/types/modules/device'
import '@/types/modules/layout'
import '@/types/modules/locale'
import '@/types/modules/router'
import '@/types/modules/theme'
import '@/types/modules/user'
import '@/types/modules/utils'
import '@/types/modules/vue'

// 扩展 Window 接口
declare global {
  interface Window {
    $toast: ToastService
  }
}
