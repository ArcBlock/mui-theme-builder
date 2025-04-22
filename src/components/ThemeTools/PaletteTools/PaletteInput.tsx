import { Button, Grid } from '@mui/material';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ColorInput from 'src/components/ColorInput';
import { sceneColorTypes } from 'src/constants';
import { removeThemeOption, setThemeOptions } from 'src/state/actions';
import { useThemeValueInfo } from 'src/state/selectors';
import { RootState } from 'src/state/types';

const mainSceneColorPaths = sceneColorTypes.map((v) => `palette.${v}.main`);

interface Props {
  label: string;
  path: string;
}

export default function PaletteInput({ label, path }: Props) {
  const themeValueInfo = useThemeValueInfo(path);
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.themeObject);

  const handleColorChange = useCallback(
    (color: string) => {
      if (mainSceneColorPaths.includes(path)) {
        // 如果是主色值，需要联动计算其他值
        const colorType = path.split('.')[1]; // 获取颜色类型，如 primary, secondary 等
        const augmentedColor = theme.palette.augmentColor({ color: { main: color } } as any);

        dispatch(
          setThemeOptions([
            { path: `palette.${colorType}.main`, value: color },
            { path: `palette.${colorType}.light`, value: augmentedColor.light },
            { path: `palette.${colorType}.dark`, value: augmentedColor.dark },
            { path: `palette.${colorType}.contrastText`, value: augmentedColor.contrastText },
          ]),
        );
      } else {
        // 非主色值，直接设置
        dispatch(setThemeOptions([{ path, value: color }]));
      }
    },
    [dispatch, path, theme.palette],
  );

  const handleReset = useCallback(() => {
    if (mainSceneColorPaths.includes(path)) {
      // 如果是主色值，需要联动重置其他值
      const colorType = path.split('.')[1];
      // 依次移除所有相关的颜色值
      dispatch(removeThemeOption(`palette.${colorType}.main`));
      dispatch(removeThemeOption(`palette.${colorType}.light`));
      dispatch(removeThemeOption(`palette.${colorType}.dark`));
      dispatch(removeThemeOption(`palette.${colorType}.contrastText`));
    } else {
      dispatch(removeThemeOption(path));
    }
  }, [dispatch, path]);

  return (
    <Grid container justifyContent="space-between" alignItems="flex-end">
      <Grid item>
        <ColorInput label={label} color={themeValueInfo.value} onColorChange={handleColorChange} />
      </Grid>
      <Grid item>
        <Button
          size="small"
          disabled={!themeValueInfo.modifiedByUser}
          sx={{
            textTransform: 'capitalize',
            '&.Mui-disabled': {
              fontStyle: 'italic',
            },
          }}
          onClick={handleReset}>
          {themeValueInfo.modifiedByUser ? 'Reset' : 'auto'}
        </Button>
      </Grid>
    </Grid>
  );
}
