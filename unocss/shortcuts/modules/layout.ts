/**
 * 布局快捷方式
 */
export const layoutShortcuts = {
  // 基础布局
  full: 'w-full h-full',
  container: 'full bg-bg100 color-text100',
  screen: 'min-h-screen',

  // Flex 布局
  center: 'flex items-center justify-center',
  between: 'flex items-center justify-between',
  around: 'flex items-center justify-around',
  evenly: 'flex items-center justify-evenly',
  start: 'flex items-center justify-start',
  end: 'flex items-center justify-end',

  'center-col': 'flex flex-col items-center justify-center',
  'between-col': 'flex flex-col justify-between',
  'evenly-col': 'flex flex-col justify-evenly',
  'around-col': 'flex flex-col justify-around',
  'start-col': 'flex flex-col justify-start',
  'end-col': 'flex flex-col justify-end',

  'center-start': 'flex items-start justify-center',
  'between-start': 'flex items-center justify-start',
  'center-end': 'flex items-end justify-center',
  'between-end': 'flex items-center justify-end',

  // Grid 布局
  'grid-center': 'grid place-items-center',
}
