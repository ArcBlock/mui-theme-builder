# 颜色自定义

本节将引导您使用主题构建器 (Theme Builder) 自定义 Material-UI 主题的调色板。您将学习如何管理主要颜色和中性颜色、应用预定义调色板，以及使用锁定功能来保留特定的颜色设置。有关颜色偏好如何影响整体主题模式的信息，请参阅[主题模式和偏好](./customization-guides-theme-mode-preference.md)部分。

## 主要颜色

Material-UI 主题定义了一组“主要”颜色，例如 `primary`、`secondary`、`success`、`error`、`info` 和 `warning`。这些颜色在组件中保持一致使用，以传达不同的状态和含义。

### 编辑主要颜色

您可以直接编辑任何主要颜色的十六进制值。当您修改 `main` 色调时，`light`、`dark` 和 `contrastText` 色调将自动计算，以确保视觉和谐和可读性。

**步骤：**
1.  点击编辑器中的任意主要颜色块。这将打开 Color Edit Drawer。
2.  使用颜色选择器或十六进制输入字段选择新颜色。
3.  观察自动生成的色调（`light`、`dark`、`contrastText`）实时更新。

**示例：**
要打开抽屉并编辑主色调：
```typescript
import { ColorBlock, colorTypes } from 'packages/react/src/components/Editor/ColorsSection/ColorBlock';
import { ColorEditDrawer }m 'packages/react/src/components/Editor/ColorsSection/ColorEditDrawer';
import React, { useState } from 'react';

function ExampleColorEditor() {
  const [selectedColor, setSelectedColor] = useState<typeof colorTypes[number] | null>(null);

  const handleColorClick = (colorType: typeof colorTypes[number]) => {
    setSelectedColor(colorType);
  };

  const handleCloseDrawer = () => {
    setSelectedColor(null);
  };

  return (
    <div>
      {colorTypes.map((type) => (
        <ColorBlock key={type} colorType={type} onClick={() => handleColorClick(type)} />
      ))}
      <ColorEditDrawer
        open={!!selectedColor}
        colorType={selectedColor}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}
```
在 `ColorEditDrawer` 中，`HexColorPicker` 和 `HexColorField` 允许直接交互：
```typescript
import { HexColorPicker } from 'react-colorful';
import { HexColorField } from 'packages/react/src/components/Editor/ColorsSection/HexColorField';

// Inside ColorEditDrawer component where mainColor is available
// ...
<HexColorPicker color={mainColor.main} style={{ width: '100%' }} onChange={handleMainColorChange} />
<HexColorField
  path={`palette.${colorType}.main`}
  onChange={(v) => handleMainColorChange(v)}
  onReset={(p) => removeThemeOption(p)}
/>
// ...
```
`onChange` 函数 `handleMainColorChange` 计算增强的颜色：
```typescript
// Inside ColorEditDrawer
const handleMainColorChange = (newColor: string) => {
  if (!colorType) return;
  const augmentedColor = themeObject.palette.augmentColor({ color: { main: newColor } } as any);
  setThemeOptions([
    { path: `palette.${colorType}.main`, value: newColor },
    { path: `palette.${colorType}.light`, value: augmentedColor.light },
    { path: `palette.${colorType}.dark`, value: augmentedColor.dark },
    { path: `palette.${colorType}.contrastText`, value: augmentedColor.contrastText },
  ]);
};
```
`ShadeItem` 组件显示计算出的色调：
```typescript
// Inside ColorEditDrawer
function ShadeItem({ colorValue }: { colorValue: string }) {
  return (
    // ... JSX to display colorValue
    <Box sx={{ width: 24, height: 24, borderRadius: 0.5, bgcolor: colorValue }} />
    <Box>{colorValue}</Box>
    // ...
  );
}
```

### 重置主要颜色

每个主要颜色块都提供了一个选项，可将其重置为默认的 Material-UI 值。这将撤销您对该特定颜色所做的任何自定义更改。

**步骤：**
1.  将鼠标悬停在主要颜色块上。
2.  点击出现的“重置”图标（循环箭头）。

**示例：**
`ColorBlock` 组件的 `handleReset` 函数处理此操作：
```typescript
// Inside ColorBlock
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const handleReset = useMemoizedFn((e: React.MouseEvent<HTMLButtonElement>) => {
  e.stopPropagation();
  removeThemeOption(`palette.${colorType}`);
});

// ... In JSX
{mainColor !== defaultColor && (
  <IconButton className="action" title={t('editor.reset')} onClick={handleReset}>
    <RestartAltIcon sx={{ fontSize: 20, color: actionColor }} />
  </IconButton>
)}
```

