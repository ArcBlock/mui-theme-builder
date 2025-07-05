import Confirm from '@arcblock/ux/lib/Dialog/confirm';
import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import Toast from '@arcblock/ux/lib/Toast';
import RedoIcon from '@mui/icons-material/Redo';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SaveIcon from '@mui/icons-material/Save';
import UndoIcon from '@mui/icons-material/Undo';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, ButtonGroup, Tooltip } from '@mui/material';
import { useState } from 'react';
import { useKeyboardShortcuts } from 'src/hooks/useKeyboardShortcuts';
import useSave from 'src/hooks/useSave';
import { useThemeStore } from 'src/state/themeStore';

import { ShuffleIcon } from '../Editor/Common/ButtonShuffle';

const btnSx = {
  height: '32px',
  minWidth: 0,
  borderColor: 'divider',
  fontSize: 14,
};

const btnGroupSx = {
  '& .MuiButton-root': {
    ...btnSx,
  },
};

export function HeaderActions() {
  const { t } = useLocaleContext?.() || { t: (x: string) => x };
  const saving = useThemeStore((s) => s.saving);
  const resetStore = useThemeStore((s) => s.resetStore);
  const shuffleTheme = useThemeStore((s) => s.shuffleTheme);
  const undo = useThemeStore((s) => s.undo);
  const redo = useThemeStore((s) => s.redo);
  const canUndo = useThemeStore((s) => s.canUndo());
  const canRedo = useThemeStore((s) => s.canRedo());
  const [resetOpen, setResetOpen] = useState(false);
  const { saveTheme } = useSave();

  // 检测操作系统 (使用 userAgent 替代已废弃的 platform)
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
  const modKey = isMac ? 'Cmd' : 'Ctrl';

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

  // 撤销操作
  const handleUndo = () => {
    undo();
  };

  // 重做操作
  const handleRedo = () => {
    redo();
  };

  // 键盘快捷键
  useKeyboardShortcuts({
    onUndo: handleUndo,
    onRedo: handleRedo,
    canUndo,
    canRedo,
  });

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
      {/* 保存按钮组 */}
      <ButtonGroup variant="outlined" color="inherit" size="small" sx={btnGroupSx}>
        <LoadingButton startIcon={<SaveIcon sx={{ color: 'text.primary' }} />} loading={saving} onClick={handleSave}>
          {t('editor.save')}
        </LoadingButton>
      </ButtonGroup>

      {/* 撤销/重做按钮组 */}
      <ButtonGroup variant="outlined" color="inherit" size="small" sx={btnGroupSx}>
        <Tooltip title={`${t('editor.undo')} (${modKey}+Z)`}>
          <LoadingButton disabled={!canUndo} onClick={handleUndo}>
            <UndoIcon sx={{ fontSize: 18 }} />
          </LoadingButton>
        </Tooltip>
        <Tooltip title={`${t('editor.redo')} (${modKey}+Shift+Z)`}>
          <LoadingButton disabled={!canRedo} onClick={handleRedo}>
            <RedoIcon sx={{ fontSize: 18 }} />
          </LoadingButton>
        </Tooltip>
      </ButtonGroup>

      {/* 主题操作按钮组 */}
      <ButtonGroup variant="outlined" color="inherit" size="small" sx={btnGroupSx}>
        <Tooltip title={t('editor.concept.shuffle')}>
          <LoadingButton onClick={handleShuffle}>
            <ShuffleIcon />
          </LoadingButton>
        </Tooltip>
        <Tooltip title={t('editor.concept.resetTitle')}>
          <LoadingButton
            disabled={saving}
            onClick={handleReset}
            sx={{
              '&:hover': {
                '& .MuiSvgIcon-root': {
                  color: 'warning.main',
                },
              },
            }}>
            <RestartAltIcon sx={{ fontSize: 20 }} />
          </LoadingButton>
        </Tooltip>
      </ButtonGroup>

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
