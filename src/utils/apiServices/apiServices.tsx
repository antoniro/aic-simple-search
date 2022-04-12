import axios from 'axios';

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

export function fetchArtists(keyword: string) {
  return axios
    .get(
      `${BASE_URL}${AGENTS_SEARCH_ENDPOINT}?fields=${RELEVANT_AGENT_FIELDS.toString()}`,
      {
        headers: {
          'AIC-User-Agent': USER_AGENT,
        },
        params: {
          params: {
            q: keyword,
            query: {
              term: {
                is_artist: true,
              },
            },
          },
        },
      }
    )
    .catch((error) => {
      console.error('Error fetching data: ', error);
      throw Error(error);
    });
}

export function fetchArtworks(ids: number[]) {
    return axios
    .get(`${BASE_URL}${ARTWORKS_ENDPOINT}`, {
      headers: {
        'AIC-User-Agent': USER_AGENT,
      },
      params: {
        params: {
          fields: RELEVANT_ARTWORK_FIELDS.toString(),
          ids: ids.toString(),
        },
      },
    })
    .catch((error) => {
      console.error('Error fetching data: ', error);
      throw Error(error)
    });
}
