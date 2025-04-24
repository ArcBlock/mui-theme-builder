import { SessionContext } from '@arcblock/did-connect/lib/Session';
import { temp as colors } from '@arcblock/ux/lib/Colors';
import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import Tabs from '@arcblock/ux/lib/Tabs';
import Nft from '@blocklet/ui-react/lib/UserCenter/components/nft';
import Passport from '@blocklet/ui-react/lib/UserCenter/components/passport';
import { UserBasicInfo } from '@blocklet/ui-react/lib/UserCenter/components/user-info';
import { Box, Divider, Typography, useMediaQuery, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useCreation, useMemoizedFn } from 'ahooks';
import { useContext, useState } from 'react';

import BlockletWrapper from './Share/BlockletWrapper';
import Footer from './Share/Footer';
import Header from './Share/Header';

const ContentWrapper = styled(Box)(({ theme }) => ({
  overflow: 'hidden',
  flex: 'revert',
  [theme.breakpoints.up('md')]: {
    flex: 1,
  },
  '@media (min-width: 850px) and (max-width: 1050px)': {
    '& .user-center-tabs': {
      maxWidth: '500px',
    },
  },
}));

function UserCenter() {
  const { t, locale } = useLocaleContext();
  // @ts-ignore
  const { session } = useContext(SessionContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const userCenterTabs = useCreation(
    () => [
      {
        label: t('common.notifications'),
        value: 'notifications',
      },
      {
        label: t('common.nft'),
        value: 'nfts',
      },
      {
        label: t('common.setting'),
        value: 'settings',
      },
      {
        label: t('common.storageManagement'),
        value: 'didSpaces',
      },
    ],
    [locale],
  );
  const [currentTab, setCurrentTab] = useState('notifications');
  const tabContent = useCreation(() => {
    if (currentTab === 'nfts') {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
          }}>
          <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, p: 2 }}>
            <Typography
              sx={{
                color: 'text.primary',
                fontWeight: 600,
                mb: 2.5,
              }}>
              {t('passport')}
            </Typography>
            <Passport user={session.user} />
          </Box>
          <Nft user={session.user} />
        </Box>
      );
    }
    return null;
  }, [currentTab]);

  const handleChangeTab = useMemoizedFn((value) => {
    setCurrentTab(value);
  });
  const handleSwitchPassport = useMemoizedFn(() => {
    session.user.switchPassport();
  });
  const onRefreshUser = useMemoizedFn(() => {
    session.user.refresh();
  });

  return (
    <ContentWrapper display="flex" flexDirection={isMobile ? 'column' : 'row'}>
      <Box flex="1" className="user-center-tabs" order={isMobile ? 2 : 'unset'}>
        <Box
          display="flex"
          flexDirection="column"
          sx={{
            height: '100%',
            overflow: 'auto',
            padding: '1px',
          }}>
          <Tabs
            orientation="horizontal"
            variant="line"
            tabs={userCenterTabs}
            current={currentTab}
            onChange={handleChangeTab}
            sx={{
              mb: 2,
              '.MuiTabs-flexContainer': {
                gap: 3,
                '.MuiButtonBase-root': {
                  padding: isMobile ? '16px 4px' : '40px 4px 32px 4px',
                  fontSize: 16,
                },
                '.MuiTab-root': {
                  display: 'block',
                  textAlign: 'left',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  fontWeight: 400,
                },
              },
              '.MuiTabs-scroller': {
                '&:after': {
                  content: '""',
                  display: 'block',
                  width: '100%',
                  height: '1px',
                  backgroundColor: `${colors.dividerColor} !important`,
                },
              },
            }}
          />
          {tabContent}
        </Box>
      </Box>
      {!isMobile && <Divider orientation="vertical" sx={{ borderColor: colors.dividerColor, ml: 5 }} />}
      <UserBasicInfo
        isMobile={isMobile}
        order={isMobile ? 1 : 'unset'}
        switchPassport={handleSwitchPassport}
        switchProfile={session?.switchProfile}
        user={session?.user}
        refreshProfile={onRefreshUser}
        showFullDid={false}
        sx={{
          padding: !isMobile ? '40px 24px 24px 40px' : '16px 0 0 0',
          ...(!isMobile ? { width: 320, maxWidth: 320, flexShrink: 0 } : {}),
          boxSizing: 'content-box',
        }}
      />
    </ContentWrapper>
  );
}

export default function UserCenterSample() {
  return (
    <BlockletWrapper>
      <Header />
      <Box sx={{ display: 'flex', maxWidth: '1600px', margin: '0 auto', padding: '0 16px' }}>
        <UserCenter />
      </Box>
      <Footer />
    </BlockletWrapper>
  );
}
