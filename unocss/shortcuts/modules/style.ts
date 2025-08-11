/**
 * 样式快捷方式
 */
export const styleShortcuts = {
  'c-cp': 'cursor-pointer',

  'c-border': 'border border-solid border-bg300',
  'c-border-primary': 'border border-solid border-primary200',
  'c-border-accent': 'border border-solid border-accent200',

  'c-shadow': 'shadow-md shadow-bg300',
  'c-shadow-primary': 'shadow-md shadow-primary200',
  'c-shadow-accent': 'shadow-md shadow-accent200',

  /* 卡片组 */
  // 强调色
  'c-card-accent':
    'c-cp center c-shadow gap-gap p-paddings rounded-rounded bg-bg200 color-text100 c-border border-tm hover:color-accent100 hover:c-shadow-accent  active:color-accent200 active:border-color-accent100 active:c-shadow-primary',
  'c-card-accent-hover':
    'c-cp c-shadow-accent gap-gap p-paddings rounded-rounded bg-bg200 color-text100  color-accent100 ',
  'c-card-accent-active':
    'c-cp  gap-gap p-paddings rounded-rounded bg-bg200 color-text100  color-accent100 c-border-accent',
  // 主题色
  'c-card-primary':
    'c-cp center c-shadow gap-gap p-paddings rounded-rounded bg-bg200 color-text100 c-border border-tm hover:color-primary100 hover:c-shadow-primary  active:color-primary200 active:border-color-primary100 active:c-shadow-primary',
  'c-card-primary-hover':
    'c-cp c-shadow-primary gap-gap p-paddings rounded-rounded bg-bg200 color-text100  color-primary100 ',
  'c-card-primary-active':
    'c-cp  gap-gap p-paddings rounded-rounded bg-bg200 color-text100  color-primary100 c-border-primary',
}
