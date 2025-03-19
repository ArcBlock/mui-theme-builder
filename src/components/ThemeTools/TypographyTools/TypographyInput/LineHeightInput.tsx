import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';

function LineHeightInput({ value, onChange }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => setDisplayValue(value), [value]);

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="baseline">
        <Grid item>
          <Typography variant="caption" color="textSecondary">
            Line Height:
          </Typography>
        </Grid>
        <Grid item>
          <Typography display="inline">{displayValue}</Typography>
        </Grid>
      </Grid>
      <Slider
        value={displayValue}
        min={0.5}
        max={3}
        step={0.01}
        onChange={(event, newDisplayValue) => setDisplayValue(newDisplayValue)}
        onChangeCommitted={onChange}
      />
    </>
  );
}

export default LineHeightInput;
