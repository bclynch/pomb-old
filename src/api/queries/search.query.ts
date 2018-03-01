import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

import { fragments as AccountFragments } from '../fragments/account.fragment';

export const searchSiteQuery: DocumentNode = gql`
  query searchSite($query: String!) {
    searchTrips(
      query: $query,
      first: 5
    ) {
      nodes {
        id,
        name
      }
    },
    searchPosts(
      query: $query,
      first: 10
    ) {
      nodes {
        id,
        title,
        subtitle,
        createdAt
      }
    }
    searchAccounts(
      query: $query,
      first: 10
    ) {
      nodes {
        ...AccountByAuthor
        profilePhoto
      }
    }
  }

  ${AccountFragments['accountByAuthor']}
`;

export const searchTagsQuery: DocumentNode = gql`
  query searchTags($query: String!) {
    searchTags(query: $query) {
      nodes {
        name
      }
    }
  }
`;

export const searchPostsQuery: DocumentNode = gql`
  query searchPosts($query: String!, $postStatus: String) {
    searchPosts(
      query: $query,
      first: 10
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

export const searchCountriesQuery: DocumentNode = gql`
  query searchCountries($query: String!) {
    searchCountries(query: $query) {
      nodes {
        code,
        name
      }
    }
  }
`;
