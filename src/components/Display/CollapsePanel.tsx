import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, BoxProps, Collapse, IconButton } from '@mui/material';

export interface CollapsePanelProps extends Omit<BoxProps, 'title' | 'onToggle'> {
  expand?: boolean;
  title: React.ReactNode;
  children: React.ReactNode;
  onToggle?: (expanded: boolean) => void;
}

export default function CollapsePanel({ expand = false, title, children, onToggle, sx, ...props }: CollapsePanelProps) {
  return (
    <Box sx={sx} {...props}>
      <Box
        className="collapse-panel-header"
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 1,
          py: 0.5,
          fontSize: '0.875rem',
          backgroundColor: 'background.default',
          cursor: 'pointer',
        }}
        onClick={() => onToggle?.(!expand)}>
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, backgroundColor: 'background.default' }}>
          <IconButton size="small" sx={{ p: 0 }}>
            {expand ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
          <Box sx={{ ml: 1, fontWeight: 'medium' }}>{title}</Box>
        </Box>
      </Box>
      <Collapse className="collapse-panel-content" in={expand} sx={{ width: 1 }}>
        {children}
      </Collapse>
    </Box>
  );
}
