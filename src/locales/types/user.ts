/** 用户模块语言配置 */
export interface UserLocaleMessages {
  profile: {
    title: string
    basicInfo: string
    avatar: string
    username: string
    email: string
    phone: string
    department: string
    role: string
    lastLogin: string
    createdAt: string
    updatedAt: string
    updateSuccess: string
    updateFailed: string
  }

  management: {
    title: string
    userList: string
    addUser: string
    editUser: string
    deleteUser: string
    deleteConfirm: string
    batchDelete: string
    exportUsers: string
    importUsers: string
    userCount: string
    searchUser: string
    filterByRole: string
    filterByStatus: string
  }

  roles: {
    admin: string
    user: string
    guest: string
    moderator: string
    editor: string
    viewer: string
  }

  status: {
    active: string
    inactive: string
    banned: string
    pending: string
    suspended: string
  }
}
