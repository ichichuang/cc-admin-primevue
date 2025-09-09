# GridTable 类型定义

仿照 SchemaForm 的设计模式，提供友好的配置方式，让 GridTable 使用更加简单和直观。

## 🎯 设计理念

- **配置驱动**：通过配置对象控制表格行为
- **类型安全**：完整的 TypeScript 类型支持
- **样式统一**：统一的样式配置方式
- **功能丰富**：支持排序、过滤、分页、选择、导出等功能
- **易于扩展**：支持自定义组件和渲染器

## 📋 核心类型

### GridTableConfig

表格的主配置对象，包含所有表格相关的配置。

```typescript
interface GridTableConfig {
  columns: GridColumn[] // 列配置
  data: any[] // 数据
  layout?: LayoutConfig // 布局配置
  row?: RowConfig // 行配置
  cell?: CellConfig // 单元格配置
  pagination?: PaginationConfig // 分页配置
  selection?: SelectionConfig // 选择配置
  export?: ExportConfig // 导出配置
  toolbar?: ToolbarConfig // 工具栏配置
  components?: Record<string, any> // 自定义组件
  gridOptions?: Partial<GridOptions> // AG Grid 原生配置
}
```

### GridColumn

列配置对象，定义每一列的属性和行为。

```typescript
interface GridColumn {
  field: string // 字段名
  headerName?: string // 列标题
  type?: ColumnType // 列类型
  width?: number // 列宽度
  textAlign?: TextAlign // 文本对齐
  sortable?: boolean // 是否可排序
  filterable?: boolean // 是否可过滤
  pinned?: 'left' | 'right' // 是否固定
  style?: TextStyleConfig // 样式配置
  cellRenderer?: string | Function // 自定义渲染器
  // ... 更多配置
}
```

## 🚀 使用示例

### 基础用法

```typescript
import type { GridTableConfig } from '@/components/modules/grid-table/utils/types'

const config: GridTableConfig = {
  columns: [
    {
      field: 'id',
      headerName: 'ID',
      type: 'number',
      width: 80,
      textAlign: 'center',
    },
    {
      field: 'name',
      headerName: '姓名',
      type: 'text',
      width: 120,
      sortable: true,
      filterable: true,
    },
    {
      field: 'actions',
      headerName: '操作',
      type: 'actions',
      width: 120,
      pinned: 'right',
      cellRenderer: 'actionButtons',
    },
  ],
  data: userData,
  layout: {
    height: '500px',
    bordered: true,
    striped: true,
  },
  pagination: {
    enabled: true,
    pageSize: 10,
  },
  selection: {
    mode: 'multiple',
    checkboxes: true,
  },
}
```

### 样式配置

```typescript
const styledConfig: GridTableConfig = {
  columns: [
    {
      field: 'id',
      headerName: 'ID',
      type: 'number',
      width: 80,
      style: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#007bff',
      },
      headerStyle: {
        class: 'header-id',
        style: {
          backgroundColor: '#f8f9fa',
        },
      },
    },
  ],
  data: userData,
  row: {
    rowClass: 'custom-row',
    rowStyle: params => ({
      backgroundColor: params.node.rowIndex % 2 === 0 ? '#f8f9fa' : '#ffffff',
    }),
  },
}
```

### 工具栏配置

```typescript
const toolbarConfig: GridTableConfig = {
  columns: [...],
  data: userData,
  toolbar: {
    enabled: true,
    position: 'top',
    items: [
      {
        type: 'button',
        label: '刷新',
        icon: 'pi pi-refresh',
        onClick: () => handleRefresh()
      },
      {
        type: 'button',
        label: '导出',
        icon: 'pi pi-download',
        onClick: () => handleExport()
      },
      {
        type: 'separator'
      },
      {
        type: 'button',
        label: '新增',
        icon: 'pi pi-plus',
        onClick: () => handleAdd()
      }
    ]
  }
}
```

## 🎨 样式系统

### 文本样式配置

```typescript
interface TextStyleConfig {
  textAlign?: 'left' | 'center' | 'right' // 文本对齐
  fontSize?: string // 字体大小
  fontWeight?: 'normal' | 'bold' | number // 字体粗细
  color?: string // 字体颜色
  class?: string // 自定义类名
  style?: Record<string, string> // 自定义样式
}
```

### 样式优先级

1. **列配置样式** - 优先级最高
2. **全局配置样式** - 中等优先级
3. **默认样式** - 最低优先级

## 🔧 列类型

### 内置列类型

- `text` - 文本列
- `number` - 数字列
- `date` - 日期列
- `boolean` - 布尔列
- `select` - 选择列
- `actions` - 操作列
- `custom` - 自定义列

### 列类型特性

每种列类型都有默认的配置：

- **文本列**：支持文本过滤和排序
- **数字列**：支持数字过滤、排序和格式化
- **日期列**：支持日期过滤、排序和格式化
- **布尔列**：支持集合过滤
- **选择列**：支持集合过滤
- **操作列**：固定样式，不支持排序和过滤

## 🛠️ 工具函数

### 快速创建列

```typescript
import { createDefaultColumn, createActionColumn, createIdColumn } from './transformer'

// 创建默认列
const nameColumn = createDefaultColumn('name', '姓名')

// 创建操作列
const actionsColumn = createActionColumn('actionButtons')

// 创建ID列
const idColumn = createIdColumn('id', 'ID')
```

### 配置转换

```typescript
import { transformGridConfig } from './transformer'

const { columnDefs, gridOptions, components } = transformGridConfig(config)
```

## 📝 最佳实践

### 1. 列配置

- 使用 `type` 属性指定列类型，获得默认行为
- 通过 `style` 配置统一样式
- 使用 `pinned` 固定重要列

### 2. 样式配置

- 优先使用 `textAlign` 等语义化属性
- 通过 `class` 应用 CSS 类
- 使用 `style` 进行内联样式

### 3. 性能优化

- 合理设置列宽度
- 使用 `suppressSizeToFit` 优化操作列
- 启用虚拟滚动处理大数据

### 4. 用户体验

- 提供清晰的列标题
- 使用合适的过滤器类型
- 配置工具栏提供常用操作

## 🔄 与 AG Grid 的关系

新的类型定义是对 AG Grid 的二次封装：

- **配置转换**：将友好配置转换为 AG Grid 原生配置
- **类型安全**：提供完整的 TypeScript 支持
- **功能增强**：添加样式、布局等配置
- **向下兼容**：支持 AG Grid 原生配置

## 📚 更多示例

查看 `example.ts` 文件获取更多使用示例：

- 基础配置示例
- 完整功能示例
- 样式配置示例
- 工具栏配置示例
