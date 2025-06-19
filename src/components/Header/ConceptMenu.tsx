import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useThemeStore } from 'src/state/themeStore';

function ConceptMenu() {
  const { t } = useLocaleContext();
  const concepts = useThemeStore((s) => s.concepts);
  const currentConceptId = useThemeStore((s) => s.currentConceptId);
  const addConcept = useThemeStore((s) => s.addConcept);
  const duplicateConcept = useThemeStore((s) => s.duplicateConcept);
  const deleteConcept = useThemeStore((s) => s.deleteConcept);
  const renameConcept = useThemeStore((s) => s.renameConcept);
  const setCurrentConcept = useThemeStore((s) => s.setCurrentConcept);

  const currentConcept = concepts.find((c) => c.id === currentConceptId);

  // 菜单控制
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [renameId, setRenameId] = useState<string | null>(null);

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // 重命名弹窗
  const openRenameDialog = (id: string, name: string) => {
    setRenameId(id);
    setRenameValue(name);
    setRenameDialogOpen(true);
    handleMenuClose();
  };

  const handleRename = () => {
    if (renameId && renameValue.trim()) {
      renameConcept(renameId, renameValue.trim());
    }
    setRenameDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (concepts.length > 1) {
      deleteConcept(id);
    }
    handleMenuClose();
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {currentConcept?.name || t('concept.defaultTheme')}
        </Typography>
        <IconButton onClick={handleMenuOpen} size="small">
          <MoreVertIcon />
        </IconButton>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}>
        {concepts.map((concept) => (
          <MenuItem
            key={concept.id}
            selected={concept.id === currentConceptId}
            onClick={() => {
              setCurrentConcept(concept.id);
              handleMenuClose();
            }}
            sx={{ minWidth: 200 }}>
            <ListItemText primary={concept.name} />
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                openRenameDialog(concept.id, concept.name);
              }}
              sx={{ mr: 0.5 }}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              disabled={concepts.length === 1}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(concept.id);
              }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </MenuItem>
        ))}
        <MenuItem
          onClick={() => {
            addConcept(t('concept.newTheme'));
            handleMenuClose();
          }}>
          <ListItemIcon>
            <AddIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t('concept.newTheme')} />
        </MenuItem>
        <MenuItem
          onClick={() => {
            duplicateConcept(currentConceptId);
            handleMenuClose();
          }}>
          <ListItemIcon>
            <FileCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t('concept.copyTheme')} />
        </MenuItem>
      </Menu>

      <Dialog open={renameDialogOpen} onClose={() => setRenameDialogOpen(false)}>
        <DialogTitle>{t('concept.renameDialogTitle')}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={t('concept.themeName')}
            fullWidth
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleRename();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameDialogOpen(false)}>{t('concept.cancel')}</Button>
          <Button onClick={handleRename} variant="contained">
            {t('concept.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ConceptMenu;
