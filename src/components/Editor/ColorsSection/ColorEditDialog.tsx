import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import { useState } from 'react';
import { useThemeStore } from 'src/state/themeStore';

interface ColorEditDialogProps {
  open: boolean;
  colorType: 'neutral' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
}

function ColorEditDialog({ open, colorType, onClose }: ColorEditDialogProps) {
  const { t } = useLocaleContext();
  const currentConcept = useThemeStore((s) => {
    const { concepts } = s;
    const { currentConceptId } = s;
    return concepts.find((c) => c.id === currentConceptId);
  });
  const mode = useThemeStore((s) => s.mode);
  const setThemeOptions = useThemeStore((s) => s.setThemeOptions);

  // 获取当前颜色值
  const getCurrentColor = () => {
    if (!currentConcept) return '#000000';

    const themeOptions = currentConcept.themeOptions[mode];
    if (!themeOptions?.palette) return '#000000';

    switch (colorType) {
      case 'neutral':
        return themeOptions.palette.background?.default || '#ffffff';
      case 'primary':
        return themeOptions.palette.primary?.main || '#1976d2';
      case 'secondary':
        return themeOptions.palette.secondary?.main || '#dc004e';
      case 'success':
        return themeOptions.palette.success?.main || '#2e7d32';
      case 'error':
        return themeOptions.palette.error?.main || '#d32f2f';
      case 'info':
        return themeOptions.palette.info?.main || '#0288d1';
      case 'warning':
        return themeOptions.palette.warning?.main || '#ed6c02';
      default:
        return '#000000';
    }
  };

  const [colorValue, setColorValue] = useState(getCurrentColor());

  const handleSave = () => {
    if (!currentConcept) return;

    const newThemeOptions = { ...currentConcept.themeOptions };
    if (!newThemeOptions[mode]) {
      newThemeOptions[mode] = {};
    }
    if (!newThemeOptions[mode].palette) {
      newThemeOptions[mode].palette = {};
    }

    // 更新对应的颜色
    // eslint-disable-next-line default-case
    switch (colorType) {
      case 'neutral':
        if (!newThemeOptions[mode].palette.background) {
          newThemeOptions[mode].palette.background = {};
        }
        newThemeOptions[mode].palette.background.default = colorValue;
        break;
      case 'primary':
        if (!newThemeOptions[mode].palette.primary) {
          newThemeOptions[mode].palette.primary = {};
        }
        newThemeOptions[mode].palette.primary.main = colorValue;
        break;
      case 'secondary':
        if (!newThemeOptions[mode].palette.secondary) {
          newThemeOptions[mode].palette.secondary = {};
        }
        newThemeOptions[mode].palette.secondary.main = colorValue;
        break;
      case 'success':
        if (!newThemeOptions[mode].palette.success) {
          newThemeOptions[mode].palette.success = {};
        }
        newThemeOptions[mode].palette.success.main = colorValue;
        break;
      case 'error':
        if (!newThemeOptions[mode].palette.error) {
          newThemeOptions[mode].palette.error = {};
        }
        newThemeOptions[mode].palette.error.main = colorValue;
        break;
      case 'info':
        if (!newThemeOptions[mode].palette.info) {
          newThemeOptions[mode].palette.info = {};
        }
        newThemeOptions[mode].palette.info.main = colorValue;
        break;
      case 'warning':
        if (!newThemeOptions[mode].palette.warning) {
          newThemeOptions[mode].palette.warning = {};
        }
        newThemeOptions[mode].palette.warning.main = colorValue;
        break;
    }

    setThemeOptions(newThemeOptions);
    onClose();
  };

  const handleCancel = () => {
    setColorValue(getCurrentColor());
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>
        {t('editor.editColor')} - {t(`editor.${colorType}`)}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  backgroundColor: colorValue,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              />
            </Grid>
            <Grid item xs>
              <TextField
                fullWidth
                label={t('editor.colorValue')}
                value={colorValue}
                onChange={(e) => setColorValue(e.target.value)}
                placeholder="#000000"
                size="small"
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>{t('concept.cancel')}</Button>
        <Button onClick={handleSave} variant="contained">
          {t('concept.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ColorEditDialog;
