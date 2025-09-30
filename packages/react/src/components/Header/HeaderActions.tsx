import Confirm from '@arcblock/ux/lib/Dialog/confirm';
import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import Toast from '@arcblock/ux/lib/Toast';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import RedoIcon from '@mui/icons-material/Redo';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SaveIcon from '@mui/icons-material/Save';
import UndoIcon from '@mui/icons-material/Undo';
import { Box, Button, ButtonGroup, Divider, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip } from '@mui/material';
import { useMemoizedFn } from 'ahooks';
import { useRef, useState } from 'react';
import { useThemeBuilder } from 'src/context/themeBuilder';
import { useKeyboardShortcuts } from 'src/hooks/useKeyboardShortcuts';
import useMobile from 'src/hooks/useMobile';
import { ThemeSetting } from 'src/types/theme';

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
const commonButtonGroupProps = {
  variant: 'outlined',
  color: 'inherit',
  size: 'small',
} as const;

export function ThemeLockIcon({ locked }: { locked: boolean }) {
  return locked ? <LockIcon style={{ fontSize: 18 }} /> : <LockOpenIcon style={{ fontSize: 18 }} />;
}

export interface HeaderActionsProps {
  onSave?: (setting: Partial<ThemeSetting>) => Promise<void>;
  onLockChange?: (nextLock: boolean) => Promise<void>;
}
export function HeaderActions({ onSave = undefined, onLockChange = undefined }: HeaderActionsProps) {
  const { t } = useLocaleContext?.() || { t: (x: string) => x };
  const isMobile = useMobile();
  const isThemeLocked = useThemeBuilder((s) => s.isThemeLocked());
  const setThemeLocked = useThemeBuilder((s) => s.setThemeLocked);
  const setSaving = useThemeBuilder((s) => s.setSaving);
  const saving = useThemeBuilder((s) => s.saving);
  const getThemeSetting = useThemeBuilder((s) => s.getThemeSetting);
  const resetStore = useThemeBuilder((s) => s.resetStore);
  const shuffleTheme = useThemeBuilder((s) => s.shuffleTheme);
  const undo = useThemeBuilder((s) => s.undo);
  const redo = useThemeBuilder((s) => s.redo);
  const canUndo = useThemeBuilder((s) => !s.isThemeLocked() && s.canUndo());
  const canRedo = useThemeBuilder((s) => !s.isThemeLocked() && s.canRedo());
  const [resetOpen, setResetOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const splitButtonRef = useRef<HTMLDivElement>(null);

  // 检测操作系统 (使用 userAgent 替代已废弃的 platform)
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
  const modKey = isMac ? 'Cmd' : 'Ctrl';

  // 保存主题
  const handleSave = useMemoizedFn(async () => {
    try {
      setSaving(true);
      await onSave?.(getThemeSetting());
      Toast.success(t('editor.concept.saveSuccess'));
    } catch (e) {
      Toast.error(t('editor.concept.saveFailed', { message: (e as Error).message }));
    } finally {
      setSaving(false);
    }
  });

  // 重置主题
  const handleReset = useMemoizedFn(() => {
    setResetOpen(true);
    setMenuOpen(false);
  });
  const handleConfirmReset = useMemoizedFn(async () => {
    resetStore();
    setResetOpen(false);
    await handleSave();
  });

  // 随机挑选主题
  const handleShuffle = useMemoizedFn(() => {
    shuffleTheme();
    setMenuOpen(false);
  });

  // 撤销操作
  const handleUndo = useMemoizedFn(() => {
    undo();
    setMenuOpen(false);
  });

  // 重做操作
  const handleRedo = useMemoizedFn(() => {
    redo();
    setMenuOpen(false);
  });

  // 锁定/解锁
  const handleLockChange = useMemoizedFn(async () => {
    const nextLock = !isThemeLocked;
    try {
      setSaving(true);
      await onLockChange?.(nextLock);
      setThemeLocked(nextLock);
      Toast.success(t(nextLock ? 'editor.concept.lockSuccess' : 'editor.concept.unlockSuccess'));
    } catch (e) {
      Toast.error(t(nextLock ? 'editor.concept.lock' : 'editor.concept.unlock', { message: (e as Error).message }));
    } finally {
      setSaving(false);
      setMenuOpen(false);
    }
  });

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

  // 保存按钮
  const renderSaveButton = () => (
    <Button disabled={isThemeLocked} startIcon={<SaveIcon />} loading={saving} sx={{ ...btnSx }} onClick={handleSave}>
      {t('editor.save')}
    </Button>
  );

  // 锁定/解锁按钮
  const renderLockButton = () => (
    <Tooltip title={`${t(isThemeLocked ? 'editor.concept.unlock' : 'editor.concept.lock')}`}>
      <Button disabled={saving} onClick={handleLockChange}>
        <ThemeLockIcon locked={isThemeLocked} />
      </Button>
    </Tooltip>
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
          <MenuItem onClick={handleShuffle} disabled={isThemeLocked || saving}>
            <ListItemIcon>
              <ShuffleIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText>{t('editor.concept.shuffle')}</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleReset} disabled={isThemeLocked || saving}>
            <ListItemIcon>
              <RestartAltIcon fontSize="small" sx={{ color: 'warning.main' }} />
            </ListItemIcon>
            <ListItemText>{t('editor.concept.resetTitle')}</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLockChange} disabled={saving}>
            <ListItemIcon>
              <ThemeLockIcon locked={isThemeLocked} />
            </ListItemIcon>
            <ListItemText>{t(isThemeLocked ? 'editor.unlock' : 'editor.lock')}</ListItemText>
          </MenuItem>
        </Menu>
        {renderConfirmDialog()}
      </Box>
    );
  }

  // 桌面端保持原有的 ButtonGroup 布局
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
      {/* 保存 */}
      <ButtonGroup {...commonButtonGroupProps} sx={btnGroupSx}>
        {renderSaveButton()}
      </ButtonGroup>

      {/* 撤销/重做按钮组 */}
      <ButtonGroup {...commonButtonGroupProps} sx={btnGroupSx}>
        <Tooltip title={`${t('editor.undo')} (${modKey}+Z)`}>
          <Button disabled={!canUndo} onClick={handleUndo}>
            <UndoIcon sx={{ fontSize: 18 }} />
          </Button>
        </Tooltip>
        <Tooltip title={`${t('editor.redo')} (${modKey}+Shift+Z)`}>
          <Button disabled={!canRedo} onClick={handleRedo}>
            <RedoIcon sx={{ fontSize: 18 }} />
          </Button>
        </Tooltip>
      </ButtonGroup>

      {/* 主题操作按钮组 */}
      <ButtonGroup {...commonButtonGroupProps} sx={btnGroupSx}>
        <Tooltip title={t('editor.concept.shuffle')}>
          <Button disabled={isThemeLocked} onClick={handleShuffle}>
            <ShuffleIcon disabled={isThemeLocked} />
          </Button>
        </Tooltip>
        <Tooltip title={t('editor.concept.resetTitle')}>
          <Button
            disabled={isThemeLocked || saving}
            onClick={handleReset}
            sx={{
              '&:hover': {
                '& .MuiSvgIcon-root': {
                  color: 'warning.main',
                },
              },
            }}>
            <RestartAltIcon sx={{ fontSize: 20 }} />
          </Button>
        </Tooltip>
      </ButtonGroup>

      {/* 锁定/解锁 */}
      <ButtonGroup {...commonButtonGroupProps} sx={btnGroupSx}>
        {renderLockButton()}
      </ButtonGroup>

      {renderConfirmDialog()}
    </Box>
  );
}
