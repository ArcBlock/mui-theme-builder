import { Box, Stack } from '@mui/material';

import BlockletWrapper from './Share/BlockletWrapper';
import Footer from './Share/Footer';
import Header from './Share/Header';

export default function LandingPage() {
  return (
    <BlockletWrapper>
      <Stack bgcolor="#fff">
        <Header />
        <Box sx={{ flexGrow: 1, padding: 4, minHeight: 300, backgroundColor: '#F8F8F8' }} />
        <Footer />
      </Stack>
    </BlockletWrapper>
  );
}
