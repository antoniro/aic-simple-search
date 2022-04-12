import React, { useEffect, useState } from 'react';

import { AxiosResponse } from 'axios';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import AccordionDetails from '@mui/material/AccordionDetails';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import styles from './ArtistDetails.module.css';

import ErrorMessage from '../common/ErrorMessage';
import EmptyComponent from '../common/EmptyComponent';
import LoadingSpinner from '../common/LoadingSpinner';

import { fetchArtworks } from '../../utils/apiServices/apiServices';
import { getDateSpan } from '../../utils/helpers/helpers';



type ArtistProps = {
  data: any;
};

const MAX_NUM_OF_ARTWORKS = 5;

function ArtistDetails(artistProps: ArtistProps) {
  const [artistArtworksResponse, setArtistArtworksResponse] =
    useState<AxiosResponse>();
  const [error, setError] = useState<boolean>(false);
  const [fetchingData, setFetchingData] = useState<boolean>(false);

  useEffect(() => {
    getArtistArtworks();
  }, [artistProps.data]);

  function getArtistArtworks() {
    setFetchingData(true);
    setError(false);

    const artwork_ids = artistProps.data.artwork_ids.slice(
      0,
      MAX_NUM_OF_ARTWORKS
    );

    fetchArtworks(artwork_ids)
      .then((response) => {
        setArtistArtworksResponse(response);
        setFetchingData(false);
      })
      .catch((error) => {
        console.error('Error fetching data: ', error);
        setError(true);
        setFetchingData(false);
      });
  }

  function showArtworks() {
    if (fetchingData) {
      return <LoadingSpinner message='Loading artworks...' />;
    }

    if (error) {
      return (
        <ErrorMessage message='Oops! There was an error while retrieving artworks :(' />
      );
    }

    // TODO 2022-04-12 11:54:32 @antoniro
    // There is a tight coupling with the structure of response. If
    // the structure of the response sent by ACI changes, or if another
    // api is used, it will potentially break the component.
    // apiServices should be expanded, and/or another service/helper should
    // be created to digest responses, abstract data into objects that can  
    // be used by this component. This is also applicable to other components
    if (artistArtworksResponse?.data.data.length < 1) {
      return (
        <EmptyComponent message={`This artist doesn't have any artworks.`} />
      );
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
            <img src={imgUrl} className={styles.artworkImage} />
          </AccordionDetails>
        </Accordion>
      );
    });

    return artworks;
  }

  return (
    <Container sx={{ width: '100%', flexShrink: 1 }}>
      <Stack sx={{ margin: 2, alignItems: 'center' }}>
        <Typography textAlign='center' variant='h6'>
          {artistProps.data.title}
        </Typography>
        <Typography textAlign='center' variant='subtitle2'>
          {getDateSpan(
            artistProps.data.birth_date,
            artistProps.data.death_date
          )}
        </Typography>
      </Stack>

      <div>{showArtworks()}</div>
    </Container>
  );
}

export default ArtistDetails;
