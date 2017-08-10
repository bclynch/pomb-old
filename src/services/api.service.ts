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
        title,
        userByAuthor {
          firstName,
          lastName
        }
        id,
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
                username
              }
              content,
              createdAt
            }
          }
        },
        subtitle,
        leadphoto,
        createdAt,
        updatedAt
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

  getAllPosts(): any {
    return this.apollo.watchQuery<any>({
      query: getAllPosts
    });
  }
}