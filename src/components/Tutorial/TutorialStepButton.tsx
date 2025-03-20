import Button from '@mui/material/Button';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { decrementTutorialStep, incrementTutorialStep, toggleTutorial } from 'src/state/actions';
import { RootState } from 'src/state/types';

import { get } from './Steps/length';

function TutorialStepButton({ variant }: { variant: 'next' | 'prev' }) {
  const tutorialStep = useSelector((state: RootState) => state.tutorialStep);
  const dispatch = useDispatch();

  const handleNext = useCallback(() => {
    dispatch(incrementTutorialStep());
  }, [dispatch]);

  const handlePrev = useCallback(() => {
    dispatch(decrementTutorialStep());
  }, [dispatch]);

  const handleClose = useCallback(() => {
    dispatch(toggleTutorial());
  }, [dispatch]);

  if (variant === 'next' && tutorialStep === get() - 1) {
    return <Button onClick={handleClose}>Finish</Button>;
  }

  return (
    <Button
      disabled={(variant === 'prev' && tutorialStep === 0) || (variant === 'next' && tutorialStep === get() - 1)}
      // eslint-disable-next-line no-nested-ternary
      onClick={variant === 'next' ? handleNext : variant === 'prev' ? handlePrev : undefined}>
      {variant === 'next' && 'Next'}
      {variant === 'prev' && 'Prev'}
    </Button>
  );
}

export default TutorialStepButton;
