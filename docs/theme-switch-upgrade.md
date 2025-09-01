# ThemeSwitch 组件升级说明

## 🎨 升级概述

本次升级将 ThemeSwitch 组件从简单的主题切换升级为支持 View Transitions API 的现代化主题切换组件，实现了类似 Element Plus 官网的圆形扩散动画效果。

## ✨ 新特性

### 1. View Transitions API 支持

- 使用最新的 View Transitions API 实现平滑的主题切换
- 圆形扩散动画效果（从点击位置向外扩散）
- 优雅的降级处理（不支持的浏览器使用普通切换）

### 2. 增强的动画效果

- 图标切换动画（太阳/月亮图标旋转切换）
- 防抖处理（动画期间禁止重复点击）
- 脉冲动画反馈

### 3. 性能优化

- 使用 cubic-bezier 缓动函数优化动画流畅度
- 动画状态管理，避免重复触发
- 计算半径函数缓存

### 4. 无障碍支持

- 自动检测 `prefers-reduced-motion` 设置
- 支持键盘导航
- 语义化的 HTML 结构

## 🔧 技术实现

### View Transitions API 核心代码

```typescript
// 主题切换核心函数
const toggleThemeWithAnimation = async (event: MouseEvent, duration: number = 500) => {
  // 防止动画期间重复点击
  if (isAnimating.value) {
    return
  }
  isAnimating.value = true

  // 如果浏览器不支持 View Transitions API，降级处理
  if (!document?.startViewTransition) {
    toggleMode()
    isAnimating.value = false
    return
  }

  try {
    // 添加过渡类
    document.documentElement.classList.add('theme-transition')

    const transition = document.startViewTransition(async () => {
      toggleMode()
    }) as ViewTransition

    await transition.ready

    const { clientX, clientY } = event
    const radius = calculateRadius(clientX, clientY)

    // 创建圆形扩散动画
    const clipPath = [
      `circle(0px at ${clientX}px ${clientY}px)`,
      `circle(${radius}px at ${clientX}px ${clientY}px)`,
    ]

    // 根据主题方向调整动画
    // 当切换到深色模式时，我们需要在 ::view-transition-new(root) 上应用扩散动画
    // 当切换到浅色模式时，我们需要在 ::view-transition-old(root) 上应用收缩动画
    const willBeDark = !isDark.value // 即将切换到的模式

    if (willBeDark) {
      // 切换到深色模式：从点击位置向外扩散
      document.documentElement.animate(
        { clipPath: clipPath },
        {
          duration,
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          fill: 'both',
          pseudoElement: '::view-transition-new(root)',
        }
      )
    } else {
      // 切换到浅色模式：从外向内收缩
      document.documentElement.animate(
        { clipPath: clipPath.reverse() },
        {
          duration,
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          fill: 'both',
          pseudoElement: '::view-transition-old(root)',
        }
      )
    }

    await transition.finished
    document.documentElement.classList.remove('theme-transition')
  } catch (error) {
    console.error('Theme transition failed:', error)
    // 备用动画方案
    try {
      document.documentElement.style.transition = 'all 0.3s ease'
      document.documentElement.style.opacity = '0.8'

      setTimeout(() => {
        document.documentElement.style.opacity = '1'
        setTimeout(() => {
          document.documentElement.style.transition = ''
        }, 300)
      }, 50)
    } catch (fallbackError) {
      console.error('Fallback animation also failed:', fallbackError)
    }
    toggleMode()
  } finally {
    isAnimating.value = false
  }
}
```

### 计算动画半径

```typescript
// 计算动画半径
const calculateRadius = (x: number, y: number): number => {
  const maxX = Math.max(x, window.innerWidth - x)
  const maxY = Math.max(y, window.innerHeight - y)
  return Math.hypot(maxX, maxY)
}
```

## 📝 使用说明

### 确保 Store 支持以下方法

```typescript
// 颜色存储需要支持的方法
interface ColorStore {
  getModeOptions: () => ModeOptions[]
  getMode: () => Mode
  setMode: (value: Mode) => void
  isDark: boolean
}
```

### 主题模式约定

- `light`: 浅色模式
- `dark`: 深色模式
- `auto`: 自动模式（跟随系统）

### 组件功能

1. **循环切换**：在 light 和 dark 模式之间循环切换，排除 auto 模式
2. **动画效果**：点击时触发圆形扩散动画
3. **防抖处理**：动画期间禁止重复点击
4. **降级处理**：不支持的浏览器使用普通切换

## 🎯 可配置项

### 动画配置

```typescript
// 动画持续时间（默认 500ms）
duration: number = 500

// 动画缓动函数
easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
```

### 样式自定义

```scss
// 主题切换开关样式
.theme-switch {
  position: relative;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: scale(1.04);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &.is-animating {
    pointer-events: none;
    animation: pulse 0.5s ease-in-out;
  }
}

// 图标切换动画
.icon-switch-enter-active,
.icon-switch-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

## 🌐 浏览器兼容性

### 支持的浏览器

- Chrome 111+
- Edge 111+
- Safari 16.4+
- Firefox 113+

### 降级处理

对于不支持的浏览器，组件会自动降级为普通的主题切换，不会影响功能使用。

### 减少动画偏好

组件会自动检测用户的 `prefers-reduced-motion` 设置，如果用户偏好减少动画，会自动禁用动画效果。

## 📁 文件结构

```
src/
└── components/
    └── common/
        └── ThemeSwitch.vue          # 升级后的主题切换组件
```

## 🔄 升级步骤

1. **备份原组件**：备份原有的 ThemeSwitch.vue 文件
2. **替换组件**：使用新的 ThemeSwitch.vue 文件
3. **测试功能**：测试主题切换和动画效果
4. **浏览器测试**：在不同浏览器中测试兼容性

## 🐛 常见问题

### Q: 动画不生效怎么办？

A: 检查浏览器是否支持 View Transitions API，不支持时会自动降级。

### Q: 如何自定义动画效果？

A: 修改 `toggleThemeWithAnimation` 函数中的动画配置参数。

### Q: 如何调整切换按钮样式？

A: 修改 `.theme-switch` 的 CSS 样式。

### Q: 如何修改切换逻辑？

A: 修改 `getNextMode` 函数来改变切换顺序。

### Q: 为什么浅色切换到深色模式时没有动画效果？

A: 这是因为 View Transitions API 的伪元素选择器配置问题。已修复：

- 切换到深色模式时，在 `::view-transition-new(root)` 上应用扩散动画
- 切换到浅色模式时，在 `::view-transition-old(root)` 上应用收缩动画

## 🎉 总结

本次升级大大提升了主题切换的用户体验，通过 View Transitions API 实现了现代化的动画效果，同时保持了良好的浏览器兼容性和性能表现。组件现在支持：

- 🎨 圆形扩散动画
- ⚡ 平滑的主题切换
- 🎯 防抖处理
- 🔄 优雅的降级处理
- ♿ 无障碍支持
- 📱 响应式设计

这些改进使得主题切换功能更加现代化和用户友好。
