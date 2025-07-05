import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import ShuffleIconBase from '@mui/icons-material/Shuffle';
import { Button, ButtonProps, SvgIconProps } from '@mui/material';

const noop = () => {};

export const DEFAULT_SHUFFLE_COLOR = '#6248ff';

export function ShuffleIcon({ sx, ...rest }: SvgIconProps) {
  return <ShuffleIconBase sx={{ color: DEFAULT_SHUFFLE_COLOR, fontSize: 20, ...sx }} {...rest} />;
}

export function ButtonShuffle({
  onClick = noop,
  size = 'small',
  variant = 'outlined',
  color = 'inherit',
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
      startIcon={<ShuffleIcon />}
      sx={{ textTransform: 'none', borderColor: 'divider', ...sx }}
      onClick={onClick}>
      {t('editor.shuffle')}
    </Button>
  );
}
