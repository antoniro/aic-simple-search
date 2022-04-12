import React from 'react';
import { StyledEngineProvider } from '@mui/material/styles';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import './App.css';
import MainContent from './components/MainContent/MainContent';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MainContent />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
