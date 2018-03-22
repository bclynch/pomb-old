import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

import { fragments as ImageFragments } from '../fragments/image.fragment';

export const allImagesByUserQuery: DocumentNode = gql`
  query allImages($userId: Int, $first: Int, $offset: Int) {
    allImages(
      condition:{
        userId: $userId
      },
      first: $first,
      offset: $offset,
      filter: {
        type: {
          notEqualTo: LEAD_SMALL
        }
      },
      orderBy: PRIMARY_KEY_DESC
    ) {
      nodes {
        ...Image
      }
    }
  }

  ${ImageFragments['image']}
`;

export const allImagesByTripQuery: DocumentNode = gql`
  query allImages($tripId: Int!, $first: Int, $offset: Int, $userId: Int) {
    allImages(
      condition: {
        tripId: $tripId
      },
      first: $first,
      offset: $offset,
      filter: {
        type: {
          notEqualTo: LEAD_SMALL
        }
      },
      orderBy: PRIMARY_KEY_DESC
    ) {
      nodes {
        ...Image
      }
    }
  }

  ${ImageFragments['image']}
`;

export const recentImagesQuery: DocumentNode = gql`
  query allImages($last: Int, $userId: Int) {
    allImages(
      condition: {
        type: GALLERY
      },
      last: $last,
    ) {
      nodes {
        ...Image
      }
    }
  }

  ${ImageFragments['image']}
`;
