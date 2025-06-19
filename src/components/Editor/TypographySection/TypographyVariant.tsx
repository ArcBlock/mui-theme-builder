import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Box,
  Button,
  Collapse,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useThemeStore } from 'src/state/themeStore';

interface TypographyVariantProps {
  variant:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'body1'
    | 'body2'
    | 'subtitle1'
    | 'subtitle2'
    | 'button'
    | 'caption'
    | 'overline';
}

function TypographyVariant({ variant }: TypographyVariantProps) {
  const { t } = useLocaleContext();
  const currentConcept = useThemeStore((s) => {
    const { concepts } = s;
    const { currentConceptId } = s;
    return concepts.find((c) => c.id === currentConceptId);
  });
  const mode = useThemeStore((s) => s.mode);
  const updateThemeOptions = useThemeStore((s) => s.updateThemeOptions);

  const [expanded, setExpanded] = useState(false);
  const [fontFamily, setFontFamily] = useState('');
  const [fontSize, setFontSize] = useState('');
  const [fontWeight, setFontWeight] = useState('');
  const [lineHeight, setLineHeight] = useState('');
  const [letterSpacing, setLetterSpacing] = useState('');

  // 获取当前字体设置
  const getCurrentTypography = () => {
    if (!currentConcept) return null;

    const themeOptions = currentConcept.themeOptions[mode];
    if (!themeOptions?.typography) return null;

    return themeOptions.typography[variant] || {};
  };

  const currentTypography = getCurrentTypography();

  const handleSave = () => {
    if (!currentConcept) return;

    const newThemeOptions = { ...currentConcept.themeOptions };
    if (!newThemeOptions[mode]) {
      newThemeOptions[mode] = {};
    }
    if (!newThemeOptions[mode].typography) {
      newThemeOptions[mode].typography = {};
    }

    newThemeOptions[mode].typography[variant] = {
      ...currentTypography,
      ...(fontFamily && { fontFamily }),
      ...(fontSize && { fontSize }),
      ...(fontWeight && { fontWeight }),
      ...(lineHeight && { lineHeight }),
      ...(letterSpacing && { letterSpacing }),
    };

    updateThemeOptions(newThemeOptions);
  };

  const handleReset = () => {
    setFontFamily('');
    setFontSize('');
    setFontWeight('');
    setLineHeight('');
    setLetterSpacing('');
  };

  return (
    <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
      {/* 标题栏 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 1,
          backgroundColor: 'background.paper',
          cursor: 'pointer',
        }}
        onClick={() => setExpanded(!expanded)}>
        <Typography variant="body2" fontWeight={500}>
          {t(`editor.${variant}`)}
        </Typography>
        <IconButton size="small">{expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
      </Box>

      {/* 展开内容 */}
      <Collapse in={expanded}>
        <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* 字体族 */}
            <TextField
              label={t('editor.fontFamily')}
              size="small"
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              placeholder={currentTypography?.fontFamily || 'inherit'}
            />

            {/* 字体大小 */}
            <TextField
              label={t('editor.fontSize')}
              size="small"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              placeholder={currentTypography?.fontSize || 'inherit'}
            />

            {/* 字体粗细 */}
            <FormControl size="small">
              <InputLabel>{t('editor.fontWeight')}</InputLabel>
              <Select value={fontWeight} label={t('editor.fontWeight')} onChange={(e) => setFontWeight(e.target.value)}>
                <MenuItem value="">{t('editor.inherit')}</MenuItem>
                <MenuItem value="100">100</MenuItem>
                <MenuItem value="200">200</MenuItem>
                <MenuItem value="300">300</MenuItem>
                <MenuItem value="400">400</MenuItem>
                <MenuItem value="500">500</MenuItem>
                <MenuItem value="600">600</MenuItem>
                <MenuItem value="700">700</MenuItem>
                <MenuItem value="800">800</MenuItem>
                <MenuItem value="900">900</MenuItem>
              </Select>
            </FormControl>

            {/* 行高 */}
            <TextField
              label={t('editor.lineHeight')}
              size="small"
              value={lineHeight}
              onChange={(e) => setLineHeight(e.target.value)}
              placeholder={currentTypography?.lineHeight || 'inherit'}
            />

            {/* 字母间距 */}
            <TextField
              label={t('editor.letterSpacing')}
              size="small"
              value={letterSpacing}
              onChange={(e) => setLetterSpacing(e.target.value)}
              placeholder={currentTypography?.letterSpacing || 'inherit'}
            />

            {/* 操作按钮 */}
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Button size="small" onClick={handleReset}>
                {t('editor.reset')}
              </Button>
              <Button size="small" variant="contained" onClick={handleSave}>
                {t('concept.confirm')}
              </Button>
            </Box>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
}

export default TypographyVariant;
