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
    management: {
      title: 'User Management',
    },
  },
  dashboard: {
    title: 'Dashboard',
  },
  permission: {
    page: {
      title: 'Page Management',
    },
    button: {
      title: 'Button Management',
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
      example: 'Example',
      fullscreen: 'Fullscreen',
      screen: 'Screen',
      test: 'Test',
    },
    error: {
      notFound: 'Page Not Found',
      forbidden: 'Forbidden',
      serverError: 'Server Error',
    },
  },
}

// 为了保持向后兼容，同时导出具名导出和默认导出
export { enUS }

// i18n Ally 期望的默认导出
export default enUS
