import React from 'react';

import Typography from '@mui/material/Typography';

type ErrorMessageProps = {
    message: string;
  };

function ErrorMessage(props: ErrorMessageProps) {
  return (
    <Typography
      variant='subtitle2'
      sx={{
        padding: '4rem 0rem',
        flexGrow: 1,
        textAlign: 'center',
        color: 'red',
      }}
    >
      {props.message}
    </Typography>
  );
}

export default ErrorMessage;
