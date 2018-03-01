import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

import { fragments as AccountFragments } from '../fragments/account.fragment';

export const tripByIdQuery: DocumentNode = gql`
  query tripById($id: Int!, $userId: Int) {
    tripById(id: $id) {
      id,
      name,
      startDate,
      endDate,
      startLat,
      startLon,
      description,
      juncturesByTripId {
        totalCount,
        nodes {
          name,
          lat,
          lon,
          arrivalDate,
          id,
          markerImg,
          description,
          type,
          city,
          country,
          coordsByJunctureId {
            nodes {
              lat,
              lon,
              elevation,
              coordTime
            }
          }
        }
      },
      accountByUserId {
        ...AccountByAuthor
        profilePhoto
      },
      imagesByTripId {
        totalCount,
        nodes {
          id,
          url,
          title,
          type,
          description,
          accountByUserId {
            id,
            username
          },
          likesByUser: likesByImageId(
            condition: {
              userId: $userId
            }
          ) {
            nodes {
              id
            }
          },
          totalLikes: likesByImageId {
            totalCount
          }
        }
      }
      likesByUser: likesByTripId(
        condition: {
          userId: $userId
        }
      ) {
        nodes {
          id
        }
      },
      totalLikes: likesByTripId {
        totalCount
      }
    }
  }

  ${AccountFragments['accountByAuthor']}
`;

export const tripsByUserQuery: DocumentNode = gql`
  query allTrips($id: Int!) {
    allTrips (
      condition: {
        userId: $id
      }
    ) {
      nodes {
        id,
        name,
        juncturesByTripId {
          nodes {
            name,
            id,
            city,
            country
          }
        }
      }
    }
  }
`;

export const tripsUserDashboardQuery: DocumentNode = gql`
  query allTrips($id: Int!) {
    allTrips (
      condition: {
        userId: $id
      }
    ) {
      nodes {
        id,
        name,
        startDate,
        endDate,
        juncturesByTripId {
          nodes {
            id
            name,
            arrivalDate,
            city,
            country
          }
        },
        imagesByTripId {
          nodes {
            id,
            url
          }
        }
      }
    }
  }
`;

export const tripsByUserIdQuery: DocumentNode = gql`
  query tripsByUserId($userId: Int!) {
    allTrips(
      condition: {
        userId: $userId
      },
      orderBy: PRIMARY_KEY_DESC
    ) {
      nodes {
        id,
        name
      }
    }
  }
`;
