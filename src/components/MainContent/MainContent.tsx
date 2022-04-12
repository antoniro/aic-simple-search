import React, { useState } from 'react';

import { alpha, useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';

import axios, { AxiosResponse } from 'axios';

import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  CircularProgress,
} from '@mui/material';
import styles from './MainContent.module.css';

import ArtistDetails from '../ArtistDetails/ArtistDetails';

const BASE_URL = 'https://api.artic.edu/api/v1';
const AGENTS_ENDPOINT = '/agents';
const AGENTS_SEARCH_ENDPOINT = `${AGENTS_ENDPOINT}/search`;
const RELEVANT_AGENT_FIELDS = [
  'id',
  'title',
  'birth_date',
  'death_date',
  'description',
  'is_artist',
  'agent_type_title',
  'agent_type_id',
  'artwork_ids',
];
const USER_AGENT = 'AIC Simple Search (anthony.gbegan@gmail.com)';

function MainContent() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previousSearchQuery, setPreviousSearchQuery] = useState<string>('');
  const [artistSearchResponse, setArtistSearchResponse] = useState<AxiosResponse>();
  const [fetchingData, setFetchingData] = useState<boolean>(false);
  const [selectedArtist, setSelectedArtist] = React.useState<number>(-1);

  const theme = useTheme();

  function onArtistClick(index: number) {
    setSelectedArtist(index);
  }

  function onClickSearch() {
    if (searchQuery === '' || searchQuery == previousSearchQuery) return;

    setPreviousSearchQuery(searchQuery);
    setSelectedArtist(-1);

    searchArtist(searchQuery);
  }

  function searchArtist(query: string) {
    setFetchingData(true);

    axios
      .get(
        `${BASE_URL}${AGENTS_SEARCH_ENDPOINT}?fields=${RELEVANT_AGENT_FIELDS.toString()}`,
        {
          headers: {
            'AIC-User-Agent': USER_AGENT,
          },
          params: {
            params: {
              q: query,
              query: {
                term: {
                  is_artist: true,
                },
              },
            },
          },
        }
      )
      .then((response) => {
        setArtistSearchResponse(response);
        setFetchingData(false);
      })
      .catch((error) => {
        console.error('Error fetching data: ', error);
        setFetchingData(false);
      });
  }

  function getArtists() {
    const artists = artistSearchResponse?.data.data.map((artist: any) => (
      <ListItem key={artist.id} disablePadding divider dense>
        <ListItemButton
          selected={selectedArtist === artist.id}
          onClick={() => onArtistClick(artist.id)}
        >
          <ListItemText primary={artist.title} />
        </ListItemButton>
      </ListItem>
    ));

    return artists;
  }

  function getSelectedArtistData() {
    return artistSearchResponse?.data.data.find(
      (artist: any) => artist.id == selectedArtist
    );
  }

  function getLoadingSpinner(message: string) {
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
        <Typography>{message}</Typography>
      </Box>
    );
  }

  function showSearchResults() {
    if (fetchingData) {
      return getLoadingSpinner('Searching artists...');
    }

    if (artistSearchResponse == null) {
      return (
        <Typography
          sx={{ padding: '4rem 0rem', flexGrow: 1, textAlign: 'center' }}
        >
          Please search for artists using search field above.
        </Typography>
      );
    }

    if (artistSearchResponse?.data.pagination.total < 1) {
      return (
        <Typography
          sx={{ padding: '4rem 0rem', flexGrow: 1, textAlign: 'center' }}
        >
          No results were found :(
        </Typography>
      );
    }

    return (
      <Stack
        sx={{ flexGrow: 1 }}
        direction='row'
        divider={<Divider orientation='vertical' flexItem />}
      >
        <List
          sx={{
            minWidth: '250px',
            maxWidth: '250px',
            minHeight: '100%',
            bgcolor: 'background.paper',
          }}
        >
          {getArtists()}
        </List>
        {selectedArtist != -1 ? (
          <ArtistDetails data={getSelectedArtistData()} />
        ) : (
          <Typography
            sx={{ padding: '4rem 0rem', flexGrow: 1, textAlign: 'center' }}
          >
            Select an artist to see details.
          </Typography>
        )}
      </Stack>
    );
  }

  return (
    <Stack sx={{ bgcolor: 'grey.200', flexGrow: 1 }}>
      <AppBar sx={{ bgcolor: 'common.black' }} position='static' elevation={0}>
        <Toolbar className={styles.headerToolbar}>
          <Typography variant='h6'>AIC Simple Search</Typography>
          <Box className={styles.searchBarContainer}>
            <Box
              sx={{
                height: 1,
                bgcolor: alpha(theme.palette.common.white, 0.2),
                '&:hover': {
                  bgcolor: alpha(theme.palette.common.white, 0.3),
                },
              }}
              className={styles.searchBar}
            >
              <div className={styles.searchIconContainer}>
                <SearchIcon />
              </div>
              <InputBase
                fullWidth
                placeholder='Search Artist...'
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Box>
            <Button
              variant='contained'
              disableElevation
              className={styles.searchButton}
              onClick={onClickSearch}
            >
              Search
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      {showSearchResults()}
    </Stack>
  );
}

export default MainContent;
