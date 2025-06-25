import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import AppsIcon from '@mui/icons-material/Apps';
import {
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import Samples from 'src/components/Samples';
import useMobile from 'src/hooks/useMobile';
import { useThemeStore } from 'src/state/themeStore';

export default function SampleNavigation() {
  const { t } = useLocaleContext();
  const selectedComponentId = useThemeStore((s) => s.selectedComponentId);
  const setSelectedComponentId = useThemeStore((s) => s.setSelectedComponentId);
  const isMobile = useMobile();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSampleSelect = (id: string) => {
    setSelectedComponentId(id);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // 桌面端水平导航
  if (!isMobile) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        {Samples.map(({ id, title }) => (
          <Button
            key={id}
            onClick={() => handleSampleSelect(id)}
            color={selectedComponentId === id ? 'primary' : 'inherit'}
            sx={{
              mx: 1,
              px: 1,
              py: 1,
              fontWeight: selectedComponentId === id ? 'medium' : 'normal',
              backgroundColor: selectedComponentId === id ? 'action.selected' : 'transparent',
              borderRadius: 1,
              '&:hover': {
                backgroundColor: selectedComponentId === id ? 'action.focus' : 'action.hover',
              },
              transition: 'background-color 0.3s',
              textTransform: 'none',
            }}>
            {title}
          </Button>
        ))}
      </Box>
    );
  }

  // 移动端汉堡菜单
  return (
    <>
      <IconButton
        onClick={toggleDrawer}
        sx={{
          color: 'text.secondary',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}>
        <AppsIcon />
      </IconButton>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer}
        PaperProps={{
          sx: {
            width: 240,
            backgroundColor: 'background.paper',
            borderLeft: '1px solid',
            borderColor: 'divider',
          },
        }}>
        <Box sx={{ p: 2 }}>
          {/* Drawer 标题 */}
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: 'medium',
              color: 'text.primary',
              borderBottom: '1px solid',
              borderColor: 'divider',
              pb: 1,
            }}>
            {t('samples.title')}
          </Typography>

          <List>
            {Samples.map(({ id, title }) => (
              <ListItem key={id} disablePadding>
                <ListItemButton
                  onClick={() => handleSampleSelect(id)}
                  selected={selectedComponentId === id}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    '&.Mui-selected': {
                      backgroundColor: 'action.selected',
                      '&:hover': {
                        backgroundColor: 'action.focus',
                      },
                    },
                  }}>
                  <ListItemText
                    primary={title}
                    primaryTypographyProps={{
                      fontWeight: selectedComponentId === id ? 'medium' : 'normal',
                      color: selectedComponentId === id ? 'primary.main' : 'text.primary',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
