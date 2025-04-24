import { Stack, Typography, styled } from '@mui/material';

import PreferInput from './PreferInput';

const SettingItem = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: `0 ${theme.spacing(2)}`,
}));

export default function ThemeSettings() {
  return (
    <SettingItem>
      <Typography variant="body2">Prefer</Typography>
      <PreferInput />
    </SettingItem>
  );
}
