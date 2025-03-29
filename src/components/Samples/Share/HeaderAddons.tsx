import { SessionContext } from '@arcblock/did-connect/lib/Session';
import NotificationsOutlinedIcon from '@arcblock/icons/lib/Notification';
import LocaleSelector from '@arcblock/ux/lib/Locale/selector';
import { ItemOptions } from '@arcblock/ux/lib/NavMenu/nav-menu';
import SessionUser from '@arcblock/ux/lib/SessionUser';
import { IconButton } from '@mui/material';
import { useContext } from 'react';

export default function HeaderAddons() {
  // @ts-ignore
  const { session } = useContext(SessionContext);
  const locale = 'en';
  const menu: ItemOptions[] = [];

  if (!session) return null;

  return (
    <>
      <IconButton key="notification-addon" size="medium">
        <NotificationsOutlinedIcon style={{ width: 'auto', height: 24 }} />
      </IconButton>
      <LocaleSelector key="locale-selector" showText={false} />
      {/* @ts-ignore */}
      <SessionUser key="session-user" session={session} locale={locale} menu={menu} showRole />
    </>
  );
}
