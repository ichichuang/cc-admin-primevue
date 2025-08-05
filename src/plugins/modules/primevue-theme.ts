// 文件：primevue-theme.ts

import { useColorStore, useSizeStore } from '@/stores'
import { definePreset, usePreset } from '@primevue/themes'
import Aura from '@primevue/themes/aura'
console.log('Aura: ', Aura)

const initBottonColor = (
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
              : colorStore[`get${colorType}ColorShadow` as keyof typeof colorStore],
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

const customPreset = (
  colorStore: ReturnType<typeof useColorStore>,
  sizeStore: ReturnType<typeof useSizeStore>
) => {
  return {
    components: {
      button: {
        colorScheme: {
          light: {
            root: initBottonColor(colorStore),
            outlined: initBottonColor(colorStore, 'outlined'),
            text: initBottonColor(colorStore, 'text'),
            link: initBottonColor(colorStore, 'link'),
          },
          dark: {
            root: initBottonColor(colorStore),
            outlined: initBottonColor(colorStore, 'outlined'),
            text: initBottonColor(colorStore, 'text'),
            link: initBottonColor(colorStore, 'link'),
          },
        },
      },
    },
    semantic: {
      formField: {
        paddingX: `${sizeStore.getGapValue}px`,
        paddingY: `${sizeStore.getGapsValue}px`,
        sm: {
          paddingX: `${sizeStore.getGapValue}px`,
          paddingY: `${sizeStore.getGapsValue}px`,
        },
        lg: {
          paddingX: `${sizeStore.getGapValue}px`,
          paddingY: `${sizeStore.getGapsValue}px`,
        },
        borderRadius: `${sizeStore.getRoundedValue}px`,
      },
    },
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
