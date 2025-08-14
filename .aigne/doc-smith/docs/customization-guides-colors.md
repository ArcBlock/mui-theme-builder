# Colors Customization

This section guides you through customizing your Material-UI theme's color palette using the Theme Builder. You will learn how to manage main and neutral colors, apply predefined color palettes, and use locking features to preserve specific color settings. For information on how color preferences affect the overall theme mode, refer to the [Theme Mode and Preference](./customization-guides-theme-mode-preference.md) section.

## Main Colors

Material-UI themes define a set of "main" colors such as `primary`, `secondary`, `success`, `error`, `info`, and `warning`. These colors are used consistently across components to convey different states and meanings.

### Editing a Main Color

You can directly edit the hex value of any main color. When you modify the `main` shade, the `light`, `dark`, and `contrastText` shades are automatically calculated to ensure visual harmony and readability.

**Steps:**
1.  Click on any main color block in the editor. This will open the Color Edit Drawer.
2.  Use the color picker or the hex input field to select a new color.
3.  Observe the automatically generated shades (`light`, `dark`, `contrastText`) updating in real-time.

**Example:**
To open the drawer and edit the primary color:
```typescript
import { ColorBlock, colorTypes } from 'packages/react/src/components/Editor/ColorsSection/ColorBlock';
import { ColorEditDrawer } from 'packages/react/src/components/Editor/ColorsSection/ColorEditDrawer';
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
In the `ColorEditDrawer`, the `HexColorPicker` and `HexColorField` allow direct interaction:
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
The `onChange` function `handleMainColorChange` calculates the augmented colors:
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
The `ShadeItem` component displays the calculated shades:
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

### Resetting a Main Color

Each main color block provides an option to reset it to its default Material-UI value. This reverts any custom changes you've made to that specific color.

**Steps:**
1.  Hover over a main color block.
2.  Click the "Reset" icon (circular arrow) that appears.

**Example:**
The `ColorBlock` component's `handleReset` function handles this action:
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

### Shuffling a Single Main Color

You can shuffle an individual main color to randomly select a new value from a predefined palette, without affecting other colors.

**Steps:**
1.  Hover over a main color block.
2.  Click the "Shuffle" icon that appears.

**Example:**
The `ColorBlock` component's `handleShuffle` function triggers the shuffle for a specific color:
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
The `shuffleColors` function in the store (`createStore.ts`) handles this:
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

### Locking/Unlocking a Main Color

Locking a main color prevents it from being changed by shuffle operations (both individual color shuffle and global theme shuffle). This helps you preserve specific colors while exploring other design variations.

**Steps:**
1.  Hover over a main color block.
2.  Click the "Lock" or "Unlock" icon. A closed lock indicates the color is locked.

**Example:**
The `ColorBlock` component's `toggleLock` function updates the lock status:
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
The `setColorLock` function in the store (`createStore.ts`) persists this setting:
```typescript
// Inside packages/react/src/state/createStore.ts
setColorLock: (colorKey: string, isLocked: boolean) =>
  set((state) => ({
    concepts: state.concepts.map((c) =>
      c.id === state.currentConceptId
        ? {
            ...c,
            editor: { ...c.editor, colors: { ...c.editor.colors, [colorKey]: { isLocked } } },
          }
        : c,
    ),
  })),
```

## Neutral Colors

Neutral colors define the palette for backgrounds, text, and dividers, which are crucial for content readability and visual hierarchy. These include `background.default`, `background.paper`, `divider`, `text.hint`, `text.disabled`, `text.secondary`, and `text.primary`.

### Editing a Neutral Color

You can edit the hex value of any neutral color.

**Steps:**
1.  Click on any neutral color row within the Neutral Color Block. This will open the Color Edit Drawer.
2.  Use the color picker or the hex input field to select a new color.

**Example:**
The `NeutralColorBlock` component's `onClick` handler opens the drawer for a specific neutral color:
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
Inside the `ColorEditDrawer`, the `handleNeutralColorChange` function updates the theme:
```typescript
// Inside packages/react/src/components/Editor/ColorsSection/ColorEditDrawer.tsx
const handleNeutralColorChange = (newColor: string) => {
  if (!colorType) return;

  setThemeOptions([{ path: `palette.${colorType}`, value: newColor }]);
};
```
The `HexColorField` is also used for neutral colors:
```typescript
// Inside packages/react/src/components/Editor/ColorsSection/ColorEditDrawer.tsx
<HexColorField
  path={`palette.${colorType}`}
  onChange={(v) => handleNeutralColorChange(v)}
  onReset={(p) => removeThemeOption(p)}
/>
```

## Applying Predefined Color Palettes

The Theme Builder allows you to quickly apply a complete, randomly selected predefined color palette to your current concept. This is a quick way to explore new color schemes.

**Steps:**
1.  Click the "Shuffle" button located in the top-right corner of the Colors section.

**Example:**
The `ButtonShuffle` component triggers the `shuffleColors` action:
```typescript
import { ButtonShuffle } from 'packages/react/src/components/Editor/Common/ButtonShuffle';

// ... In ColorsSection component JSX
<ButtonShuffle onClick={handleShuffle} />
// ...
```
The `handleShuffle` function in `ColorsSection` calls the global `shuffleColors`:
```typescript
// Inside packages/react/src/components/Editor/ColorsSection/ColorsSection.tsx
const handleShuffle = () => {
  shuffleColors(); // No `colorType` passed, shuffles all eligible colors
};
```
The `shuffleColors` function in `createStore.ts` then applies the colors from a random predefined theme:
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

## Resetting All Colors

If you wish to discard all custom color settings and revert to the default Material-UI color palette for your theme, you can use the "Reset Colors" option.

**Steps:**
1.  Click the "Settings" icon (gear) next to the "Shuffle" button.
2.  Select "Reset Colors" from the dropdown menu.

**Example:**
The `ColorsSettingMenu` component handles this:
```typescript
import { ColorsSettingMenu } from 'packages/react/src/components/Editor/ColorsSection/ColorsSettingMenu';

// ... In ColorsSection component JSX
<ColorsSettingMenu />
// ...
```
The `handleResetColors` function in `ColorsSettingMenu` calls the `resetColors` action:
```typescript
// Inside packages/react/src/components/Editor/ColorsSection/ColorsSettingMenu.tsx
const handleResetColors = useMemoizedFn(() => {
  resetColors();
  handleClose();
});
```
The `resetColors` function in `createStore.ts` clears the theme configuration for `light` and `dark` modes:
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

This section provided a detailed overview of how to customize colors within the Theme Builder, covering individual color adjustments, shuffling, locking, and resetting. You now have the tools to fine-tune your theme's color palette. Next, explore how to manage font families and text styles in the [Typography Customization](./customization-guides-typography.md) section.
