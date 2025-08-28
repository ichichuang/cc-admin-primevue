/**
 * 中文语言包 (zh-CN)
 */

// 直接定义翻译内容，便于 i18n-ally 插件识别
const zhCN = {
  auth: {
    login: {
      title: '用户登录',
      username: '用户名',
      password: '密码',
      rememberMe: '记住我',
      forgotPassword: '忘记密码',
      loginButton: '登录',
      loginSuccess: '登录成功',
      loginFailed: '登录失败',
      invalidCredentials: '用户名或密码错误',
      usernameRequired: '请输入用户名',
      passwordRequired: '请输入密码',
    },
    logout: {
      title: '退出登录',
      confirm: '确定要退出登录吗？',
      success: '已退出登录',
      failed: '退出登录失败',
    },
    register: {
      title: '用户注册',
      username: '用户名',
      password: '密码',
      confirmPassword: '确认密码',
      email: '邮箱',
      phone: '手机号',
      agreement: '我已阅读并同意用户协议',
      registerButton: '注册',
      registerSuccess: '注册成功',
      registerFailed: '注册失败',
      userExists: '用户名已存在',
      emailExists: '邮箱已被使用',
    },
  },
  common: {
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
  },
  user: {
    title: '用户管理',
    list: {
      title: '用户列表',
    },
    permission: {
      title: '用户权限',
    },
  },
  dashboard: {
    title: '仪表盘',
  },
  permission: {
    title: '权限管理',
    page: {
      title: '页面权限',
    },
    button: {
      title: '按钮权限',
    },
  },
  router: {
    core: {
      root: '首页',
      login: '登录',
    },
    dashboard: {
      dashboard: '仪表盘',
    },
    example: {
      title: '示例',
      layout: {
        title: '布局',
        screen: '屏幕',
        fullscreen: '全屏',
        test: '测试',
        ratio: '比例',
      },
      components: {
        title: '组件',
        menu: '菜单',
        dialog: '对话框',
        schemaForm: {
          title: '表单',
          basic: '基础',
          step: '步骤',
          section: '分组',
          dynamic: '动态',
        },
      },
    },
    error: {
      notFound: '页面未找到',
      forbidden: '访问被拒绝',
      serverError: '服务器错误',
    },
  },
  layout: {
    tabs: {
      close: '关闭',
      closeAll: '关闭所有',
      closeOther: '关闭其他',
      closeLeft: '关闭左侧',
      closeRight: '关闭右侧',
      fixed: '固定',
      unFixed: '取消固定',
    },
  },
}

// 为了保持向后兼容，同时导出具名导出和默认导出
export { zhCN }

// i18n Ally 期望的默认导出
export default zhCN
