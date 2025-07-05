import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box, Button, Divider, Menu, MenuItem, Typography, styled } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { useCallback, useState, useMemo } from 'react';
import useMobile from 'src/hooks/useMobile';
import useSave from 'src/hooks/useSave';
import { useThemeStore } from 'src/state/themeStore';
import { Concept } from 'src/types/theme';

const ConceptItem = styled(MenuItem)(({ theme }) => ({
  minWidth: 254,
  fontSize: 14,
  paddingTop: theme.spacing(0.75),
  paddingBottom: theme.spacing(0.75),
  paddingLeft: theme.spacing(1.5),
  paddingRight: `${theme.spacing(1.5)} !important`,
  color: theme.palette.text.primary,
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  // 行操作
  '.concept-actions': {
    display: 'flex',
    opacity: 0,
    transition: 'opacity 0.2s',
    marginLeft: theme.spacing(2),
  },
  '&:hover .concept-actions': {
    opacity: 1,
  },
  '&.Mui-selected  .concept-actions': {
    opacity: 1,
  },
}));

const ConceptButton = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4px',
  borderRadius: '64px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
}));

export function ConceptMenu() {
  const { t } = useLocaleContext();
  const isMobile = useMobile();
  //
  const concepts = useThemeStore((s) => s.concepts);
  const currentConceptId = useThemeStore((s) => s.currentConceptId);
  const setCurrentConcept = useThemeStore((s) => s.setCurrentConcept);
  const addConcept = useThemeStore((s) => s.addConcept);
  const duplicateConcept = useThemeStore((s) => s.duplicateConcept);
  const deleteConcept = useThemeStore((s) => s.deleteConcept);
  const renameConcept = useThemeStore((s) => s.renameConcept);
  //
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { saveTheme } = useSave();
  const [renameDrawerOpen, setRenameDrawerOpen] = useState(false);
  const [renameTargetId, setRenameTargetId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const currentConcept = concepts.find((c) => c.id === currentConceptId);

  // 检查主题名字是否重复
  const isDuplicateName = useMemo(() => {
    if (!renameValue.trim()) return false;
    return concepts.some((concept) => concept.name === renameValue.trim() && concept.id !== renameTargetId);
  }, [renameValue, concepts, renameTargetId]);

  // 切换主题
  const handleSelectConcept = useCallback(
    (concept: Concept) => () => {
      setCurrentConcept(concept.id);
      // 直接保存主题
      saveTheme(useThemeStore.getState());
      setAnchorEl(null);
    },
    [setCurrentConcept],
  );

  // 打开主题编辑框
  const openRenameDrawer = (concept: Concept) => {
    setRenameTargetId(concept.id);
    setRenameValue(concept.name);
    setRenameDrawerOpen(true);
  };

  // 关闭主题编辑框
  const closeRenameDrawer = () => {
    setRenameDrawerOpen(false);
    setRenameTargetId(null);
    setRenameValue('');
  };

  // 提交主题表单
  const handleRenameSubmit = () => {
    if (renameTargetId && renameValue.trim() && !isDuplicateName) {
      renameConcept(renameTargetId, renameValue.trim());
      closeRenameDrawer();
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box
        className={open ? 'is-open' : ''}
        sx={{
          minWidth: 80,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          cursor: 'pointer',
          height: '32px',
          px: 1,
          border: '1px solid',
          borderColor: 'transparent',
          borderRadius: 1,
          ':hover': {
            backgroundColor: 'action.hover',
          },
          '&.is-open': {
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
            onClick={handleSelectConcept(concept)}
            onMouseDown={(e) => e.stopPropagation()}>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" noWrap sx={{ flex: 1 }}>
                {concept.name}
              </Typography>
              {/* 行操作按钮 */}
              {!isMobile && (
                <Box className="concept-actions">
                  <ConceptButton
                    title={t('editor.concept.rename')}
                    onClick={(e) => {
                      e.stopPropagation();
                      openRenameDrawer(concept);
                      setAnchorEl(null);
                    }}>
                    <EditIcon sx={{ fontSize: 16 }} />
                  </ConceptButton>
                  <ConceptButton
                    title={t('editor.concept.duplicate')}
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateConcept(concept.id);
                    }}>
                    <ContentCopyIcon sx={{ fontSize: 16 }} />
                  </ConceptButton>
                  {concepts.length > 1 && (
                    <ConceptButton
                      title={t('editor.concept.delete')}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConcept(concept.id);
                        setAnchorEl(null);
                      }}>
                      <DeleteIcon sx={{ color: 'error.main', fontSize: 16 }} />
                    </ConceptButton>
                  )}
                </Box>
              )}
            </Box>
          </ConceptItem>
        ))}
        <Divider />
        <ConceptItem
          disabled={concepts.length >= 8}
          onClick={() => {
            addConcept();
            setAnchorEl(null);
          }}>
          <AddCircleOutlineOutlinedIcon sx={{ mr: 1, fontSize: 18 }} />
          {t('editor.concept.add')}
        </ConceptItem>
        {isMobile && (
          <>
            <ConceptItem
              onClick={() => {
                const c = concepts.find((v) => v.id === currentConceptId);
                if (c) openRenameDrawer(c);
                setAnchorEl(null);
              }}>
              <EditIcon sx={{ mr: 1, fontSize: 18 }} />
              {t('editor.concept.rename') || 'Rename'}
            </ConceptItem>
            <ConceptItem
              disabled={concepts.length >= 8}
              onClick={() => {
                duplicateConcept(currentConceptId);
                setAnchorEl(null);
              }}>
              <ContentCopyIcon sx={{ mr: 1, fontSize: 18 }} />
              {t('editor.concept.duplicate')}
            </ConceptItem>
            <ConceptItem
              onClick={() => {
                deleteConcept(currentConceptId);
                setAnchorEl(null);
              }}
              disabled={concepts.length === 1}>
              <DeleteIcon sx={{ mr: 1, fontSize: 18, color: 'error.main' }} />
              {t('editor.concept.delete')}
            </ConceptItem>
          </>
        )}
      </Menu>
      {/* Drawer for editing concept */}
      <Drawer anchor={isMobile ? 'bottom' : 'left'} open={renameDrawerOpen} onClose={closeRenameDrawer}>
        <Box sx={{ p: 2, width: isMobile ? 'auto' : 320 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">{t('editor.concept.rename')}</Typography>
            <IconButton onClick={closeRenameDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>
          <TextField
            fullWidth
            label={t('editor.concept.name')}
            value={renameValue}
            autoFocus
            error={isDuplicateName}
            helperText={isDuplicateName && t('editor.concept.duplicateName')}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRenameSubmit();
              if (e.key === 'Escape') closeRenameDrawer();
            }}
            inputProps={{ maxLength: 32 }}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="text" size="small" onClick={closeRenameDrawer}>
              {t('editor.cancel')}
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleRenameSubmit}
              disabled={!renameValue.trim() || isDuplicateName}>
              {t('editor.confirm')}
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}
