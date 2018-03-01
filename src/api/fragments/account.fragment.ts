import { DocumentNode } from 'graphql';

import gql from 'graphql-tag';

export const fragments: {
  [key: string]: DocumentNode,
} = {
  accountByAuthor: gql`
    fragment AccountByAuthor on Account {
      id,
      firstName,
      lastName,
      username
    }
  `,
};
