import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const createPostTagMutation: DocumentNode = gql`
  mutation createPostTag($name: String!, $tagDescription: String) {
    createPostTag(input:{
      postTag:{
        name: $name,
        tagDescription: $tagDescription
      }
    }) {
      postTag {
        name
      }
    }
  }
`;

export const deletePostToTagByIdMutation: DocumentNode = gql`
  mutation deletePostToTagById($id: Int!) {
    deletePostToTagById(input:{
      id: $id
    }) {
      clientMutationId
    }
  }
`;
