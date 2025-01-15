'use client';
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import {
  Alert,
  LinearProgress,
  Slide,
  Snackbar,
  linearProgressClasses,
} from '@mui/material';
import { styled } from '@mui/material/styles';

interface SnackbarContextType {
  showSnackbar: (
    message: string,
    severity?: 'info' | 'warning' | 'error' | 'success',
    duration?: number
  ) => void;
}

const BorderLinearProgress = styled(LinearProgress)(() => ({
  marginTop: '-4px',
  height: 4,
  borderRadius: 4,
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 4,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
}));

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [duration, setDuration] = useState(6000);
  const [progress, setProgress] = useState(100);
  const [startTime, setStartTime] = useState<number>(0);
  const [severity, setSeverity] = useState<
    'info' | 'warning' | 'error' | 'success'
  >('info');

  const showSnackbar = (
    message: string,
    severity: 'info' | 'warning' | 'error' | 'success' = 'info',
    duration = 6000
  ) => {
    setMessage(message);
    setSeverity(severity);
    setDuration(duration);
    setOpen(true);
    setProgress(100);
    setStartTime(Date.now());
  };

  useEffect(() => {
    if (!open) return;

    const interval = 100; // Update every 100ms

    const timer = setInterval(() => {
      const elapsedTime = Date.now() - startTime + 400;
      console.log(elapsedTime);
      const newProgress = Math.max(100 - (elapsedTime / duration) * 100, 0);
      setProgress(newProgress);

      if (elapsedTime >= duration) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [open, duration, startTime]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={duration}
        open={open}
        onClose={handleClose}
        TransitionComponent={Slide}
      >
        <span>
          <Alert
            variant="filled"
            onClose={handleClose}
            severity={severity}
            sx={{
              borderBottomLeftRadius: '4px',
              borderBottomRightRadius: '4px',
            }}
          >
            {message}
          </Alert>
          <BorderLinearProgress
            variant="determinate"
            value={progress}
            color={severity}
            sx={
              {
                // borderBottomLeftRadius: '4px',
                // borderBottomRightRadius: '4px',
                // '& .MuiLinearProgress-bar': {
                //   borderBottomLeftRadius: '4px',
                //   borderBottomRightRadius: '4px',
                // },
              }
            }
          />
        </span>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};
