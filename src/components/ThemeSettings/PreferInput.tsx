import { FormControl, FormControlLabel, Radio, RadioGroup, styled } from '@mui/material';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setThemePrefer } from 'src/state/actions';
import { RootState } from 'src/state/types';

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  margin: 0,
  marginRight: theme.spacing(1),
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
  },
}));

export default function PreferInput() {
  const dispatch = useDispatch();
  const prefer = useSelector((state: RootState) => state.themeOptions.prefer);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setThemePrefer(event.target.value));
    },
    [dispatch],
  );

  return (
    <FormControl size="small">
      <RadioGroup row value={prefer} onChange={handleChange}>
        <StyledFormControlLabel value="light" control={<Radio size="small" />} label="Light" />
        <StyledFormControlLabel value="dark" control={<Radio size="small" />} label="Dark" />
        <StyledFormControlLabel value="system" control={<Radio size="small" />} label="System" />
      </RadioGroup>
    </FormControl>
  );
}
