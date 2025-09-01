<template lang="pug">
.example-container
  h3 主题切换 Hook 使用示例

  // 示例1：按钮形式
  .example-section
    h4 按钮形式
    button.btn-primary(@click='handleButtonClick') 切换主题（按钮）

  // 示例2：图标形式
  .example-section
    h4 图标形式
    .icon-button(@click='handleIconClick')
      i.pi.pi-sun(v-if='!isDark()')
      i.pi.pi-moon(v-else)

  // 示例3：卡片形式
  .example-section
    h4 卡片形式
    .theme-card(@click='handleCardClick')
      .card-content
        h5 点击切换主题
        p 这是一个卡片形式的主题切换器
        .card-icon
          i.pi.pi-palette

  // 示例4：简单切换（无动画）
  .example-section
    h4 简单切换
    button.btn-secondary(@click='handleSimpleClick') 简单切换（无动画）

  // 示例5：直接切换模式
  .example-section
    h4 直接切换模式
    .direct-switch
      button.btn-dark(@click='handleDarkMode') 切换到深色
      button.btn-light(@click='handleLightMode') 切换到浅色

  // 示例6：模式选项
  .example-section
    h4 可用模式
    .mode-list
      .mode-item(v-for='option in modeOptions', :key='option.value')
        span {{ option.label }}: {{ option.value }}

  // 状态显示
  .status-display
    p 当前主题: {{ isDark ? '深色' : '浅色' }}
    p 当前模式: {{ mode }}
    p 动画状态: {{ isAnimating ? '动画中...' : '空闲' }}
</template>

<script setup lang="ts">
import { useThemeSwitch } from '@/hooks/components/useThemeSwitch'

const {
  isAnimating,
  toggleThemeWithAnimation,
  toggleTheme,
  isDark,
  setThemeWithAnimation,
  modeOptions,
} = useThemeSwitch()

// 按钮点击处理 - 循环切换
const handleButtonClick = (event: MouseEvent) => {
  toggleThemeWithAnimation(event)
}

// 图标点击处理 - 循环切换
const handleIconClick = (event: MouseEvent) => {
  toggleThemeWithAnimation(event)
}

// 卡片点击处理 - 循环切换
const handleCardClick = (event: MouseEvent) => {
  toggleThemeWithAnimation(event)
}

// 简单切换处理（无动画）
const handleSimpleClick = () => {
  toggleTheme()
}

// 直接切换到深色模式
const handleDarkMode = (event: MouseEvent) => {
  setThemeWithAnimation('dark', event)
}

// 直接切换到浅色模式
const handleLightMode = (event: MouseEvent) => {
  setThemeWithAnimation('light', event)
}
</script>

<style lang="scss" scoped>
.example-container {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.example-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #f9f9f9;

  h4 {
    margin-top: 0;
    margin-bottom: 15px;
    color: #333;
  }
}

.btn-primary {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background: #0056b3;
  }
}

.btn-secondary {
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background: #545b62;
  }
}

.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #007bff;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 20px;

  &:hover {
    background: #0056b3;
    transform: scale(1.1);
  }
}

.theme-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  .card-content {
    text-align: center;

    h5 {
      margin: 0 0 10px 0;
      color: #333;
    }

    p {
      margin: 0 0 15px 0;
      color: #666;
    }

    .card-icon {
      font-size: 24px;
      color: #007bff;
    }
  }
}

.direct-switch {
  display: flex;
  gap: 10px;

  .btn-dark {
    background: #343a40;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background: #23272b;
    }
  }

  .btn-light {
    background: #f8f9fa;
    color: #212529;
    border: 1px solid #dee2e6;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background: #e2e6ea;
    }
  }
}

.mode-list {
  .mode-item {
    padding: 8px 12px;
    margin: 4px 0;
    background: #f8f9fa;
    border-radius: 4px;
    border: 1px solid #dee2e6;

    span {
      color: #495057;
      font-family: monospace;
    }
  }
}

.status-display {
  margin-top: 30px;
  padding: 15px;
  background: #e9ecef;
  border-radius: 4px;

  p {
    margin: 5px 0;
    color: #495057;
  }
}

// 深色模式适配
:global(.dark) {
  .example-section {
    background: #2d3748;
    border-color: #4a5568;
  }

  .theme-card {
    background: #4a5568;
    color: white;

    .card-content h5 {
      color: white;
    }

    .card-content p {
      color: #cbd5e0;
    }
  }

  .status-display {
    background: #4a5568;
    color: white;

    p {
      color: #cbd5e0;
    }
  }
}
</style>
