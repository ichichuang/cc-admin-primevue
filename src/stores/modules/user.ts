import { getUserInfo } from '@/api'
import router from '@/router'
import store from '@/stores'
import { env } from '@/utils'
import { defineStore } from 'pinia'

interface UserState {
  token: string
  userInfo: UserInfo
  isLogin: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: '',
    userInfo: {
      userId: '', // 用户ID
      username: '', // 用户名
      roles: [], // 用户角色
      permissions: [], // 用户权限
    },
    isLogin: false, // 是否登录
  }),

  getters: {
    getToken: (state: UserState) => state.token,
    getUserInfo: (state: UserState) => state.userInfo,
    // 获取页面权限
    getUserRoles: (state: UserState) => state.userInfo.roles,
    // 获取按钮权限
    getUserPermissions: (state: UserState) => state.userInfo.permissions,
    getIsLogin: (state: UserState) => state.isLogin,
  },

  actions: {
    setToken(token: string) {
      this.token = token
      getUserInfo().then(res => {
        this.setUserInfo(res.data)
        router.push((router.currentRoute.value.query.redirect as string) || env.rootRedirect)
      })
    },
    resetToken() {
      this.token = ''
    },
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo
      this.isLogin = true
    },
    resetUserInfo() {
      this.userInfo = {
        userId: '',
        username: '',
        roles: [],
        permissions: [],
      }
      this.isLogin = false
    },
    async logout() {
      this.resetToken()
      this.resetUserInfo()

      // 重置动态路由初始化状态
      try {
        const { resetDynamicRoutesInitialized } = await import('@/router/utils/permission')
        resetDynamicRoutesInitialized()
      } catch (error) {
        console.warn('重置动态路由状态失败:', error)
      }

      const key = `${env.piniaKeyPrefix}-`
      Object.keys(localStorage).forEach(item => {
        if (item.startsWith(key)) {
          localStorage.removeItem(item)
        }
      })
      window.location.reload()
    },
  },

  persist: {
    key: `${env.piniaKeyPrefix}-user`,
    storage: localStorage,
  },
})

export const useUserStoreWithOut = () => {
  return useUserStore(store)
}
