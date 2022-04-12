import { useEffect, useState } from 'react';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Container,
  Stack,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios, { AxiosResponse } from 'axios';

import styles from './ArtistDetails.module.css';

type ArtistProps = {
  data: any;
};

const BASE_URL = 'https://api.artic.edu/api/v1';
const ARTWORKS_ENDPOINT = '/artworks';
const RELEVANT_ARTWORK_FIELDS = [
  'id',
  'title',
  'thumbnail',
  'date_display',
  'place_of_origin',
  'image_id',
];
const USER_AGENT = 'AIC Simple Search (anthony.gbegan@gmail.com)';
const MAX_NUM_OF_ARTWORKS = 5;

function ArtistDetails(artistProps: ArtistProps) {
  const [artistArtworksResponse, setArtistArtworksResponse] =
    useState<AxiosResponse>();
  const [error, setError] = useState();
  const [fetchingData, setFetchingData] = useState<boolean>(false);

  useEffect(() => {
    searchArtworks();
  }, [artistProps.data]);

  function searchArtworks() {
    setFetchingData(true);

    const artwork_ids = artistProps.data.artwork_ids.slice(
      0,
      MAX_NUM_OF_ARTWORKS
    );

    axios
      .get(`${BASE_URL}${ARTWORKS_ENDPOINT}?limit=5`, {
        headers: {
          'AIC-User-Agent': USER_AGENT,
        },
        params: {
          params: {
            fields: RELEVANT_ARTWORK_FIELDS.toString(),
            ids: artwork_ids.toString(),
          },
        },
      })
      .then((response) => {
        setArtistArtworksResponse(response);
        setFetchingData(false);
      })
      .catch((error) => {
        console.error('Error fetching data: ', error);
        setError(error);
        setFetchingData(false);
      });
  }

  function getArtworks() {
    if(fetchingData) {
      return getLoadingSpinner('Loading artworks...');
    }

    const artworks = artistArtworksResponse?.data.data.map((artwork: any) => {
      const imgUrl = `${artistArtworksResponse.data.config.iiif_url}/${artwork.image_id}/full/843,/0/default.jpg`;
      return (
        <Accordion key={artwork.id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontWeight: '500' }}>{artwork.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>Time period: {artwork.date_display}</Typography>
            <Typography>Origin: {artwork.place_of_origin}</Typography>
            <Typography>Illustration:</Typography>
            <img src={imgUrl} />
          </AccordionDetails>
        </Accordion>
      );
    });

    return artworks;
  }

  function getDateSpan() {
    let dateSpan = '';

    if (artistProps.data.birth_date != null) {
      dateSpan =
        artistProps.data.death_date != null
          ? `(${artistProps.data.birth_date} - ${artistProps.data.death_date})`
          : `(${artistProps.data.birth_date})`;
    }

    return dateSpan;
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

  return (
    <Container sx={{ width: '100%', flexShrink: 1 }}>
      <Stack sx={{ margin: 2, alignItems: 'center' }}>
        <Typography textAlign='center' variant='h6'>{artistProps.data.title}</Typography>
        <Typography textAlign='center' variant='subtitle2'>{getDateSpan()}</Typography>
      </Stack>

      <div className={styles.artworkList}>{getArtworks()}</div>
    </Container>
  );
}

export default ArtistDetails;
