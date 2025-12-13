# Shadcn UI 组件样式基线记录

> **文档创建日期**: 2024-12-14  
> **目的**: 记录从 Radix UI 迁移至 BaseUI 之前的所有 shadcn 组件样式状态  
> **分支**: baseui

## 项目配置概览

### Shadcn 配置 (components.json)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/styles.css",
    "baseColor": "zinc",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

### 主题配置

**样式**: New York  
**基色**: Zinc  
**圆角半径**: `0.625rem` (10px)

## CSS 变量和主题

### 亮色主题 (Light Mode)

| 变量 | 值 | 说明 |
|------|------|------|
| `--background` | `oklch(1 0 0)` | 纯白背景 |
| `--foreground` | `oklch(0.145 0 0)` | 深色前景文字 |
| `--primary` | `oklch(0.205 0 0)` | 深灰主色 |
| `--primary-foreground` | `oklch(0.985 0 0)` | 主色前景（近白） |
| `--secondary` | `oklch(0.97 0 0)` | 浅灰次要色 |
| `--secondary-foreground` | `oklch(0.205 0 0)` | 次要色前景 |
| `--muted` | `oklch(0.97 0 0)` | 柔和背景色 |
| `--muted-foreground` | `oklch(0.556 0 0)` | 柔和前景色 |
| `--accent` | `oklch(0.97 0 0)` | 强调色 |
| `--accent-foreground` | `oklch(0.205 0 0)` | 强调前景色 |
| `--destructive` | `oklch(0.577 0.245 27.325)` | 红色破坏性操作色 |
| `--border` | `oklch(0.922 0 0)` | 边框颜色 |
| `--input` | `oklch(0.922 0 0)` | 输入框边框 |
| `--ring` | `oklch(0.708 0 0)` | 聚焦环颜色 |
| `--card` | `oklch(1 0 0)` | 卡片背景 |
| `--card-foreground` | `oklch(0.145 0 0)` | 卡片前景 |
| `--popover` | `oklch(1 0 0)` | 弹出层背景 |
| `--popover-foreground` | `oklch(0.145 0 0)` | 弹出层前景 |

### 暗色主题 (Dark Mode)

| 变量 | 值 | 说明 |
|------|------|------|
| `--background` | `oklch(0.145 0 0)` | 深色背景 |
| `--foreground` | `oklch(0.985 0 0)` | 亮色前景 |
| `--primary` | `oklch(0.922 0 0)` | 浅色主色 |
| `--primary-foreground` | `oklch(0.205 0 0)` | 主色前景 |
| `--secondary` | `oklch(0.269 0 0)` | 深灰次要色 |
| `--muted` | `oklch(0.269 0 0)` | 柔和背景 |
| `--accent` | `oklch(0.269 0 0)` | 强调色 |
| `--destructive` | `oklch(0.704 0.191 22.216)` | 红色破坏性操作 |
| `--border` | `oklch(1 0 0 / 10%)` | 半透明边框 |
| `--input` | `oklch(1 0 0 / 15%)` | 半透明输入框 |

### 侧边栏主题变量

