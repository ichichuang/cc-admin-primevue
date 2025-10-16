import { DEFAULT_OPACITY_VALUES } from '@/components/modules/use-echarts/utils/constants'
import type { ChartOpacityConfig } from '@/components/modules/use-echarts/utils/types'
import { useColorStore, useSizeStore } from '@/stores'
import { computed } from 'vue'

export const useChartTheme = (option: any, opacityConfig?: ChartOpacityConfig) => {
  if (!option || typeof option !== 'object') {
    return option
  }

  // 在函数内部获取 store 实例
  const colorStore = useColorStore()
  const sizeStore = useSizeStore()

  // 获取主题颜色
  const textColor100 = computed(() => colorStore.getText100)
  const textColor200 = computed(() => colorStore.getText200)
  const bgColor200 = computed(() => colorStore.getBg200)
  const bgColor300 = computed(() => colorStore.getBg300)

  // 获取主题尺寸
  const paddings = computed(() => sizeStore.getPaddingsValue)
  const gapl = computed(() => sizeStore.getGapl)
  const fontSize = computed(() => sizeStore.getFontSizeValue)
  const fontSizeSmall = computed(() => sizeStore.getFontSizesValue)

  // 获取颜色数组
  const primaryColors = computed(() => [
    colorStore.getPrimaryColor,
    colorStore.getPrimaryColorHover,
    colorStore.getPrimaryColorActive,
    colorStore.getPrimaryColorBorder,
  ])
  const successColors = computed(() => [
    colorStore.getSuccessColor,
    colorStore.getSuccessColorHover,
    colorStore.getSuccessColorActive,
    colorStore.getSuccessColorBorder,
  ])
  const infoColors = computed(() => [
    colorStore.getInfoColor,
    colorStore.getInfoColorHover,
    colorStore.getInfoColorActive,
    colorStore.getInfoColorBorder,
  ])
  const warnColors = computed(() => [
    colorStore.getWarnColor,
    colorStore.getWarnColorHover,
    colorStore.getWarnColorActive,
    colorStore.getWarnColorBorder,
  ])
  const dangerColors = computed(() => [
    colorStore.getDangerColor,
    colorStore.getDangerColorHover,
    colorStore.getDangerColorActive,
    colorStore.getDangerColorBorder,
  ])
  const helpColors = computed(() => [
    colorStore.getHelpColor,
    colorStore.getHelpColorHover,
    colorStore.getHelpColorActive,
    colorStore.getHelpColorBorder,
  ])
  const contrastColors = computed(() => [
    colorStore.getContrastColor,
    colorStore.getContrastColorHover,
    colorStore.getContrastColorActive,
    colorStore.getContrastColorBorder,
  ])
  const secondaryColors = computed(() => [
    colorStore.getSecondaryColor,
    colorStore.getSecondaryColorHover,
    colorStore.getSecondaryColorActive,
    colorStore.getSecondaryColorBorder,
  ])

  const colors = [
    primaryColors.value[0],
    successColors.value[0],
    infoColors.value[0],
    warnColors.value[0],
    dangerColors.value[0],
    helpColors.value[0],
    contrastColors.value[0],
    secondaryColors.value[0],
    primaryColors.value[1],
    secondaryColors.value[1],
    successColors.value[1],
    infoColors.value[1],
    warnColors.value[1],
    dangerColors.value[1],
    helpColors.value[1],
    contrastColors.value[1],
    primaryColors.value[2],
    successColors.value[2],
    infoColors.value[2],
    warnColors.value[2],
    dangerColors.value[2],
    helpColors.value[2],
    contrastColors.value[2],
    secondaryColors.value[2],
    primaryColors.value[3],
    successColors.value[3],
    infoColors.value[3],
    warnColors.value[3],
    dangerColors.value[3],
    helpColors.value[3],
    contrastColors.value[3],
    secondaryColors.value[3],
  ]

  // 深拷贝原始配置，避免修改原始对象
  const mergedOption = JSON.parse(JSON.stringify(option))

  // 合并透明度配置
  const finalOpacityConfig = { ...DEFAULT_OPACITY_VALUES, ...opacityConfig }

  // 设置全局调色盘（用于饼图等自动着色）
  if (!mergedOption.color) {
    mergedOption.color = colors
  }

  // 合并标题样式
  if (mergedOption.title) {
    if (!mergedOption.title.textStyle) {
      mergedOption.title.textStyle = {}
    }
    if (!mergedOption.title.textStyle.color) {
      mergedOption.title.textStyle.color = textColor100.value
    }
    if (!mergedOption.title.textStyle.fontSize) {
      mergedOption.title.textStyle.fontSize = fontSize.value * 1.3
    }
    if (!mergedOption.title.left) {
      mergedOption.title.left = 0
    }
    if (!mergedOption.title.top) {
      mergedOption.title.top = 0
    }
  }

  // 合并图例样式
  if (mergedOption.legend) {
    if (!mergedOption.legend.textStyle) {
      mergedOption.legend.textStyle = {}
    }
    if (!mergedOption.legend.textStyle.color) {
      mergedOption.legend.textStyle.color = textColor200.value
    }
    if (!mergedOption.legend.textStyle.fontSize) {
      mergedOption.legend.textStyle.fontSize = fontSizeSmall.value
    }
    if (!mergedOption.legend.left) {
      mergedOption.legend.right = `${paddings.value}%`
    }
    if (!mergedOption.legend.top) {
      mergedOption.legend.top = gapl.value
    }
  }

  // 合并网格样式
  if (!mergedOption.grid) {
    mergedOption.grid = {
      left: `${paddings.value}%`,
      right: `${paddings.value}%`,
      top: '20%',
      bottom: `${paddings.value}%`,
      backgroundColor: 'transparent',
      containLabel: true,
    }
  }

  // 合并坐标轴样式
  if (mergedOption.xAxis) {
    const xAxisArray = Array.isArray(mergedOption.xAxis) ? mergedOption.xAxis : [mergedOption.xAxis]
    xAxisArray.forEach((axis: any) => {
      if (!axis.axisLabel) {
        axis.axisLabel = {}
      }
      if (!axis.axisLabel.color) {
        axis.axisLabel.color = textColor200.value
      }
      if (!axis.axisLabel.fontSize) {
        axis.axisLabel.fontSize = fontSizeSmall.value
      }
      if (!axis.axisLine) {
        axis.axisLine = {}
      }
      if (!axis.axisLine.lineStyle) {
        axis.axisLine.lineStyle = {}
      }
      if (!axis.axisLine.lineStyle.color) {
        axis.axisLine.lineStyle.color = bgColor300.value
      }
      if (!axis.splitLine) {
        axis.splitLine = {}
      }
      if (!axis.splitLine.lineStyle) {
        axis.splitLine.lineStyle = {}
      }
      if (!axis.splitLine.lineStyle.color) {
        axis.splitLine.lineStyle.color = bgColor300.value
      }
    })
  }

  if (mergedOption.yAxis) {
    const yAxisArray = Array.isArray(mergedOption.yAxis) ? mergedOption.yAxis : [mergedOption.yAxis]
    yAxisArray.forEach((axis: any) => {
      if (!axis.axisLabel) {
        axis.axisLabel = {}
      }
      if (!axis.axisLabel.color) {
        axis.axisLabel.color = textColor200.value
      }
      if (!axis.axisLabel.fontSize) {
        axis.axisLabel.fontSize = fontSizeSmall.value
      }
      if (!axis.axisLine) {
        axis.axisLine = {}
      }
      if (!axis.axisLine.lineStyle) {
        axis.axisLine.lineStyle = {}
      }
      if (!axis.axisLine.lineStyle.color) {
        axis.axisLine.lineStyle.color = bgColor300.value
      }
      if (!axis.splitLine) {
        axis.splitLine = {}
      }
      if (!axis.splitLine.lineStyle) {
        axis.splitLine.lineStyle = {}
      }
      if (!axis.splitLine.lineStyle.color) {
        axis.splitLine.lineStyle.color = bgColor300.value
      }
    })
  }

  // 合并雷达坐标系样式
  if (mergedOption.radar) {
    const radarArray = Array.isArray(mergedOption.radar) ? mergedOption.radar : [mergedOption.radar]
    radarArray.forEach((radar: any) => {
      // 设置雷达图的轴线颜色
      if (!radar.axisLine) {
        radar.axisLine = {}
      }
      if (!radar.axisLine.lineStyle) {
        radar.axisLine.lineStyle = {}
      }
      if (!radar.axisLine.lineStyle.color) {
        radar.axisLine.lineStyle.color = bgColor300.value
      }

      // 设置雷达图的分隔线颜色
      if (!radar.splitLine) {
        radar.splitLine = {}
      }
      if (!radar.splitLine.lineStyle) {
        radar.splitLine.lineStyle = {}
      }
      if (!radar.splitLine.lineStyle.color) {
        radar.splitLine.lineStyle.color = bgColor300.value
      }

      // 设置雷达图的分隔区域颜色
      if (!radar.splitArea) {
        radar.splitArea = { show: false }
      }

      // 设置雷达图的指示器文本颜色（ECharts 6 使用 axisName）
      if (!radar.axisName) {
        radar.axisName = {}
      }
      if (!radar.axisName.color) {
        radar.axisName.color = textColor200.value
      }
    })
  }

  // 合并单轴样式（主题河流图使用）
  if (mergedOption.singleAxis) {
    const singleAxisArray = Array.isArray(mergedOption.singleAxis)
      ? mergedOption.singleAxis
      : [mergedOption.singleAxis]
    singleAxisArray.forEach((axis: any) => {
      // 设置轴线颜色
      if (!axis.axisLine) {
        axis.axisLine = {}
      }
      if (!axis.axisLine.lineStyle) {
        axis.axisLine.lineStyle = {}
      }
      if (!axis.axisLine.lineStyle.color) {
        axis.axisLine.lineStyle.color = bgColor300.value
      }

      // 设置轴标签颜色
      if (!axis.axisLabel) {
        axis.axisLabel = {}
      }
      if (!axis.axisLabel.color) {
        axis.axisLabel.color = textColor200.value
      }

      // 设置分隔线颜色
      if (!axis.splitLine) {
        axis.splitLine = {}
      }
      if (!axis.splitLine.lineStyle) {
        axis.splitLine.lineStyle = {}
      }
      if (!axis.splitLine.lineStyle.color) {
        axis.splitLine.lineStyle.color = bgColor300.value
      }

      // 设置刻度线颜色
      if (!axis.axisTick) {
        axis.axisTick = {}
      }
      if (!axis.axisTick.lineStyle) {
        axis.axisTick.lineStyle = {}
      }
      if (!axis.axisTick.lineStyle.color) {
        axis.axisTick.lineStyle.color = bgColor300.value
      }
    })
  }

  // 合并系列样式
  if (mergedOption.series) {
    const seriesArray = Array.isArray(mergedOption.series)
      ? mergedOption.series
      : [mergedOption.series]
    seriesArray.forEach((series: any, index: number) => {
      // 设置默认颜色
      // 对于饼图、漏斗图、旭日图等，依赖全局 color 数组，不在 series 级别设置颜色
      const useGlobalColor = ['pie', 'funnel', 'sunburst', 'treemap', 'graph', 'sankey'].includes(
        series.type
      )

      if (!series.itemStyle) {
        series.itemStyle = {}
      }

      // 箱型图需要特殊处理：为每个箱子设置不同颜色
      if (series.type === 'boxplot') {
        // 将数据转换为对象格式，为每个数据项设置颜色
        if (Array.isArray(series.data)) {
          series.data = series.data.map((item: any, dataIndex: number) => {
            if (Array.isArray(item)) {
              // 如果是数组格式，转换为对象格式
              return {
                value: item,
                itemStyle: {
                  color: colors[dataIndex % colors.length],
                },
              }
            } else if (item && typeof item === 'object' && !item.itemStyle?.color) {
              // 如果已经是对象格式但没有颜色，添加颜色
              return {
                ...item,
                itemStyle: {
                  ...item.itemStyle,
                  color: colors[dataIndex % colors.length],
                },
              }
            }
            return item
          })
        }
      } else if (series.type === 'gauge') {
        // 仪表盘需要特殊处理：设置进度条、指针、轴线等颜色
        const gaugeColor = colors[index % colors.length]

        // 设置进度条颜色
        if (!series.progress) {
          series.progress = {}
        }
        if (!series.progress.itemStyle) {
          series.progress.itemStyle = {}
        }
        if (!series.progress.itemStyle.color) {
          series.progress.itemStyle.color = gaugeColor
        }

        // 设置指针颜色
        if (!series.pointer) {
          series.pointer = {}
        }
        if (!series.pointer.itemStyle) {
          series.pointer.itemStyle = {}
        }
        if (!series.pointer.itemStyle.color) {
          series.pointer.itemStyle.color = gaugeColor
        }

        // 设置轴线颜色（显示进度高亮效果）
        if (!series.axisLine) {
          series.axisLine = {}
        }
        if (!series.axisLine.lineStyle) {
          series.axisLine.lineStyle = {}
        }
        if (!series.axisLine.lineStyle.color) {
          // 根据数据值动态设置轴线颜色，实现进度高亮效果
          // 获取仪表盘的数值（百分比）
          const gaugeValue = series.data?.[0]?.value || 0
          const maxValue = series.max || 100
          const progress = gaugeValue / maxValue

          // 设置轴线分段颜色：[[进度比例, 高亮颜色], [剩余比例, 背景色]]
          series.axisLine.lineStyle.color = [
            [progress, gaugeColor], // 0 到当前值使用主题颜色（高亮）
            [1, bgColor300.value], // 当前值到最大值使用背景色
          ]
        }

        // 设置刻度线颜色
        if (!series.axisTick) {
          series.axisTick = {}
        }
        if (!series.axisTick.lineStyle) {
          series.axisTick.lineStyle = {}
        }
        if (!series.axisTick.lineStyle.color) {
          series.axisTick.lineStyle.color = textColor200.value
        }

        // 设置分隔线颜色
        if (!series.splitLine) {
          series.splitLine = {}
        }
        if (!series.splitLine.lineStyle) {
          series.splitLine.lineStyle = {}
        }
        if (!series.splitLine.lineStyle.color) {
          series.splitLine.lineStyle.color = textColor200.value
        }

        // 设置刻度标签颜色
        if (!series.axisLabel) {
          series.axisLabel = {}
        }
        if (!series.axisLabel.color) {
          series.axisLabel.color = textColor200.value
        }

        // 设置数值文本颜色
        if (!series.detail) {
          series.detail = {}
        }
        if (!series.detail.color) {
          series.detail.color = textColor100.value
        }

        // 设置标题颜色
        if (!series.title) {
          series.title = {}
        }
        if (!series.title.color) {
          series.title.color = textColor200.value
        }
      } else if (series.type === 'radar') {
        // 雷达图需要特殊处理：为每个数据项设置不同颜色
        if (Array.isArray(series.data)) {
          series.data = series.data.map((item: any, dataIndex: number) => {
            const radarColor = colors[dataIndex % colors.length]

            // 设置线条颜色
            if (!item.lineStyle) {
              item.lineStyle = {}
            }
            if (!item.lineStyle.color) {
              item.lineStyle.color = radarColor
            }

            // 设置区域填充颜色
            if (!item.areaStyle) {
              item.areaStyle = {}
            }
            if (!item.areaStyle.color) {
              item.areaStyle.color = radarColor
            }

            // 设置数据点颜色
            if (!item.itemStyle) {
              item.itemStyle = {}
            }
            if (!item.itemStyle.color) {
              item.itemStyle.color = radarColor
            }

            return item
          })
        }
      } else if (series.type === 'themeRiver') {
        // 主题河流图需要特殊处理：根据类别名称设置颜色
        // 主题河流图的数据格式：[['日期', 数值, '类别名'], ...]
        // 我们需要收集所有唯一的类别名，并为每个类别分配颜色
        if (Array.isArray(series.data)) {
          const categories = new Set<string>()
          series.data.forEach((item: any) => {
            if (Array.isArray(item) && item[2]) {
              categories.add(item[2])
            }
          })

          // 为每个类别分配颜色
          const categoryColors: { [key: string]: string } = {}
          Array.from(categories).forEach((category, catIndex) => {
            categoryColors[category] = colors[catIndex % colors.length]
          })

          // 将颜色映射保存到 series 中，供 ECharts 使用
          if (!series.itemStyle) {
            series.itemStyle = {}
          }
          if (!series.itemStyle.color) {
            series.itemStyle.color = (params: any) => {
              // params.data[2] 是类别名
              const category = params.data?.[2]
              return category ? categoryColors[category] : colors[0]
            }
          }
        }
      } else if (!useGlobalColor && !series.itemStyle.color && !series.color) {
        series.color = colors[index % colors.length]
      }

      // 设置标签样式
      if (!series.label) {
        series.label = {}
      }
      if (!series.label.color) {
        series.label.color = textColor100.value
      }
      if (!series.label.fontSize) {
        series.label.fontSize = fontSizeSmall.value
      }

      // 设置线条样式（折线图、面积图等）
      if (!series.lineStyle) {
        series.lineStyle = {}
      }
      if (!series.lineStyle.color && series.type === 'line') {
        series.lineStyle.color = colors[index % colors.length]
      }

      // 设置区域样式（面积图）
      if (!series.areaStyle) {
        series.areaStyle = {}
      }
      if (!series.areaStyle.color && series.type === 'line' && series.areaStyle) {
        series.areaStyle.color = colors[index % colors.length]
      }

      // 根据用户配置设置透明度
      if (series.type === 'line' && !series.areaStyle.opacity) {
        series.areaStyle.opacity = finalOpacityConfig.lineArea
      }

      if (series.type === 'area' && !series.areaStyle.opacity) {
        series.areaStyle.opacity = finalOpacityConfig.area
      }

      if (series.type === 'bar' && !series.itemStyle.opacity) {
        if (!series.itemStyle) {
          series.itemStyle = {}
        }
        series.itemStyle.opacity = finalOpacityConfig.bar
      }

      if (
        (series.type === 'scatter' || series.type === 'effectScatter') &&
        !series.itemStyle.opacity
      ) {
        if (!series.itemStyle) {
          series.itemStyle = {}
        }
        series.itemStyle.opacity = finalOpacityConfig.scatter
      }

      if (series.type === 'radar') {
        if (!series.areaStyle) {
          series.areaStyle = {}
        }
        if (!series.areaStyle.opacity) {
          series.areaStyle.opacity = finalOpacityConfig.radar
        }
      }

      if (series.type === 'funnel' && !series.itemStyle.opacity) {
        if (!series.itemStyle) {
          series.itemStyle = {}
        }
        series.itemStyle.opacity = finalOpacityConfig.funnel
      }

      if (series.type === 'gauge' && !series.itemStyle.opacity) {
        if (!series.itemStyle) {
          series.itemStyle = {}
        }
        series.itemStyle.opacity = finalOpacityConfig.gauge
      }
    })
  }

  // 合并提示框样式
  if (mergedOption.tooltip) {
    if (!mergedOption.tooltip.backgroundColor) {
      mergedOption.tooltip.backgroundColor = bgColor200.value
    }
    if (!mergedOption.tooltip.borderColor) {
      mergedOption.tooltip.borderColor = bgColor300.value
    }
    if (!mergedOption.tooltip.textStyle) {
      mergedOption.tooltip.textStyle = {}
    }
    if (!mergedOption.tooltip.textStyle.color) {
      mergedOption.tooltip.textStyle.color = textColor100.value
    }
    if (!mergedOption.tooltip.textStyle.fontSize) {
      mergedOption.tooltip.textStyle.fontSize = fontSizeSmall.value
    }
  }

  return mergedOption
}
