/** 通用模块语言配置 */
export interface CommonLocaleMessages {
  settings: {
    title: string
    theme: string
    language: string
    size: string
    rounded: string
    padding: string
    fontSize: string
    systemManagement: string
    logout: string
  }
  error: {
    notFound: string
    forbidden: string
    serverError: string
    notFoundTitle: string
    forbiddenTitle: string
    serverErrorTitle: string
  }
  actions: {
    jump: string
    register: string
    forgotPassword: string
    recoverAccount: string
    loginInProgress: string
  }
  social: {
    qq: string
    wechat: string
    alipay: string
  }
  auth: {
    accountPasswordLogin: string
  }
  messages: {
    loginFailed: string
    userNotExists: string
    networkError: string
    networkConnectionFailed: string
    corsError: string
    requestTimeout: string
    securityFailed: string
    unknownError: string
    unauthorized: string
    insufficientPermissions: string
    resourceNotFound: string
    serverInternalError: string
    serverUnavailable: string
  }
}
