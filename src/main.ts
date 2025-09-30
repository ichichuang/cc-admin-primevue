// 导入功能样式
import '@/assets/styles/custom.scss'
import '@/assets/styles/reset.scss'
import 'animate.css'
import 'overlayscrollbars/overlayscrollbars.css'
import 'uno.css'

// 导入应用
import App from '@/App.vue'
import { setupPlugins } from '@/plugins'
import { createApp } from 'vue'

async function bootstrap() {
  const app = createApp(App)

  // 设置插件（支持异步）
  await setupPlugins(app)

  // 挂载应用
  app.mount('#app')
}

// 启动应用
bootstrap().catch(error => {
  console.error('应用启动失败:', error)
})
