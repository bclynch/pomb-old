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

const getPostsByTag = gql`
  query postsByTag($tagId: Int!) {
    postsByTag(tagId: $tagId) {
      nodes {
        id,
        title,
        userByAuthor {
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

@Injectable()
export class APIService {

  constructor(
    private http: Http,
    private apollo: Apollo
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
            alert('Could not upload file.');
            reject('failed');
          }
        }
      };
      xhr.send(file);
    });
  }

  // Graphql Queries
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
}