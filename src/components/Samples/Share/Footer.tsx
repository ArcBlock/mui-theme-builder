import BlockletFooter from '@blocklet/ui-react/lib/Footer';
import { useTheme } from '@mui/material';
import { useMemo } from 'react';

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

export default function Footer() {
  const theme = useTheme();
  const locale = 'en';
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
    // @ts-ignore
    <BlockletFooter className="custom-footer" meta={{ ...baseMeta, ...brand }} />
  );
}
