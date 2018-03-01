import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const createLikeMutation: DocumentNode = gql`
  mutation($tripId: Int, $junctureId: Int, $postId: Int, $imageId: Int, $userId: Int!) {
    createLike(
      input: {
        like: {
          tripId: $tripId,
          junctureId: $junctureId,
          postId: $postId,
          imageId: $imageId,
          userId: $userId
        }
      }
    ) {
      likeEdge {
        node {
          id
        }
      }
    }
  }
`;

export const deleteLikeMutation: DocumentNode = gql`
  mutation($likeId: Int!) {
    deleteLikeById(
      input: {
        id: $likeId
      }
    ) {
      clientMutationId
    }
  }
`;
