import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const createJunctureMutation: DocumentNode = gql`
  mutation($userId: Int!, $tripId: Int!, $type: JunctureType!, $name: String!, $arrivalDate: BigInt!, $description: String, $lat: BigFloat!, $lon: BigFloat!, $city: String, $country: String, $isDraft: Boolean, $markerImg: String) {
    createJuncture(input:{
      juncture: {
        userId: $userId,
        tripId: $tripId,
        type: $type,
        name: $name,
        arrivalDate: $arrivalDate,
        description: $description,
        lat: $lat,
        lon: $lon,
        city: $city,
        country: $country,
        isDraft: $isDraft,
        markerImg: $markerImg
      }
    }) {
      juncture {
        id
      }
    }
  }
`;

export const updateJunctureMutation: DocumentNode = gql`
  mutation($junctureId: Int!, $userId: Int, $tripId: Int, $type: JunctureType, $name: String, $arrivalDate: BigInt, $description: String, $lat: BigFloat, $lon: BigFloat, $city: String, $country: String, $isDraft: Boolean, $markerImg: String) {
    updateJunctureById(input:{
      id: $junctureId,
      juncturePatch: {
        userId: $userId,
        tripId: $tripId,
        name: $name,
        arrivalDate: $arrivalDate,
        description: $description,
        type: $type,
        lat: $lat,
        lon: $lon,
        city: $city,
        country: $country,
        isDraft: $isDraft,
        markerImg: $markerImg
      }
    }) {
      juncture {
        id
      }
    }
  }
`;

export const deleteJunctureByIdMutation: DocumentNode = gql`
  mutation($junctureId: Int!) {
    deleteJunctureById (
      input: {
        id: $junctureId
      }
    ) {
      clientMutationId
    }
  }
`;