### 随机选择单个主要颜色

您可以随机选择单个主要颜色，从预定义调色板中随机选择一个新值，而不会影响其他颜色。

**步骤：**
1.  将鼠标悬停在主要颜色块上。
2.  点击出现的“随机选择”图标。

**示例：**
`ColorBlock` 组件的 `handleShuffle` 函数触发特定颜色的随机选择：
```typescript
// Inside ColorBlock
import { IconButtonShuffle } from 'packages/react/src/components/Editor/Common/IconButtonShuffle';

const handleShuffle = useMemoizedFn((e) => {
  e.stopPropagation();
  shuffleColors(colorType); // `colorType` is passed here
});

// ... In JSX
<IconButtonShuffle color={actionColor} onClick={handleShuffle} />
```
存储 (store) 中的 `shuffleColors` 函数（`createStore.ts`）处理此操作：
```typescript
// Inside packages/react/src/state/createStore.ts
shuffleColors: (colorKeys) => { // colorKeys can be string or string[]
  const { saveToHistory } = get();

  set((state) => {
    const currentConcept = state.getCurrentConcept();
    if (!currentConcept) return {};

    const selected = pickRandomTheme(currentConcept.template);
    if (!selected) return {};

    const newConcept = state.applyColors(currentConcept, selected, {
      colorKeys,
      skipCheckLock: isSingle(colorKeys),
    });

    return {
      concepts: state.concepts.map((c) => (c.id === state.currentConceptId ? newConcept : c)),
    };
  });

  // 保存到历史记录
  saveToHistory();
},
```

### 锁定/解锁主要颜色

锁定主要颜色可防止其被随机选择操作（包括单个颜色随机选择和全局主题随机选择）更改。这有助于您在探索其他设计变体时保留特定颜色。

**步骤：**
1.  将鼠标悬停在主要颜色块上。
2.  点击“锁定”或“解锁”图标。闭合的锁表示颜色已锁定。

**示例：**
`ColorBlock` 组件的 `toggleLock` 函数更新锁定状态：
```typescript
// Inside ColorBlock
import { IconButtonLock } from 'packages/react/src/components/Editor/Common/IconButtonLock';

const toggleLock = useMemoizedFn((e: React.MouseEvent<HTMLDivElement>) => {
  e.stopPropagation();
  setColorLock(colorType, !isLocked);
});

// ... In JSX
<IconButtonLock lock={isLocked} color={actionColor} onClick={toggleLock} />
```
存储 (store) 中的 `setColorLock` 函数（`createStore.ts`）持久化此设置：
```typescript
// Inside packages/react/src/state/createStore.ts
setColorLock: (colorKey: string, isLocked: boolean) =>
  set((state) => ({
    concepts: state.concepts.map((c) =>
      c.id === state.currentConceptId
        ? {
            ...c,
            editor: { ...c.editor.colors, [colorKey]: { isLocked } },
          }
        : c,
    ),
  })),
```

## 中性颜色

中性颜色定义了背景、文本和分割线的调色板，这对于内容的可读性和视觉层次结构至关重要。这些包括 `background.default`、`background.paper`、`divider`、`text.hint`、`text.disabled`、`text.secondary` 和 `text.primary`。

### 编辑中性颜色

您可以编辑任何中性颜色的十六进制值。

**步骤：**
1.  点击中性颜色块 (Neutral Color Block) 中的任意中性颜色行。这将打开 Color Edit Drawer。
2.  使用颜色选择器或十六进制输入字段选择新颜色。

