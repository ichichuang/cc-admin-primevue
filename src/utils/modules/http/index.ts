// src/utils/http/index.ts
export { alovaInstance, alovaInstance as default } from './instance'
export {
  clearCache,
  clearRequests,
  del,
  downloadFile,
  get,
  getCacheStats,
  getRequestStats,
  patch,
  post,
  put,
  uploadFile,
  uploadFiles,
} from './methods'
export type { ApiResponse, RequestConfig, UploadConfig } from './types'

// 连接管理功能
export {
  addConnectionListener,
  connectionManager,
  disconnect,
  getConnectionState,
  reconnect,
} from './connection'

// 文件上传管理功能
export {
  addUploadTask,
  cancelUploadTask,
  getAllUploadTasks,
  getUploadTask,
  pauseUploadTask,
  removeUploadTask,
  resumeUploadTask,
  uploadManager,
} from './uploadManager'

// 错误处理功能
export { ErrorType, HttpRequestError, isRetryableError } from './interceptors'

// 导出所有类型
export type {
  AlovaRequestConfig,
  CacheConfig,
  CacheStats,
  ChunkInfo,
  ConnectionConfig,
  ConnectionState,
  DownloadConfig,
  HttpError,
  RequestStats,
  RetryConfig,
  SecurityConfig,
  UploadChunkConfig,
  UploadManager,
  UploadTask,
} from './types'
