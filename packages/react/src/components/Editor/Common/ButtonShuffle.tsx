import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import ShuffleIconBase from '@mui/icons-material/Shuffle';
import { Button, ButtonProps, SvgIconProps } from '@mui/material';

const noop = () => {};

export const DEFAULT_SHUFFLE_COLOR = '#6248ff';

export interface ShuffleIconProps extends SvgIconProps {
  disabled?: boolean;
}
export function ShuffleIcon({ sx, disabled = false, ...rest }: ShuffleIconProps) {
  return (
    <ShuffleIconBase
      sx={{ color: disabled ? 'text.disabled' : DEFAULT_SHUFFLE_COLOR, fontSize: 20, ...sx }}
      {...rest}
    />
  );
}

export function ButtonShuffle({
  onClick = noop,
  size = 'small',
  variant = 'outlined',
  color = 'inherit',
  disabled = false,
  sx,
  ...props
}: { onClick?: () => void } & ButtonProps) {
  const { t } = useLocaleContext();

  return (
    <Button
      {...props}
      variant={variant}
      color={color}
      size={size}
      disabled={disabled}
      startIcon={<ShuffleIcon disabled={disabled} />}
      sx={{ textTransform: 'none', borderColor: 'divider', ...sx }}
      onClick={onClick}>
      {t('editor.shuffle')}
    </Button>
  );
}
