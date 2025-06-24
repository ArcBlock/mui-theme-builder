import Confirm from '@arcblock/ux/lib/Dialog/confirm';
import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import Toast from '@arcblock/ux/lib/Toast';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SaveIcon from '@mui/icons-material/Save';
import { Box, IconButton, Tooltip } from '@mui/material';
import { useState } from 'react';
import { useThemeStore } from 'src/state/themeStore';

export function HeaderActions() {
  const { t } = useLocaleContext?.() || { t: (x: string) => x };
  const [saving, setSaving] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const concepts = useThemeStore((s) => s.concepts);
  const currentConceptId = useThemeStore((s) => s.currentConceptId);
  const resetStore = useThemeStore((s) => s.resetStore);

  // 保存主题
  const handleSave = async () => {
    setSaving(true);
    try {
      // localStorage.setItem('blocklet-theme-builder-concepts', JSON.stringify({ concepts, currentConceptId }));
      Toast.success(t('editor.concept.saveSuccess'));
    } catch (e) {
      Toast.error(t('editor.concept.saveFailed', { message: (e as Error).message }));
    } finally {
      setSaving(false);
    }
  };

  // 重置主题
  const handleReset = () => {
    setResetOpen(true);
  };
  const handleConfirmReset = () => {
    resetStore();
    setResetOpen(false);
    Toast.success(t('editor.concept.resetSuccess'));
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
      <Tooltip title={t('editor.save')}>
        <span>
          <IconButton onClick={handleSave} disabled={saving} size="small">
            <SaveIcon sx={{ color: 'text.primary' }} />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title={t('editor.concept.resetTitle')}>
        <span>
          <IconButton
            onClick={handleReset}
            size="small"
            sx={{
              '&:hover': {
                backgroundColor: 'warning.lighter',
                '& .MuiSvgIcon-root': {
                  color: 'warning.main',
                },
              },
            }}>
            <RestartAltIcon sx={{ color: 'warning.light' }} />
          </IconButton>
        </span>
      </Tooltip>
      <Confirm
        open={resetOpen}
        title={t('editor.concept.resetTitle')}
        cancelButton={{
          text: t('editor.cancel'),
        }}
        confirmButton={{
          props: { variant: 'contained', color: 'warning' },
          text: t('editor.reset'),
        }}
        onConfirm={handleConfirmReset}
        onCancel={() => setResetOpen(false)}>
        {t('editor.concept.resetConfirm')}
      </Confirm>
    </Box>
  );
}
