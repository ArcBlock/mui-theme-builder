import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import { Close, RestartAlt } from '@mui/icons-material';
import { Box, Button, Drawer, IconButton, Slider, Stack, Theme, Typography } from '@mui/material';
import { useMemoizedFn, useReactive } from 'ahooks';
import { useMemo } from 'react';
import { defaultLightTheme } from 'src/constants';
import { BODY_VARIANTS, HEADING_VARIANTS } from 'src/constants';
import { useThemeBuilder } from 'src/context/themeBuilder';
import useHtmlFontSize from 'src/hooks/useHtmlFontSize';
import useMobile from 'src/hooks/useMobile';
import { remToPx } from 'src/utils';

type HeadingVariant = (typeof HEADING_VARIANTS)[number];
type TypographyVariant = 'body' | HeadingVariant;

// 获取 MUI 主题中的字体大小
const getThemeFontSizes = (theme: Theme, htmlFontSize: number) => {
  return {
    body: theme.typography.fontSize,
    ...HEADING_VARIANTS.reduce(
      (acc, variant) => {
        let value = theme.typography[variant]!.fontSize;

        if (typeof value === 'string') {
          if (value.endsWith('rem')) {
            value = remToPx(parseFloat(value), theme.typography.fontSize, theme.typography.htmlFontSize, htmlFontSize);
          } else {
            value = parseFloat(value);
          }
        }

        acc[variant] = value || theme.typography.fontSize;
        return acc;
      },
      {} as Record<HeadingVariant, number>,
    ),
  };
};

// 字体大小配置
const FONT_SIZE_CONFIG = {
  min: 10,
  max: 64,
  step: 1,
} as const;

export interface FontSizeDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function FontSizeDrawer({ open, onClose }: FontSizeDrawerProps) {
  const { t } = useLocaleContext();
  const setThemeOptions = useThemeBuilder((s) => s.setThemeOptions);
  const removeThemeOptions = useThemeBuilder((s) => s.removeThemeOptions);
  const themeObject = useThemeBuilder((s) => s.themeObject);
  const isMobile = useMobile();
  const htmlFontSize = useHtmlFontSize();

  const sizes = useReactive<Record<TypographyVariant, number>>(getThemeFontSizes(themeObject, htmlFontSize));
  const defaultSizes = useMemo<Record<TypographyVariant, number>>(
    () => getThemeFontSizes(defaultLightTheme, htmlFontSize),
    [htmlFontSize],
  );

  // 滑块改变
  const handleSizeChange = useMemoizedFn((variant: TypographyVariant, size: number) => {
    sizes[variant] = size;
  });

  // 修改主题
  const handleSliderChangeCommitted = useMemoizedFn((variant: TypographyVariant, size: number) => {
    if (variant === 'body') {
      if (size === defaultSizes.body) {
        removeThemeOptions(['typography.fontSize'].concat(BODY_VARIANTS.map((v) => `typography.${v}.fontSize`)));
      } else {
        setThemeOptions(
          [{ path: 'typography.fontSize', value: size }].concat(
            BODY_VARIANTS.map((v) => ({ path: `typography.${v}.fontSize`, value: size })),
          ),
        );
      }
    } else if (size === defaultSizes[variant]) {
      removeThemeOptions([`typography.${variant}.fontSize`]);
    } else {
      setThemeOptions([{ path: `typography.${variant}.fontSize`, value: `${size}px` }]);
    }
  });

  // 重置单个字体大小
  const handleResetSize = (variant: TypographyVariant) => {
    const defaultSize = defaultSizes[variant];
    sizes[variant] = defaultSize;

    if (variant === 'body') {
      removeThemeOptions(['typography.fontSize'].concat(BODY_VARIANTS.map((v) => `typography.${v}.fontSize`)));
    } else {
      removeThemeOptions([`typography.${variant}.fontSize`]);
    }
  };

  // 重置所有字体大小
  const handleResetAll = () => {
    const allPaths = HEADING_VARIANTS.map((variant) => `typography.${variant}.fontSize`)
      .concat('typography.fontSize')
      .concat(BODY_VARIANTS.map((v) => `typography.${v}.fontSize`));

    Object.assign(sizes, defaultSizes);
    removeThemeOptions(allPaths);
  };

  // 渲染字体大小设置项
  const renderFontSizeItem = (variant: TypographyVariant) => {
    const currentSize = sizes[variant];

    return (
      <Stack key={variant} spacing={1} sx={{ mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          {/* 标题 */}
          <Typography sx={{ fontWeight: 500, minWidth: 80, textTransform: 'capitalize' }}>{variant}</Typography>
          {/* 重置 */}
          <IconButton size="small" onClick={() => handleResetSize(variant)} sx={{ color: 'text.secondary' }}>
            <RestartAlt sx={{ fontSize: 16 }} />
          </IconButton>
        </Stack>
        {/* 描述 */}
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 12, lineHeight: 1.3 }}>
          {t(`editor.typographySection.fontSizeDescriptions.${variant}`)}
        </Typography>
        {/* 滑块 */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            px: 1,
          }}>
          <Slider
            value={currentSize}
            min={FONT_SIZE_CONFIG.min}
            max={FONT_SIZE_CONFIG.max}
            step={FONT_SIZE_CONFIG.step}
            onChange={(_, value) => handleSizeChange(variant, value as number)}
            onChangeCommitted={(_, value) => handleSliderChangeCommitted(variant, value as number)}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${value}px`}
            sx={{
              '& .MuiSlider-thumb': {
                width: 16,
                height: 16,
              },
              '& .MuiSlider-track': {
                height: 3,
              },
              '& .MuiSlider-rail': {
                height: 3,
              },
              '&::before': {
                content: '""',
                height: 5,
                width: '10px',
                backgroundColor: 'primary.main',
                position: 'absolute',
                top: '50%',
                left: '-8px',
                borderRadius: '16px',
                transform: 'translateY(-50%)',
              },
            }}
          />
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: 14, minWidth: 48, textAlign: 'right' }}>
            {currentSize}px
          </Typography>
        </Stack>
      </Stack>
    );
  };

  const drawerContent = (
    <Stack sx={{ p: 2, width: isMobile ? 'auto' : 400, height: '100%' }}>
      {/* 标题栏 */}
      <Stack
        direction="row"
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}>
        <Typography sx={{ fontSize: 18, fontWeight: 500 }}>{t('editor.typographySection.fontSize')}</Typography>
        <IconButton onClick={onClose}>
          <Close sx={{ fontSize: 20 }} />
        </IconButton>
      </Stack>
      {/* 字体大小设置 */}
      <Box className="hide-scrollbar" sx={{ flex: 1, overflow: 'auto' }}>
        {['body', ...HEADING_VARIANTS].map((variant) => renderFontSizeItem(variant as TypographyVariant))}
      </Box>
      {/* 重置所有按钮 */}
      <Button
        variant="outlined"
        color="inherit"
        size="small"
        onClick={handleResetAll}
        startIcon={<RestartAlt />}
        sx={{ mt: 1, borderColor: 'divider' }}>
        {t('editor.typographySection.resetAllSizes')}
      </Button>
    </Stack>
  );

  return (
    <Drawer
      anchor={isMobile ? 'bottom' : 'left'}
      open={open}
      onClose={onClose}
      slotProps={{
        paper: { sx: { height: { xs: '60vh', md: '100%' } } },
        backdrop: { sx: { backgroundColor: 'transparent' } },
      }}>
      {drawerContent}
    </Drawer>
  );
}
