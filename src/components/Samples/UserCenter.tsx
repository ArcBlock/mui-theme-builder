import { SessionContext } from '@arcblock/did-connect/lib/Session';
import { ServerLogoNotext } from '@arcblock/icons';
import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import Tabs from '@arcblock/ux/lib/Tabs';
import Nft from '@blocklet/ui-react/lib/UserCenter/components/nft';
import Passport from '@blocklet/ui-react/lib/UserCenter/components/passport';
import { UserBasicInfo } from '@blocklet/ui-react/lib/UserCenter/components/user-info';
import ErrorIcon from '@mui/icons-material/Error';
import TelegramIcon from '@mui/icons-material/Telegram';
import WarningIcon from '@mui/icons-material/Warning';
import { Box, Divider, Stack, Typography, useTheme } from '@mui/material';
import { useCreation, useMemoizedFn } from 'ahooks';
import { formatDistanceToNow } from 'date-fns';
import { useContext, useState } from 'react';
import useMobile from 'src/hooks/useMobile';

import BlockletWrapper from './Share/BlockletWrapper';
import Footer from './Share/Footer';
import Header from './Share/Header';

function timeSince(date: string | number | Date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

const mockNotifications = [
  {
    id: 1,
    icon: <WarningIcon color="warning" sx={{ fontSize: 20 }} />,
    appIcon: <ServerLogoNotext style={{ width: 28, height: 28 }} />,
    title: 'Blocklet health check failed',
    description: 'Blocklet Discuss Kit with components Discuss Kit, Media Kit health check failed, restarting...',
    time: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
  },
  {
    id: 2,
    icon: <TelegramIcon color="info" sx={{ fontSize: 20 }} />,
    appIcon: <ServerLogoNotext style={{ width: 28, height: 28 }} />,
    description: (
      <span>
        <Typography component="span" color="text.primary" fontWeight={600}>
          Robot
        </Typography>
        <span> has assigned you a task: </span>
        <Typography component="span" color="primary.main">
          Theme configuration feedback
        </Typography>
      </span>
    ),
    time: new Date(Date.now() - 30 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: 3,
    icon: <ErrorIcon color="info" sx={{ fontSize: 20 }} />,
    appIcon: <ServerLogoNotext style={{ width: 28, height: 28 }} />,
    title: 'You logged in on a new device',
    description: 'You logged in on a new device: Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_1 like Mac OS X)...',
    time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
];

function UserCenter() {
  const { t, locale } = useLocaleContext();
  // @ts-ignore
  const { session } = useContext(SessionContext);
  const theme = useTheme();
  const isMobile = useMobile();

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

  // 通知列表
  const notificationsContent = useCreation(() => {
    return (
      <Stack spacing={1} sx={{ pr: 1 }}>
        {mockNotifications.map((item: (typeof mockNotifications)[number]) => (
          <Stack
            direction="row"
            spacing={2}
            alignItems="flex-start"
            key={item.id}
            sx={{
              p: 2,
              borderBottom: '1px solid',
              borderColor: 'divider',
              minHeight: 80,
            }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mt: 0.5,
                p: '6px',
                backgroundColor: 'grey.100',
                borderRadius: 64,
              }}>
              {item.icon}
            </Box>
            <Stack sx={{ flex: 1 }} spacing={0.5}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="space-between"
                sx={{ height: '32px' }}>
                {item.appIcon}
                <Typography variant="caption" color="text.secondary">
                  {timeSince(item.time)}
                </Typography>
              </Stack>
              <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {item.description}
              </Typography>
            </Stack>
          </Stack>
        ))}
      </Stack>
    );
  }, []);

  // NTTs
  const nftsContent = useCreation(() => {
    if (!session) {
      return null;
    }

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
  }, [session]);

  // Tab 内容
  const tabContent = useCreation<Record<string, React.ReactNode>>(
    () => ({
      notifications: notificationsContent,
      nfts: nftsContent,
      settings: null,
      didSpaces: null,
    }),
    [notificationsContent, nftsContent],
  );

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
    <Box className="user-center" display="flex" flexDirection={isMobile ? 'column' : 'row'}>
      <Box className="user-center-tabs" flex="1" order={isMobile ? 2 : 'unset'}>
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
                  backgroundColor: `${theme.palette.divider} !important`,
                },
              },
            }}
          />
          {tabContent[currentTab]}
        </Box>
      </Box>
      {!isMobile && <Divider orientation="vertical" sx={{ borderColor: 'divider', ml: 4 }} />}
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
    </Box>
  );
}

export default function UserCenterSample() {
  return (
    <BlockletWrapper>
      <Header />
      <Box sx={{ margin: '0 auto', padding: '0 32px', minHeight: 768 }}>
        <UserCenter />
      </Box>
      <Footer />
    </BlockletWrapper>
  );
}
