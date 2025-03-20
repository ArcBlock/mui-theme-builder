import AddIcon from '@mui/icons-material/Add';
import { IconButton, InputAdornment, Menu, MenuItem, TextField, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/state/types';

function FontFamilyInput({ value, onChange }) {
  const [input, setInput] = useState(value);

  useEffect(() => setInput(value), [value]);
  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    onChange(event, input);
  };

  const handleFontSelected = (fontName: string) => {
    onChange(null, fontName);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="caption" color="textSecondary">
        Font Family
      </Typography>
      <TextField
        name="fontfamily"
        value={input}
        onChange={(event: react.ChangeEvent<HTMLInputElement>) => setInput(event.target.value)}
        fullWidth
        variant="standard"
        InputLabelProps={{ shrink: true }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <FontSelector onSelectFont={handleFontSelected} />
            </InputAdornment>
          ),
        }}
      />
    </form>
  );
}

export default FontFamilyInput;

function FontSelector({ onSelectFont }) {
  const loadedFonts = useSelector((state: RootState) => state.loadedFonts);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);

  const handleClick = (fontName: string) => {
    setAnchorEl(null);
    onSelectFont(fontName);
  };

  return (
    <Tooltip title="Replace with Downloaded Font" placement="top" open={tooltipOpen}>
      <div
        onMouseEnter={() => setTooltipOpen(true)}
        onMouseLeave={() => setTooltipOpen(false)}
        onClick={() => setTooltipOpen(false)}>
        <IconButton
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget)}
          aria-haspopup="true"
          size="large">
          <AddIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          {[...loadedFonts].map((f) => (
            <MenuItem key={f} onClick={() => handleClick(f)} style={{ fontFamily: f }}>
              {f}
            </MenuItem>
          ))}
        </Menu>
      </div>
    </Tooltip>
  );
}
