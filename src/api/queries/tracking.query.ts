import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

import { fragments as AccountFragments } from '../fragments/account.fragment';

export const checkTrackingByUserQuery: DocumentNode = gql`
  query checkTrackingByUser($trackedUser: Int!, $trackingUser: Int!) {
    accountById (
      id: $trackedUser
    ) {
      tracksByTrackUserId(
        condition: {
          userId: $trackingUser
        }
      ) {
        nodes {
          id
        }
      }
    }
  }
`;

export const userTrackedTripsQuery: DocumentNode = gql`
  query getUserTrackedTrips($username: String!) {
    accountByUsername(username: $username) {
      tracksByUserId {
        totalCount,
        nodes {
          accountByTrackUserId {
            ...AccountByAuthor
            profilePhoto,
            tripsByUserId (
              orderBy: START_DATE_DESC
            ) {
              nodes {
                id,
                name,
                startDate,
                endDate,
                imagesByTripId(
                  condition: {
                    type: BANNER,
                  },
                  first: 1
                ) {
                  nodes {
                    id,
                    url
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  ${AccountFragments['accountByAuthor']}
`;
