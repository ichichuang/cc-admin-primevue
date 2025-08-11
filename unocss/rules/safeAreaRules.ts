/**
 * 安全区域规则 - 适配移动端
 */
export const safeAreaRules = [
  ['safe-top', { 'padding-top': 'env(safe-area-inset-top)' }],
  ['safe-bottom', { 'padding-bottom': 'env(safe-area-inset-bottom)' }],
  ['safe-left', { 'padding-left': 'env(safe-area-inset-left)' }],
  ['safe-right', { 'padding-right': 'env(safe-area-inset-right)' }],
  [
    'safe-x',
    {
      'padding-left': 'env(safe-area-inset-left)',
      'padding-right': 'env(safe-area-inset-right)',
    },
  ],
  [
    'safe-y',
    {
      'padding-top': 'env(safe-area-inset-top)',
      'padding-bottom': 'env(safe-area-inset-bottom)',
    },
  ],
]
