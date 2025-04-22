import ResponsiveHeader from '@arcblock/ux/lib/Header/responsive-header';
import NavMenu, { ItemOptions } from '@arcblock/ux/lib/NavMenu/nav-menu';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import ChatbotSvg from '@mui/icons-material/ChatOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import GallerySvg from '@mui/icons-material/PhotoSizeSelectActualOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import BoardsSvg from '@mui/icons-material/SpaceDashboardOutlined';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import { Box, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import LogoNotext from 'src/images/store-logo-notext.svg?react';

import HeaderAddons from './HeaderAddons';

export default function Header() {
  const theme = useTheme();
  const items = [
    {
      label: <Link to="/">Tools</Link>,
      icon: <SettingsOutlinedIcon />,
      children: [
        {
          label: <Link to="/">Chatbot</Link>,
          description: 'Chat with AIGNE',
          icon: <ChatbotSvg />,
        },
        {
          label: <Link to="/">Boards</Link>,
          description: 'Give some draft here',
          icon: <BoardsSvg />,
        },
        {
          label: <Link to="/">Gallery</Link>,
          description: 'Show your images',
          icon: <GallerySvg />,
        },
        {
          label: <Link to="/">No Desc</Link>,
          icon: <ChatbotSvg />,
        },
        {
          label: <Link to="/">No Icon</Link>,
          description: 'Chat with AIGNE',
        },
        {
          label: <Link to="/">Only Label</Link>,
        },
      ],
    },
    {
      label: <Link to="/">Side Effects</Link>,
      icon: <HomeOutlinedIcon />,
      children: [
        {
          label: <Link to="/">Child 1 very longongongongongong</Link>,
          icon: <HomeOutlinedIcon />,
        },
        {
          label: <Link to="/">Child 2</Link>,
          icon: <WidgetsOutlinedIcon />,
        },
        {
          label: <Link to="/">Child 3</Link>,
          icon: <SettingsOutlinedIcon />,
          children: [
            {
              label: <Link to="/">Child 1</Link>,
              icon: <HomeOutlinedIcon />,
            },
            {
              label: <Link to="/">Child 2</Link>,
              icon: <WidgetsOutlinedIcon />,
              children: [
                {
                  label: <Link to="/">Child 1</Link>,
                  icon: <HomeOutlinedIcon />,
                },
                {
                  label: <Link to="/">Child 2</Link>,
                  icon: <WidgetsOutlinedIcon />,
                },
              ],
            },
          ],
        },
        {
          label: <Link to="/">Child 4</Link>,
          icon: <AssessmentOutlinedIcon />,
        },
      ],
    },
  ];

  return (
    <Box
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        '.MuiContainer-root': {
          maxWidth: 'unset',
        },
      }}>
      <ResponsiveHeader logo={<LogoNotext />} addons={<HeaderAddons />}>
        {({ isMobile, closeMenu }: { isMobile: boolean; closeMenu: () => void }) => (
          <NavMenu
            mode={isMobile ? 'inline' : 'horizontal'}
            items={items as ItemOptions[]}
            activeTextColor={theme.palette.primary.main}
            onSelected={closeMenu}
          />
        )}
      </ResponsiveHeader>
    </Box>
  );
}
