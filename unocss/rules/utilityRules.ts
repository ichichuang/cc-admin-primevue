/**
 * 工具规则
 */
export const utilityRules = [
  // 多行文本省略规则
  [
    /^line-clamp-(\d+)$/,
    ([, num]) => ({
      overflow: 'hidden',
      display: '-webkit-box',
      '-webkit-box-orient': 'vertical',
      '-webkit-line-clamp': num,
      'line-clamp': num,
    }),
  ],

  // 禁止文字选中规则
  [
    /^select-none$/,
    () => ({
      'user-select': 'none',
      '-webkit-user-select': 'none',
      '-moz-user-select': 'none',
      '-ms-user-select': 'none',
    }),
  ],

  // 允许文字选中规则
  [
    /^select-text$/,
    () => ({
      'user-select': 'text',
      '-webkit-user-select': 'text',
      '-moz-user-select': 'text',
      '-ms-user-select': 'text',
    }),
  ],

  // 自定义透明度规则
  [
    /^bg-theme-(\d+)$/,
    ([, opacity]) => ({
      'background-color': `rgba(var(--theme-color-rgb), ${Number(opacity) / 100})`,
    }),
  ],

  // 渐变规则
  [
    /^bg-gradient-theme$/,
    () => ({
      'background-image': 'linear-gradient(135deg, var(--theme-color), var(--primary-color))',
    }),
  ],
]
