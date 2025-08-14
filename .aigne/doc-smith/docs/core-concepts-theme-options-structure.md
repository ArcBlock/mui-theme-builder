# Theme Options Structure

The Theme Builder organizes Material-UI's `ThemeOptions` into a structured format that facilitates distinct configurations for light mode, dark mode, and common settings. Understanding this structure is crucial for managing and customizing your themes effectively. For a broader understanding of how theme concepts are managed within the Theme Builder, refer to the [Theme Concepts](./core-concepts-theme-concepts.md) section.

## The `themeConfig` Object

Each `Concept` in the Theme Builder, which represents a single editable theme, contains a `themeConfig` property. This property is the central hub for all Material-UI theme configurations and is defined as follows:

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

This structure ensures that you can define mode-specific styles while maintaining shared configurations across both light and dark modes.

## Configuration Categories

The `themeConfig` object is divided into three primary categories:

*   **`light: ThemeOptions`**: This object holds all Material-UI `ThemeOptions` that are specific to the light theme mode. Properties defined here will only apply when the theme is in light mode.
*   **`dark: ThemeOptions`**: Similar to `light`, this object contains `ThemeOptions` that are specific to the dark theme mode. These properties take effect when the theme is in dark mode.
*   **`common: ThemeOptions`**: This object is for `ThemeOptions` that apply universally, regardless of whether the theme is in light or dark mode. Examples include `typography`, `spacing`, and `shape` settings, which typically remain consistent across modes.

## Distinguishing Mode-Specific and Common Fields

Material-UI `ThemeOptions` include various properties such as `palette`, `typography`, `components`, `shadows`, etc. The Theme Builder intelligently routes these options to either the `light`, `dark`, or `common` configuration based on their nature.

The `MODE_SPECIFIC_FIELDS` constant identifies the top-level `ThemeOptions` properties that should be managed separately for light and dark modes. Currently, these fields include:

*   `palette`
*   `components`
*   `shadows`

Any other top-level `ThemeOptions` property (e.g., `typography`, `spacing`, `shape`, `breakpoints`) is considered common and applied universally across both light and dark modes, falling under the `common` configuration.

Understanding this organization allows you to precisely control how your theme behaves across different modes and ensures consistency where needed. Next, explore how the Theme Builder manages its internal state, including history and data persistence, in the [State Management](./core-concepts-state-management.md) section.