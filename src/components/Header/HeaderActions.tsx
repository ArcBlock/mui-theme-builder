import Confirm from '@arcblock/ux/lib/Dialog/confirm';
import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import Toast from '@arcblock/ux/lib/Toast';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SaveIcon from '@mui/icons-material/Save';
import { Box, IconButton, Tooltip } from '@mui/material';
import { useState } from 'react';
import useSave from 'src/hooks/useSave';
import { useThemeStore } from 'src/state/themeStore';

export function HeaderActions() {
  const { t } = useLocaleContext?.() || { t: (x: string) => x };
  const resetStore = useThemeStore((s) => s.resetStore);
  const [saving, setSaving] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const { saveTheme } = useSave();

  // 保存主题
  const handleSave = async () => {
    setSaving(true);
    try {
      await saveTheme(useThemeStore.getState()); // 使用 getState 保证每次都获取最新数据
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
  const handleConfirmReset = async () => {
    resetStore();
    setResetOpen(false);
    await handleSave();
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
