import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const updateConfigMutation: DocumentNode = gql`
  mutation updateConfig($primaryColor: String!, $secondaryColor: String!, $tagline: String!, $heroBanner: String!) {
    updateConfigById(input:{
      id: 1,
      configPatch: {
        primaryColor: $primaryColor,
        secondaryColor: $secondaryColor,
        tagline: $tagline,
        heroBanner: $heroBanner
      }
    }) {
      clientMutationId
    }
  }
`;
