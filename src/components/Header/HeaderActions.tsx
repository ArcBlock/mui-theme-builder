import Confirm from '@arcblock/ux/lib/Dialog/confirm';
import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import Toast from '@arcblock/ux/lib/Toast';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Tooltip } from '@mui/material';
import { useState } from 'react';
import useSave from 'src/hooks/useSave';
import { useThemeStore } from 'src/state/themeStore';

import { ShuffleIcon } from '../Editor/Common/ButtonShuffle';

const btnSx = {
  height: '32px',
  minWidth: 0,
  borderColor: 'divider',
  fontSize: 14,
};

export function HeaderActions() {
  const { t } = useLocaleContext?.() || { t: (x: string) => x };
  const saving = useThemeStore((s) => s.saving);
  const resetStore = useThemeStore((s) => s.resetStore);
  const shuffleTheme = useThemeStore((s) => s.shuffleTheme);
  const [resetOpen, setResetOpen] = useState(false);
  const { saveTheme } = useSave();

  // 保存主题
  const handleSave = async () => {
    try {
      await saveTheme(useThemeStore.getState()); // 使用 getState 保证每次都获取最新数据
      Toast.success(t('editor.concept.saveSuccess'));
    } catch (e) {
      Toast.error(t('editor.concept.saveFailed', { message: (e as Error).message }));
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

  // 随机挑选主题
  const handleShuffle = () => {
    shuffleTheme();
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
      {/* 保存 */}
      <LoadingButton
        variant="outlined"
        color="inherit"
        size="small"
        startIcon={<SaveIcon sx={{ color: 'text.primary' }} />}
        loading={saving}
        sx={{ ...btnSx }}
        onClick={handleSave}>
        {t('editor.save')}
      </LoadingButton>
      {/* 整体 Shuffle 颜色 */}
      <Tooltip title={t('editor.concept.shuffle')}>
        <LoadingButton variant="outlined" color="inherit" size="small" sx={{ ...btnSx }} onClick={handleShuffle}>
          <ShuffleIcon />
        </LoadingButton>
      </Tooltip>
      {/* 重置 */}
      <Tooltip title={t('editor.concept.resetTitle')}>
        <LoadingButton
          variant="outlined"
          color="inherit"
          size="small"
          disabled={saving}
          onClick={handleReset}
          sx={{
            ...btnSx,
            '&:hover': {
              backgroundColor: 'warning.lighter',
              '& .MuiSvgIcon-root': {
                color: 'warning.main',
              },
            },
          }}>
          <RestartAltIcon sx={{ color: 'warning.light', fontSize: 20 }} />
        </LoadingButton>
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
