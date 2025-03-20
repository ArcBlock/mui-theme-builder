import { Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from 'src/state/types';

import SavedThemeItem from './SavedThemeItem/SavedThemeItem';

export const savedThemeListId = 'saved-theme-list';

function SavedThemeList() {
  const savedThemes = useSelector((state: RootState) => state.savedThemes);
  const sortedThemes = Object.values(savedThemes).sort((a, b) =>
    // eslint-disable-next-line no-nested-ternary
    a.lastUpdated > b.lastUpdated ? -1 : a.lastUpdated < b.lastUpdated ? 1 : 0,
  );

  return (
    <Grid id={savedThemeListId} container wrap="wrap" justifyContent="center">
      {sortedThemes.map((t) => (
        <Grid
          item
          key={`${t.name}-${t.id}`}
          sx={{
            m: 2,
            mt: 0,
          }}>
          <SavedThemeItem name={t.name} themeOptions={t.themeOptions} themeId={t.id} lastUpdated={t.lastUpdated} />
        </Grid>
      ))}
    </Grid>
  );
}

export default SavedThemeList;
