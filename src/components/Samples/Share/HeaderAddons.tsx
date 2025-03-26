import { SessionContext } from '@arcblock/did-connect/lib/Session';
import LocaleSelector from '@arcblock/ux/lib/Locale/selector';
import { ItemOptions } from '@arcblock/ux/lib/NavMenu/nav-menu';
import SessionBlocklet from '@arcblock/ux/lib/SessionBlocklet';
import SessionUser from '@arcblock/ux/lib/SessionUser';
import NotificationAddon from '@blocklet/ui-react/lib/common/notification-addon';
import { useContext } from 'react';

export default function HeaderAddons() {
  // @ts-ignore
  const { session } = useContext(SessionContext);
  const locale = 'en';
  const menu: ItemOptions[] = [];

  if (!session) return null;

  return (
    <>
      <NotificationAddon key="notification-addon" session={session} />
      <LocaleSelector key="locale-selector" showText={false} />
      <SessionBlocklet key="session-blocklet" session={session} locale={locale} />
      {/* @ts-ignore */}
      <SessionUser key="session-user" session={session} locale={locale} menu={menu} showRole />
    </>
  );
}
