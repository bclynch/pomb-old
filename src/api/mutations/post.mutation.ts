import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const deletePostByIdMutation: DocumentNode = gql`
  mutation deletePostById($id: Int!) {
    deletePostById(input: {
      id: $id
    }) {
      post {
        title
      }
    }
  }
`;

export const createPostMutation: DocumentNode = gql`
  mutation createPost($author: Int!, $title: String!, $subtitle: String!, $content: String!, $isDraft: Boolean!, $isScheduled: Boolean!, $isPublished: Boolean!, $tripId: Int, $city: String, $country: String, $junctureId: Int, $scheduledDate: BigInt, $publishedDate: BigInt) {
    createPost(input: {
      post: {
        author: $author,
        title: $title,
        subtitle: $subtitle,
        content: $content,
        isDraft: $isDraft,
        isScheduled: $isScheduled,
        isPublished: $isPublished,
        tripId: $tripId,
        junctureId: $junctureId,
        city: $city,
        country: $country,
        scheduledDate: $scheduledDate,
        publishedDate: $publishedDate
      }
    }) {
      post {
        id
      }
    }
  }
`;

export const updatePostByIdMutation: DocumentNode = gql`
  mutation updatePostById($postId: Int!, $title: String, $subtitle: String, $content: String, $tripId: Int, $junctureId: Int, $city: String, $country: String, $isDraft: Boolean, $isScheduled: Boolean, $isPublished: Boolean, $scheduledDate: BigInt, $publishedDate: BigInt) {
    updatePostById(input:{
      id: $postId,
      postPatch:{
        title: $title,
        subtitle: $subtitle,
        content: $content,
        tripId: $tripId,
        junctureId: $junctureId,
        city: $city,
        country: $country,
        isDraft: $isDraft,
        isScheduled: $isScheduled,
        isPublished: $isPublished,
        scheduledDate: $scheduledDate,
        publishedDate: $publishedDate
      }
    }) {
      post {
        id
      }
    }
  }
`;
