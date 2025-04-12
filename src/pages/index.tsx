import { Box } from '@mui/material';
import ErrorBoundary from 'src/components/ErrorBoundary';
import Header from 'src/components/Header';
import Layout from 'src/components/Layout';
import MainWindow from 'src/components/MainWindow';
import ThemeConfigDrawer from 'src/components/ThemeConfigDrawer';

function IndexPage() {
  return (
    <Layout>
      <Box
        sx={{
          display: 'flex',
          height: '100%',
        }}>
        <ErrorBoundary>
          <ThemeConfigDrawer />
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
            }}>
            <Header />
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                minHeight: 0,
              }}>
              <Box
                component="main"
                sx={{
                  minWidth: 0,
                  minHeight: 0,
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                <MainWindow />
              </Box>
            </Box>
          </Box>
        </ErrorBoundary>
      </Box>
    </Layout>
  );
}

export default IndexPage;
