import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { Route, Routes } from 'react-router-dom';
import theme from 'src/siteTheme';

import './components/layout.css';
// 导入您的页面组件
import HomePage from './pages/index';

// 假设您有这个组件

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* 添加更多路由 */}
        </Routes>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
