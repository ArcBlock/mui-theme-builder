import { Box, Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Component, ErrorInfo, ReactNode, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { resetSiteData } from 'src/state/actions';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      // eslint-disable-next-line react/no-unused-state
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.log('Caught Error', error);
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Box
          sx={{
            width: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100vh',
            overflowY: 'auto',
          }}>
          <Typography variant="h2">Something went wrong, causing the app to crash</Typography>
          <Typography variant="h1" gutterBottom>
            ':('
          </Typography>
          <Typography variant="h5" gutterBottom>
            This likely is caused by an error on the ThemeOptions object
          </Typography>
          <Typography variant="h5" gutterBottom>
            This can be cleared up by wiping the saved theme data...
          </Typography>
          <Typography variant="h5" gutterBottom>
            but you will lose your saved themes. Sorry :(
          </Typography>
          <Typography variant="h6" gutterBottom>
            Click the button below to reset your local storage data for this site
          </Typography>
          <ClearStorageButton />
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

function ClearStorageButton() {
  const dispatch = useDispatch();
  const handleClick = useCallback(() => {
    dispatch(resetSiteData());
    window.location.reload();
  }, [dispatch]);

  return (
    <Button variant="contained" color="primary" size="large" onClick={handleClick}>
      Reset Site Data
    </Button>
  );
}
