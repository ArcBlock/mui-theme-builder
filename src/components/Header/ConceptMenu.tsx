import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box, Button, Divider, ListItemIcon, Menu, MenuItem, Typography, styled, useTheme } from '@mui/material';
import { useCallback, useState } from 'react';
import { useThemeStore } from 'src/state/themeStore';

const ConceptItem = styled(MenuItem)(({ theme }) => ({
  minWidth: 254,
  fontSize: 14,
  paddingTop: theme.spacing(0.75),
  paddingBottom: theme.spacing(0.75),
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(3),
  color: theme.palette.text.primary,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 1,
}));

function ConceptMenu() {
  const theme = useTheme();
  const concepts = useThemeStore((s) => s.concepts);
  const currentConceptId = useThemeStore((s) => s.currentConceptId);
  const setCurrentConcept = useThemeStore((s) => s.setCurrentConcept);
  const addConcept = useThemeStore((s) => s.addConcept);
  const duplicateConcept = useThemeStore((s) => s.duplicateConcept);
  const deleteConcept = useThemeStore((s) => s.deleteConcept);

  const currentConcept = concepts.find((c) => c.id === currentConceptId);
  const genConceptName = useCallback(() => {
    const name = 'Concept';
    const lst = concepts.at(-1);
    const match = lst?.name.match(new RegExp(`^${name}\\s+(\\d+)$`));
    let maxNum = 0;

    if (match) {
      maxNum = parseInt(match[1], 10);
    }

    return `${name} ${maxNum + 1}`;
  }, [concepts]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <Box
        className={open ? 'is-open' : ''}
        sx={{
          minWidth: 80,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          cursor: 'pointer',
          py: 1,
          px: 1.5,
          borderRadius: 1,
          ':hover': {
            backgroundColor: 'action.hover',
          },
          '&.is-open': {
            border: '1px solid',
            borderColor: 'divider',
          },
        }}
        onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Typography variant="body2" sx={{ flex: 1 }}>
          {currentConcept?.name}
        </Typography>
        <KeyboardArrowDownIcon style={{ fontSize: 14 }} />
      </Box>
      <Menu
        open={open}
        anchorEl={anchorEl}
        slotProps={{ paper: { sx: { mt: '4px' } } }}
        onClose={() => setAnchorEl(null)}>
        {concepts.map((concept) => (
          <ConceptItem
            key={concept.id}
            selected={concept.id === currentConceptId}
            onClick={() => {
              setCurrentConcept(concept.id);
              setAnchorEl(null);
            }}>
            {concept.name}
            {concept.id === currentConceptId && (
              <CheckIcon style={{ position: 'absolute', right: theme.spacing(1.5), fontSize: 14 }} />
            )}
          </ConceptItem>
        ))}
        <Divider />
        <ConceptItem
          onClick={() => {
            addConcept(genConceptName());
            setAnchorEl(null);
          }}>
          New Concept
        </ConceptItem>
        <ConceptItem
          onClick={() => {
            duplicateConcept(currentConceptId, genConceptName());
            setAnchorEl(null);
          }}>
          Duplicate Concept
        </ConceptItem>
        <ConceptItem
          onClick={() => {
            deleteConcept(currentConceptId);
            setAnchorEl(null);
          }}
          disabled={concepts.length === 1}>
          Delete Concept
        </ConceptItem>
      </Menu>
    </>
  );
}

export default ConceptMenu;