**示例：**
`NeutralColorBlock` 组件的 `onClick` 处理函数为特定的中性颜色打开抽屉：
```typescript
import { NeutralColorBlock, neutralColorTypes } from 'packages/react/src/components/Editor/ColorsSection/NeutralColorBlock';
import { ColorEditDrawer } from 'packages/react/src/components/Editor/ColorsSection/ColorEditDrawer';
import React, { useState } from 'react';

function ExampleNeutralColorEditor() {
  const [selectedColor, setSelectedColor] = useState<typeof neutralColorTypes[number] | null>(null);

  const handleColorClick = (key: typeof neutralColorTypes[number]) => {
    setSelectedColor(key);
  };

  const handleCloseDrawer = () => {
    setSelectedColor(null);
  };

  return (
    <div>
      <NeutralColorBlock onClick={handleColorClick} />
      <ColorEditDrawer
        open={!!selectedColor}
        colorType={selectedColor}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}
```
在 `ColorEditDrawer` 中，`handleNeutralColorChange` 函数更新主题：
```typescript
// Inside packages/react/src/components/Editor/ColorsSection/ColorEditDrawer.tsx
const handleNeutralColorChange = (newColor: string) => {
  if (!colorType) return;

  setThemeOptions([{ path: `palette.${colorType}`, value: newColor }]);
};
```
`HexColorField` 也用于中性颜色：
```typescript
// Inside packages/react/src/components/Editor/ColorsSection/ColorEditDrawer.tsx
<HexColorField
  path={`palette.${colorType}`}
  onChange={(v) => handleNeutralColorChange(v)}
  onReset={(p) => removeThemeOption(p)}
/>
```

## 应用预定义调色板

主题构建器 (Theme Builder) 允许您快速将一个完整、随机选择的预定义调色板应用到当前概念 (concept)。这是探索新配色方案的快捷方式。

**步骤：**
1.  点击“颜色”部分右上角的“随机选择”按钮。

**示例：**
`ButtonShuffle` 组件触发 `shuffleColors` 操作：
```typescript
import { ButtonShuffle } from 'packages/react/src/components/Editor/Common/ButtonShuffle';

// ... In ColorsSection component JSX
<ButtonShuffle onClick={handleShuffle} />
// ...
```
`ColorsSection` 中的 `handleShuffle` 函数调用全局 `shuffleColors`：
```typescript
// Inside packages/react/src/components/Editor/ColorsSection/ColorsSection.tsx
const handleShuffle = () => {
  shuffleColors(); // No `colorType` passed, shuffles all eligible colors
};
```
`createStore.ts` 中的 `shuffleColors` 函数随后应用随机预定义主题中的颜色：
```typescript
// Inside packages/react/src/state/createStore.ts
shuffleColors: (colorKeys) => {
  const { saveToHistory } = get();

  set((state) => {
    const currentConcept = state.getCurrentConcept();
    if (!currentConcept) return {};

    const selected = pickRandomTheme(currentConcept.template);
    if (!selected) return {};

    const newConcept = state.applyColors(currentConcept, selected, {
      colorKeys,
      skipCheckLock: isSingle(colorKeys),
    });

    return {
      concepts: state.concepts.map((c) => (c.id === state.currentConceptId ? newConcept : c)),
    };
  });

  // 保存到历史记录
  saveToHistory();
},
```

## 重置所有颜色

如果您希望放弃所有自定义颜色设置并恢复到主题的默认 Material-UI 调色板，您可以使用“重置颜色”选项。

**步骤：**
1.  点击“随机选择”按钮旁边的“设置”图标（齿轮）。
2.  从下拉菜单中选择“重置颜色”。

**示例：**
`ColorsSettingMenu` 组件处理此操作：
```typescript
import { ColorsSettingMenu } from 'packages/react/src/components/Editor/ColorsSection/ColorsSettingMenu';

// ... In ColorsSection component JSX
<ColorsSettingMenu />
// ...
```
`ColorsSettingMenu` 中的 `handleResetColors` 函数调用 `resetColors` 操作：
```typescript
// Inside packages/react/src/components/Editor/ColorsSection/ColorsSettingMenu.tsx
const handleResetColors = useMemoizedFn(() => {
  resetColors();
  handleClose();
});
```
`createStore.ts` 中的 `resetColors` 函数清除 `light` 和 `dark` 模式的主题配置：
```typescript
// Inside packages/react/src/state/createStore.ts
resetColors: () => {
  const { saveToHistory } = get();

  set((state) => {
    const concept = state.getCurrentConcept();
    if (!concept) return {};

    const newConcept = { ...concept };
    newConcept.themeConfig.light = {};
    newConcept.themeConfig.dark = {};
    newConcept.template = DEFAULT_CONCEPT_NAME;

    return { concepts: state.concepts.map((c) => (c.id === state.currentConceptId ? newConcept : c)) };
  });

  // 保存到历史记录
  saveToHistory();
},
```

---

本节详细概述了如何在主题构建器 (Theme Builder) 中自定义颜色，包括单独的颜色调整、随机选择、锁定和重置。您现在拥有了微调主题调色板的工具。接下来，请在[排版自定义](./customization-guides-typography.md)部分探索如何管理字体系列和文本样式。
