// 替换为 MUI Icons
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PaletteIcon from '@mui/icons-material/Palette';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import TuneIcon from '@mui/icons-material/Tune';
import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import { Box } from '@mui/material';
import { useState } from 'react';

import useIsMobile from '../../hooks/useIsMobile';
import ColorsSection from './ColorsSection';
import ConceptsSection from './ConceptsSection';
import StylesSection from './StylesSection';
import TypographySection from './TypographySection';

export default function Editor() {
  const { t } = useLocaleContext();
  const isMobile = useIsMobile();
  const [tab, setTab] = useState<'concepts' | 'colors' | 'fonts' | 'styles'>('colors');

  const TABS = [
    { key: 'concepts', label: t('editor.concepts'), icon: <MoreVertIcon /> },
    { key: 'colors', label: t('editor.colors'), icon: <PaletteIcon /> },
    { key: 'fonts', label: t('editor.typography'), icon: <TextFieldsIcon /> },
    { key: 'styles', label: t('editor.styles'), icon: <TuneIcon /> },
  ];

  if (isMobile) {
    return (
      <Box className="editor-mobile-root">
        {tab === 'concepts' && <ConceptsSection />}
        {tab === 'colors' && <ColorsSection />}
        {tab === 'fonts' && <TypographySection />}
        {tab === 'styles' && <StylesSection />}
        <Box className="editor-mobile-tabbar">
          {TABS.map((item) => (
            <button
              key={item.key}
              className={`tabbar-btn${tab === item.key ? ' active' : ''}`}
              onClick={() => setTab(item.key as any)}>
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </Box>
      </Box>
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
