/** 仪表盘模块语言配置 */
export interface DashboardLocaleMessages {
  title: string
  welcome: string
  overview: string
  statistics: {
    totalUsers: string
    activeUsers: string
    totalOrders: string
    totalRevenue: string
    growthRate: string
    conversionRate: string
  }
  charts: {
    userGrowth: string
    revenueChart: string
    orderChart: string
    trafficChart: string
    conversionChart: string
  }
  quickActions: {
    title: string
    addUser: string
    viewOrders: string
    generateReport: string
    systemSettings: string
  }
  recentActivities: {
    title: string
    viewAll: string
    noActivities: string
  }
}
