import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import { Box, BoxProps } from '@mui/material';

import { ShuffleIcon } from './ButtonShuffle';

export interface IconButtonLockProps extends BoxProps {
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  color?: string;
}

export function IconButtonShuffle({ onClick = undefined, color = 'text.primary', ...rest }: IconButtonLockProps) {
  const { t } = useLocaleContext();

  return (
    <Box
      title={t('editor.shuffle')}
      sx={{
        p: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 64,
        color,
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      }}
      className="action"
      onClick={onClick}
      {...rest}>
      <ShuffleIcon sx={{ color }} />
    </Box>
  );
}
