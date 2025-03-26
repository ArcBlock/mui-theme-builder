import { Alert, Box, Button } from '@mui/material';
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
            justifyContent: 'center',
            height: '100vh',
            overflowY: 'auto',
          }}>
          <Alert severity="error" sx={{ mb: 2, maxWidth: '80vw', maxHeight: '50vh', width: '100%' }}>
            {this.state.error?.message}
            <pre>{this.state.error?.stack}</pre>
          </Alert>
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
