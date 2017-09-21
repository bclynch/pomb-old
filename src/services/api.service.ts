import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs';

import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';

import { AlertService } from './alert.service';

import { PostCategory } from '../models/Post.model';

//////////////////////////
/////////// queries
////////////////////////
const currentAccountQuery = gql`
  query currentAccount {
    currentAccount {
      id,
      firstName,
      lastName,
      username
    }
  }
`;

const getAllPosts = gql`
  query allPosts {
    allPosts {
      nodes {
        id,
        title,
        subtitle,
        content,
        category,
        createdAt,
        updatedAt,
        isDraft,
        isScheduled,
        isPublished,
        scheduledDate,
        publishedDate,
        accountByAuthor {
          firstName,
          lastName
        },
        postToTagsByPostId {
          nodes {
            id,
            postTagByPostTagId {
              name,
              id
            }
          }
        },
        postToCommentsByPostId {
          nodes {
            postCommentByCommentId {
              accountByAuthor {
              firstName 
              },
              content,
              createdAt
            }
          }
        },
        postLeadPhotosByPostId {
          nodes {
            id,
            title,
            leadPhotoLinksByLeadPhotoId {
              nodes {
                url,
                size
              }
            }
          }
        },
        postToGalleryPhotosByPostId {
          nodes {
            id,
            galleryPhotoUrl,
            description
          }
        }
      }
    }
  }
`;

const getPostsByStatus = gql`
query allPosts($isDraft: Boolean!, $isScheduled: Boolean!, $isPublished: Boolean!) {
  allPosts(condition: {
    isDraft: $isDraft,
    isScheduled: $isScheduled,
    isPublished: $isPublished
  }) {
    nodes {
      id,
      title,
      subtitle,
      content,
      category,
      createdAt,
      updatedAt,
      isDraft,
      isScheduled,
      isPublished,
      scheduledDate,
      publishedDate,
      accountByAuthor {
        firstName,
        lastName
      },
      postToTagsByPostId {
        nodes {
          id,
          postTagByPostTagId {
            name,
            id
          }
        }
      },
      postToCommentsByPostId {
        nodes {
          postCommentByCommentId {
            accountByAuthor {
            firstName 
            },
            content,
            createdAt
          }
        }
      },
      postLeadPhotosByPostId {
        nodes {
          id,
          title,
          leadPhotoLinksByLeadPhotoId {
            nodes {
              url,
              size
            }
          }
        }
      },
      postToGalleryPhotosByPostId {
        nodes {
          id,
          galleryPhotoUrl,
          description
        }
      }
    }
  }
}
`;

const getAllPostTags = gql`
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

const getConfig = gql`
query allConfigs {
  allConfigs {
    nodes {
      primaryColor,
      secondaryColor,
      tagline,
      heroBanner
    }
  }
}
`;

const getPostById = gql` 
  query postById($id: Int!) {
    postById(id: $id) {
      id,
      title,
      subtitle,
      content,
      category,
      createdAt,
      updatedAt,
      scheduledDate,
      publishedDate,
      accountByAuthor {
        firstName,
        lastName
      },
      postToTagsByPostId {
        nodes {
          id,
          postTagByPostTagId {
            name,
            id
          }
        }
      },
      postToCommentsByPostId {
        nodes {
          postCommentByCommentId {
            accountByAuthor {
            firstName 
            },
            content,
            createdAt
          }
        }
      },
      postLeadPhotosByPostId {
        nodes {
          id,
          title,
          leadPhotoLinksByLeadPhotoId {
            nodes {
              url,
              size
            }
          }
        }
      },
      postToGalleryPhotosByPostId {
        nodes {
          id,
          galleryPhotoUrl,
          description
        }
      }
    }
  }
`;

const getPostsByTag = gql`
  query postsByTag($tagId: Int!) {
    postsByTag(tagId: $tagId) {
      nodes {
        id,
        title,
        accountByAuthor {
          firstName,
          lastName
        }
        subtitle,
        createdAt,
        postLeadPhotosByPostId {
          nodes {
            id,
            title,
            leadPhotoLinksByLeadPhotoId {
              nodes {
                url,
                size
              }
            }
          }
        }
      }
    }
  }
`;

const getPostsByCategory = gql`
  query allPosts($category: PostCategory) {
    allPosts(condition:{
      category: $category
    }) {
      nodes {
        id,
        title,
        accountByAuthor {
          firstName,
          lastName
        }
        subtitle,
        createdAt,
        postLeadPhotosByPostId {
          nodes {
            id,
            title,
            leadPhotoLinksByLeadPhotoId {
              nodes {
                url,
                size
              }
            }
          }
        }
      }
    }
  }
`;

const getTagByName = gql`
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

const searchPostsQuery = gql`
  query searchPosts($query: String!) {
    searchPosts(query: $query) {
      nodes {
        id,
        title,
        subtitle,
        createdAt,
        updatedAt
      }
    }
  }
`;

