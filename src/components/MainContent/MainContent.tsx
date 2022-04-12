import React, { useState } from 'react';

import { AxiosResponse } from 'axios';

import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import { alpha, useTheme } from '@mui/material/styles';

import styles from './MainContent.module.css';

import ErrorMessage from '../common/ErrorMessage';
import EmptyComponent from '../common/EmptyComponent';
import LoadingSpinner from '../common/LoadingSpinner';
import ArtistDetails from '../ArtistDetails/ArtistDetails';

import { fetchArtists } from '../../utils/apiServices/apiServices';

function MainContent() {
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [previousSearchKeyword, setPreviousSearchKeyword] =
    useState<string>('');
  const [artistSearchResponse, setArtistSearchResponse] =
    useState<AxiosResponse>();
  const [fetchingData, setFetchingData] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [selectedArtist, setSelectedArtist] = React.useState<number>(-1);

  const theme = useTheme();

  function onClickSearch() {
    console.log(previousSearchKeyword);
    if (searchKeyword === '' || searchKeyword === previousSearchKeyword) return;

    setPreviousSearchKeyword(searchKeyword);
    setSelectedArtist(-1);

    setFetchingData(true);
    setError(false);

    fetchArtists(searchKeyword)
      .then((response) => {
        setArtistSearchResponse(response);
        setFetchingData(false);
      })
      .catch(() => {
        setError(true);
        setPreviousSearchKeyword('');
        setFetchingData(false);
      });
  }

  // TODO: 2022-04-12 11:54:32 @antoniro
  // There is a tight coupling with the structure of response. If
  // the structure of the response sent by ACI changes, or if another
  // api is used, it will potentially break the component.
  // apiServices should be expanded, and/or another service/helper should
  // be created to digest responses, abstract data into objects that can
  // be used by this component. This is also applicable to other components
  function getArtists() {
    // NB: 2022-04-12 16:32:20 @antoniro
    // There is currently a limit on the number of artists that can be
    // fetched (see AIC API documentation). However, if the list was supposed
    // to display a large number of artists, we could make use of pagination
    // to show a small set of artists at a time, or use the react-window
    // component. (https://github.com/bvaughn/react-window)
    const artists = artistSearchResponse?.data.data.map((artist: any) => (
      <ListItem key={artist.id} disablePadding divider dense>
        <ListItemButton
          selected={selectedArtist === artist.id}
          onClick={() => setSelectedArtist(artist.id)}
        >
          <ListItemText primary={artist.title} />
        </ListItemButton>
      </ListItem>
    ));

    return artists;
  }

  function getSelectedArtistData() {
    return artistSearchResponse?.data.data.find(
      (artist: any) => artist.id === selectedArtist
    );
  }

  // TODO: 2022-04-12 16:28:21 @antoniro
  // Consider moving search results into its own component.
  function showSearchResults() {
    if (fetchingData) {
      return <LoadingSpinner message='Searching artists...' />;
    }

    if (error) {
      return (
        <ErrorMessage message='Oops! There was an error while fetching data :(' />
      );
    }

    if (artistSearchResponse == null) {
      return (
        <EmptyComponent message='Please search for artists using search field above.' />
      );
    }

    if (artistSearchResponse?.data.pagination.total < 1) {
      return <EmptyComponent message='No results were found :(' />;
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
        {selectedArtist !== -1 ? (
          <ArtistDetails data={getSelectedArtistData()} />
        ) : (
          <EmptyComponent message='Select an artist to see details.' />
        )}
      </Stack>
    );
  }

  return (
    <Stack sx={{ bgcolor: 'grey.200', flexGrow: 1 }}>
      {/* TODO: 2022-04-12 17:06:23 @antoniro
       * Consider moving app header and search bar into their own components */}
      <AppBar sx={{ bgcolor: 'common.black' }} position='static' elevation={0}>
        <Toolbar className={styles.headerToolbar}>
          <Typography variant='h6'>AIC Simple Search</Typography>
          {/* TODO: 2022-04-12 16:17:47 @antoniro
           * For the implementation of the search bar, a simple input and button
           * were used for simplicity and time. However, it would be more appropriate
           * to use an actual form element with the Controller component provided
           * by react-hook-form. (https://react-hook-form.com/) */}
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
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onClickSearch();
                }}
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
