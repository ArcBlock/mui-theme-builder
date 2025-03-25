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
          p: 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          cursor: 'pointer',
        }}
        onClick={() => onToggle?.(!expand)}>
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <IconButton size="small">{expand ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
          <Box sx={{ ml: 1, fontWeight: 'medium' }}>{title}</Box>
        </Box>
      </Box>
      <Collapse className="collapse-panel-content" in={expand} sx={{ width: 1 }}>
        {children}
      </Collapse>
    </Box>
  );
}
