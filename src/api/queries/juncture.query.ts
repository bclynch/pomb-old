import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

import { fragments as JunctureFragments } from '../fragments/juncture.fragment';

export const partialJunctureByIdQuery: DocumentNode = gql`
  query junctureById($id: Int!, $userId: Int) {
    junctureById(id: $id) {
      ...JunctureData
    }
  }

  ${JunctureFragments['junctureData']}
`;

export const fullJunctureByIdQuery: DocumentNode = gql`
  query junctureById($id: Int!, $userId: Int) {
    junctureById(id: $id) {
      ...JunctureData
      lat,
      lon,
      markerImg,
      userId,
      coordsByJunctureId {
        nodes {
          id,
          lat,
          lon,
          elevation,
          coordTime
        }
      },
      tripByTripId {
        id,
        name,
        juncturesByTripId {
          nodes {
            name
            id
          }
        }
      }
      likesByUser: likesByJunctureId(
        condition: {
          userId: $userId
        }
      ) {
        nodes {
          id
        }
      },
      totalLikes: likesByJunctureId {
        totalCount
      }
    }
  }

  ${JunctureFragments['junctureData']}
`;
