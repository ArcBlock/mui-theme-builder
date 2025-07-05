import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Box, BoxProps } from '@mui/material';
import useMobile from 'src/hooks/useMobile';

export interface IconButtonLockProps extends BoxProps {
  lock: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  color?: string;
}

export function IconButtonLock({ lock = false, onClick, color = 'text.primary', ...rest }: IconButtonLockProps) {
  const isMobile = useMobile();
  const { t } = useLocaleContext();

  return (
    <Box
      title={lock ? t('editor.unlock') : t('editor.lock')}
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
      className={`action ${lock || isMobile ? 'is-locked' : ''}`}
      onClick={onClick}
      {...rest}>
      {lock ? <LockIcon style={{ fontSize: 16 }} /> : <LockOpenIcon style={{ fontSize: 16 }} />}
    </Box>
  );
}