| 变量 | 亮色 | 暗色 |
|------|------|------|
| `--sidebar` | `oklch(0.985 0 0)` | `oklch(0.205 0 0)` |
| `--sidebar-foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` |
| `--sidebar-border` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 10%)` |

## UI 组件样式详情

### 1. Button (按钮)

**文件**: `src/components/ui/button.tsx`  
**依赖**: Radix UI Slot

#### 变体 (Variants)

| 变体 | 样式类 | 视觉效果 |
|------|--------|---------|
| `default` | `bg-primary text-primary-foreground shadow-xs hover:bg-primary/90` | 深色背景，白色文字，悬停变浅 |
| `destructive` | `bg-destructive text-white shadow-xs hover:bg-destructive/90` | 红色背景，白色文字 |
| `outline` | `border bg-background shadow-xs hover:bg-accent` | 边框按钮，悬停改变背景 |
| `secondary` | `bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80` | 次要按钮样式 |
| `ghost` | `hover:bg-accent hover:text-accent-foreground` | 透明背景，悬停显示背景 |
| `link` | `text-primary underline-offset-4 hover:underline` | 链接样式 |

#### 尺寸 (Sizes)

| 尺寸 | 高度 | 内边距 | 说明 |
|------|------|--------|------|
| `default` | `h-9` (36px) | `px-4 py-2` | 标准尺寸 |
| `sm` | `h-8` (32px) | `px-3` | 小尺寸 |
| `lg` | `h-10` (40px) | `px-6` | 大尺寸 |
| `icon` | `size-9` (36x36px) | - | 图标按钮 |

#### 焦点样式

- **焦点环**: `focus-visible:ring-ring/50 focus-visible:ring-[3px]`
- **焦点边框**: `focus-visible:border-ring`
- **无效状态**: `aria-invalid:ring-destructive/20 aria-invalid:border-destructive`

### 2. Input (输入框)

**文件**: `src/components/ui/input.tsx`

#### 基础样式

```css
h-9 w-full min-w-0 rounded-md border border-input 
bg-transparent px-3 py-1 text-base shadow-xs
```

#### 特殊状态

- **占位符**: `placeholder:text-muted-foreground`
- **选中文本**: `selection:bg-primary selection:text-primary-foreground`
- **焦点**: `focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]`
- **无效**: `aria-invalid:ring-destructive/20 aria-invalid:border-destructive`
- **禁用**: `disabled:opacity-50 disabled:cursor-not-allowed`
- **暗色模式**: `dark:bg-input/30`

### 3. Card (卡片)

**文件**: `src/components/ui/card.tsx`

#### 组件结构

| 子组件 | 样式类 | 说明 |
|--------|--------|------|
| `Card` | `bg-card text-card-foreground rounded-xl border py-6 shadow-sm` | 主容器 |
| `CardHeader` | `px-6 gap-1.5 grid grid-cols-[1fr_auto]` | 卡片头部 |
| `CardTitle` | `font-semibold leading-none` | 标题 |
| `CardDescription` | `text-muted-foreground text-sm` | 描述文本 |
| `CardContent` | `px-6` | 内容区 |
| `CardFooter` | `px-6 flex items-center` | 底部区域 |
| `CardAction` | `col-start-2 row-span-2` | 操作按钮区 |

#### 关键样式特性

- **圆角**: `rounded-xl` (更大的圆角)
- **间距**: `gap-6` (子元素间距)
- **阴影**: `shadow-sm`

### 4. Dialog (对话框)

**文件**: `src/components/ui/dialog.tsx`  
**依赖**: Radix UI Dialog

#### 组件结构

| 子组件 | 样式 | 说明 |
|--------|------|------|
| `DialogOverlay` | `bg-black/50 fixed inset-0 z-50` | 半透明遮罩 |
| `DialogContent` | `bg-background rounded-lg border p-6 shadow-lg` | 内容容器 |
| `DialogTitle` | `text-lg font-semibold leading-none` | 标题 |
| `DialogDescription` | `text-muted-foreground text-sm` | 描述 |

#### 动画效果

- **进入**: `fade-in-0 zoom-in-95`
- **退出**: `fade-out-0 zoom-out-95`
- **持续时间**: `duration-200`

#### 关闭按钮

- 位置: `absolute top-4 right-4`
- 样式: `rounded-xs opacity-70 hover:opacity-100`

### 5. Select (选择器)

**文件**: `src/components/ui/select.tsx`  
**依赖**: Radix UI Select

#### SelectTrigger 样式

```css
h-9 w-fit px-3 py-2 rounded-md border border-input 
bg-transparent shadow-xs whitespace-nowrap
```

**尺寸变体**:
- `default`: `h-9`
- `sm`: `h-8`

#### SelectContent 样式

```css
bg-popover text-popover-foreground rounded-md 
border shadow-md min-w-[8rem] overflow-y-auto
```

#### SelectItem 样式

```css
rounded-sm py-1.5 pr-8 pl-2 text-sm
focus:bg-accent focus:text-accent-foreground
```

#### 特殊功能

- **占位符样式**: `data-[placeholder]:text-muted-foreground`
- **选中指示器**: CheckIcon (右侧显示)
- **滚动按钮**: ChevronUpIcon / ChevronDownIcon

### 6. Table (表格)

**文件**: `src/components/ui/table.tsx`

#### 组件结构

| 组件 | 样式 | 说明 |
|------|------|------|
| `Table` | `w-full caption-bottom text-sm` | 主表格 |
| `TableHeader` | `[&_tr]:border-b` | 表头 |
| `TableBody` | `[&_tr:last-child]:border-0` | 表体 |
| `TableFooter` | `bg-muted/50 border-t font-medium` | 表尾 |
| `TableRow` | `border-b hover:bg-muted/50` | 表格行 |
| `TableHead` | `h-10 px-2 text-left font-medium` | 表头单元格 |
| `TableCell` | `p-2 align-middle whitespace-nowrap` | 数据单元格 |
| `TableCaption` | `text-muted-foreground mt-4 text-sm` | 表格说明 |

#### 特殊状态

- **选中行**: `data-[state=selected]:bg-muted`
- **悬停效果**: `hover:bg-muted/50`

### 7. Badge (徽章)

**文件**: `src/components/ui/badge.tsx`

#### 变体样式

| 变体 | 样式 | 视觉效果 |
|------|------|---------|
| `default` | `bg-primary text-primary-foreground border-transparent` | 深色徽章 |
| `secondary` | `bg-secondary text-secondary-foreground border-transparent` | 次要徽章 |
| `destructive` | `bg-destructive text-white border-transparent` | 红色徽章 |
| `outline` | `text-foreground border` | 边框徽章 |

#### 基础样式

```css
rounded-md border px-2 py-0.5 text-xs font-medium 
w-fit whitespace-nowrap shrink-0 gap-1
```

### 8. Form (表单)

**文件**: `src/components/ui/form.tsx`  
**依赖**: React Hook Form, Radix UI Label/Slot

#### 组件结构

| 组件 | 样式 | 说明 |
|------|------|------|
| `FormItem` | `grid gap-2` | 表单项容器 |
| `FormLabel` | `text-sm font-medium` | 标签 |
| `FormDescription` | `text-muted-foreground text-sm` | 描述文本 |
| `FormMessage` | `text-destructive text-sm` | 错误消息 |

#### 错误状态

- **标签**: `data-[error=true]:text-destructive`
- **控件**: 通过 `aria-invalid` 属性触发无效样式

### 9. Dropdown Menu (下拉菜单)

**文件**: `src/components/ui/dropdown-menu.tsx`  
**依赖**: Radix UI DropdownMenu

#### DropdownMenuContent 样式

```css
bg-popover text-popover-foreground rounded-md 
border p-1 shadow-md min-w-[8rem] z-50
```

#### DropdownMenuItem 样式

```css
rounded-sm px-2 py-1.5 text-sm gap-2
focus:bg-accent focus:text-accent-foreground
cursor-default select-none
```

**变体**:
- `default`: 标准样式
- `destructive`: `data-[variant=destructive]:text-destructive`

#### 特殊组件

- **CheckboxItem**: 左侧显示 CheckIcon
- **RadioItem**: 左侧显示 CircleIcon (填充)
- **Separator**: `bg-border h-px -mx-1 my-1`
- **Label**: `px-2 py-1.5 text-sm font-medium`
- **Shortcut**: `text-muted-foreground ml-auto text-xs`

### 10. Sheet (抽屉)

**文件**: `src/components/ui/sheet.tsx`  
**依赖**: Radix UI Dialog (复用)

#### SheetContent 样式

基础样式:
```css
bg-background fixed z-50 flex flex-col gap-4 
shadow-lg transition ease-in-out
```

#### 侧边变体

| 侧边 | 位置样式 | 尺寸 |
|------|---------|------|
| `right` | `inset-y-0 right-0 border-l` | `w-3/4 sm:max-w-sm` |
| `left` | `inset-y-0 left-0 border-r` | `w-3/4 sm:max-w-sm` |
| `top` | `inset-x-0 top-0 border-b` | `h-auto` |
| `bottom` | `inset-x-0 bottom-0 border-t` | `h-auto` |

#### 动画

- **进入持续时间**: `data-[state=open]:duration-500`
- **退出持续时间**: `data-[state=closed]:duration-300`
- **滑动动画**: 根据侧边方向不同

### 11. Checkbox (复选框)

**文件**: `src/components/ui/checkbox.tsx`  
**依赖**: Radix UI Checkbox

#### 样式

```css
size-4 shrink-0 rounded-[4px] border border-input 
shadow-xs transition-shadow
dark:bg-input/30
```

#### 选中状态

```css
data-[state=checked]:bg-primary 
data-[state=checked]:text-primary-foreground
data-[state=checked]:border-primary
```

#### 指示器

- **图标**: CheckIcon
- **尺寸**: `size-3.5`

### 12. Textarea (文本区域)

**文件**: `src/components/ui/textarea.tsx`

#### 样式

```css
min-h-16 w-full rounded-md border border-input 
bg-transparent px-3 py-2 text-base shadow-xs
field-sizing-content
dark:bg-input/30
```

#### 特殊功能

- **自动调整大小**: `field-sizing-content` (CSS原生功能)
- **占位符**: `placeholder:text-muted-foreground`

### 13. Alert Dialog (警告对话框)

**文件**: `src/components/ui/alert-dialog.tsx`  
**依赖**: Radix UI AlertDialog

#### 结构与 Dialog 相似

主要区别:
- **AlertDialogAction**: 使用 `buttonVariants()` 默认样式
- **AlertDialogCancel**: 使用 `buttonVariants({ variant: "outline" })`

### 14. Tabs (标签页)

**文件**: `src/components/ui/tabs.tsx`  
**依赖**: Radix UI Tabs

#### TabsList 样式

```css
bg-muted text-muted-foreground 
inline-flex h-9 w-fit items-center justify-center 
rounded-lg p-[3px]
```

#### TabsTrigger 样式

```css
h-[calc(100%-1px)] px-2 py-1 rounded-md 
border border-transparent text-sm font-medium
data-[state=active]:bg-background 
data-[state=active]:shadow-sm
dark:data-[state=active]:bg-input/30
```

### 15. Sidebar (侧边栏)

**文件**: `src/components/ui/sidebar.tsx`  
**依赖**: Radix UI Slot, Sheet

#### 配置常量

```typescript
SIDEBAR_WIDTH = "16rem"
SIDEBAR_WIDTH_MOBILE = "18rem"
SIDEBAR_WIDTH_ICON = "3rem"
SIDEBAR_KEYBOARD_SHORTCUT = "b" (Cmd/Ctrl + B)
```

#### 主要组件

| 组件 | 样式/功能 | 说明 |
|------|----------|------|
| `SidebarProvider` | 提供上下文，管理状态 | 支持展开/折叠 |
| `Sidebar` | 固定侧边栏容器 | 响应式设计 |
| `SidebarHeader` | 侧边栏顶部 | - |
| `SidebarContent` | 滚动内容区 | - |
| `SidebarFooter` | 侧边栏底部 | - |
| `SidebarMenu` | 菜单列表容器 | - |
| `SidebarMenuItem` | 单个菜单项 | - |
| `SidebarMenuButton` | 菜单按钮 | 支持 lg/default/sm 尺寸 |

#### 状态管理

- **展开状态**: Cookie 持久化 (`sidebar_state`)
- **移动端**: 使用 Sheet 组件
- **键盘快捷键**: Cmd/Ctrl + B

### 16. Avatar (头像)

**文件**: `src/components/ui/avatar.tsx`  
**依赖**: Radix UI Avatar

#### 组件结构

| 组件 | 样式 | 说明 |
|------|------|------|
| `Avatar` | `size-8 shrink-0 overflow-hidden rounded-full` | 容器 |
| `AvatarImage` | `aspect-square size-full` | 图片 |
| `AvatarFallback` | `bg-muted flex items-center justify-center` | 后备内容 |

### 17. Switch (开关)

**文件**: `src/components/ui/switch.tsx`  
**依赖**: Radix UI Switch

#### 根样式

```css
h-[1.15rem] w-8 rounded-full border shadow-xs
data-[state=checked]:bg-primary
data-[state=unchecked]:bg-input
dark:data-[state=unchecked]:bg-input/80
```

#### Thumb 样式

```css
bg-background size-4 rounded-full
data-[state=checked]:translate-x-[calc(100%-2px)]
dark:data-[state=unchecked]:bg-foreground
```

### 18. Slider (滑块)

**文件**: `src/components/ui/slider.tsx`  
**依赖**: Radix UI Slider

#### 组件结构

| 组件 | 样式 | 说明 |
|------|------|------|
| `SliderTrack` | `bg-muted h-1.5 rounded-full` | 轨道 |
| `SliderRange` | `bg-primary absolute h-full` | 范围 |
| `SliderThumb` | `size-4 rounded-full border border-primary bg-background` | 滑块 |

#### 交互效果

- **悬停**: `hover:ring-4 ring-ring/50`
- **焦点**: `focus-visible:ring-4`

### 19. Tooltip (工具提示)

**文件**: `src/components/ui/tooltip.tsx`  
**依赖**: Radix UI Tooltip

#### TooltipContent 样式

```css
bg-primary text-primary-foreground 
z-50 rounded-md px-3 py-1.5 text-xs text-balance
```

#### 特殊功能

- **箭头**: `bg-primary fill-primary size-2.5 rotate-45 rounded-[2px]`
- **延迟**: `delayDuration = 0` (默认)

### 20. Radio Group (单选按钮组)

**文件**: `src/components/ui/radio-group.tsx`  
**依赖**: Radix UI RadioGroup

#### RadioGroupItem 样式

```css
size-4 shrink-0 rounded-full border border-input shadow-xs
dark:bg-input/30
```

#### 指示器

- **图标**: CircleIcon (填充)
- **尺寸**: `size-2`
- **颜色**: `fill-primary`

### 21. Separator (分隔线)

**文件**: `src/components/ui/separator.tsx`  
**依赖**: Radix UI Separator

#### 样式

```css
bg-border shrink-0
data-[orientation=horizontal]:h-px w-full
data-[orientation=vertical]:h-full w-px
```

### 22. Accordion (手风琴)

**文件**: `src/components/ui/accordion.tsx`  
**依赖**: Radix UI Accordion

#### AccordionItem 样式

```css
border-b last:border-b-0
```

#### AccordionTrigger 样式

```css
flex flex-1 items-start justify-between gap-4 
rounded-md py-4 text-sm font-medium
hover:underline
[&[data-state=open]>svg]:rotate-180
```

#### AccordionContent 动画

```css
data-[state=closed]:animate-accordion-up
data-[state=open]:animate-accordion-down
overflow-hidden
```

### 23. Collapsible (可折叠)

**文件**: `src/components/ui/collapsible.tsx`  
**依赖**: Radix UI Collapsible

最小化封装，主要使用 Radix UI 原生功能。

### 24. Label (标签)

**文件**: `src/components/ui/label.tsx`  
**依赖**: Radix UI Label

#### 样式

```css
flex items-center gap-2 text-sm leading-none 
font-medium select-none
group-data-[disabled=true]:opacity-50
peer-disabled:cursor-not-allowed peer-disabled:opacity-50
```

### 25. Skeleton (骨架屏)

**文件**: `src/components/ui/skeleton.tsx`

#### 样式

```css
bg-accent animate-pulse rounded-md
```

### 26. Toaster (通知)

**文件**: `src/components/ui/sonner.tsx`  
**依赖**: Sonner (第三方库)

#### CSS 变量绑定

```css
--normal-bg: var(--popover)
--normal-text: var(--popover-foreground)
--normal-border: var(--border)
```

## 组件使用统计

### 使用频率最高的组件

根据项目文件分析，以下组件使用最频繁：

1. **Button** - 76+ 处引用
2. **Form** (FormItem, FormLabel, FormControl, FormMessage) - 40+ 处
3. **Dialog** - 25+ 处
4. **Card** - 20+ 处
5. **Input** - 30+ 处
6. **Select** - 15+ 处
7. **Table** - 10+ 处
8. **Badge** - 15+ 处

### 主要使用场景

#### Dashboard 区域

- **产品管理**: `product-form.tsx`, `product-table-view.tsx`, `product-card.tsx`
- **订单管理**: `orders-table.tsx`, `order-details-dialog.tsx`
- **分类管理**: `category-form.tsx`, `category-card.tsx`
- **颜色管理**: `color-form.tsx`, `color-list.tsx`
- **尺寸管理**: `size-form.tsx`, `size-list.tsx`

#### Shop 区域

- **产品展示**: `product-info.tsx`, `product-filters.tsx`
- **购物车**: `cart-sheet.tsx`, `cart-item.tsx`
- **结账**: `checkout-form.tsx`, `checkout-summary.tsx`
- **订单**: `myorders.tsx`, `pay-order-button.tsx`

## 共通样式模式

### 焦点环样式

所有交互组件统一使用：

```css
focus-visible:border-ring 
focus-visible:ring-ring/50 
focus-visible:ring-[3px]
outline-none
```

### 无效状态样式

```css
aria-invalid:ring-destructive/20 
dark:aria-invalid:ring-destructive/40 
aria-invalid:border-destructive
```

### 禁用状态样式

```css
disabled:pointer-events-none 
disabled:cursor-not-allowed 
disabled:opacity-50
```

### 暗色模式适配

- 输入类组件: `dark:bg-input/30`
- 悬停效果: `dark:hover:bg-input/50`
- 边框: `dark:border-input`

### 动画进出

大多数弹出组件使用：

```css
data-[state=open]:animate-in 
data-[state=closed]:animate-out 
data-[state=closed]:fade-out-0 
data-[state=open]:fade-in-0
```

### 阴影系统

- **xs**: `shadow-xs` - 输入框、按钮
- **sm**: `shadow-sm` - 卡片
- **md**: `shadow-md` - 下拉菜单、选择器
- **lg**: `shadow-lg` - 对话框、抽屉

## Radix UI 依赖列表

当前项目使用的 Radix UI 原语（primitives）：

| 原语 | 使用的组件 |
|------|-----------|
| `@radix-ui/react-slot` | Button, Badge, Form, Sidebar |
| `@radix-ui/react-dialog` | Dialog, Sheet, AlertDialog |
| `@radix-ui/react-label` | Label, Form |
| `@radix-ui/react-select` | Select |
| `@radix-ui/react-dropdown-menu` | DropdownMenu |
| `@radix-ui/react-checkbox` | Checkbox |
| `@radix-ui/react-avatar` | Avatar |
| `@radix-ui/react-switch` | Switch |
| `@radix-ui/react-slider` | Slider |
| `@radix-ui/react-tooltip` | Tooltip |
| `@radix-ui/react-radio-group` | RadioGroup |
| `@radix-ui/react-separator` | Separator |
| `@radix-ui/react-accordion` | Accordion |
| `@radix-ui/react-collapsible` | Collapsible |
| `@radix-ui/react-tabs` | Tabs |

## 迁移注意事项

### 需要特别注意的样式特性

1. **data-slot 属性**: 所有组件都添加了 `data-slot` 属性用于识别
2. **CSS 变量依赖**: 大量使用 CSS 变量，需要确保 BaseUI 支持
3. **动画类**: 使用 `tw-animate-css` 和 Tailwind 动画
4. **复合选择器**: 大量使用属性选择器和伪类
5. **响应式设计**: 使用 Tailwind 响应式前缀
6. **暗色模式**: 通过 `.dark` 类和 `dark:` 前缀

### 可能的兼容性问题

1. **Slot 组件**: BaseUI 是否有等效的 polymorphic 组件支持？
2. **Portal**: BaseUI 的 Portal 实现可能不同
3. **数据属性**: Radix 使用 `data-state`, `data-side` 等，BaseUI 可能不同
4. **动画触发**: 基于状态的动画触发机制可能需要调整
5. **无障碍属性**: ARIA 属性的处理可能有差异

### 建议的迁移顺序

1. **阶段 1**: 基础组件 (Button, Input, Label, Skeleton)
2. **阶段 2**: 表单组件 (Form, Select, Checkbox, Radio, Textarea, Switch)
3. **阶段 3**: 布局组件 (Card, Separator, Tabs)
4. **阶段 4**: 弹出组件 (Dialog, Sheet, DropdownMenu, Tooltip)
5. **阶段 5**: 复杂组件 (Table, Sidebar, Accordion, Slider)

## 测试清单

迁移完成后需要测试的功能点：

### 视觉测试

- [ ] 所有组件的默认状态
- [ ] 悬停状态
- [ ] 焦点状态
- [ ] 活动状态
- [ ] 禁用状态
- [ ] 无效状态
- [ ] 暗色模式

### 功能测试

- [ ] 键盘导航
- [ ] 屏幕阅读器支持
- [ ] 表单验证
- [ ] 动画流畅性
- [ ] 响应式布局
- [ ] 触摸设备支持

### 特定组件测试

- [ ] Dialog/Sheet 滚动锁定
- [ ] Select/DropdownMenu 定位
- [ ] Sidebar 展开/折叠
- [ ] Form 错误提示
- [ ] Table 排序和选择
- [ ] Tooltip 延迟显示

## 参考截图位置

项目主要页面截图建议记录：

1. **Dashboard 首页**: `/dashboard`
2. **产品列表**: `/dashboard/products`
3. **产品表单**: `/dashboard/products/new`
4. **订单管理**: `/dashboard/orders`
5. **商店首页**: `/`
6. **产品详情**: `/product/:id`
7. **购物车**: `/cart`
8. **结账页面**: `/checkout`

---

**文档维护**:
- 迁移前: 记录当前状态 ✅
- 迁移中: 记录发现的差异
- 迁移后: 对比验证结果

**最后更新**: 2024-12-14

