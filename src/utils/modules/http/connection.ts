/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 连接管理模块
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import { HTTP_CONFIG } from '@/constants/modules/http'
import type { ConnectionConfig, ConnectionState } from './types'

/**
 * 连接管理器
 * 负责管理 HTTP 连接状态、自动重连和健康检查
 */
export class ConnectionManager {
  private state: ConnectionState
  private config: ConnectionConfig
  private healthCheckTimer?: NodeJS.Timeout
  private reconnectTimer?: NodeJS.Timeout
  private listeners: Set<(state: ConnectionState) => void>
  private isDestroyed = false

  constructor(config?: Partial<ConnectionConfig>) {
    this.config = {
      autoReconnect: true,
      maxReconnectAttempts: HTTP_CONFIG.maxReconnectAttempts,
      reconnectDelay: HTTP_CONFIG.reconnectDelay,
      healthCheckInterval: HTTP_CONFIG.healthCheckInterval,
      ...config,
    }

    this.state = {
      isConnected: true,
      isReconnecting: false,
      reconnectAttempts: 0,
      maxReconnectAttempts: this.config.maxReconnectAttempts,
    }

    this.listeners = new Set()

    // 监听网络状态变化
    this.setupNetworkListeners()
  }

  /**
   * 获取当前连接状态
   */
  getConnectionState(): ConnectionState {
    return { ...this.state }
  }

  /**
   * 添加状态变化监听器
   */
  addListener(listener: (state: ConnectionState) => void): () => void {
    if (this.isDestroyed) {
      console.warn('⚠️ 连接管理器已销毁，无法添加监听器')
      return () => {}
    }

    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  /**
   * 手动断开连接
   */
  disconnect(reason?: string): void {
    if (this.state.isConnected) {
      this.state.isConnected = false
      this.state.disconnectReason = reason || '手动断开'
      this.state.lastConnectedAt = new Date()

      this.stopHealthCheck()
      this.notifyListeners()
    }
  }

  /**
   * 手动重连
   */
  async reconnect(): Promise<boolean> {
    if (this.state.isReconnecting || this.isDestroyed) {
      return false
    }

    this.state.isReconnecting = true
    this.state.reconnectAttempts = 0

    return this.attemptReconnect()
  }

  /**
   * 尝试重连
   */
  private async attemptReconnect(): Promise<boolean> {
    while (this.state.reconnectAttempts < this.config.maxReconnectAttempts && !this.isDestroyed) {
      this.state.reconnectAttempts++

      try {
        // 执行健康检查
        const isHealthy = await this.performHealthCheck()

        if (isHealthy) {
          this.onReconnectSuccess()
          return true
        }
      } catch (error) {
        console.error('❌ 重连失败:', error)
      }

      // 等待后重试，使用指数退避
      const delay = this.config.reconnectDelay * Math.pow(2, this.state.reconnectAttempts - 1)
      await this.delay(Math.min(delay, HTTP_CONFIG.healthCheckInterval)) // 最大延迟30秒
    }

    this.onReconnectFailed()
    return false
  }

  /**
   * 重连成功
   */
  private onReconnectSuccess(): void {
    this.state.isConnected = true
    this.state.isReconnecting = false
    this.state.reconnectAttempts = 0
    this.state.disconnectReason = undefined
    this.state.lastConnectedAt = new Date()

    this.startHealthCheck()
    this.notifyListeners()
  }

  /**
   * 重连失败
   */
  private onReconnectFailed(): void {
    this.state.isReconnecting = false
    this.state.isConnected = false
    this.notifyListeners()

    console.error('❌ 重连失败，已达到最大重试次数')
  }

  /**
   * 执行健康检查
   */
  private async performHealthCheck(): Promise<boolean> {
    try {
      const healthUrl = this.config.healthCheckUrl || '/api/health'
      const response = await fetch(healthUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(HTTP_CONFIG.timeout), // 使用配置的超时时间
      })

      return response.ok
    } catch (error) {
      console.warn('⚠️ 健康检查失败:', error)
      return false
    }
  }

  /**
   * 开始健康检查
   */
  private startHealthCheck(): void {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer)
    }

    this.healthCheckTimer = setInterval(async () => {
      if (!this.state.isConnected || this.isDestroyed) {
        return
      }

      const isHealthy = await this.performHealthCheck()
      if (!isHealthy && this.state.isConnected) {
        // 避免在重连过程中再次触发断开
        if (!this.state.isReconnecting) {
          this.disconnect('健康检查失败')

          // 延迟重连，避免立即重连
          setTimeout(() => {
            if (this.config.autoReconnect && !this.isDestroyed) {
              this.reconnect()
            }
          }, HTTP_CONFIG.reconnectDelay)
        }
      }
    }, this.config.healthCheckInterval)
  }

  /**
   * 停止健康检查
   */
  private stopHealthCheck(): void {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer)
      this.healthCheckTimer = undefined
    }
  }

  /**
   * 设置网络状态监听
   */
  private setupNetworkListeners(): void {
    // 监听在线/离线状态
    window.addEventListener('online', () => {
      if (!this.state.isConnected && this.config.autoReconnect && !this.isDestroyed) {
        this.reconnect()
      }
    })

    window.addEventListener('offline', () => {
      this.disconnect('网络断开')
    })

    // 监听页面可见性变化
    document.addEventListener('visibilitychange', () => {
      if (
        !document.hidden &&
        !this.state.isConnected &&
        this.config.autoReconnect &&
        !this.isDestroyed
      ) {
        this.reconnect()
      }
    })
  }

  /**
   * 延迟函数
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * 通知监听器
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.getConnectionState())
      } catch (error) {
        console.error('监听器执行错误:', error)
      }
    })
  }

  /**
   * 销毁连接管理器
   */
  destroy(): void {
    this.isDestroyed = true
    this.stopHealthCheck()
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
    }
    this.listeners.clear()
  }
}

// 创建全局连接管理器实例
export const connectionManager = new ConnectionManager()

// 导出连接状态
export const getConnectionState = () => connectionManager.getConnectionState()
export const addConnectionListener = (listener: (state: ConnectionState) => void) =>
  connectionManager.addListener(listener)
export const disconnect = (reason?: string) => connectionManager.disconnect(reason)
export const reconnect = () => connectionManager.reconnect()
