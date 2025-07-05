import Confirm from '@arcblock/ux/lib/Dialog/confirm';
import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import Toast from '@arcblock/ux/lib/Toast';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import RedoIcon from '@mui/icons-material/Redo';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SaveIcon from '@mui/icons-material/Save';
import UndoIcon from '@mui/icons-material/Undo';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
} from '@mui/material';
import { useRef, useState } from 'react';
import { useKeyboardShortcuts } from 'src/hooks/useKeyboardShortcuts';
import useMobile from 'src/hooks/useMobile';
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

// 公共样式
const saveIconSx = { color: 'text.primary' };
const commonButtonGroupProps = {
  variant: 'outlined',
  color: 'inherit',
  size: 'small',
} as const;

export function HeaderActions() {
  const { t } = useLocaleContext?.() || { t: (x: string) => x };
  const theme = useTheme();
  const isMobile = useMobile();
  const saving = useThemeStore((s) => s.saving);
  const resetStore = useThemeStore((s) => s.resetStore);
  const shuffleTheme = useThemeStore((s) => s.shuffleTheme);
  const undo = useThemeStore((s) => s.undo);
  const redo = useThemeStore((s) => s.redo);
  const canUndo = useThemeStore((s) => s.canUndo());
  const canRedo = useThemeStore((s) => s.canRedo());
  const [resetOpen, setResetOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const splitButtonRef = useRef<HTMLDivElement>(null);
  const { saveTheme } = useSave();

  // 检测操作系统 (使用 userAgent 替代已废弃的 platform)
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
  const modKey = isMac ? 'Cmd' : 'Ctrl';

  // 保存主题
  const handleSave = async () => {
    try {
      await saveTheme(useThemeStore.getState());
      Toast.success(t('editor.concept.saveSuccess'));
    } catch (e) {
      Toast.error(t('editor.concept.saveFailed', { message: (e as Error).message }));
    }
  };

  // 重置主题
  const handleReset = () => {
    setResetOpen(true);
    setMenuOpen(false);
  };
  const handleConfirmReset = async () => {
    resetStore();
    setResetOpen(false);
    await handleSave();
  };

  // 随机挑选主题
  const handleShuffle = () => {
    shuffleTheme();
    setMenuOpen(false);
  };

  // 撤销操作
  const handleUndo = () => {
    undo();
    setMenuOpen(false);
  };

  // 重做操作
  const handleRedo = () => {
    redo();
    setMenuOpen(false);
  };

  // 键盘快捷键
  useKeyboardShortcuts({
    onUndo: handleUndo,
    onRedo: handleRedo,
    canUndo,
    canRedo,
  });

  // 公共的 Confirm 对话框
  const renderConfirmDialog = () => (
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
  );

  // 保存按钮组件
  const renderSaveButton = () => (
    <LoadingButton startIcon={<SaveIcon sx={saveIconSx} />} loading={saving} sx={{ ...btnSx }} onClick={handleSave}>
      {t('editor.save')}
    </LoadingButton>
  );

  // 移动端渲染 SplitButton
  if (isMobile) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
        <ButtonGroup {...commonButtonGroupProps} ref={splitButtonRef}>
          {/* 主按钮 - 保存 */}
          {renderSaveButton()}
          {/* 下拉按钮 */}
          <Button size="small" onClick={() => setMenuOpen(true)} sx={{ ...btnSx, minWidth: '32px', px: 0.5 }}>
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>

        {/* 下拉菜单 */}
        <Menu
          anchorEl={splitButtonRef.current}
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}>
          <MenuItem onClick={handleUndo} disabled={!canUndo}>
            <ListItemIcon>
              <UndoIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t('editor.undo')}</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleRedo} disabled={!canRedo}>
            <ListItemIcon>
              <RedoIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t('editor.redo')}</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleShuffle}>
            <ListItemIcon>
              <ShuffleIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText>{t('editor.concept.shuffle')}</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleReset} disabled={saving}>
            <ListItemIcon>
              <RestartAltIcon fontSize="small" sx={{ color: 'warning.main' }} />
            </ListItemIcon>
            <ListItemText>{t('editor.concept.resetTitle')}</ListItemText>
          </MenuItem>
        </Menu>

        {renderConfirmDialog()}
      </Box>
    );
  }

  // 桌面端保持原有的 ButtonGroup 布局
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
      {/* 保存按钮组 */}
      <ButtonGroup {...commonButtonGroupProps} sx={btnGroupSx}>
        {renderSaveButton()}
      </ButtonGroup>

      {/* 撤销/重做按钮组 */}
      <ButtonGroup {...commonButtonGroupProps} sx={btnGroupSx}>
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
      <ButtonGroup {...commonButtonGroupProps} sx={btnGroupSx}>
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

      {renderConfirmDialog()}
    </Box>
  );
}
