/**
 * 繁体中文语言包 (zh-TW)
 */

// 直接定义翻译内容，便于 i18n-ally 插件识别
const zhTW = {
  auth: {
    login: {
      title: '用戶登入',
      username: '用戶名',
      password: '密碼',
      rememberMe: '記住我',
      forgotPassword: '忘記密碼',
      loginButton: '登入',
      loginSuccess: '登入成功',
      loginFailed: '登入失敗',
      invalidCredentials: '用戶名或密碼錯誤',
      usernameRequired: '請輸入用戶名',
      passwordRequired: '請輸入密碼',
    },
    logout: {
      title: '登出',
      confirm: '確定要登出嗎？',
      success: '已登出',
      failed: '登出失敗',
    },
    register: {
      title: '用戶註冊',
      username: '用戶名',
      password: '密碼',
      confirmPassword: '確認密碼',
      email: '電子郵件',
      phone: '手機號碼',
      agreement: '我已閱讀並同意用戶協議',
      registerButton: '註冊',
      registerSuccess: '註冊成功',
      registerFailed: '註冊失敗',
      userExists: '用戶名已存在',
      emailExists: '電子郵件已被使用',
    },
  },
  common: {
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
  },
  user: {
    management: {
      title: '用戶管理',
    },
  },
  dashboard: {
    title: '儀表板',
  },
  permission: {
    page: {
      title: '頁面管理',
    },
    button: {
      title: '按鈕管理',
    },
  },
  router: {
    core: {
      root: '首頁',
      login: '登錄',
    },
    dashboard: {
      dashboard: '儀表板',
    },
    example: {
      example: '示例',
      fullscreen: '全屏',
      screen: '屏幕',
      test: '測試',
    },
    error: {
      notFound: '頁面未找到',
      forbidden: '訪問被拒絕',
      serverError: '服務器錯誤',
    },
  },
}

// 为了保持向后兼容，同时导出具名导出和默认导出
export { zhTW }

// i18n Ally 期望的默认导出
export default zhTW
