import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs';

import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';

const currentUserQuery = gql`
  query currentUser {
    currentUser {
        id,
        firstName,
        lastName
    }
  }
`;

const getAllPosts = gql`
  query allPosts {
    allPosts {
      nodes {
        id,
        title,
        userByAuthor {
          firstName,
          lastName
        }
        subtitle,
        leadphoto,
        createdAt,
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
      leadphoto,
      createdAt,
      updatedAt,
      userByAuthor {
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
            userByAuthor {
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

@Injectable()
export class APIService {

  constructor(
    private http: Http,
    private apollo: Apollo
  ) {}

  getCurrentPerson(): any {
    return this.apollo.watchQuery<any>({
      query: currentUserQuery
    });
  }

  getAllPosts() {
    return this.apollo.watchQuery<any>({
      query: getAllPosts
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
}