/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */
import { LocaleProvider } from '@arcblock/ux/lib/Locale/context';
import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider, Theme, ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { translations } from 'src/locales';
import theme from 'src/siteTheme';

import './layout.css';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

interface LayoutProps {
  children: React.ReactNode;
}

// 移除 Gatsby 相关代码，简化为纯 React 组件
function Layout({ children }: LayoutProps) {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocaleProvider locale="en" translations={translations}>
          {children}
        </LocaleProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default Layout;
