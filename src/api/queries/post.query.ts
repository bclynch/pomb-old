import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

import { fragments as AccountFragments } from '../fragments/account.fragment';
import { fragments as ImageFragments } from '../fragments/image.fragment';
import { fragments as PostFragments } from '../fragments/post.fragment';

export const allPublishedPostsQuery: DocumentNode = gql`
  query allPosts($quantity: Int, $offset: Int) {
    allPosts(
      orderBy: PRIMARY_KEY_DESC
      condition:{
        isPublished: true
      },
      first: $quantity,
      offset: $offset
    ) {
      totalCount,
      nodes {
        ...PostData
        accountByAuthor {
          ...AccountByAuthor
        }
        imagesByPostId {
          nodes {
            ...ImagesByPostId
          }
        }
      }
    }
  }

  ${AccountFragments['accountByAuthor']}
  ${ImageFragments['imagesByPostId']}
  ${PostFragments['postData']}
`;

export const allPostsByUserQuery: DocumentNode = gql`
  query allPosts($author: Int!) {
    allPosts(
      orderBy: PRIMARY_KEY_DESC,
      condition: {
        author: $author
      }
    ) {
      nodes {
        id,
        title,
        updatedAt,
        isDraft,
        isScheduled,
        isPublished
      }
    }
  }
`;

export const postByIdQuery: DocumentNode = gql`
  query postById($id: Int!, $userId: Int) {
    postById(id: $id) {
      id,
      title,
      subtitle,
      content,
      createdAt,
      updatedAt,
      scheduledDate,
      publishedDate,
      tripId,
      junctureId,
      city,
      country,
      accountByAuthor {
        ...AccountByAuthor
      },
      postToTagsByPostId {
        nodes {
          postTagByPostTagId {
            name,
            postToTagsByPostTagId(first: 5, orderBy: ID_DESC) {
              nodes {
                postByPostId {
                  id,
                  title,
                  createdAt,
                  accountByAuthor {
                    ...AccountByAuthor
                  },
                  imagesByPostId {
                    nodes {
                      ...ImagesByPostId
                    }
                  }
                }
              }
            }
          }
        }
      },
      imagesByPostId {
        nodes {
          id,
          type,
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
      },
      likesByUser: likesByPostId(
        condition: {
          userId: $userId
        }
      ) {
        nodes {
          id
        }
      },
      totalLikes: likesByPostId {
        totalCount
      }
    }
  }

  ${AccountFragments['accountByAuthor']}
  ${ImageFragments['imagesByPostId']}
`;

export const postsByTagQuery: DocumentNode = gql`
  query allPostToTags($tagId: String) {
    allPostToTags(
      condition: {
        postTagId: $tagId
      }
    ) {
      nodes {
        postByPostId {
          id,
          title,
          accountByAuthor {
            ...AccountByAuthor
          }
          subtitle,
          createdAt,
          imagesByPostId {
            nodes {
              ...ImagesByPostId,
              title
            }
          }
        }
      }
    }
  }

  ${AccountFragments['accountByAuthor']}
  ${ImageFragments['imagesByPostId']}
`;

export const postsByTripQuery: DocumentNode = gql`
  query getPostsByTrip($id: Int!) {
    tripById(id: $id) {
      postsByTripId(
        first: 10,
        orderBy: ID_DESC
      ) {
        totalCount,
        nodes {
          id,
          title,
          accountByAuthor {
            ...AccountByAuthor
          }
          subtitle,
          createdAt,
          imagesByPostId {
            nodes {
              ...ImagesByPostId
            }
          }
        }
      }
    }
  }

  ${AccountFragments['accountByAuthor']}
  ${ImageFragments['imagesByPostId']}
`;
