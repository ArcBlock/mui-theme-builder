import AddIcon from '@mui/icons-material/Add';
import { Chip, Grid } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addFonts } from 'src/state/actions';
import { RootState } from 'src/state/types';

const popularFonts = ['Inter', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Merriweather', 'Lora'];

function PopularFontList() {
  const dispatch = useDispatch();
  const loadedFonts = useSelector((state: RootState) => state.loadedFonts);
  const [fontShortList, setFontShortList] = useState(popularFonts);

  useEffect(() => {
    const fonts = [...popularFonts];

    setFontShortList(
      // reduce defaultFonts to only fonts not already loaded
      fonts.reduce((fontList: string[], font: string) => (loadedFonts.has(font) ? fontList : [...fontList, font]), []),
    );
  }, [loadedFonts]);

  const handleDefaultFontClick = useCallback(
    (fontName: string) => {
      dispatch(addFonts([fontName]));
      const index = fontShortList.indexOf(fontName);
      setFontShortList([...fontShortList.slice(0, index), ...fontShortList.slice(index + 1)]);
    },
    [dispatch, fontShortList],
  );

  return fontShortList.length ? (
    <Grid container spacing={1}>
      {fontShortList.map((font) => (
        <Grid item key={font}>
          <Chip label={font} icon={<AddIcon />} onClick={() => handleDefaultFontClick(font)} />
        </Grid>
      ))}
    </Grid>
  ) : null;
}

export default PopularFontList;
