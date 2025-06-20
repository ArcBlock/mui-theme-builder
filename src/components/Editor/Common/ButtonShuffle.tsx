import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import { Button, ButtonProps } from '@mui/material';

const noop = () => {};

export default function ButtonShuffle({
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
      startIcon={<ShuffleIcon style={{ color: '#6248ff' }} />}
      sx={{ textTransform: 'none', borderColor: 'divider', ...sx }}
      onClick={onClick}>
      {t('editor.shuffle')}
    </Button>
  );
}
