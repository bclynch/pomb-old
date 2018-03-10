import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

import { fragments as AccountFragments } from '../fragments/account.fragment';
import { fragments as TripFragments } from '../fragments/trip.fragment';

export const currentAccountQuery: DocumentNode = gql`
  query currentAccount {
    currentAccount {
      id,
      firstName,
      lastName,
      username,
      profilePhoto,
      heroPhoto,
      userStatus,
      city,
      country,
      autoUpdateLocation,
      autoUpdateVisited,
      userToCountriesByUserId {
        nodes {
          id,
          countryByCountry {
            code,
            name
          }
        }
      }
    }
  }
`;

export const accountByUsernameQuery: DocumentNode = gql`
  query accountByUsername($username: String!, $userId: Int) {
    accountByUsername(username: $username) {
      id,
      username,
      firstName,
      lastName,
      profilePhoto,
      heroPhoto,
      city,
      country,
      userStatus,
      postsByAuthor (
        condition: {
          isPublished: true
        },
        last: 11
      ) {
        nodes {
          id,
          title,
          accountByAuthor {
            ...AccountByAuthor
          }
          imagesByPostId(condition:{
            type: LEAD_LARGE
          }) {
            nodes {
              url,
              type
            }
          }
        }
      },
      imagesByUserId(last: 12) {
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
      tripsByUserId (
        last: 5
      ) {
        nodes {
          ...TripsByUserId
        }
      },
      totalJunctureCount: juncturesByUserId {
        totalCount
      },
      totalImageCount: imagesByUserId {
        totalCount
      },
      totalPostCount: postsByAuthor {
        totalCount
      }
      totalTripCount: tripsByUserId {
        totalCount
      },
      tracksByUserId {
        totalCount
      },
      tracksByTrackUserId {
        totalCount
      },
      userToCountriesByUserId(
        orderBy: COUNTRY_ASC
      ) {
        nodes {
          countryByCountry {
            code,
            name
          }
        }
      }
    }
  }

  ${AccountFragments['accountByAuthor']}
  ${TripFragments['tripsByUserId']}
`;

export const recentUserActivityQuery: DocumentNode = gql`
  query accountByUsername($username: String!) {
    accountByUsername(username: $username) {
      tripsByUserId(last: 1) {
        nodes {
          ...TripsByUserId
        }
      },
      juncturesByUserId(first: 2, orderBy: PRIMARY_KEY_DESC) {
        nodes {
          id,
          name,
          markerImg,
          city,
          country,
          type
        }
      },
      postsByAuthor(
        first: 3,
        condition: {
          isPublished: true
        },
        orderBy: PRIMARY_KEY_DESC
      ) {
        nodes {
          title,
          id,
          imagesByPostId(
            condition: {
              type: LEAD_SMALL
            }
          ) {
            nodes {
              url
            }
          },
          createdAt
        }
      }
    }
  }

  ${TripFragments['tripsByUserId']}
`;
