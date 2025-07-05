import { useEffect } from 'react';

interface KeyboardShortcutsConfig {
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export function useKeyboardShortcuts({ onUndo, onRedo, canUndo = true, canRedo = true }: KeyboardShortcutsConfig) {
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      // 检查是否在输入框中
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      // 检查是否按下了 Ctrl/Cmd 键（Mac 兼容）
      const isCtrlOrCmd = event.ctrlKey || event.metaKey;

      // Ctrl+Z 或 Cmd+Z 撤销
      if (isCtrlOrCmd && event.key === 'z' && !event.shiftKey) {
        if (canUndo && onUndo) {
          event.preventDefault();
          event.stopPropagation();
          onUndo();
        }
        return;
      }

      // Ctrl+Shift+Z 或 Cmd+Shift+Z 重做
      if (isCtrlOrCmd && event.shiftKey && event.key === 'z') {
        if (canRedo && onRedo) {
          event.preventDefault();
          event.stopPropagation();
          onRedo();
        }
        return;
      }
    };

    // 使用捕获阶段监听，优先级更高
    document.addEventListener('keydown', handleKeydown, { capture: true });
    return () => document.removeEventListener('keydown', handleKeydown, { capture: true });
  }, [onUndo, onRedo, canUndo, canRedo]);
}
