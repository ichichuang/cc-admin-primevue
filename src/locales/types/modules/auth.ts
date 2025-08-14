/** 认证模块语言配置 */
export interface AuthLocaleMessages {
  login: {
    title: string
    username: string
    password: string
    rememberMe: string
    forgotPassword: string
    loginButton: string
    loginSuccess: string
    loginFailed: string
    invalidCredentials: string
    usernameRequired: string
    passwordRequired: string
  }

  logout: {
    title: string
    confirm: string
    success: string
    failed: string
  }

  register: {
    title: string
    username: string
    password: string
    confirmPassword: string
    email: string
    phone: string
    agreement: string
    registerButton: string
    registerSuccess: string
    registerFailed: string
    userExists: string
    emailExists: string
  }
}
