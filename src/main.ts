// 导入功能样式
import '@/assets/styles/custom.scss'
import '@/assets/styles/reset.scss'
import 'animate.css'
import 'uno.css'

// 导入应用
import App from '@/App.vue'
import { setupPlugins } from '@/plugins'
import { createApp } from 'vue'

const app = createApp(App)

// 设置插件
setupPlugins(app)

// 挂载应用
app.mount('#app')
