import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

import { fragments as AccountFragments } from '../fragments/account.fragment';

export const fragments: {
  [key: string]: DocumentNode,
} = {
  junctureData: gql`
    fragment JunctureData on Juncture {
      id,
      name,
      arrivalDate,
      description,
      city,
      country,
      type,
      postsByJunctureId {
        nodes {
          id,
          title,
          accountByAuthor {
            ...AccountByAuthor
          },
          publishedDate,
          imagesByPostId {
            nodes {
              id,
              url,
              type,
              accountByUserId {
                id
              }
            }
          }
        }
      },
      imagesByJunctureId(
        condition:{
          type: GALLERY
        }
      ) {
        nodes {
          id,
          postId,
          type,
          url,
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

    ${AccountFragments['accountByAuthor']}
  `,
};
