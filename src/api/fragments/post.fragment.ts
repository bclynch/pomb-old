import { DocumentNode } from 'graphql';

import gql from 'graphql-tag';

export const fragments: {
  [key: string]: DocumentNode,
} = {
  postData: gql`
    fragment PostData on Post {
      id,
      title,
      subtitle,
      content,
      publishedDate,
      updatedAt
    }
  `,
};
