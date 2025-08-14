# 主题选项结构

主题构建器将 Material-UI 的 `ThemeOptions` 组织成一种结构化格式，便于为亮色模式、暗色模式和通用设置提供不同的配置。理解这种结构对于有效管理和定制你的主题至关重要。有关主题构建器中主题概念如何管理的更广泛理解，请参阅[主题概念](./core-concepts-theme-concepts.md)部分。

## `themeConfig` 对象

主题构建器中的每个 `Concept`（代表一个可编辑的主题）都包含一个 `themeConfig` 属性。此属性是所有 Material-UI 主题配置的中心枢纽，定义如下：

```typescript
interface Concept {
  // ... other properties
  themeConfig: {
    light: ThemeOptions;
    dark: ThemeOptions;
    common: ThemeOptions;
  };
  // ... other properties
}
```

这种结构确保你可以定义模式特定的样式，同时在亮色和暗色模式之间保持共享配置。

## 配置类别

`themeConfig` 对象分为三个主要类别：

*   **`light: ThemeOptions`**: 此对象包含所有专门用于亮色主题模式的 Material-UI `ThemeOptions`。此处定义的属性仅在主题处于亮色模式时应用。
*   **`dark: ThemeOptions`**: 类似于 `light`，此对象包含专门用于暗色主题模式的 `ThemeOptions`。这些属性在主题处于暗色模式时生效。
*   **`common: ThemeOptions`**: 此对象用于普遍适用的 `ThemeOptions`，无论主题是亮色还是暗色模式。示例包括 `typography`、`spacing` 和 `shape` 设置，这些设置通常在不同模式下保持一致。

## 区分模式特定字段和通用字段

Material-UI `ThemeOptions` 包含 `palette`、`typography`、`components`、`shadows` 等各种属性。主题构建器根据这些选项的性质，智能地将它们路由到 `light`、`dark` 或 `common` 配置。

`MODE_SPECIFIC_FIELDS` 常量标识了应该为亮色和暗色模式分别管理的顶级 `ThemeOptions` 属性。当前，这些字段包括：

*   `palette`
*   `components`
*   `shadows`

任何其他顶级 `ThemeOptions` 属性（例如 `typography`、`spacing`、`shape`、`breakpoints`）都被认为是通用的，并普遍应用于亮色和暗色模式，属于 `common` 配置。

理解这种组织结构使你能够精确控制你的主题在不同模式下的行为方式，并确保在需要时保持一致性。接下来，在[状态管理](./core-concepts-state-management.md)部分中探索主题构建器如何管理其内部状态，包括历史记录和数据持久性。