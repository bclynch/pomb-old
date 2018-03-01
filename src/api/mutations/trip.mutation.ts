import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const createTripMutation: DocumentNode = gql`
  mutation($userId: Int!, $name: String!, $description: String, $startDate: BigInt!, $endDate: BigInt, $startLat: BigFloat!, $startLon: BigFloat!) {
    createTrip(input:{
      trip:{
        userId: $userId,
        name: $name,
        description: $description,
        startDate: $startDate,
        endDate: $endDate,
        startLat: $startLat,
        startLon: $startLon
      }
    }) {
      trip {
        id
      }
    }
  }
`;

export const updateTripMutation: DocumentNode = gql`
  mutation($tripId: Int!, $name: String, $description: String, $startDate: BigInt, $endDate: BigInt, $startLat: BigFloat, $startLon: BigFloat) {
    updateTripById (
      input: {
        id: $tripId,
        tripPatch:{
          name: $name,
          description: $description,
          startDate: $startDate,
          endDate: $endDate,
          startLat: $startLat,
          startLon: $startLon
        }
      }
    ) {
      trip {
        id
      }
    }
  }
`;

export const deleteTripByIdMutation: DocumentNode = gql`
  mutation($tripId: Int!) {
    deleteTripById (
      input: {
        id: $tripId
      }
    ) {
      clientMutationId
    }
  }
`;
