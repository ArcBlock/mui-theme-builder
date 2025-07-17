import { Box, Button, ButtonGroup } from '@mui/material';
import Samples from 'src/components/Samples';
import { useThemeBuilder } from 'src/context/themeBuilder';

export default function SampleNavigation() {
  const selectedComponentId = useThemeBuilder((s) => s.selectedComponentId);
  const setSelectedComponentId = useThemeBuilder((s) => s.setSelectedComponentId);

  const handleSampleSelect = (id: string) => {
    setSelectedComponentId(id);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
      <ButtonGroup
        variant="outlined"
        sx={{
          '& .MuiButtonGroup-grouped': {
            borderColor: 'divider',
            '&:not(:last-of-type)': {
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          },
        }}>
        {Samples.map(({ id, title }) => (
          <Button
            key={id}
            size="small"
            onClick={() => handleSampleSelect(id)}
            variant={selectedComponentId === id ? 'contained' : 'outlined'}
            sx={{
              fontWeight: selectedComponentId === id ? 'medium' : 'normal',
              textTransform: 'none',
              minWidth: 'auto',
              '&.MuiButton-contained': {
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              },
              '&.MuiButton-outlined': {
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: 'action.hover',
                  borderColor: 'primary.main',
                },
              },
            }}>
            {title}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
}
