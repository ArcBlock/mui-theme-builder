import { Box, Paper, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface NeutralColorBlockProps {
  onClick?: () => void;
}

function NeutralColorBlock({ onClick }: NeutralColorBlockProps) {
  const theme = useTheme();
  const neutralColors = [
    { key: '50', value: theme.palette.grey[50] },
    { key: '100', value: theme.palette.grey[100] },
    { key: '200', value: theme.palette.grey[200] },
    { key: '300', value: theme.palette.grey[300] },
    { key: '400', value: theme.palette.grey[400] },
    { key: '500', value: theme.palette.grey[500] },
    { key: '600', value: theme.palette.grey[600] },
    { key: '700', value: theme.palette.grey[700] },
    { key: '800', value: theme.palette.grey[800] },
    { key: '900', value: theme.palette.grey[900] },
  ];

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        height: '100%',
        cursor: 'pointer',
        '&:hover': {
          borderColor: 'primary.main',
        },
      }}
      onClick={onClick}
    >
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Neutrals
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {neutralColors.map(({ key, value }) => (
          <Box
            key={key}
            sx={{
              height: 24,
              backgroundColor: value,
              borderRadius: 0.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 1,
              '& > *': {
                color: theme.palette.getContrastText(value),
                fontSize: '0.75rem',
              },
            }}
          >
            <Typography>{key}</Typography>
            <Typography>{value}</Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}

export default NeutralColorBlock; 