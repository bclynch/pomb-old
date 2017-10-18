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

const getAllPublishedPosts = gql`
  query allPosts {
    allPosts(
      orderBy: PRIMARY_KEY_DESC
      condition:{
        isPublished: true
      }
    ) {
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
          lastName,
          username
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
                id,
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

const getAllPostsByUser = gql`
query allPosts($author: Int!) {
  allPosts(
    orderBy: PRIMARY_KEY_DESC,
    condition: {
      author: $author
    }
  ) {
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
              id,
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
query allPosts($isDraft: Boolean!, $isScheduled: Boolean!, $isPublished: Boolean!, $author: Int!) {
  allPosts(condition: {
    isDraft: $isDraft,
    isScheduled: $isScheduled,
    isPublished: $isPublished,
    author: $author
  },
  orderBy: PRIMARY_KEY_DESC) {
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
              id,
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

const getAccountByUsername = gql`
  query accountByUsername($username: String!) {
    accountByUsername(username: $username) {
      id,
      firstName,
      lastName,
      profilePhoto,
      heroPhoto,
      postsByAuthor(condition: {
        isPublished: true
      }) {
        nodes {
          id,
          title,
          accountByAuthor {
            firstName,
            lastName,
            username
          },
          postLeadPhotosByPostId {
            nodes {
              leadPhotoLinksByLeadPhotoId {
                nodes {
                  url
                }
              }
            }
          }
        }
      },
      userToTripsByUserId {
        nodes {
          tripByTripId {
            id,
            name,
            bannerPhoto,
            startDate,
            endDate
          }
        }
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
              id,
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
                id,
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
    },
    orderBy: PRIMARY_KEY_DESC) {
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
                id,
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
  mutation createPost($author: Int!, $title: String!, $subtitle: String!, $content: String!, $category: PostCategory, $isDraft: Boolean!, $isScheduled: Boolean!, $isPublished: Boolean!, $scheduledDate: BigInt, $publishedDate: BigInt) {
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
const createPostLeadPhoto = gql`
  mutation createPostLeadPhoto($postId: Int!, $photoTitle: String!) {
    createPostLeadPhoto(input: {
      postLeadPhoto: {
        postId: $postId,
        title: $photoTitle
      }
    }) {
      postLeadPhoto {
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
  mutation updatePostById($postId: Int!, $title: String, $subtitle: String, $content: String, $category: PostCategory, $isDraft: Boolean, $isScheduled: Boolean, $isPublished: Boolean, $scheduledDate: BigInt, $publishedDate: BigInt) {
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

  //get all countries
  getAllCountries() {
    return this.http.get('https://restcountries.eu/rest/v2/')
    .map(
      (response: Response) => {
        const responseData = <any>response;
        return JSON.parse(responseData._body);
      }
    )
    .catch(
      (error: Response) => {
        return Observable.throw('Something went wrong');
      }
    );
  }

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

  getAllPublishedPosts() {
    return this.apollo.watchQuery<any>({
      query: getAllPublishedPosts
    });
  }

  getAllPostsByUser(author: number) {
    return this.apollo.watchQuery<any>({
      query: getAllPostsByUser,
      variables: {
        author
      }
    });
  }

  getPostsByStatus(isDraft: boolean, isScheduled: boolean, isPublished: boolean, author: number) {
    return this.apollo.watchQuery<any>({
      query: getPostsByStatus,
      variables: {
        isDraft,
        isScheduled,
        isPublished, 
        author
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

  getAccountByUsername(username: string) {
    return this.apollo.watchQuery<any>({
      query: getAccountByUsername,
      variables: {
        username
      }
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

  genericCall(mutation: string) {
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

  createPostLeadPhoto(postId: number, photoTitle: string) {
    return this.apollo.mutate({
      mutation: createPostLeadPhoto,
      variables: {
        postId,
        photoTitle
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