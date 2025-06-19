import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useState } from 'react';
import { useThemeStore } from 'src/state/themeStore';

interface AddFontDialogProps {
  open: boolean;
  onClose: () => void;
}

function AddFontDialog({ open, onClose }: AddFontDialogProps) {
  const { t } = useLocaleContext();
  const currentConcept = useThemeStore((s) => {
    const { concepts } = s;
    const { currentConceptId } = s;
    return concepts.find((c) => c.id === currentConceptId);
  });
  const mode = useThemeStore((s) => s.mode);
  const updateThemeOptions = useThemeStore((s) => s.updateThemeOptions);

  const [fontName, setFontName] = useState('');
  const [fontUrl, setFontUrl] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!fontName.trim()) {
      setError(t('editor.fontNameRequired'));
      return;
    }

    if (!currentConcept) return;

    const newThemeOptions = { ...currentConcept.themeOptions };
    if (!newThemeOptions[mode]) {
      newThemeOptions[mode] = {};
    }
    if (!newThemeOptions[mode].typography) {
      newThemeOptions[mode].typography = {};
    }

    // 添加字体到 typography.fontFamily
    if (!newThemeOptions[mode].typography.fontFamily) {
      newThemeOptions[mode].typography.fontFamily = [];
    }

    const fontFamilies = Array.isArray(newThemeOptions[mode].typography.fontFamily)
      ? newThemeOptions[mode].typography.fontFamily
      : [];

    // 检查字体是否已存在
    if (fontFamilies.includes(fontName)) {
      setError(t('editor.fontAlreadyExists'));
      return;
    }

    fontFamilies.push(fontName);
    newThemeOptions[mode].typography.fontFamily = fontFamilies;

    updateThemeOptions(newThemeOptions);

    // 重置表单
    setFontName('');
    setFontUrl('');
    setError('');
    onClose();
  };

  const handleCancel = () => {
    setFontName('');
    setFontUrl('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>{t('editor.addFont')}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label={t('editor.fontName')}
            value={fontName}
            onChange={(e) => setFontName(e.target.value)}
            placeholder="Roboto"
            size="small"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label={t('editor.fontUrl')}
            value={fontUrl}
            onChange={(e) => setFontUrl(e.target.value)}
            placeholder="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
            size="small"
            helperText={t('editor.fontUrlHelper')}
          />
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

export default AddFontDialog;
