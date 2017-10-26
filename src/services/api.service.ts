import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs';
declare var google: any;

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
      username,
      profilePhoto,
      heroPhoto
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
            photoUrl,
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
          photoUrl,
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
          photoUrl,
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

const getTripById = gql`
  query tripById($id: Int!) {
    tripById(id: $id) {
      id,
      name,
      startDate,
      endDate,
      bannerPhoto,
      tripToJuncturesByTripId {
        nodes {
          junctureByJunctureId {
            name,
            lat,
            lon,
            id
          }
        }
      },
      userToTripsByTripId {
        nodes {
          accountByUserId {
            username,
            firstName, 
            lastName,
            profilePhoto
          }
        }
      }
    }
  }
`;

const getJunctureById = gql`
  query junctureById($id: Int!) {
    junctureById(id: $id) {
      id,
      name,
      arrivalDate,
      description,
      city, 
      country,
      junctureToPostsByJunctureId {
        nodes {
          postByPostId {
            id,
            title,
            accountByAuthor {
              firstName,
              lastName,
              username
            },
            createdAt
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
        }
      },
      junctureToPhotosByJunctureId {
        nodes {
          id,
          photoUrl,
          description
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
          photoUrl,
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

const tripsByUserId = gql`
  query tripsByUserId($userId: Int!) {
    allUserToTrips(condition: {
      userId: $userId,
    },
    orderBy: PRIMARY_KEY_DESC
    ) {
      nodes {
        id,
        tripByTripId {
          name
        }
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

const updateAccountById = gql`
  mutation updateAccountById($id: Int!, $firstName: String!, $lastName: String!, $heroPhoto: String, $profilePhoto: String) {
    updateAccountById(input:{
      id: $id,
      accountPatch:{
        firstName: $firstName,
        lastName: $lastName,
        profilePhoto: $profilePhoto,
        heroPhoto: $heroPhoto
      }
    }) {
      account {
        id,
        username,
        firstName,
        lastName,
        heroPhoto,
        profilePhoto
      }
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

const createJuncture = gql`
  mutation($name: String!, $arrivalDate: BigInt!, $description: String, $lat: Float!, $lon: Float!, $city: String!, $country: String!, $isDraft: Boolean!) {
    createJuncture(input:{
      juncture: {
        name: $name,
        arrivalDate: $arrivalDate,
        description: $description,
        lat: $lat,
        lon: $lon,
        city: $city,
        country: $country,
        isDraft: $isDraft
      }
    }) {
      juncture {
        id
      }
    }
  }
`;

const createTrip = gql`
  mutation($name: String!, $startDate: BigInt!, $endDate: BigInt, $bannerPhoto: String) {
    createTrip(input:{
      trip:{
        name: $name,
        startDate: $startDate,
        endDate: $endDate,
        bannerPhoto: $bannerPhoto
      }
    }) {
      trip {
        id
      }
    }
  }
`;

const createUserToTrip = gql`
  mutation($userId: Int!, $tripId: Int!) {
    createUserToTrip(input:{
      userToTrip:{
        userId: $userId,
        tripId: $tripId
      }
    }) {
      clientMutationId
    }
  }
`;

const createTripToJuncture = gql`
  mutation($tripId: Int!, $junctureId: Int!) {
    createTripToJuncture(input:{
      tripToJuncture: {
        tripId: $tripId,
        junctureId: $junctureId
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

  uploadPhoto(formData: FormData, size: string) {
    return this.http.post(`http://localhost:8080/upload-photo/${size}`, formData)
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

  uploadProfilePhoto(formData: FormData) {
    return this.http.post('http://localhost:8080/upload-profile-photo', formData)
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

  // Reverse Geocoding
  geocodeCoords(lat: number, lon: number) {
    console.log('Getting coord information...');
    let geocoder = new google.maps.Geocoder();
    return Observable.create(observer => {
      geocoder.geocode( {'location': {lat, lng: lon}}, (results, status) => {
        console.log(results);
        if (status == google.maps.GeocoderStatus.OK) {
          observer.next(results[0]);
          observer.complete();
        } else {
          console.log('Error - ', results, ' & Status - ', status);
          observer.next({});
          observer.complete();
        }
      });
    });
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

  getTripById(id: number) {
    return this.apollo.watchQuery<any>({
      query: getTripById,
      variables: {
          id
      }
    });
  }

  getJunctureById(id: number) {
    return this.apollo.watchQuery<any>({
      query: getJunctureById,
      variables: {
          id
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

  tripsByUserId(userId: number) {
    return this.apollo.watchQuery<any>({
      query: tripsByUserId,
      variables: {
        userId
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

  updateAccountById(id: number, firstName: string, lastName: string, heroPhoto: string, profilePhoto: string) {
    return this.apollo.mutate({
      mutation: updateAccountById,
      variables: {
        id,
        firstName,
        lastName,
        heroPhoto,
        profilePhoto
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

  createJuncture(name: string, arrivalDate: number, description: string, lat: number, lon: number, city: string, country: string, isDraft: boolean) {
    return this.apollo.mutate({
      mutation: createJuncture,
      variables: {
        name,
        arrivalDate,
        description,
        lat,
        lon,
        city,
        country,
        isDraft
      }
    });
  }

  createTrip(name: string, startDate: number, endDate: number, bannerPhoto: string) {
    return this.apollo.mutate({
      mutation: createTrip,
      variables: {
        name,
        startDate,
        endDate,
        bannerPhoto
      }
    });
  }

  createUserToTrip(userId: number, tripId: number) {
    return this.apollo.mutate({
      mutation: createUserToTrip,
      variables: {
        userId,
        tripId
      }
    });
  }

  createTripToJuncture(tripId: number, junctureId: number) {
    return this.apollo.mutate({
      mutation: createTripToJuncture,
      variables: {
        tripId,
        junctureId
      }
    });
  }
}