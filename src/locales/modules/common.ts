/**
 * 通用模块语言配置
 */
import type { CommonLocaleMessages } from '@/locales/types/modules/common'

/** 中文配置 */
export const commonZhCN: CommonLocaleMessages = {
  settings: {
    title: '设置',
    theme: '主题',
    language: '语言',
    size: '尺寸',
    rounded: '棱角',
    padding: '间距',
    fontSize: '字体大小',
    systemManagement: '管理系统',
    logout: '退出系统',
  },
  error: {
    notFound: '页面未找到',
    forbidden: '访问被拒绝',
    serverError: '服务器错误',
    notFoundTitle: '404',
    forbiddenTitle: '403',
    serverErrorTitle: '500',
  },
  actions: {
    jump: '跳转',
    register: '还没有账号？点我注册',
    forgotPassword: '忘记密码？',
    recoverAccount: '立即找回？',
    loginInProgress: '登录中...',
  },
  social: {
    qq: 'QQ',
    wechat: '微信',
    alipay: '支付宝',
  },
  auth: {
    accountPasswordLogin: '账号密码登录',
  },
  messages: {
    loginFailed: '登录失败',
    userNotExists: '用户不存在',
    networkError: '网络连接错误',
    networkConnectionFailed: '网络连接失败，请检查网络设置',
    corsError: '跨域请求被阻止，请联系管理员',
    requestTimeout: '请求超时，请稍后重试',
    securityFailed: '安全验证失败',
    unknownError: '未知错误',
    unauthorized: '未授权',
    insufficientPermissions: '权限不足',
    resourceNotFound: '请求的资源不存在',
    serverInternalError: '服务器内部错误',
    serverUnavailable: '服务器暂时不可用',
  },
}

/** 英文配置 */
export const commonEnUS: CommonLocaleMessages = {
  settings: {
    title: 'Settings',
    theme: 'Theme',
    language: 'Language',
    size: 'Size',
    rounded: 'Rounded',
    padding: 'Padding',
    fontSize: 'Font Size',
    systemManagement: 'System Management',
    logout: 'Logout',
  },
  error: {
    notFound: 'Page Not Found',
    forbidden: 'Forbidden',
    serverError: 'Server Error',
    notFoundTitle: '404',
    forbiddenTitle: '403',
    serverErrorTitle: '500',
  },
  actions: {
    jump: 'Jump',
    register: 'No account yet? Click to register',
    forgotPassword: 'Forgot password?',
    recoverAccount: 'Recover account?',
    loginInProgress: 'Logging in...',
  },
  social: {
    qq: 'QQ',
    wechat: 'WeChat',
    alipay: 'Alipay',
  },
  auth: {
    accountPasswordLogin: 'Account Password Login',
  },
  messages: {
    loginFailed: 'Login failed',
    userNotExists: 'User does not exist',
    networkError: 'Network connection error',
    networkConnectionFailed: 'Network connection failed, please check network settings',
    corsError: 'Cross-origin request blocked, please contact administrator',
    requestTimeout: 'Request timeout, please try again later',
    securityFailed: 'Security verification failed',
    unknownError: 'Unknown error',
    unauthorized: 'Unauthorized',
    insufficientPermissions: 'Insufficient permissions',
    resourceNotFound: 'Requested resource not found',
    serverInternalError: 'Server internal error',
    serverUnavailable: 'Server temporarily unavailable',
  },
}

/** 繁体中文配置 */
export const commonZhTW: CommonLocaleMessages = {
  settings: {
    title: '設定',
    theme: '主題',
    language: '語言',
    size: '尺寸',
    rounded: '稜角',
    padding: '間距',
    fontSize: '字體大小',
    systemManagement: '系統管理',
    logout: '登出系統',
  },
  error: {
    notFound: '頁面未找到',
    forbidden: '訪問被拒絕',
    serverError: '伺服器錯誤',
    notFoundTitle: '404',
    forbiddenTitle: '403',
    serverErrorTitle: '500',
  },
  actions: {
    jump: '跳轉',
    register: '還沒有帳號？點我註冊',
    forgotPassword: '忘記密碼？',
    recoverAccount: '立即找回？',
    loginInProgress: '登入中...',
  },
  social: {
    qq: 'QQ',
    wechat: '微信',
    alipay: '支付寶',
  },
  auth: {
    accountPasswordLogin: '帳號密碼登入',
  },
  messages: {
    loginFailed: '登入失敗',
    userNotExists: '用戶不存在',
    networkError: '網路連線錯誤',
    networkConnectionFailed: '網路連線失敗，請檢查網路設定',
    corsError: '跨域請求被阻止，請聯繫管理員',
    requestTimeout: '請求超時，請稍後重試',
    securityFailed: '安全驗證失敗',
    unknownError: '未知錯誤',
    unauthorized: '未授權',
    insufficientPermissions: '權限不足',
    resourceNotFound: '請求的資源不存在',
    serverInternalError: '伺服器內部錯誤',
    serverUnavailable: '伺服器暫時不可用',
  },
}
