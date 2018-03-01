import { DocumentNode } from 'graphql';

import gql from 'graphql-tag';

export const fragments: {
  [key: string]: DocumentNode,
} = {
  tripsByUserId: gql`
    fragment TripsByUserId on Trip {
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
          url
        }
      }
    }
  `,
};
