// 替换为 MUI Icons
import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import PaletteIcon from '@mui/icons-material/Palette';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import TuneIcon from '@mui/icons-material/Tune';
import { Box } from '@mui/material';
import { useState } from 'react';
import useMobile from 'src/hooks/useMobile';

import ColorsSection from './ColorsSection';
import StylesSection from './StylesSection';
import TypographySection from './TypographySection';

export default function Editor() {
  const { t } = useLocaleContext();
  const isMobile = useMobile();
  const [activeTab, setActiveTab] = useState<'concepts' | 'colors' | 'fonts' | 'styles' | null>(null);

  const TABS = [
    { key: 'colors', label: t('editor.colorSection.title'), icon: <PaletteIcon /> },
    { key: 'fonts', label: t('editor.typographySection.title'), icon: <TextFieldsIcon /> },
    { key: 'styles', label: t('editor.stylesSection.title'), icon: <TuneIcon /> },
  ];

  const handleTabClick = (tabKey: 'concepts' | 'colors' | 'fonts' | 'styles') => {
    if (activeTab === tabKey) {
      setActiveTab(null); // 点击当前激活的 tab，隐藏 section
    } else {
      setActiveTab(tabKey); // 点击其他 tab，显示对应的 section
    }
  };

  const handleOverlayClick = () => {
    setActiveTab(null); // 点击遮罩层，隐藏 section
  };

  if (isMobile) {
    return (
      <>
        {/* 移动端 Section Container */}
        {activeTab !== null && (
          <Box
            className="hide-scrollbar"
            sx={{
              position: 'absolute',
              p: 2,
              left: 0,
              right: 0,
              bottom: '48px',
              height: '50%',
              backgroundColor: 'background.paper',
              zIndex: 2,
              overflowY: 'auto',
            }}>
            {activeTab === 'colors' && <ColorsSection />}
            {activeTab === 'fonts' && <TypographySection />}
            {activeTab === 'styles' && <StylesSection />}
          </Box>
        )}

        {/* 遮罩层 - 当 section 显示时覆盖在预览区域上 */}
        {activeTab !== null && (
          <Box
            onClick={handleOverlayClick}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: '48px',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              zIndex: 1,
            }}
          />
        )}

        {/* 底部 Tabbar */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '48px',
            backgroundColor: 'background.paper',
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            zIndex: 3,
          }}>
          {TABS.map((item) => (
            <Box
              key={item.key}
              onClick={() => handleTabClick(item.key as any)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                height: '100%',
                cursor: 'pointer',
                color: activeTab === item.key ? 'primary.main' : 'text.secondary',
                backgroundColor: activeTab === item.key ? 'action.selected' : 'transparent',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: activeTab === item.key ? 'action.focus' : 'action.hover',
                },
                '& .MuiSvgIcon-root': {
                  fontSize: '20px',
                  mb: 0.25,
                },
                '& span': {
                  fontSize: '11px',
                  fontWeight: activeTab === item.key ? 'medium' : 'normal',
                  lineHeight: 1,
                },
              }}>
              {item.icon}
              <span>{item.label}</span>
            </Box>
          ))}
        </Box>
      </>
    );
  }

  return (
    <Box className="editor-sections" sx={{ flex: 1, p: 2 }}>
      <ColorsSection />
      <TypographySection />
      <StylesSection />
    </Box>
  );
}
