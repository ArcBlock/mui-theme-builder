import { DID } from '@arcblock/ux/lib/DID';
import Dashboard from '@arcblock/ux/lib/Layout/dashboard';
import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import TerminalOutlinedIcon from '@mui/icons-material/TerminalOutlined';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import { Box, styled } from '@mui/material';
import StoreLogo from 'src/images/store-logo-notext.svg?react';

import BlockletWrapper from './Share/BlockletWrapper';
import HeaderAddons from './Share/HeaderAddons';

export default function DashboardSample() {
  const { t } = useLocaleContext();
  // 菜单结构支持 i18n
  const groupedLinks = [
    {
      url: '/nav1',
      title: t('samples.dashboard.nav1'),
      showBadge: false,
      icon: <WidgetsOutlinedIcon />,
    },
    {
      url: '/nav2',
      title: t('samples.dashboard.nav2'),
      showBadge: true,
      icon: <TerminalOutlinedIcon />,
    },
    {
      title: t('samples.dashboard.group1'),
      icon: <TerminalOutlinedIcon />,
      children: [
        { url: '/group1-1', title: t('samples.dashboard.group1_1'), showBadge: true, icon: <WidgetsOutlinedIcon /> },
        { url: '/group1-2', title: t('samples.dashboard.group1_2'), icon: <TerminalOutlinedIcon /> },
        { url: '/group1-3', title: t('samples.dashboard.group1_3'), icon: <WidgetsOutlinedIcon /> },
        { url: '/group1-4', title: t('samples.dashboard.group1_4'), icon: <TerminalOutlinedIcon /> },
      ],
    },
    {
      title: t('samples.dashboard.group2'),
      icon: <TerminalOutlinedIcon />,
      children: [
        { url: '/group2-1', title: t('samples.dashboard.group2_1'), icon: <WidgetsOutlinedIcon /> },
        { url: '/group2-2', title: t('samples.dashboard.group2_2'), icon: <TerminalOutlinedIcon /> },
        { url: '/group2-3', title: t('samples.dashboard.group2_3'), icon: <WidgetsOutlinedIcon /> },
        { url: '/group2-4', title: t('samples.dashboard.group2_4'), icon: <TerminalOutlinedIcon />, external: true },
      ],
    },
  ];

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
        <Box sx={{ flexGrow: 1, marginTop: 2, height: '100%' }}>
          {/* 顶部 Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', gap: { xs: 2, sm: 4 } }}>
            <Box
              sx={{
                px: { xs: 1, sm: 2 },
                py: 1,
                borderBottom: '2px solid',
                borderColor: 'primary.main',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: { xs: 14, sm: 16 },
              }}>
              {t('samples.dashboard.content.tabs.overview')}
            </Box>
            <Box
              sx={{
                px: { xs: 1, sm: 2 },
                py: 1,
                color: 'text.secondary',
                cursor: 'pointer',
                fontSize: { xs: 14, sm: 16 },
              }}>
              {t('samples.dashboard.content.tabs.blocklets')}
            </Box>
          </Box>

          {/* 概览数据和时间区 */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: { xs: 2, sm: 3, md: 4 },
              mt: { xs: 2, sm: 4 },
              mb: { xs: 2, sm: 4 },
              '& > *': {
                flex: { xs: '1 1 calc(50% - 8px)', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 12px)' },
                minWidth: { xs: 'auto', sm: 180 },
              },
            }}>
            {/* 数据项 */}
            <Box>
              <Box
                sx={{
                  fontSize: { xs: 24, sm: 28, md: 32 },
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}>
                5{' '}
                <Box
                  component="span"
                  sx={{
                    fontSize: { xs: 12, sm: 14 },
                    fontWeight: 400,
                    color: 'text.secondary',
                  }}>
                  {t('samples.dashboard.content.overview.running')} 5
                </Box>
              </Box>
              <Box
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                  fontSize: { xs: 12, sm: 14 },
                }}>
                {t('samples.dashboard.content.overview.blocklets')}
              </Box>
            </Box>
            <Box>
              <Box
                sx={{
                  fontSize: { xs: 24, sm: 28, md: 32 },
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}>
                2,690{' '}
                <Box
                  component="span"
                  sx={{
                    fontSize: { xs: 12, sm: 14 },
                    fontWeight: 400,
                    color: 'text.secondary',
                  }}>
                  {t('samples.dashboard.content.overview.active')} 2,686
                </Box>
              </Box>
              <Box
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                  fontSize: { xs: 12, sm: 14 },
                }}>
                {t('samples.dashboard.content.overview.members')}
              </Box>
            </Box>
            <Box>
              <Box
                sx={{
                  fontSize: { xs: 24, sm: 28, md: 32 },
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}>
                111{' '}
                <Box
                  component="span"
                  sx={{
                    fontSize: { xs: 12, sm: 14 },
                    fontWeight: 400,
                    color: 'text.secondary',
                  }}>
                  {t('samples.dashboard.content.overview.active')} 111
                </Box>
              </Box>
              <Box
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                  fontSize: { xs: 12, sm: 14 },
                }}>
                {t('samples.dashboard.content.overview.passports')}
              </Box>
            </Box>
            <Box>
              <Box
                sx={{
                  fontSize: { xs: 24, sm: 28, md: 32 },
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}>
                6{' '}
                <Box
                  component="span"
                  sx={{
                    fontSize: { xs: 12, sm: 14 },
                    fontWeight: 400,
                    color: 'text.secondary',
                  }}>
                  {t('samples.dashboard.content.overview.customDomain')} 2
                </Box>
              </Box>
              <Box
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                  fontSize: { xs: 12, sm: 14 },
                }}>
                {t('samples.dashboard.content.overview.domains')}
              </Box>
            </Box>

            {/* 时间项 */}
            <Box>
              <Box
                sx={{
                  fontSize: { xs: 20, sm: 24, md: 28 },
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}>
                1 day
              </Box>
              <Box
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                  fontSize: { xs: 12, sm: 14 },
                }}>
                {t('samples.dashboard.content.overview.uptime')}
              </Box>
            </Box>
            <Box>
              <Box
                sx={{
                  fontSize: { xs: 20, sm: 24, md: 28 },
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}>
                2 years ago
              </Box>
              <Box
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                  fontSize: { xs: 12, sm: 14 },
                }}>
                {t('samples.dashboard.content.overview.createdAt')}
              </Box>
            </Box>
            <Box>
              <Box
                sx={{
                  fontSize: { xs: 20, sm: 24, md: 28 },
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}>
                1 hour ago
              </Box>
              <Box
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                  fontSize: { xs: 12, sm: 14 },
                }}>
                {t('samples.dashboard.content.overview.lastBackup')}
              </Box>
            </Box>
          </Box>

          {/* 基本信息区块 */}
          <Box sx={{ mt: { xs: 1, sm: 2 } }}>
            <Box
              sx={{
                fontWeight: 700,
                fontSize: { xs: 16, sm: 18 },
                mb: { xs: 1, sm: 2 },
              }}>
              {t('samples.dashboard.content.basicInfo.title')}
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: '180px 1fr',
                },
                rowGap: { xs: 1, sm: 2 },
                columnGap: { xs: 0, sm: 4 },
              }}>
              <Box
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                  fontSize: { xs: 12, sm: 14 },
                }}>
                {t('samples.dashboard.content.basicInfo.appDid')}
              </Box>
              <DID did="zNKYczJHvz8QV34Mj9ofDqZgD3axaNErGK2uu" showQrcode />
              <Box
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                  fontSize: { xs: 12, sm: 14 },
                }}>
                {t('samples.dashboard.content.basicInfo.permanentDid')}
              </Box>
              <DID did="zNKYczJHvz8QV34Mj9ofDqZgD3axaNErGK7Mp" showQrcode />
              <Box
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                  fontSize: { xs: 12, sm: 14 },
                }}>
                {t('samples.dashboard.content.basicInfo.owner')}
              </Box>
              <DID did="zNKryNmcoFxUVieWmpz7btGZGfyTcbajDR4Nq" showQrcode />
              <Box
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                  fontSize: { xs: 12, sm: 14 },
                }}>
                {t('samples.dashboard.content.basicInfo.installedAt')}
              </Box>
              <Box
                sx={{
                  fontFamily: 'monospace',
                  fontSize: { xs: 12, sm: 14 },
                }}>
                -
              </Box>
              <Box
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                  fontSize: { xs: 12, sm: 14 },
                }}>
                {t('samples.dashboard.content.basicInfo.walletType')}
              </Box>
              <Box sx={{ fontSize: { xs: 12, sm: 14 } }}>ArcBlock</Box>
              <Box
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                  fontSize: { xs: 12, sm: 14 },
                }}>
                {t('samples.dashboard.content.basicInfo.serverDid')}
              </Box>
              <DID did="z1QkBNpFxijVx3SwoCk7Ngc9nh1JRvXeXW2y" showQrcode />
              <Box
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                  fontSize: { xs: 12, sm: 14 },
                }}>
                {t('samples.dashboard.content.basicInfo.serverVersion')}
              </Box>
              <Box>
                <Box
                  component="span"
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    px: 1,
                    py: 0.25,
                    borderRadius: 0.5,
                    fontWeight: 600,
                    fontSize: 12,
                  }}>
                  1.16.45
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </StyledDashboard>
    </BlockletWrapper>
  );
}

const StyledDashboard = styled(Dashboard)({
  '&.dashboard': {
    minHeight: '80vh',
  },
});
