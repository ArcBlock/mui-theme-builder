import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import { Close, Search } from '@mui/icons-material';
import GoogleIcon from '@mui/icons-material/Google';
import {
  Box,
  CircularProgress,
  Drawer,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useState } from 'react';
import { useThemeStore } from 'src/state/themeStore';

import { ButtonShuffle } from '../Common/ButtonShuffle';
import useGoogleFonts from './hooks/useGoogleFonts';

interface TypographyEditDrawerProps {
  open: boolean;
  variant: string | null;
  onClose: () => void;
}

function TypographyEditDrawer({ open, variant, onClose }: TypographyEditDrawerProps) {
  const { t } = useLocaleContext();
  const themeObject = useThemeStore((s) => s.themeObject);
  const isMobile = useMediaQuery(themeObject.breakpoints.down('md'));
  const [searchQuery, setSearchQuery] = useState('');
  const { fonts, loading } = useGoogleFonts(searchQuery);
  const addFonts = useThemeStore((s) => s.addFonts);
  const setThemeOption = useThemeStore((s) => s.setThemeOption);
  const activeFont =
    // @ts-ignore $FixMe
    variant === 'base' ? themeObject.typography.fontFamily : (themeObject.typography as any)[variant]?.fontFamily;

  const handleFontSelect = (fontFamily: string) => {
    if (variant) {
      addFonts([fontFamily]);
      if (variant === 'base') {
        setThemeOption(`typography.fontFamily`, `"${fontFamily}", "Roboto", "Helvetica", "Arial", sans-serif`);
      } else {
        setThemeOption(
          `typography.${variant}.fontFamily`,
          `"${fontFamily}", "Roboto", "Helvetica", "Arial", sans-serif`,
        );
      }
    }

    onClose();
  };

  const drawerContent = (
    <Stack sx={{ p: 2, width: isMobile ? 'auto' : 320, height: '100%' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
          {variant}
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Stack>

      <TextField
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
          endAdornment: searchQuery ? (
            <IconButton size="small" onClick={() => setSearchQuery('')}>
              <Close />
            </IconButton>
          ) : null,
        }}
      />

      {/* <Typography variant="body2" color="text.secondary">
        {fonts.length} results
      </Typography> */}

      <Stack spacing={1} sx={{ flex: 1, overflowY: 'auto', mt: 2, mb: 2 }}>
        {loading ? (
          <CircularProgress sx={{ alignSelf: 'center' }} />
        ) : (
          fonts.map((font) => (
            <Paper
              key={font.family}
              variant="outlined"
              onClick={() => handleFontSelect(font.family)}
              sx={{
                p: 1.5,
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                '&:hover': {
                  borderColor: 'grey.700',
                },
              }}>
              <Box>
                <Typography sx={{ fontFamily: font.family, fontSize: '1.2rem' }}>
                  The five boxing wizards jump quickly together
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                  <GoogleIcon sx={{ fontSize: '14px', color: 'text.secondary' }} />
                  <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>{font.family}</Typography>
                  <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
                    {font.family.split(',')[1]}
                  </Typography>
                </Stack>
              </Box>
              {/* <IconButton size="small">
                <ThumbUpOutlined />
              </IconButton> */}
            </Paper>
          ))
        )}
      </Stack>

      <Box>
        <ButtonShuffle />
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
          Active font: {activeFont?.split(',')[0].replace(/"/g, '')}
        </Typography>
      </Box>
    </Stack>
  );

  return (
    <Drawer
      anchor={isMobile ? 'bottom' : 'left'}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { height: { xs: '80vh', md: '100%' } } }}>
      {drawerContent}
    </Drawer>
  );
}

export default TypographyEditDrawer;
