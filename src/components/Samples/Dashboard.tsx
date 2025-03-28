import Dashboard from '@arcblock/ux/lib/Layout/dashboard';
import TerminalOutlinedIcon from '@mui/icons-material/TerminalOutlined';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import { Box, styled } from '@mui/material';
import StoreLogo from 'src/images/store-logo-notext.svg?react';

import BlockletWrapper from './Share/BlockletWrapper';
import HeaderAddons from './Share/HeaderAddons';

// 左侧菜单配置
const groupedLinks = [
  {
    url: '/nav1',
    title: 'Nav1',
    showBadge: false,
    icon: <WidgetsOutlinedIcon />,
  },
  {
    url: '/nav2',
    title: 'Nav2',
    showBadge: true,
    icon: <TerminalOutlinedIcon />,
  },
  {
    title: 'Group1',
    icon: <TerminalOutlinedIcon />,
    children: [
      { url: '/group1-1', title: 'Group1-1', showBadge: true, icon: <WidgetsOutlinedIcon /> },
      { url: '/group1-2', title: 'Group1-2', icon: <TerminalOutlinedIcon /> },
      { url: '/group1-3', title: 'Group1-3', icon: <WidgetsOutlinedIcon /> },
      { url: '/group1-4', title: 'Group1-4', icon: <TerminalOutlinedIcon /> },
    ],
  },
  {
    title: 'Group2',
    icon: <TerminalOutlinedIcon />,
    children: [
      { url: '/group2-1', title: 'Group2-1', icon: <WidgetsOutlinedIcon /> },
      { url: '/group2-2', title: 'Group2-2', icon: <TerminalOutlinedIcon /> },
      { url: '/group2-3', title: 'Group2-3', icon: <WidgetsOutlinedIcon /> },
      { url: '/group2-4', title: 'Group2-4', icon: <TerminalOutlinedIcon />, external: true },
    ],
  },
];

export default function DashboardSample() {
  return (
    <BlockletWrapper>
      <StyledDashboard
        // @ts-ignore
        links={groupedLinks}
        title="Blocklets"
        headerProps={{
          brand: 'ABT Node (Dev)',
          addons: <HeaderAddons />,
          logo: <StoreLogo height={54} />,
        }}
        fullWidth
        legacy={false}>
        <Box sx={{ flexGrow: 1, marginTop: 2, height: '100%', backgroundColor: 'background.default' }} />
      </StyledDashboard>
    </BlockletWrapper>
  );
}

const StyledDashboard = styled(Dashboard)({
  '&.dashboard': {
    height: '80vh',
  },
});
