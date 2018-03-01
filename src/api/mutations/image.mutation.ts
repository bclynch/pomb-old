import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const deleteImageByIdMutation: DocumentNode = gql`
  mutation deleteImageById($id: Int!) {
    deleteImageById(input:{
      id: $id
    }) {
      clientMutationId
    }
  }
`;

export const createImageMutation: DocumentNode = gql`
  mutation createImage($tripId: Int, $junctureId: Int, $postId: Int, $userId: Int!, $type: ImageType!, $url: String!, $title: String, $description: String) {
    createImage(
      input: {
        image:{
          tripId: $tripId,
          junctureId: $junctureId,
          postId: $postId,
          userId: $userId,
          type: $type,
          url: $url,
          title: $title,
          description: $description
        }
      }
    ) {
      clientMutationId
    }
  }
`;
