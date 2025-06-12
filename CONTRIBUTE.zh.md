# MUI Theme Builder 贡献指南

## Redux Action 使用指南

本项目使用 Redux 管理主题配置和编辑器状态，以下是主要 Action 的使用场景说明。

### 1. 主题配置相关 Actions

#### 1.1 更新主题配置

```typescript
// 单个配置更新
dispatch(setThemeOption('palette.primary.main', '#1976d2'));

// 批量配置更新
dispatch(
  setThemeOptions([
    { path: 'palette.primary.main', value: '#1976d2' },
    { path: 'typography.fontFamily', value: 'Roboto' },
  ]),
);
```

使用场景：

- 修改主题颜色
- 更新字体设置
- 调整组件样式
- 批量更新多个主题属性

注意事项：

- 路径使用点号分隔，如 `palette.primary.main`
- 批量更新时，所有更新会同时生效
- 更新会自动同步到 light/dark 模式的共享字段

#### 1.2 删除主题配置

```typescript
// 删除单个配置
dispatch(removeThemeOption('palette.primary.light'));

// 批量删除配置
dispatch(removeThemeOptions([{ path: 'palette.primary.light' }, { path: 'typography.h1.fontWeight' }]));
```

使用场景：

- 移除自定义样式，恢复默认值
- 清理未使用的主题配置
- 重置特定组件的样式

注意事项：

- 删除 `main` 结尾的路径会恢复默认值
- 删除后会自动清理空对象
- 删除操作不可撤销

#### 1.3 主题模式切换

```typescript
// 切换主题模式
dispatch(setThemeMode('dark'));
```

使用场景：

- 切换明暗主题
- 预览不同模式下的主题效果
- 同步编辑 light/dark 主题

注意事项：

- 切换会自动更新 `themeObject`
- 会同步更新编辑器中的主题代码
- 会重新计算需要加载的字体

### 2. 编辑器相关 Actions

#### 2.1 保存编辑器内容

```typescript
// 保存编辑器代码到主题
dispatch(saveEditorToTheme(editorCode));
```

使用场景：

- 从编辑器更新主题配置
- 应用用户编写的主题代码
- 同步编辑器状态到主题

注意事项：

- 会解析编辑器代码为主题对象
- 解析失败会更新编辑器错误状态
- 成功后会更新主题配置

#### 2.2 更新编辑器状态

```typescript
// 更新编辑器状态
dispatch(
  updateEditorState({
    themeInput: newCode,
    currentVersion: versionId,
    canUndo: true,
    canRedo: false,
  }),
);

// 更新版本状态（用于撤销/重做）
dispatch(updateVersionStates(nextVersionId));
```

使用场景：

- 编辑器内容变化时
- 执行撤销/重做操作
- 更新编辑器错误状态
- 切换主题模式时同步编辑器内容

注意事项：

- 需要维护版本号以支持撤销/重做
- 状态更新会触发编辑器重新渲染
- 错误状态会影响主题更新

### 3. 字体相关 Actions

```typescript
// 加载字体
dispatch(addFonts(['Roboto', 'Open Sans']));
```

使用场景：

- 主题使用新字体时
- 切换主题模式时
- 初始化主题时

注意事项：

- 字体加载是异步操作
- 已加载的字体不会重复加载
- 加载失败不会影响主题更新
