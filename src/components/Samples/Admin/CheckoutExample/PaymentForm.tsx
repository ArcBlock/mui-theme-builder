import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

export default function PaymentForm() {
  return (
    <>
      <Tooltip title='<Typography color="textPrimary" variant="h6">' placement="left" arrow>
        <Typography variant="h6" gutterBottom>
          Payment method
        </Typography>
      </Tooltip>
      <Grid container spacing={3}>
        <Grid
          size={{
            xs: 12,
            md: 6,
          }}>
          <TextField required id="cardName" label="Name on card" fullWidth autoComplete="cc-name" variant="standard" />
        </Grid>
        <Grid
          size={{
            xs: 12,
            md: 6,
          }}>
          <TextField
            required
            id="cardNumber"
            label="Card number"
            fullWidth
            autoComplete="cc-number"
            variant="standard"
          />
        </Grid>
        <Grid
          size={{
            xs: 12,
            md: 6,
          }}>
          <TextField required id="expDate" label="Expiry date" fullWidth autoComplete="cc-exp" variant="standard" />
        </Grid>
        <Grid
          size={{
            xs: 12,
            md: 6,
          }}>
          <TextField
            required
            id="cvv"
            label="CVV"
            helperText="Last three digits on signature strip"
            fullWidth
            autoComplete="cc-csc"
            variant="standard"
          />
        </Grid>
        <Grid size={12}>
          <FormControlLabel
            control={
              <Tooltip title='<Checkbox color="secondary">' arrow>
                <Checkbox color="secondary" name="saveCard" value="yes" />
              </Tooltip>
            }
            label="Remember credit card details for next time"
          />
        </Grid>
      </Grid>
    </>
  );
}
