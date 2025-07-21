import { OAuthProvider } from '@arcblock/did-connect/lib/OAuth/context';
import { PasskeyContext } from '@arcblock/did-connect/lib/Passkey';
import { SessionContext } from '@arcblock/did-connect/lib/Session';
import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import { useCreation } from 'ahooks';
import noop from 'lodash/noop';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import './mock-backend';

const mockSession = {
  login: noop,
  logout: noop,
  refresh: noop,
  switch: noop,
  switchDid: noop,
  switchProfile: noop,
  switchPassport: noop,
  bindWallet: noop,
  user: {
    did: 'z1exXZY2A7G4JuYv3AMzjCmioyQGQ4y3wtu',
    fullName: 'Foo',
    role: 'owner',
    lastLoginAt: new Date(Date.now() - 60 * 1000).toISOString(),
    lastLoginIp: '192.168.1.100',
    createdAt: new Date(Date.now() - 2 * 30 * 24 * 60 * 60 * 1000).toISOString(),
    sourceProvider: 'wallet', // wallet, auth0, email, apple, github, google, nft, passkey
    login: noop,
    logout: noop,
    refresh: noop,
    switch: noop,
    switchDid: noop,
    switchProfile: noop,
    switchPassport: noop,
    bindWallet: noop,
  },
  didSpace: {
    did: 'zNKuiSAJ5Kx2rcaoxnNRWEQxupojK7Xni625',
    name: 'Test DID Space',
    url: 'https://test.com',
    endpoint: 'https://test.com',
  },
  useDid: () => {
    return { walletDid: 'z1exXZY2A7G4JuYv3AMzjCmioyQGQ4y3wtu' };
  },
  useOAuth: () => {
    return {
      logoutOAuth: noop,
      bindOAuth: noop,
      configs: {},
      switchOAuthPassport: noop,
    };
  },
  usePasskey: () => {
    return {
      switchPassport: noop,
    };
  },
  getUserSessions: () => [],
};

// @ts-ignore
if (!window.blocklet) {
  // @ts-ignore mock window.blocklet
  window.blocklet = {
    did: 'zNKuiSAJ5Kx2rcaoxnNRWEQxupojK7Xni625',
    appId: 'zNKuiSAJ5Kx2rcaoxnNRWEQxupojK7Xni625',
    languages: [
      { code: 'en', name: 'English' },
      { code: 'zh', name: '简体中文' },
    ],
  };
}

export default function SessionWrapper({ children }: { children: React.ReactNode }) {
  const [sessionCtx, setSessionCtx] = useState<{ session: Record<string, any> }>({} as any);
  const { locale } = useLocaleContext();
  const passkeyCtx = useCreation(() => {
    return {
      locale,
      connectPasskey: noop,
      disconnectPasskey: noop,
      createPasskey: noop,
      verifyPasskey: noop,
      loginPasskey: noop,
      logoutPasskey: noop,
      switchPassport: noop,
      baseUrl: '',
      setBaseUrl: noop,
      passkeyState: {
        user: null,
        loading: false,
        creating: false,
        verifying: false,
        creatingStatus: '',
        verifyingStatus: '',
        error: '',
        email: '',
        code: '',
        verified: false,
        sent: false,
        openDialog: false,
      },
      disconnecting: false,
      connecting: false,
      t: noop,
    };
  }, [locale]);

  useEffect(() => {
    setTimeout(() => {
      setSessionCtx({ session: mockSession });
    }, 10);
  }, []);

  return (
    <SessionContext.Provider value={sessionCtx}>
      <PasskeyContext.Provider value={passkeyCtx}>
        <OAuthProvider>
          <Router>{children}</Router>
        </OAuthProvider>
      </PasskeyContext.Provider>
    </SessionContext.Provider>
  );
}
