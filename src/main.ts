// 导入功能样式
import '@/assets/styles/reset.scss'
import '@/assets/styles/custom.scss'
import 'animate.css'
import 'uno.css'

// 导入应用和错误处理
import App from '@/App.vue'
import { setupPlugins } from '@/plugins'
import { setupErrorHandler } from '@/utils/modules/errorHandler'
import { createApp } from 'vue'

const app = createApp(App)

// 设置全局错误处理
setupErrorHandler(app)

// 设置插件
setupPlugins(app)

// 挂载应用
app.mount('#app')
