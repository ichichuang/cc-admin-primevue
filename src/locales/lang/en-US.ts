/**
 * 英文语言包 (en-US)
 */

// 直接定义翻译内容，便于 i18n-ally 插件识别
const enUS = {
  auth: {
    login: {
      title: 'User Login',
      username: 'Username',
      password: 'Password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password',
      loginButton: 'Login',
      loginSuccess: 'Login successful',
      loginFailed: 'Login failed',
      invalidCredentials: 'Invalid username or password',
      usernameRequired: 'Please enter username',
      passwordRequired: 'Please enter password',
    },
    logout: {
      title: 'Logout',
      confirm: 'Are you sure you want to logout?',
      success: 'Logged out successfully',
      failed: 'Logout failed',
    },
    register: {
      title: 'User Registration',
      username: 'Username',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      email: 'Email',
      phone: 'Phone',
      agreement: 'I have read and agree to the user agreement',
      registerButton: 'Register',
      registerSuccess: 'Registration successful',
      registerFailed: 'Registration failed',
      userExists: 'Username already exists',
      emailExists: 'Email already in use',
    },
  },
  common: {
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
  },
  user: {
    title: 'User Management',
    list: {
      title: 'User List',
    },
    permission: {
      title: 'User Permission',
    },
  },
  dashboard: {
    title: 'Dashboard',
  },
  permission: {
    title: 'Permission Management',
    page: {
      title: 'Page Permission',
    },
    button: {
      title: 'Button Permission',
    },
  },
  router: {
    core: {
      root: 'Home',
      login: 'Login',
    },
    dashboard: {
      dashboard: 'Dashboard',
    },
    example: {
      title: 'Example',
      layout: {
        title: 'Layout',
        screen: 'Screen',
        fullscreen: 'Fullscreen',
        test: 'Test',
        ratio: 'Ratio',
      },
      components: {
        title: 'Components',
        menu: 'Menu',
        dialog: 'Dialog',
        schemaForm: {
          title: 'Form',
          basic: 'Basic',
          step: 'Step',
          section: 'Section',
          dynamic: 'Dynamic',
        },
      },
    },
    error: {
      notFound: 'Page Not Found',
      forbidden: 'Forbidden',
      serverError: 'Server Error',
    },
  },
  layout: {
    tabs: {
      close: 'Close',
      closeAll: 'Close All',
      closeOther: 'Close Other',
      closeLeft: 'Close Left',
      closeRight: 'Close Right',
      fixed: 'Fixed',
      unFixed: 'UnFixed',
    },
  },
}

// 为了保持向后兼容，同时导出具名导出和默认导出
export { enUS }

// i18n Ally 期望的默认导出
export default enUS
