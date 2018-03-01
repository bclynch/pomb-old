import { DocumentNode } from 'graphql';

import gql from 'graphql-tag';

export const fragments: {
  [key: string]: DocumentNode,
} = {
  imagesByPostId: gql`
    fragment ImagesByPostId on Image {
      id,
      url,
      type,
      accountByUserId {
        id
      }
    }
  `,
  image: gql`
    fragment Image on Image {
      id,
      url,
      description,
      title,
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
  `
};
