import { defineComponent, type PropType } from 'vue'

// 明确约束 Action 列渲染器可接受的参数类型
export interface ActionCellButtonLabels {
  view?: string
  edit?: string
  delete?: string
}

export interface ActionCellParams {
  /** 当前行数据 */
  data: unknown
  /** 点击“查看”时的回调 */
  onView?: (row: unknown) => void
  /** 点击“修改”时的回调 */
  onEdit?: (row: unknown) => void
  /** 点击“删除”时的回调 */
  onDelete?: (row: unknown) => void
  /** 是否展示查看按钮，默认展示 */
  showView?: boolean
  /** 是否展示编辑按钮，默认展示 */
  showEdit?: boolean
  /** 是否展示删除按钮，默认展示 */
  showDelete?: boolean
  /** 按钮文本自定义 */
  buttonLabels?: ActionCellButtonLabels
  /** 是否使用块级（填充背景色）按钮风格 */
  block?: boolean
}

/**
 * GridTable 通用：操作列 TSX 渲染器
 * - 通过 props.params 接收 ag-Grid 的单元格参数
 * - 通过 cellRendererParams 传入 onView/onEdit/onDelete 回调
 */
export default defineComponent({
  name: 'ActionCell',
  props: {
    params: { type: Object as PropType<ActionCellParams>, required: true },
  },
  setup(props) {
    const p = (props.params || {}) as ActionCellParams
    const onView = () => p.onView?.(p.data)
    const onEdit = () => p.onEdit?.(p.data)
    const onDelete = () => p.onDelete?.(p.data)

    // 显示控制（默认全部显示）
    const showView: boolean = p.showView !== false
    const showEdit: boolean = p.showEdit !== false
    const showDelete: boolean = p.showDelete !== false

    // 文字自定义（提供默认值）
    const labels: ActionCellButtonLabels = p.buttonLabels || {}
    const viewText = labels.view || '查看'
    const editText = labels.edit || '修改'
    const deleteText = labels.delete || '删除'

    return () => (
      <div class="full between">
        {showView && (
          <>
            <div onClick={onView}>
              {p.block ? (
                <span class="px-padding py-paddings c-cp bg-primaryColor color-primaryTextColor hover:bg-primaryHoverColor active:bg-primaryActiveColor rounded-rounded c-transitions">
                  {viewText}
                </span>
              ) : (
                <span class="px-padding py-paddings c-cp color-primaryColor hover:color-primaryHoverColor active:color-primaryActiveColor rounded-rounded c-transitions">
                  {viewText}
                </span>
              )}
            </div>
            {(showEdit || showDelete) && <div class="color-text200">|</div>}
          </>
        )}

        {showEdit && (
          <>
            <div onClick={onEdit}>
              {p.block ? (
                <span class="px-padding py-paddings c-cp bg-successColor color-successTextColor hover:bg-successHoverColor active:bg-successActiveColor rounded-rounded c-transitions">
                  {editText}
                </span>
              ) : (
                <span class="px-padding py-paddings c-cp color-successColor hover:color-successHoverColor active:color-successActiveColor rounded-rounded c-transitions">
                  {editText}
                </span>
              )}
            </div>
            {showDelete && <div class="color-text200">|</div>}
          </>
        )}

        {showDelete && (
          <div onClick={onDelete}>
            {p.block ? (
              <span class="px-padding py-paddings c-cp bg-dangerColor color-dangerTextColor hover:bg-dangerHoverColor active:bg-dangerActiveColor rounded-rounded c-transitions">
                {deleteText}
              </span>
            ) : (
              <span class="px-padding py-paddings c-cp color-dangerColor hover:color-dangerHoverColor active:color-dangerActiveColor rounded-rounded c-transitions">
                {deleteText}
              </span>
            )}
          </div>
        )}
      </div>
    )
  },
})
