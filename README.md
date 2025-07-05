<p align="center">
  <a href="#">
    <img alt="Material-Ui Theme Creator" src="/src/images/mui_theme_creator_logo.webp?raw=true" width="120" />
  </a>
</p>
<h1 align="center">
  Material-UI Theme Creator
  
</h1>
<h3 align="center">Supported MUI Version: ^5.0.0</h3>

Material-UI Theme Creator provides an interface to help create a [Material-UI](https://material-ui.com/) `ThemeOptions` object, which styles components in the library.

[Use the app here](https://zenoo.github.io/mui-theme-creator/)

## Features

The app has a few developer-friendly features:

- Site templates to preview the theme on
- A code editor with code completion and suggestions based off `ThemeOptions` type data
- Dynamic loading of Google Fonts
- Detailed snippets that take advantage of the `ThemeOptions.props` and `ThemeOptions.overrides` options
- **Theme Editing**: Create and customize Material-UI themes with visual editors
- **Color Management**: Comprehensive color palette editing with lock/unlock functionality
- **Typography Settings**: Font family and typography configuration
- **Multiple Themes**: Support for multiple theme concepts
- **Preview**: Real-time preview of theme changes
- **Undo/Redo**: Full support for undo and redo operations during theme editing
- **Keyboard Shortcuts**: 
  - `Ctrl+Z` or `Cmd+Z` - Undo
  - `Ctrl+Y` or `Cmd+Y` or `Ctrl+Shift+Z` or `Cmd+Shift+Z` - Redo

## Legacy

This tool can be used with MUI Version ^5.0.0. only, as v5 included changes to the `ThemeOptions` object.

To use this tool with MUI v4: [MUI Theme Creator v4](https://bareynol.github.io/mui-theme-creator/)
Instructions for migrating from v4 to v5: [MUI Migration to v5](https://mui.com/material-ui/guides/migration-v4/)

## Motivations

The purpose of this project is to help expose the power of the Material-UI Theme styling solution, specifically relating to setting default `props` for components and default styles through `overrides`.

By customizing default props and styles of components at the theme level, developers can easily tweak the look and feel of the app, and cut out the need for specifying common styling patterns within component code.

Future work on this project should be done with the goal of adding example previews that help accomplish this, useful snippets that take advantage of the Material-UI theme capabilities, and providing the user with better knowledge of the theme utilities in general.

_Have feature ideas, useful snippets, or bugs? Fantastic! Any help is appreciated, open an issue or submit a pull request!_

## 🚀 Quick start

```shell
pnpm install
pnpm start # or use pnpm develop
```

## Acknowledgements

This project is forked from [MUI Theme Creator v5](https://github.com/Zenoo/mui-theme-creator).

## Undo/Redo Functionality

The theme builder now includes comprehensive undo/redo functionality:

- **Automatic History**: All theme editing operations are automatically saved to history
- **UI Controls**: Undo/Redo buttons are available in the header toolbar
- **Keyboard Shortcuts**: Standard keyboard shortcuts for undo/redo operations
- **History Management**: Up to 50 history states are maintained per theme concept
- **Concept Isolation**: Each theme concept maintains its own history stack

### Operations that create history entries:
- Color modifications
- Typography changes
- Theme style adjustments
- Theme mode switching
- Bulk operations (reset, shuffle, etc.)

### Notes:
- History is not persisted between page refreshes
- Switching between theme concepts will reset the history for the new concept
- History is automatically managed - no manual intervention required

## Getting Started

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Open in browser: `http://localhost:3000`

## Usage

1. **Edit Colors**: Click on color blocks to modify palette colors
2. **Edit Typography**: Select font families and adjust typography settings
3. **Edit Styles**: Modify border radius and other style properties
4. **Undo/Redo**: Use toolbar buttons or keyboard shortcuts to undo/redo changes
5. **Save**: Save your theme configuration
6. **Preview**: See real-time preview of your changes

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## License

MIT License
