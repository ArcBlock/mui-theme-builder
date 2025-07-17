import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import Toast from '@arcblock/ux/lib/Toast';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { IconButton, OutlinedTextFieldProps, TextField } from '@mui/material';
import { useMemo, useState } from 'react';
import { defaultDarkTheme, defaultLightTheme } from 'src/constants';
import { useThemeBuilder } from 'src/context/themeBuilder';
import { getByPath, isValidHexColor } from 'src/utils';

export interface HexColorInputProps extends Omit<OutlinedTextFieldProps, 'value' | 'variant' | 'onChange' | 'onReset'> {
  path: string;
  onChange?: (value: string) => void;
  onReset?: (path: string) => void;
}

export function HexColorField({
  path,
  label = 'Hex',
  size = 'small',
  onChange = undefined,
  onReset = undefined,
  ...rest
}: HexColorInputProps) {
  const { t } = useLocaleContext();
  const themeObject = useThemeBuilder((s) => s.themeObject);
  const { mode } = themeObject.palette;
  const [inputValue, setInputValue] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(true);

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

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // 验证输入值
    const valid = isValidHexColor(newValue);
    setIsValid(valid);

    // 只有输入有效时才触发 onChange 事件
    if (valid && onChange) {
      onChange(newValue);
    }
  };

  // 处理失焦事件，如果输入无效则恢复原值
  const handleBlur = () => {
    if (!isValid) {
      setInputValue(value);
      setIsValid(true);
    }
  };

  // 当 value 从外部更新时，同步更新 inputValue
  useMemo(() => {
    setInputValue(value);
    setIsValid(true);
  }, [value]);

  return (
    <TextField
      variant="outlined"
      label={label}
      value={inputValue}
      size={size}
      error={!isValid}
      helperText={!isValid ? t('editor.colorSection.invalidHexColor') : ''}
      onChange={handleInputChange}
      onBlur={handleBlur}
      {...rest}
      slotProps={{
        input: {
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
        },
      }}
    />
  );
}
