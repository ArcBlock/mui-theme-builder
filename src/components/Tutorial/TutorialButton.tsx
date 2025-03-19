import { Link } from '@mui/material';
import Button from '@mui/material/Button';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { toggleTutorial } from 'src/state/actions';

function TutorialButton() {
  const dispatch = useDispatch();
  const handleToggle = useCallback(() => dispatch(toggleTutorial()), [dispatch]);

  return <Button onClick={handleToggle}>Tutorial</Button>;
}

export default TutorialButton;

function TutorialLink({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const handleToggle = useCallback(() => dispatch(toggleTutorial()), [dispatch]);

  return (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <Link onClick={handleToggle} underline="hover">
      {children}
    </Link>
  );
}

export { TutorialLink };
