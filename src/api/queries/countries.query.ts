import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const allCountriesQuery: DocumentNode = gql`
  query getAllCountries {
    allCountries {
      nodes {
        code,
        name
      }
    }
  }
`;
