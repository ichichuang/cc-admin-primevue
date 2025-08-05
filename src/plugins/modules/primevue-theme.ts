// 文件：primevue-theme.ts

import { useColorStore, useSizeStore } from '@/stores'
import { definePreset, usePreset } from '@primevue/themes'
import Aura from '@primevue/themes/aura'
console.log('Aura: ', Aura)

// 初始化按钮颜色
const initButtonColor = (
  colorStore: ReturnType<typeof useColorStore>,
  type: 'root' | 'outlined' | 'text' | 'link' = 'root'
) => {
  const getColorOptions = (
    colorType:
      | 'Primary'
      | 'Secondary'
      | 'Info'
      | 'Success'
      | 'Warn'
      | 'Help'
      | 'Danger'
      | 'Contrast'
  ) => {
    switch (type) {
      case 'outlined':
        return {
          hoverBackground:
            colorType === 'Secondary'
              ? colorStore[`get${colorType}Color` as keyof typeof colorStore]
              : colorStore[`get${colorType}ColorText` as keyof typeof colorStore],
          activeBackground:
            colorType === 'Secondary'
              ? colorStore[`get${colorType}Color` as keyof typeof colorStore]
              : colorStore[`get${colorType}ColorActive` as keyof typeof colorStore],
          borderColor:
            colorType === 'Secondary'
              ? colorStore[`get${colorType}ColorText` as keyof typeof colorStore]
              : colorStore[`get${colorType}Color` as keyof typeof colorStore],
          color:
            colorType === 'Secondary'
              ? colorStore[`get${colorType}ColorText` as keyof typeof colorStore]
              : colorStore[`get${colorType}Color` as keyof typeof colorStore],
        }
      case 'text':
        return {
          hoverBackground:
            colorType === 'Secondary'
              ? colorStore[`get${colorType}Color` as keyof typeof colorStore]
              : colorStore[`get${colorType}ColorText` as keyof typeof colorStore],
          activeBackground:
            colorType === 'Secondary'
              ? colorStore[`get${colorType}Color` as keyof typeof colorStore]
              : colorStore[`get${colorType}ColorText` as keyof typeof colorStore],
          color:
            colorType === 'Secondary'
              ? colorStore[`get${colorType}ColorText` as keyof typeof colorStore]
              : colorStore[`get${colorType}Color` as keyof typeof colorStore],
        }
      case 'link':
        return {
          color: colorStore[`get${colorType}ColorText` as keyof typeof colorStore],
          hoverColor: colorStore[`get${colorType}Color` as keyof typeof colorStore],
          activeColor: colorStore[`get${colorType}ColorHover` as keyof typeof colorStore],
        }
      default:
        return {
          background: colorStore[`get${colorType}Color` as keyof typeof colorStore],
          hoverBackground: colorStore[`get${colorType}ColorHover` as keyof typeof colorStore],
          activeBackground: colorStore[`get${colorType}ColorActive` as keyof typeof colorStore],
          borderColor: colorStore[`get${colorType}ColorBorder` as keyof typeof colorStore],
          hoverBorderColor: colorStore[`get${colorType}ColorActive` as keyof typeof colorStore],
          activeBorderColor: colorStore[`get${colorType}ColorHover` as keyof typeof colorStore],
          color: colorStore[`get${colorType}ColorText` as keyof typeof colorStore],
          hoverColor: colorStore[`get${colorType}ColorText` as keyof typeof colorStore],
          activeColor: colorStore[`get${colorType}ColorText` as keyof typeof colorStore],
          focusRing: {
            color: colorStore[`get${colorType}ColorFocus` as keyof typeof colorStore],
            shadow: colorStore[`get${colorType}ColorShadow` as keyof typeof colorStore],
          },
        }
    }
  }
  return {
    primary: getColorOptions('Primary'),
    secondary: getColorOptions('Secondary'),
    info: getColorOptions('Info'),
    success: getColorOptions('Success'),
    warn: getColorOptions('Warn'),
    help: getColorOptions('Help'),
    danger: getColorOptions('Danger'),
    contrast: getColorOptions('Contrast'),
  }
}

// 添加其他组件的颜色配置
const initComponentColors = (
  colorStore: ReturnType<typeof useColorStore>,
  sizeStore: ReturnType<typeof useSizeStore>
) => {
  return {
    button: {
      colorScheme: {
        light: {
          root: initButtonColor(colorStore),
          outlined: initButtonColor(colorStore, 'outlined'),
          text: initButtonColor(colorStore, 'text'),
          link: initButtonColor(colorStore, 'link'),
        },
        dark: {
          root: initButtonColor(colorStore),
          outlined: initButtonColor(colorStore, 'outlined'),
          text: initButtonColor(colorStore, 'text'),
          link: initButtonColor(colorStore, 'link'),
        },
      },
      // 添加按钮尺寸配置
      size: {
        sm: {
          paddingX: `${sizeStore.getGapValue * 1.5}px`,
          paddingY: `${sizeStore.getGapsValue * 1.5}px`,
          borderRadius: `${sizeStore.getRoundedValue}px`,
        },
        md: {
          paddingX: `${sizeStore.getGapValue * 2}px`,
          paddingY: `${sizeStore.getGapsValue * 2}px`,
          borderRadius: `${sizeStore.getRoundedValue}px`,
        },
        lg: {
          paddingX: `${sizeStore.getGapValue * 2.5}px`,
          paddingY: `${sizeStore.getGapsValue * 2.5}px`,
          borderRadius: `${sizeStore.getRoundedValue}px`,
        },
      },
    },
  }
}

// 初始化组件颜色
const initSemanticColors = (colorStore: ReturnType<typeof useColorStore>) => {
  return {
    primary: {
      '50': colorStore.getPrimary100,
      '100': colorStore.getPrimary100,
      '200': colorStore.getPrimary200,
      '300': colorStore.getPrimary300,
      '400': colorStore.getPrimary300,
      '500': colorStore.getPrimary300,
      '600': colorStore.getPrimary300,
      '700': colorStore.getPrimary300,
      '800': colorStore.getPrimary300,
      '900': colorStore.getPrimary300,
      '950': colorStore.getPrimary300,
    },
  }
}

const customPreset = (
  colorStore: ReturnType<typeof useColorStore>,
  sizeStore: ReturnType<typeof useSizeStore>
) => {
  const componentColors = initComponentColors(colorStore, sizeStore)

  return {
    components: {
      ...componentColors,
    },
    semantic: { ...initSemanticColors(colorStore) },
  }
}
/**
 * 创建 PrimeVue 动态主题预设
 * @param colorStore Pinia 颜色状态
 */
export function createPrimeVuePreset(
  colorStore: ReturnType<typeof useColorStore>,
  sizeStore: ReturnType<typeof useSizeStore>
) {
  return definePreset(Aura, { ...customPreset(colorStore, sizeStore) })
}

/**
 * 更新 PrimeVue 主题
 */
export function updatePrimeVueTheme(
  colorStore: ReturnType<typeof useColorStore>,
  sizeStore: ReturnType<typeof useSizeStore>
) {
  usePreset(Aura, { ...customPreset(colorStore, sizeStore) })
}
