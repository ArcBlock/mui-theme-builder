import { Box, Paper, Stack, styled } from '@mui/material';

const radiusOptions = [0, 4, 8, 32];

function CornerIcon({ radius }: { radius: number }) {
  return (
    <Box
      sx={{
        width: 20,
        height: 20,
        borderTop: '2px solid currentColor',
        borderLeft: '2px solid currentColor',
        borderTopLeftRadius: radius,
      }}
    />
  );
}

const OptionButton = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'disabled',
})<{ disabled?: boolean }>(({ theme, disabled = false }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  width: 48,
  height: 48,
  padding: 0,
  border: '1px solid',
  borderColor: 'transparent',
  backgroundColor: theme.palette.action.hover,
  '&.Mui-selected': {
    borderColor: disabled ? theme.palette.action.disabled : theme.palette.primary.main,
    backgroundColor: theme.palette.background.default,
    boxShadow: 'none',
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

interface BorderRadiusSelectorProps {
  value: number;
  disabled?: boolean;
  onChange?: (value: number) => void;
}

function BorderRadiusSelector({ value, disabled = false, onChange = () => {} }: BorderRadiusSelectorProps) {
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        display: 'inline-flex',
        p: '2px',
        borderRadius: 1,
      }}>
      {radiusOptions.map((radius) => (
        <OptionButton
          disabled={disabled}
          key={radius}
          elevation={0}
          className={value === radius ? 'Mui-selected' : ''}
          onClick={() => !disabled && onChange(radius)}>
          <CornerIcon radius={radius} />
        </OptionButton>
      ))}
    </Stack>
  );
}

export default BorderRadiusSelector;
