import { Box } from '@mui/material';
import Editor from 'src/components/Editor/Editor';
import ErrorBoundary from 'src/components/ErrorBoundary';
import Header from 'src/components/Header';
import Layout from 'src/components/Layout';
import PreviewWindow from 'src/components/Preview/PreviewWindow';
import useMobile from 'src/hooks/useMobile';

function IndexPage() {
  const isMobile = useMobile();

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
              pb: isMobile ? '48px' : 0,
              position: isMobile ? 'relative' : 'static',
            }}>
            {!isMobile && (
              <Box
                className="hide-scrollbar"
                sx={{ maxWidth: '800px', flex: '1 0', overflowY: 'auto', overflowX: 'hidden' }}>
                {/* 编辑区 */}
                <Editor />
              </Box>
            )}
            <Box className="hide-scrollbar" sx={{ flex: '1 0', overflowY: 'auto', overflowX: 'hidden' }}>
              {/* 预览区 */}
              <PreviewWindow />
            </Box>
          </Box>
          {/* 编辑区 */}
          {isMobile && <Editor />}
        </Box>
      </ErrorBoundary>
    </Layout>
  );
}

export default IndexPage;
