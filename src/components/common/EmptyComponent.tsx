import React from 'react';

import Typography from '@mui/material/Typography';

type EmptyComponentProps = {
  message: string;
};

function EmptyComponent(props: EmptyComponentProps) {
  return (
    <Typography sx={{ padding: '4rem 0rem', flexGrow: 1, textAlign: 'center' }}>
      {props.message}
    </Typography>
  );
}

export default EmptyComponent;