const searchTags = gql`
  query searchTags($query: String!) {
    searchTags(query: $query) {
      nodes {
        id,
        name
      }
    }
  }
`;

//////////////////////////
/////////// mutations
////////////////////////
const registerAccount = gql`
  mutation registerAccount($username: String!, $firstName: String!, $lastName: String!, $password: String!, $email: String!) {
    registerAccount(input:{
      username: $username
      firstName: $firstName,
      lastName: $lastName,
      password: $password,
      email: $email,
    }) 
    {
      account {
        id,
        firstName,
        lastName,
        username
      }
    }
  }
`;
const authAccount = gql`
  mutation authAccount($email: String!, $password: String!) {
    authenticateAccount(input:{
      email: $email,
      password: $password
    }) {
      jwtToken
    }
  }
`;
const deletePostById = gql`
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
const createPost = gql`
  mutation createPost($author: Int!, $title: String!, $subtitle: String!, $content: String!, $category: PostCategory!, $isDraft: Boolean!, $isScheduled: Boolean!, $isPublished: Boolean!, $scheduledDate: BigInt, $publishedDate: BigInt) {
    createPost(input: {
      post: {
        author: $author,
        title: $title,
        subtitle: $subtitle,
        content: $content,
        category: $category,
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
const createPostTag = gql`
  mutation createPostTag($name: String!, $tagDescription: String) {
    createPostTag(input:{
      postTag:{
        name: $name,
        tagDescription: $tagDescription
      }
    }) {
      postTag {
        id,
        name
      }
    }
  }
`;
const createPostToTag = gql`
mutation createPostToTag($postId: Int!, $postTagId: Int!) {
  createPostToTag(input: {
    postToTag:{
      postId: $postId,
      postTagId: $postTagId
    }
  }) {
    clientMutationId
  }
}
`;
const deletePostToTagById = gql`
  mutation deletePostToTagById($id: Int!) {
    deletePostToTagById(input:{
      id: $id
    }) {
      clientMutationId
    }
  }
`;
const deletePostToGalleryPhotoById = gql`
  mutation deletePostToGalleryPhotoById($id: Int!) {
    deletePostToGalleryPhotoById(input:{
      id: $id
    }) {
      clientMutationId
    }
  }
`;
const processPost = gql`
  mutation processPost($postId: Int!, $photoTitle: String!, $size: Int!, $photoURL: String!) {
    createPostLeadPhoto(input: {
      postLeadPhoto: {
        postId: $postId,
        title: $photoTitle
      }
    }) {
      clientMutationId
    },
    createLeadPhotoLink(input:{
      leadPhotoLink: {
        leadPhotoId: $postId,
        size: $size,
        url: $photoURL
      }
    }) {
      leadPhotoLink {
        id
      }
    }
  }
`;
const updateConfig = gql`
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

const updatePostById = gql`
  mutation updatePostById($postId: Int!, $title: String, $subtitle: String, $content: String, $category: PostCategory!, $isDraft: Boolean, $isScheduled: Boolean, $isPublished: Boolean, $scheduledDate: BigInt, $publishedDate: BigInt) {
    updatePostById(input:{
      id: $postId,
      postPatch:{
        title: $title,
        subtitle: $subtitle,
        content: $content,
        isDraft: $isDraft,
        category: $category,
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

const updateLeadPhotoInfo = gql`
  mutation updatePostLeadPhotoById($id: Int!, $title: String) {
    updatePostLeadPhotoById(input:{
      id: $id,
      postLeadPhotoPatch:{
        title: $title
      }
    }) {
      clientMutationId
    }
  }
`;

@Injectable()
export class APIService {

  constructor(
    private http: Http,
    private apollo: Apollo,
    private alertService: AlertService
  ) {}

  //S3 Uploads
  uploadPrimaryPhoto(formData: FormData) {
    return this.http.post('http://localhost:8080/upload-primary', formData)
      .map(
        (response: Response) => {
          const data = response.json();
          return data;
        }
      )
      .catch(
        (error: Response) => {
          return Observable.throw('Something went wrong');
        }
      );
  }

  uploadPostPhoto(formData: FormData, size: string) {
    return this.http.post(`http://localhost:8080/upload-post-photo/${size}`, formData)
      .map(
        (response: Response) => {
          const data = response.json();
          return data;
        }
      )
      .catch(
        (error: Response) => {
          return Observable.throw('Something went wrong');
        }
      );
  }

  uploadBannerPhoto(formData: FormData) {
    return this.http.post('http://localhost:8080/upload-hero-banner', formData)
      .map(
        (response: Response) => {
          const data = response.json();
          return data;
        }
      )
      .catch(
        (error: Response) => {
          return Observable.throw('Something went wrong');
        }
      );
  }

  uploadGalleryPhotos(formData: FormData) {
    return this.http.post('http://localhost:8080/upload-gallery', formData)
      .map(
        (response: Response) => {
          const data = response.json();
          return data;
        }
      )
      .catch(
        (error: Response) => {
          return Observable.throw('Something went wrong');
        }
      );
  }

  // Graphql Queries
  getCurrentAccount(): any {
    return this.apollo.watchQuery<any>({
      query: currentAccountQuery
    });
  }

  getAllPosts() {
    return this.apollo.watchQuery<any>({
      query: getAllPosts
    });
  }

  getPostsByStatus(isDraft: boolean, isScheduled: boolean, isPublished: boolean) {
    return this.apollo.watchQuery<any>({
      query: getPostsByStatus,
      variables: {
        isDraft,
        isScheduled,
        isPublished
      }
    });
  }

  getPostById(postId: number) {
    return this.apollo.watchQuery<any>({
      query: getPostById,
      variables: {
          id: postId
      }
    });
  }

  getPostsByTag(tagId: number) {
    return this.apollo.watchQuery<any>({
      query: getPostsByTag,
      variables: {
        tagId
      }
    });
  }

  getPostsByCategory(category: PostCategory) {
    return this.apollo.watchQuery<any>({
      query: getPostsByCategory,
      variables: {
        category
      }
    });
  }

  getAllPostTags() {
    return this.apollo.watchQuery<any>({
      query: getAllPostTags
    });
  }

  getConfig() {
    return this.apollo.watchQuery<any>({
      query: getConfig
    });
  }
  
  getTagByName(tagName: string) {
    return this.apollo.watchQuery<any>({
      query: getTagByName,
      variables: {
        tagName
      }
    });
  }

  searchPosts(query: string) {
    return this.apollo.watchQuery<any>({
      query: searchPostsQuery,
      variables: {
        query
      }
    });
  }

  searchTags(query: string) {
    return this.apollo.watchQuery<any>({
      query: searchTags,
      variables: {
        query
      }
    });
  }

  // Graphql mutations
  registerAccount(username: string, firstName: string, lastName: string, password: string, email: string) {
    return this.apollo.mutate({
      mutation: registerAccount,
      variables: {
        username,
        firstName,
        lastName,
        password,
        email
      }
      });
    }

  authAccount(email: string, password: string) {
    return this.apollo.mutate({
      mutation: authAccount,
      variables: {
        email,
        password
      }
    });
  }

  deletePostById(id: number) {
    return this.apollo.mutate({
      mutation: deletePostById,
      variables: {
        id
      }
    });
  }

  createPost(author: number, title: string, subtitle: string, content: string, category: PostCategory, isDraft: boolean, isScheduled: boolean, isPublished: boolean, scheduledDate?: number, publishedDate?: number) {
    return this.apollo.mutate({
      mutation: createPost,
      variables: {
        author,
        title,
        subtitle,
        content,
        category,
        isDraft,
        isScheduled,
        isPublished,
        scheduledDate: scheduledDate ? scheduledDate : null,
        publishedDate: publishedDate ? publishedDate : null
      }
    });
  }

  createPostTag(name: string, tagDescription?: string) {
    return this.apollo.mutate({
      mutation: createPostTag,
      variables: {
        name,
        tagDescription
      }
    });
  }

  createPostToTag(mutation: string) {
    return this.apollo.mutate({
      mutation: gql`${mutation}`
    });
  }

  deletePostToTagById(id: number) {
    return this.apollo.mutate({
      mutation: deletePostToTagById,
      variables: {
        id
      }
    });
  }

  deletePostToGalleryPhotoById(id: number) {
    return this.apollo.mutate({
      mutation: deletePostToGalleryPhotoById,
      variables: {
        id
      }
    });
  }

  processPost(postId: number, photoTitle: string, size: number, photoURL: string) {
    return this.apollo.mutate({
      mutation: processPost,
      variables: {
        postId,
        photoTitle,
        size,
        photoURL
      }
    });
  }

  updateConfig(primaryColor: string, secondaryColor: string, tagline: string, heroBanner: string) {
    return this.apollo.mutate({
      mutation: updateConfig,
      variables: {
        primaryColor,
        secondaryColor,
        tagline,
        heroBanner
      }
    });
  }

  updatePostById(postId: number, title: string, subtitle: string, content: string, category: PostCategory, isDraft: boolean, isScheduled: boolean, isPublished: boolean, scheduledDate?: number, publishedDate?: number) {
    return this.apollo.mutate({
      mutation: updatePostById,
      variables: {
        postId,
        title,
        subtitle,
        content,
        category,
        isDraft,
        isScheduled,
        isPublished,
        scheduledDate: scheduledDate ? scheduledDate : null,
        publishedDate: publishedDate ? publishedDate : null
      }
    });
  }

  updateLeadPhotoInfo(id: number, title: string) {
    return this.apollo.mutate({
      mutation: updateLeadPhotoInfo,
      variables: {
        id,
        title
      }
    });
  }
}