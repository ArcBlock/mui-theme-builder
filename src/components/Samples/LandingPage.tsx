import DidAddress from '@arcblock/ux/lib/Address';
import DidAvatar from '@arcblock/ux/lib/Avatar';
import ResponsiveHeader from '@arcblock/ux/lib/Header/responsive-header';
import NavMenu, { ItemOptions } from '@arcblock/ux/lib/NavMenu/nav-menu';
import Products from '@arcblock/ux/lib/NavMenu/products';
import { styled, useTheme } from '@arcblock/ux/lib/Theme';
import Footer from '@blocklet/ui-react/lib/Footer';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import ChatbotSvg from '@mui/icons-material/ChatOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import GallerySvg from '@mui/icons-material/PhotoSizeSelectActualOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import BoardsSvg from '@mui/icons-material/SpaceDashboardOutlined';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import { Box, Button, Stack } from '@mui/material';
import { useMemo } from 'react';
import { Link, BrowserRouter as Router } from 'react-router-dom';
import LogoNotext from 'src/images/store-logo-notext.svg?react';

const baseMeta = {
  theme: {
    background: '#ffffff',
  },
};
const brand = {
  did: 'z8iZoDztjkY82fsU26vwE8M94eHDK4tjwrFgd',
  appName: 'ArcBlock',
  appLogo: 'https://www.arcblock.io/.well-known/service/blocklet/logo',
  appLogoRect: 'https://www.arcblock.io/.well-known/service/blocklet/logo-rect',
  appDescription:
    'Redefine Software Architect and Ecosystem \n A total solution for building decentralized applications.',
};

const socialMedia = [
  { icon: 'fa6-brands:github', link: 'https://github.com/arcblock', section: 'social' },
  { icon: 'fa6-brands:x-twitter', link: 'https://twitter.com/ArcBlock_io', section: 'social' },
  { icon: 'fa6-brands:linkedin', link: 'https://www.linkedin.com/company/arcblock/', section: 'social' },
  { icon: 'bi:youtube', link: 'https://www.youtube.com/@ArcBlock_io', section: 'social' },
  { icon: 'cryptocurrency:abt', link: 'https://www.coinbase.com/price/arcblock', section: 'social' },
];

export default function LandingPage() {
  const theme = useTheme();
  const locale = 'en';
  const items = [
    {
      label: 'Products',
      // eslint-disable-next-line react/no-unstable-nested-components
      children: ({ isOpen }: { isOpen: boolean }) => <Products isOpen={isOpen} />,
    },
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
  const links = useMemo(() => {
    return [
      { title: 'Terms of Service', link: `https://www.arcblock.io/${locale}/termsofuse`, section: 'bottom' },
      { title: 'Privacy', link: `https://www.arcblock.io/${locale}/privacy`, section: 'bottom' },
      { title: 'Service Level', link: `https://www.arcblock.io/${locale}/sla`, section: 'bottom' },
      { title: 'Site Map', link: 'https://www.arcblock.io/sitemap.xml', section: 'bottom' },
    ];
  }, [locale]);
  const navs = useMemo(() => {
    return [
      {
        title: { en: 'Products', zh: '产品' },
        section: ['footer'],
        items: [
          { title: 'ArcSphere', link: `https://www.arcblock.io/content/tags/${locale}/arcsphere`, isNew: true },
          { title: 'DID Wallet', link: `https://www.didwallet.io/${locale}` },
          { title: 'DID Spaces', link: `https://www.didspaces.com/${locale}` },
          { title: 'DID Names', link: `https://www.didnames.io/${locale}` },
          { title: 'Blocklet Launcher', link: `https://launcher.arcblock.io/${locale}` },
          { title: 'Blocklet Server', link: `https://www.arcblock.io/content/collections/${locale}/blocklet-server` },
          { title: 'AIGNE', link: `https://www.aigne.io/${locale}` },
        ],
      },
      {
        title: { en: 'Learning', zh: '学习更多' },
        section: ['footer'],
        items: [
          {
            title: 'Articles',
            link: '/blog',
          },
          {
            title: 'Docs',
            link: '/docs',
          },
          {
            title: 'Bookmarks',
            link: '/bookmarks',
          },
        ],
      },
      {
        title: { en: 'Company', zh: '公司' },
        section: ['footer'],
        items: [
          {
            title: 'Careers',
            link: `/content/docs/arcblock/${locale}/join-us`,
          },
          {
            title: 'About',
            link: `/${locale}/about-us`,
          },
        ],
      },
      {
        title: { en: 'Community', zh: '社区' },
        section: ['footer'],
        items: [
          { title: 'Join & Earn', link: '/join-to-earn' },
          { title: 'Points', link: 'https://community.arcblock.io/point-up/my' },
          { title: 'Vote', link: '/vote' },
        ],
      },
    ];
  }, [locale]);

  return (
    <Router>
      <Stack sx={{ minHeight: 800 }} bgcolor="#fff">
        <ResponsiveHeader
          logo={<LogoNotext />}
          brand="BLOCKLET SERVER [Brand]"
          description={
            <DidAddress
              compact
              responsive={false}
              copyable={false}
              showCopyButtonInTooltip
              prepend={<DidAvatar did="z3CtAkv2AGG4YvJU6S4oJmX39WuKQX72WQgUj" size={16} style={{ marginRight: 4 }} />}>
              z3CtAkv2AGG4YvJU6S4oJmX39WuKQX72WQgUj
            </DidAddress>
          }
          addons={
            <>
              <Button variant="contained" color="primary" size="small" style={{ marginLeft: '12px' }}>
                Addons
              </Button>
              <Button color="primary" size="small">
                Addons
              </Button>
            </>
          }>
          {({ isMobile, closeMenu }: { isMobile: boolean; closeMenu: () => void }) => (
            <NavMenu
              mode={isMobile ? 'inline' : 'horizontal'}
              items={items as ItemOptions[]}
              activeTextColor={theme.palette.primary.main}
              onSelected={closeMenu}
            />
          )}
        </ResponsiveHeader>
        <Box sx={{ flexGrow: 1, padding: 4, backgroundColor: '#ddd' }}>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
            industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
            scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into
            electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like
            Aldus PageMaker including versions of Lorem Ipsum.
          </p>
        </Box>
        <BottomRoot
          sx={{
            display: 'flex',
            flexDirection: 'column',
            h4: {
              margin: '0 16px',
              lineHeight: '40px',
            },
          }}>
          {/* @ts-expect-error */}
          <Footer
            className="custom-footer"
            meta={{ navigation: [...socialMedia, ...navs, ...links], ...baseMeta, ...brand }}
          />
        </BottomRoot>
      </Stack>
    </Router>
  );
}

const BottomRoot = styled(Box)`
  .custom-footer > div > .MuiContainer-root {
    max-width: unset;
  }
`;
