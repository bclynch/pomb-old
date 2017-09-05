import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs';

import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';

import { AlertService } from './alert.service';

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
        leadphoto,
        createdAt,
        updatedAt,
        isDraft,
        isScheduled,
        isPublished,
        accountByAuthor {
          firstName,
          lastName
        },
        postToTagsByPostId {
          nodes {
            postTagByPostTagId {
              name
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
      leadphoto,
      createdAt,
      updatedAt,
      isDraft,
      isScheduled,
      isPublished,
      accountByAuthor {
        firstName,
        lastName
      },
      postToTagsByPostId {
        nodes {
          postTagByPostTagId {
            name
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

const getAllPostCategories = gql`
  query allPostCategories {
    allPostCategories {
      nodes {
        id,
        name,
        categoryDescription
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
      leadphoto,
      createdAt,
      updatedAt,
      accountByAuthor {
        firstName,
        lastName
      },
      postToTagsByPostId {
        nodes {
          postTagByPostTagId {
            name
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
        leadphoto,
        createdAt
      }
    }
  }
`;

const getPostsByCategory = gql`
query postsByCategory($categoryId: Int!) {
  postsByCategory(categoryId: $categoryId) {
    nodes {
      id,
      title,
      accountByAuthor {
        firstName,
        lastName
      }
      subtitle,
      leadphoto,
      createdAt
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
        leadphoto,
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

  getPostsByCategory(categoryId: number) {
    return this.apollo.watchQuery<any>({
      query: getPostsByCategory,
      variables: {
        categoryId
      }
    });
  }

  getAllPostTags() {
    return this.apollo.watchQuery<any>({
      query: getAllPostTags
    });
  }

  getAllPostCategories() {
    return this.apollo.watchQuery<any>({
      query: getAllPostCategories
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
}