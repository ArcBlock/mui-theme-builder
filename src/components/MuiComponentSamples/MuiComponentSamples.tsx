import { Box, Button, Grid, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import componentSamples from './Samples';

function MuiComponentSamples() {
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [id]);

  return (
    <Box
      sx={{
        maxWidth: 1000,
        p: 1,
        m: 'auto',
      }}>
      <Typography variant="h4" gutterBottom>
        Material-UI Components
      </Typography>
      {componentSamples.map(({ id: _id, title, component, docs }) => (
        <div key={_id} id={_id}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Typography variant="h5" gutterBottom>
              {title}
            </Typography>
            <Button variant="outlined" color="secondary" size="small" href={docs} target="_blank" rel="noreferrer">
              Docs
            </Button>
          </Grid>
          <Box
            sx={{
              mb: 10,
              width: 1,
              maxWidth: 1000,
              pl: 1,
              m: 'auto',
            }}>
            {component}
          </Box>
        </div>
      ))}
    </Box>
  );
}

export default MuiComponentSamples;
