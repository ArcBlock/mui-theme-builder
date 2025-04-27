import { Grid, Paper, Typography } from '@mui/material';

type Variant =
  | 'inherit'
  | 'button'
  | 'overline'
  | 'caption'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2';
interface Props {
  variant: Variant;
  bgText: string;
  paperText: string;
  smallPreview?: boolean;
}
function TypographySampleArea({ variant, bgText, paperText, smallPreview, ...typographyProps }: Props) {
  return (
    <Paper
      variant="outlined"
      sx={{
        overflow: 'auto',
        maxHeight: 200,
        pl: '4px',
      }}>
      <Grid container wrap="nowrap" alignItems="baseline">
        <Grid item>
          <Typography
            variant={variant}
            {...typographyProps}
            sx={{
              transition: (theme) => theme.transitions.create('font-size'),
              fontSize: smallPreview ? '1rem' : null,
            }}>
            {bgText}
          </Typography>
        </Grid>
        <Grid item>
          <Paper variant="outlined" square sx={{ p: 0.5, border: 0 }}>
            <Typography
              variant={variant}
              {...typographyProps}
              sx={{
                transition: (theme) => theme.transitions.create('font-size'),
                fontSize: smallPreview ? '1rem' : null,
              }}>
              {paperText}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default TypographySampleArea;
