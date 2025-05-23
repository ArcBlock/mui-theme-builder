import { Typography } from '@mui/material';
import SettingItem from 'src/components/ThemeSettings/SettingItem';
import { sceneColorTypes } from 'src/constants';

import PaletteSubType from './PaletteSubType';
import ThemeTypeInput from './ThemeTypeInput';

export default function PaletteTools() {
  return (
    <>
      <SettingItem>
        <Typography variant="body2">Type</Typography>
        <ThemeTypeInput />
      </SettingItem>
      <PaletteSubType
        title="Background"
        path="palette.background"
        paletteValues={[
          ['Default', 'default'],
          ['Paper', 'paper'],
        ]}
      />
      <PaletteSubType
        title="Text"
        path="palette.text"
        paletteValues={[
          ['Primary', 'primary'],
          ['Secondary', 'secondary'],
          ['Disabled', 'disabled'],
          ['Hint', 'hint'],
        ]}
      />
      {sceneColorTypes.map((colorType) => (
        <PaletteSubType
          key={colorType}
          title={colorType}
          path={`palette.${colorType}`}
          paletteValues={[
            ['Main', 'main'],
            ['Light', 'light'],
            ['Dark', 'dark'],
            ['Contrast Text', 'contrastText'],
          ]}
        />
      ))}
      <PaletteSubType title="Divider" path="palette" paletteValues={[['Divider', 'divider']]} />
      <PaletteSubType
        title="Action"
        path="palette.action"
        paletteValues={[
          ['Active', 'active'],
          ['Hover', 'hover'],
          // ['HoverOpacity', 'hoverOpacity'],
          ['Selected', 'selected'],
          // ['SelectedOpacity', 'selectedOpacity'],
          ['Disabled', 'disabled'],
          ['DisabledBackground', 'disabledBackground'],
          // ['DisabledOpacity', 'disabledOpacity'],
          ['Focus', 'focus'],
          // ['FocusOpacity', 'focusOpacity'],
          // ['ActivatedOpacity', 'activatedOpacity'],
        ]}
      />
    </>
  );
}
