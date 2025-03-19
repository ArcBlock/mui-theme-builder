import AddIcon from '@mui/icons-material/Add';
import { CircularProgress, InputAdornment, Typography } from '@mui/material';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import { FormEvent, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addFonts } from 'src/state/actions';

function AddFontInput() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleAddFontName = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      event.persist();
      const fontName: string = (event.target as HTMLFormElement).fontname.value;
      setLoading(true);

      dispatch(addFonts([fontName])).then((loaded: boolean) => {
        setLoading(false);
        if (loaded) {
          (event.target as HTMLFormElement).fontname.value = '';
        } else {
          setError(true);
        }
      });
    },
    [dispatch],
  );

  return (
    <form onSubmit={handleAddFontName} autoComplete="off">
      <Typography variant="body2">Add Fonts</Typography>
      <TextField
        name="fontname"
        error={error}
        variant="standard"
        helperText={
          error ? (
            'Error loading font'
          ) : (
            <>
              {'Enter the name of a '}
              <Link href="https://fonts.google.com/" target="_blank" rel="noreferrer" underline="hover">
                'Google Font'
              </Link>
            </>
          )
        }
        onClick={(event) => event.stopPropagation()}
        onChange={() => setError(false)}
        // InputLabelProps={{ shrink: true }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AddIcon />
            </InputAdornment>
          ),
          endAdornment: loading && (
            <InputAdornment position="end">
              <CircularProgress size="1.5rem" />
            </InputAdornment>
          ),
        }}
      />
    </form>
  );
}

export default AddFontInput;
