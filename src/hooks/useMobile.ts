import { Breakpoint, useTheme, useMediaQuery } from '@mui/material';

export default function useMobile({ key = 'md' }: { key?: number | Breakpoint } = {}) {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down(key));
}
