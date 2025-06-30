import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import Toast from '@arcblock/ux/lib/Toast';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { IconButton, OutlinedTextFieldProps, TextField } from '@mui/material';
import { useMemo } from 'react';
import { defaultDarkTheme, defaultLightTheme } from 'src/siteTheme';
import { useThemeStore } from 'src/state/themeStore';
import { getByPath } from 'src/utils';

export interface HexColorInputProps extends Omit<OutlinedTextFieldProps, 'value' | 'variant' | 'onChange' | 'onReset'> {
  path: string;
  onChange?: (value: string) => void;
  onReset?: (path: string) => void;
}

export function HexColorField({ path, label = 'Hex', size = 'small', onChange, onReset, ...rest }: HexColorInputProps) {
  const { t } = useLocaleContext();
  const themeObject = useThemeStore((s) => s.themeObject);
  const { mode } = themeObject.palette;

  const value = useMemo<string>(() => {
    return getByPath(themeObject, path);
  }, [path, themeObject]);
  const defaultValue = useMemo<string>(() => {
    return mode === 'dark' ? getByPath(defaultDarkTheme, path) : getByPath(defaultLightTheme, path);
  }, [path, mode]);

  // 复制功能
  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    Toast.success(t('editor.copied'));
  };

  return (
    <TextField
      variant="outlined"
      label={label}
      value={value}
      size={size}
      InputProps={{
        endAdornment: (
          <>
            {value !== defaultValue && (
              <IconButton title={t('editor.reset')} onClick={() => onReset?.(path)}>
                <RestartAltIcon sx={{ fontSize: 20 }} />
              </IconButton>
            )}
            <IconButton title={t('editor.copy')} onClick={handleCopy}>
              <ContentCopyIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </>
        ),
      }}
      onChange={(e) => onChange?.(e.target.value)}
      {...rest}
    />
  );
}
