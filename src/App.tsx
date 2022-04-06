import React from 'react';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { createTheme, ThemeProvider, alpha } from '@mui/material/styles';

import SearchIcon from '@mui/icons-material/Search';

import './App.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <div className='App'>
        <AppBar position='static'>
          <Toolbar className='header-toolbar'>
            <Typography variant='h6'>AIC Simple Search</Typography>
            <Box
              sx={{
                bgcolor: alpha(darkTheme.palette.common.white, 0.2),
                '&:hover': {
                  bgcolor: alpha(darkTheme.palette.common.white, 0.3),
                },
                borderRadius: 1,
              }}
              className='search-bar'
            >
              <div className='search-icon-container'>
                <SearchIcon />
              </div>
              <InputBase fullWidth placeholder='Search Artist...' className='search-input'/>
            </Box>
          </Toolbar>
        </AppBar>
      </div>
    </ThemeProvider>
  );
}

export default App;
