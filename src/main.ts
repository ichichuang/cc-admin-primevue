// 导入功能样式
import '@/assets/styles/custom.scss'
import '@/assets/styles/reset.scss'
import 'animate.css'
import 'uno.css'

// 导入应用
import App from '@/App.vue'
import { createApp } from 'vue'
import { setupPlugins } from './plugins'

const app = createApp(App)
setupPlugins(app)
app.mount('#app')
