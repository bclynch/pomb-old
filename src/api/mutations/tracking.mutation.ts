import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const createTrackMutation: DocumentNode = gql`
  mutation($userId: Int!, $trackUserId: Int!) {
    createTrack(
      input: {
        track: {
          userId: $userId,
          trackUserId: $trackUserId
        }
      }
    ) {
      clientMutationId
    }
  }
`;

export const deleteTrackByIdMutation: DocumentNode = gql`
  mutation($trackId: Int!) {
    deleteTrackById(
      input: {
        id: $trackId
      }
    ) {
      clientMutationId
    }
  }
`;
