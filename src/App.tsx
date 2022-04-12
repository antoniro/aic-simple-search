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

// NB: 2022-04-12 16:41:46 @antoniro
// Note that all components used in the app are functional components
// This was a conscious choice. Even though only the render() part
// of class components is re-rendered when the state changes, while 
// re-rendering a functional component requires redefining and
// re-evaluating the whole function (including inner functions), the
// performance difference is negligible.

// TODO: 2022-04-12 16:53:27 @antoniro
// Bonus features like searching for artworks directly, marking an
// an artist as favorite, etc. were not implemented. To add those
// features, a component would be created for each page (Artists,
// Artworks, Favorites). Appropriate routing would be added to MainContent.
// The search bar would be moved into its own component, then removed
// from the global header and added to relevant components (Artists
// and Artworks). Favorites would be cached into local storage.
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
