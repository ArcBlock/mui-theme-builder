import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { IconButton, Paper, Stack, Typography } from '@mui/material';
import { useMemoizedFn } from 'ahooks';
import { useMemo } from 'react';
import { DEFAULT_FONT_STRING, HEADING_VARIANTS, defaultDarkTheme, defaultLightTheme } from 'src/constants';
import { useThemeBuilder } from 'src/context/themeBuilder';
import useGoogleFonts from 'src/hooks/useGoogleFonts';
import useMobile from 'src/hooks/useMobile';
import { TextVariant } from 'src/types/theme';

import { DEFAULT_SHUFFLE_COLOR } from '../Common/ButtonShuffle';
import { IconButtonLock } from '../Common/IconButtonLock';
import { IconButtonShuffle } from '../Common/IconButtonShuffle';

interface TypographyBlockProps {
  variant: TextVariant;
  onClick: () => void;
}

function TypographyBlock({ variant, onClick }: TypographyBlockProps) {
  const { t } = useLocaleContext();
  const themeObject = useThemeBuilder((s) => s.themeObject);
  const isMobile = useMobile();
  const { shuffleFonts } = useGoogleFonts({ category: 'All', searchQuery: '' });
  const removeThemeOption = useThemeBuilder((s) => s.removeThemeOption);
  const removeThemeOptions = useThemeBuilder((s) => s.removeThemeOptions);
  const setFontLock = useThemeBuilder((s) => s.setFontLock);
  const isLocked = useThemeBuilder((s) => s.getCurrentConcept().editor.typography[variant]?.isLocked ?? false);
  const setFontOptions = useThemeBuilder((s) => s.setFontOptions);

  const actions = useMemo(() => {
    const isDark = themeObject.palette.mode === 'dark';

    if (variant === 'heading') {
      return {
        getFontFamily: () => themeObject.typography.h1.fontFamily,
        getDefaultFontFamily: () =>
          isDark ? defaultDarkTheme.typography.h1.fontFamily : defaultLightTheme.typography.h1.fontFamily,
        resetFontFamily: () => {
          // body 也是 default，则可以移除 heading 的 fontFamily
          if (themeObject.typography.fontFamily === DEFAULT_FONT_STRING) {
            removeThemeOptions(HEADING_VARIANTS.map((v) => `typography.${v}.fontFamily`));
          } else {
            // 否则需要设置
            setFontOptions({ heading: { fontFamily: DEFAULT_FONT_STRING } });
          }
        },
        getLabel: () => t('editor.typographySection.heading'),
      };
    }

    // body
    return {
      getFontFamily: () => themeObject.typography.fontFamily,
      getDefaultFontFamily: () =>
        isDark ? defaultDarkTheme.typography.fontFamily : defaultLightTheme.typography.fontFamily,
      resetFontFamily: () => removeThemeOption('typography.fontFamily'),
      getLabel: () => t('editor.typographySection.body'),
    };
  }, [variant, themeObject, removeThemeOption, removeThemeOptions, setFontOptions, t]);

  const fontFamily = actions.getFontFamily();
  const defaultFontFamily = actions.getDefaultFontFamily();

  const handleReset = useMemoizedFn((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    actions.resetFontFamily();
  });

  const toggleLock = useMemoizedFn((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setFontLock(variant, !isLocked);
  });

  const handleShuffle = useMemoizedFn((e) => {
    e.stopPropagation();
    const result = shuffleFonts(variant);
    setFontOptions({ [variant]: { fontFamily: result[variant]!.f } });
  });

  return (
    <Paper
      variant="outlined"
      onClick={onClick}
      sx={{
        position: 'relative',
        p: 2,
        height: '100%',
        cursor: 'pointer',
        '& .action': {
          opacity: isMobile ? 1 : 0,
          transition: 'opacity 0.2s',
          '&.is-locked': {
            opacity: 1,
          },
        },
        '&:hover': {
          borderColor: 'primary.main',
          '& .action': {
            opacity: 1,
          },
        },
      }}>
      <Stack
        direction="row"
        sx={{
          position: 'absolute',
          top: 12,
          right: 4,
        }}>
        {/* Reset Icon */}
        {fontFamily !== defaultFontFamily && (
          <IconButton className="action" title={t('editor.reset')} onClick={handleReset}>
            <RestartAltIcon sx={{ fontSize: 20 }} />
          </IconButton>
        )}
        {/* Shuffle Icon */}
        <IconButtonShuffle color={DEFAULT_SHUFFLE_COLOR} onClick={handleShuffle} />
        {/* Lock Icon */}
        <IconButtonLock lock={isLocked} onClick={toggleLock} />
      </Stack>
      <Stack spacing={1}>
        <Typography
          variant="subtitle1"
          sx={{
            color: 'text.primary',
            textTransform: 'capitalize',
          }}>
          {actions.getLabel()}
        </Typography>
        <Typography variant={variant as any} sx={{ fontFamily, fontSize: '32px' }}>
          {fontFamily?.split(',')[0].replace(/"/g, '')}
        </Typography>
      </Stack>
    </Paper>
  );
}

export default TypographyBlock;
