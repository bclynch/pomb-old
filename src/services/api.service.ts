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
        accountByAuthor {
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

const getAllPostTags = gql`
query allPostTags {
  allPostTags {
    nodes {
      id,
      name
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

const getTagByName = gql`
query postTagByName($tagName: String!) {
  postTagByName(tagName: $tagName) {
    nodes {
      id,
      tagDescription
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

@Injectable()
export class APIService {

  constructor(
    private http: Http,
    private apollo: Apollo,
    private alertService: AlertService
  ) {}

  // S3
  getSignedRequest(file: File) {
    console.log(file);
    return this.http.get(`http://localhost:8080/sign-s3?file-name=${file.name}&file-type=${file.type}`)
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

  uploadS3(file: File, signedRequest: string) {
    return new Promise<any>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', signedRequest);
      xhr.onreadystatechange = () => {
        if(xhr.readyState === 4){
          if(xhr.status === 200){
            console.log('successfully uploaded');
            resolve();
          }
          else{
            this.alertService.alert('Error', 'Could not upload file.');
            reject('failed');
          }
        }
      };
      xhr.send(file);
    });
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

  getAllPostTags() {
    return this.apollo.watchQuery<any>({
      query: getAllPostTags
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
}