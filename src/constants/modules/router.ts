/**
 * 路由白名单配置
 * 不需要登录验证的页面路径
 */
export const routeWhitePathList: string[] = [
  '/login',
  '/register',
  '/example',
  '/exampleAnimate',
  '/example/layout/ratio',
]
export const routeWhiteNameList: string[] = [
  'Login',
  'Register',
  'Example',
  'ExampleAnimate',
  'ExampleRatio',
]

/**
 * 错误页面配置
 * 系统错误页面的路径
 */
export const errorPagesPathList: string[] = ['/404', '/403', '/500']
export const errorPagesNameList: string[] = ['404', '403', '500']
