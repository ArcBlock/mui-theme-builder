import { Box, Button, Stack, Typography } from '@mui/material';

import BlockletWrapper from './Share/BlockletWrapper';
import Footer from './Share/Footer';
import Header from './Share/Header';

export default function LandingPage() {
  return (
    <BlockletWrapper>
      <Stack>
        <Header />
        <Box
          sx={{
            flexGrow: 1,
            padding: { xs: 2, md: 4 },
            minHeight: 300,
            backgroundColor: 'background.default',
          }}>
          {/* Heading Hierarchy */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h1">Main Page Title (h1)</Typography>
            <Typography variant="h2">Major Section Headers (h2)</Typography>
            <Typography variant="h3">Subsection Headers (h3)</Typography>
            <Typography variant="h4">Group Titles (h4)</Typography>
            <Typography variant="h5">Minor Headings (h5)</Typography>
            <Typography variant="h6">Small Section Labels (h6)</Typography>
          </Box>

          {/* Text Styles */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
              Text Styles
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              This is Body 1 text style, typically used for main paragraph content.
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              This is Body 2 text style, commonly used for secondary information or supplementary notes.
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1">Subtitle 1: Used for important subheadings</Typography>
              <Typography variant="subtitle2">Subtitle 2: Used for secondary subheadings</Typography>
            </Box>
          </Box>

          {/* Special Text Styles */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
              Special Text Styles
            </Typography>
            <Stack spacing={2}>
              <Typography variant="caption">Caption: Used for image captions or small hints</Typography>
              <Typography variant="overline">OVERLINE: Used for small uppercase labels</Typography>
              <Typography variant="button" component="div">
                BUTTON TEXT: Button text style
              </Typography>
            </Stack>
          </Box>

          {/* Interactive Elements */}
          <Box>
            <Typography variant="h4" sx={{ mb: 3 }}>
              Interactive Elements
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <Button variant="contained" color="primary">
                Primary Button
              </Button>
              <Button variant="contained" color="secondary">
                Secondary Button
              </Button>
              <Button variant="outlined" color="primary">
                Outlined Button
              </Button>
              <Button variant="text" color="primary">
                Text Button
              </Button>
            </Stack>
          </Box>
        </Box>
        <Footer />
      </Stack>
    </BlockletWrapper>
  );
}
