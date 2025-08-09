/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 状态管理
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import { getUserInfo } from '@/api'
import router from '@/router'
import store from '@/stores'
import { env } from '@/utils'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: '',
    userInfo: {
      userId: '', // 用户ID
      username: '', // 用户名
      roles: [], // 用户角色
      permissions: [], // 用户权限
    },
  }),

  getters: {
    getToken: (state: UserState) => state.token,
    getUserInfo: (state: UserState) => state.userInfo,
    // 获取页面权限
    getUserRoles: (state: UserState) => state.userInfo.roles,
    // 获取按钮权限
    getUserPermissions: (state: UserState) => state.userInfo.permissions,
  },

  actions: {
    setToken(token: string) {
      this.token = token
      // 确保 token 设置完成后再获取用户信息
      return getUserInfo().then(res => {
        this.userInfo = res
        router.push((router.currentRoute.value.query.redirect as string) || env.rootRedirect)
        return res
      })
    },
    resetToken() {
      this.token = ''
    },
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo
    },
    resetUserInfo() {
      this.userInfo = {
        userId: '',
        username: '',
        roles: [],
        permissions: [],
      }
    },
    logout() {
      this.resetToken()
      this.resetUserInfo()
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
