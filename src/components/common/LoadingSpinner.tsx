import React from 'react';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

type LoadingSpinnerProps = {
  message: string;
};

function LoadingSpinner(props: LoadingSpinnerProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column',
        alignItems: 'center',
        padding: '4rem 0rem',
        gap: '1rem',
      }}
    >
      <CircularProgress />
      <Typography>{props.message}</Typography>
    </Box>
  );
}

export default LoadingSpinner;
