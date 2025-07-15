import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import {
  Group as GroupIcon,
  Language as LanguageIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import { Avatar, Box, Button, Container, Grid, Paper, Stack, Typography } from '@mui/material';

import BlockletWrapper from './Share/BlockletWrapper';
import Footer from './Share/Footer';
import Header from './Share/Header';

export default function LandingPage() {
  const { t } = useLocaleContext();

  const features = [
    {
      icon: <GroupIcon fontSize="large" color="primary" sx={{ color: 'text.primary' }} />,
      title: t('samples.website.features.collaboration.title'),
      description: t('samples.website.features.collaboration.description'),
    },
    {
      icon: <SpeedIcon fontSize="large" color="primary" sx={{ color: 'text.primary' }} />,
      title: t('samples.website.features.performance.title'),
      description: t('samples.website.features.performance.description'),
    },
    {
      icon: <SecurityIcon fontSize="large" color="primary" sx={{ color: 'text.primary' }} />,
      title: t('samples.website.features.security.title'),
      description: t('samples.website.features.security.description'),
    },
    {
      icon: <LanguageIcon fontSize="large" color="primary" sx={{ color: 'text.primary' }} />,
      title: t('samples.website.features.access.title'),
      description: t('samples.website.features.access.description'),
    },
  ];

  return (
    <BlockletWrapper>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Container component="main" sx={{ flexGrow: 1, py: { xs: 4, md: 8 } }}>
          {/* Hero Section */}
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 'bold',
              }}>
              {t('samples.website.hero.title')} <br />
              <Typography
                component="span"
                variant="h2"
                color="primary"
                sx={{
                  fontWeight: 'bold',
                }}>
                TeamSpace
              </Typography>
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                maxWidth: 'md',
                mx: 'auto',
              }}>
              {t('samples.website.hero.subtitle')}
            </Typography>
            <Stack
              direction="row"
              spacing={2}
              sx={{
                justifyContent: 'center',
                mt: 4,
              }}>
              <Button variant="contained" size="large">
                {t('samples.website.hero.cta.start')}
              </Button>
              <Button variant="outlined" size="large">
                {t('samples.website.hero.cta.demo')}
              </Button>
            </Stack>
          </Box>

          {/* Features Section */}
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontWeight: 'bold',
              }}>
              {t('samples.website.features.title')}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                mb: 4,
              }}>
              {t('samples.website.features.subtitle')}
            </Typography>
            <Grid container spacing={4}>
              {features.map((feature) => (
                <Grid
                  key={feature.title}
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 3,
                  }}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 4,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      backgroundColor: 'background.paper',
                    }}>
                    <Avatar sx={{ bgcolor: 'primary.light', mb: 2, width: 64, height: 64 }}>{feature.icon}</Avatar>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        fontWeight: 'bold',
                      }}>
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                      }}>
                      {feature.description}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Final CTA Section */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontWeight: 'bold',
              }}>
              {t('samples.website.finalCta.title')}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                mb: 4,
              }}>
              {t('samples.website.finalCta.subtitle')}
            </Typography>
            <Button variant="contained" size="large" color="secondary">
              {t('samples.website.finalCta.cta')}
            </Button>
          </Box>
        </Container>
        <Footer />
      </Box>
    </BlockletWrapper>
  );
}
