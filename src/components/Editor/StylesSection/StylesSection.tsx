import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import { Box, FormControl, InputLabel, MenuItem, Select, Slider, TextField, Typography } from '@mui/material';
import { useThemeStore } from 'src/state/themeStore';

function StylesSection() {
  const { t } = useLocaleContext();
  const currentConcept = useThemeStore((s) => {
    const { concepts } = s;
    const { currentConceptId } = s;
    return concepts.find((c) => c.id === currentConceptId);
  });
  const mode = useThemeStore((s) => s.mode);
  const updateThemeOptions = useThemeStore((s) => s.updateThemeOptions);

  // 获取当前样式设置
  const getCurrentStyles = () => {
    if (!currentConcept) return {};

    const themeOptions = currentConcept.themeOptions[mode];
    return {
      borderRadius: themeOptions?.shape?.borderRadius || 4,
      // 可以添加更多样式设置
    };
  };

  const currentStyles = getCurrentStyles();

  const handleBorderRadiusChange = (value: number | number[]) => {
    if (!currentConcept) return;

    const newThemeOptions = { ...currentConcept.themeOptions };
    if (!newThemeOptions[mode]) {
      newThemeOptions[mode] = {};
    }
    if (!newThemeOptions[mode].shape) {
      newThemeOptions[mode].shape = {};
    }

    newThemeOptions[mode].shape.borderRadius = Array.isArray(value) ? value[0] : value;
    updateThemeOptions(newThemeOptions);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* 圆角设置 */}
      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {t('editor.borderRadius')}
        </Typography>
        <Slider
          value={currentStyles.borderRadius}
          onChange={(e, value) => handleBorderRadiusChange(value)}
          min={0}
          max={24}
          step={1}
          marks
          valueLabelDisplay="auto"
          size="small"
        />
        <Typography variant="caption" color="text.secondary">
          {currentStyles.borderRadius}px
        </Typography>
      </Box>

      {/* 主题偏好设置 */}
      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {t('editor.themePrefer')}
        </Typography>
        <FormControl fullWidth size="small">
          <InputLabel>{t('editor.themePrefer')}</InputLabel>
          <Select
            value={mode}
            label={t('editor.themePrefer')}
            onChange={(e) => {
              // 这里可以添加主题偏好切换逻辑
              console.log('Theme preference changed:', e.target.value);
            }}>
            <MenuItem value="light">{t('editor.lightMode')}</MenuItem>
            <MenuItem value="dark">{t('editor.darkMode')}</MenuItem>
            <MenuItem value="system">{t('editor.systemPrefer')}</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* 可以添加更多样式设置 */}
      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {t('editor.customStyles')}
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder={t('editor.customStylesPlaceholder')}
          size="small"
          variant="outlined"
        />
      </Box>
    </Box>
  );
}

export default StylesSection;
