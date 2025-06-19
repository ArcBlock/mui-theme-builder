import { Box } from '@mui/material';
import Editor from 'src/components/Editor/Editor';
import ErrorBoundary from 'src/components/ErrorBoundary';
import Header from 'src/components/Header';
import Layout from 'src/components/Layout';
import MainWindow from 'src/components/MainWindow';

function IndexPage() {
  return (
    <Layout>
      <ErrorBoundary>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}>
          <Header />
          <Box
            sx={{
              display: 'flex',
              flexGrow: 1,
              minHeight: 0,
              overflow: 'hidden',
              backgroundColor: 'background.default',
            }}>
            {/* 编辑区 */}
            <Box sx={{ flex: '1 0', overflowY: 'auto', overflowX: 'hidden' }}>
              <Editor />
            </Box>
            {/* 预览区 */}
            <Box sx={{ flex: '1 0', overflowY: 'auto', overflowX: 'hidden' }}>
              <MainWindow />
            </Box>
          </Box>
        </Box>
      </ErrorBoundary>
    </Layout>
  );
}

export default IndexPage;
