import { Stack, styled } from '@mui/material';

const SettingItem = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `0 ${theme.spacing(2)}`,
}));

export default SettingItem;
