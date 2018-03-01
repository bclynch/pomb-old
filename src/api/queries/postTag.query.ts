import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const allPostTagsQuery: DocumentNode = gql`
  query allPostTags {
    allPostTags {
      nodes {
        id,
        name,
        tagDescription
      }
    }
  }
`;

export const tagByNameQuery: DocumentNode = gql`
  query allPostTags($tagName: String!) {
    allPostTags(condition: {
      name: $tagName
    }) {
      nodes {
        id,
        tagDescription
      }
    }
  }
`;
