import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
declare var google: any;

import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';

import { AlertService } from './alert.service';

import { ImageType } from '../models/Image.model';

// needs to be an env var
const flickrKey = '691be9c5a38900c0249854a28a319e2c';
const geonamesUser = 'bclynch';

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
      heroPhoto,
      userStatus,
      city,
      country,
      autoUpdateLocation
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
        createdAt,
        updatedAt,
        accountByAuthor {
          id,
          firstName,
          lastName,
          username
        },
        imagesByPostId {
          nodes {
            id,
            type,
            url,
            title,
            accountByUserId {
              id
            }
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
      createdAt,
      updatedAt,
      isDraft,
      isScheduled,
      isPublished,
      scheduledDate,
      publishedDate,
      junctureId,
      tripId,
      accountByAuthor {
        id,
        firstName,
        lastName
      },
      postToTagsByPostId {
        nodes {
          id,
          postTagByPostTagId {
            name
          }
        }
      },
      postToCommentsByPostId {
        nodes {
          postCommentByCommentId {
            accountByAuthor {
              id,
              firstName
            },
            id,
            content,
            createdAt
          }
        }
      },
      imagesByPostId {
        nodes {
          id,
          type,
          url,
          description,
          title,
          accountByUserId {
            id
          }
        }
      }
    }
  }
}
`;

const getAllImagesByUser = gql`
  query allImages($userId: Int, $first: Int, $offset: Int) {
    allImages(
      condition:{
        userId: $userId
      },
      first: $first,
      offset: $offset
    ) {
      nodes {
        id,
        url,
        description,
        title,
        accountByUserId {
          id,
          username
        },
        likesByUser: likesByImageId(
          condition: {
            userId: $userId
          }
        ) {
          nodes {
            id
          }
        },
        totalLikes: likesByImageId {
          totalCount
        }
      }
    }
  }
`;

const getAllImagesByTrip = gql`
  query allImages($tripId: Int!, $first: Int, $offset: Int, $userId: Int) {
    allImages(
      condition: {
        tripId: $tripId
      },
      first: $first,
      offset: $offset
    ) {
      nodes {
        id,
        url,
        description,
        title,
        accountByUserId {
          id,
          username
        },
        likesByUser: likesByImageId(
          condition: {
            userId: $userId
          }
        ) {
          nodes {
            id
          }
        },
        totalLikes: likesByImageId {
          totalCount
        }
      }
    }
  }
`;

const getRecentImages = gql`
  query allImages($last: Int, $userId: Int) {
    allImages(
      condition: {
        type: GALLERY
      },
      last: $last,
    ) {
      nodes {
        id,
        url,
        description,
        accountByUserId {
          id,
          username
        },
        likesByUser: likesByImageId(
          condition: {
            userId: $userId
          }
        ) {
          nodes {
            id
          }
        },
        totalLikes: likesByImageId {
          totalCount
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
      createdAt,
      updatedAt,
      isDraft,
      isScheduled,
      isPublished,
      scheduledDate,
      publishedDate,
      accountByAuthor {
        id,
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
              id,
              firstName
            },
            content,
            createdAt
          }
        }
      },
      imagesByPostId {
        nodes {
          id,
          type,
          url,
          description,
          accountByUserId {
            id
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

const getConfig = gql`
query allConfigs {
  allConfigs {
    nodes {
      primaryColor,
      secondaryColor,
      tagline,
      heroBanner,
      postByFeaturedStory1 {
        id,
        title,
        subtitle,
        imagesByPostId(condition: {
          type: LEAD_SMALL
        }) {
          nodes {
            url
          }
        }
      }
      postByFeaturedStory2 {
        id,
        title,
        subtitle,
        imagesByPostId(condition: {
          type: LEAD_SMALL
        }) {
          nodes {
            url
          }
        }
      }
      postByFeaturedStory3 {
        id,
        title,
        subtitle,
        imagesByPostId(condition: {
          type: LEAD_SMALL
        }) {
          nodes {
            url
          }
        }
      },
      tripByFeaturedTrip1 {
        id,
        name,
        startDate,
        endDate,
        imagesByTripId(
          condition:{
            type: BANNER
          },
          first: 1
        ) {
          nodes {
            url
          }
        }
      }
    }
  }
}
`;

const getAccountByUsername = gql`
  query accountByUsername($username: String!) {
    accountByUsername(username: $username) {
      id,
      username,
      firstName,
      lastName,
      profilePhoto,
      heroPhoto,
      city,
      country,
      userStatus,
      postsByAuthor(condition: {
        isPublished: true
      }) {
        nodes {
          id,
          title,
          accountByAuthor {
            id,
            firstName,
            lastName,
            username
          },
          imagesByPostId(condition:{
            type: LEAD_LARGE
          }) {
            nodes {
              url,
              type
            }
          }
        }
      },
      tripsByUserId {
        nodes {
          id,
          name,
          startDate,
          endDate,
          imagesByTripId(
            condition: {
              type: BANNER,
            },
            first: 1
          ) {
            nodes {
              url
            }
          }
        }
      }
    }
  }
`;

const getRecentUserActivity = gql`
  query accountByUsername($username: String!) {
    accountByUsername(username: $username) {
      tripsByUserId(last: 1) {
        nodes {
          id,
          name,
          startDate,
          endDate,
          imagesByTripId(
            condition: {
              type: BANNER,
            },
            first: 1
          ) {
            nodes {
              url
            }
          }
        }
      },
      juncturesByUserId(first: 2, orderBy: PRIMARY_KEY_DESC) {
        nodes {
          id,
          name,
          markerImg,
          city,
          country
        }
      },
      postsByAuthor(
        last: 3,
        condition: {
          isPublished: true
        },
        orderBy: ID_DESC
      ) {
        nodes {
          title,
          id,
          imagesByPostId(
            condition: {
              type: LEAD_SMALL
            }
          ) {
            nodes {
              url
            }
          },
          createdAt
        }
      }
    }
  }
`;

const getTripById = gql`
  query tripById($id: Int!, $userId: Int) {
    tripById(id: $id) {
      id,
      name,
      startDate,
      endDate,
      startLat,
      startLon,
      description,
      juncturesByTripId {
        totalCount,
        nodes {
          name,
          lat,
          lon,
          arrivalDate,
          id,
          markerImg,
          description,
          city,
          country,
          coordsByJunctureId {
            nodes {
              lat,
              lon,
              elevation,
              coordTime
            }
          }
        }
      },
      accountByUserId {
        id,
        username,
        firstName,
        lastName,
        profilePhoto
      },
      imagesByTripId {
        totalCount,
        nodes {
          id,
          url,
          title,
          type,
          description,
          accountByUserId {
            id,
            username
          },
          likesByUser: likesByImageId(
            condition: {
              userId: $userId
            }
          ) {
            nodes {
              id
            }
          },
          totalLikes: likesByImageId {
            totalCount
          }
        }
      }
      likesByUser: likesByTripId(
        condition: {
          userId: $userId
        }
      ) {
        nodes {
          id
        }
      },
      totalLikes: likesByTripId {
        totalCount
      }
    }
  }
`;

const getTripsByUser = gql`
  query allTrips($id: Int!) {
    allTrips (
      condition: {
        userId: $id
      }
    ) {
      nodes {
        id,
        name,
        juncturesByTripId {
          nodes {
            name,
            id
          }
        }
      }
    }
  }
`;

const getTripsUserDashboard = gql`
  query allTrips($id: Int!) {
    allTrips (
      condition: {
        userId: $id
      }
    ) {
      nodes {
        id,
        name,
        startDate,
        endDate,
        juncturesByTripId {
          nodes {
            id
            name,
            arrivalDate,
            city,
            country
          }
        },
        imagesByTripId {
          nodes {
            url
          }
        }
      }
    }
  }
`;

const getPartialJunctureById = gql`
  query junctureById($id: Int!, $userId: Int) {
    junctureById(id: $id) {
      id,
      name,
      arrivalDate,
      description,
      city,
      country,
      postsByJunctureId {
        nodes {
          id,
          title,
          accountByAuthor {
            id,
            firstName,
            lastName,
            username
          },
          createdAt,
          imagesByPostId {
            nodes {
              id,
              url,
              type
            }
          }
        }
      },
      imagesByJunctureId(
        condition:{
          type: GALLERY
        }
      ) {
        nodes {
          id,
          postId,
          type,
          url,
          description,
          accountByUserId {
            id,
            username
          },
          likesByUser: likesByImageId(
            condition: {
              userId: $userId
            }
          ) {
            nodes {
              id
            }
          },
          totalLikes: likesByImageId {
            totalCount
          }
        }
      }
      likesByUser: likesByJunctureId(
        condition: {
          userId: $userId
        }
      ) {
        nodes {
          id
        }
      },
      totalLikes: likesByJunctureId {
        totalCount
      }
    }
  }
`;

const getFullJunctureById = gql`
  query junctureById($id: Int!, $userId: Int) {
    junctureById(id: $id) {
      id,
      name,
      arrivalDate,
      description,
      lat,
      lon,
      city,
      country,
      markerImg,
      postsByJunctureId {
        nodes {
          id,
          title,
          accountByAuthor {
            id,
            firstName,
            lastName,
            username
          }
          imagesByPostId {
            nodes {
              id,
              url,
              type,
              accountByUserId {
                id
              }
            }
          }
        }
      },
      coordsByJunctureId {
        nodes {
          id,
          lat,
          lon,
          elevation,
          coordTime
        }
      },
      imagesByJunctureId(
        condition:{
          type: GALLERY
        }
      ) {
        nodes {
          id,
          postId,
          type,
          url,
          description,
          accountByUserId {
            id,
            username
          },
          likesByUser: likesByImageId(
            condition: {
              userId: $userId
            }
          ) {
            nodes {
              id
            }
          },
          totalLikes: likesByImageId {
            totalCount
          }
        }
      }
      tripByTripId {
        id,
        name,
        juncturesByTripId {
          nodes {
            name
            id
          }
        }
      }
      likesByUser: likesByJunctureId(
        condition: {
          userId: $userId
        }
      ) {
        nodes {
          id
        }
      },
      totalLikes: likesByJunctureId {
        totalCount
      }
    }
  }
`;

const getPostById = gql`
  query postById($id: Int!, $userId: Int) {
    postById(id: $id) {
      id,
      title,
      subtitle,
      content,
      createdAt,
      updatedAt,
      scheduledDate,
      publishedDate,
      accountByAuthor {
        id,
        firstName,
        lastName,
        username
      },
      postToTagsByPostId {
        nodes {
          postTagByPostTagId {
            name,
            postToTagsByPostTagId(first: 5, orderBy: ID_DESC) {
              nodes {
                postByPostId {
                  id,
                  title,
                  createdAt,
                  accountByAuthor {
                    id,
                    firstName,
                    lastName,
                    username
                  },
                  imagesByPostId {
                    nodes {
                      id,
                      url,
                      type,
                      accountByUserId {
                        id
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      postToCommentsByPostId {
        nodes {
          postCommentByCommentId {
            accountByAuthor {
              id,
              firstName
            },
            content,
            createdAt
          }
        }
      },
      imagesByPostId {
        nodes {
          id,
          type,
          url,
          description,
          title,
          accountByUserId {
            id,
            username
          },
          likesByUser: likesByImageId(
            condition: {
              userId: $userId
            }
          ) {
            nodes {
              id
            }
          },
          totalLikes: likesByImageId {
            totalCount
          }
        }
      },
      likesByUser: likesByPostId(
        condition: {
          userId: $userId
        }
      ) {
        nodes {
          id
        }
      },
      totalLikes: likesByPostId {
        totalCount
      }
    }
  }
`;

const getPostsByTag = gql`
  query allPostToTags($tagId: String) {
    allPostToTags(
      condition: {
        postTagId: $tagId
      }
    ) {
      nodes {
        postByPostId {
          id,
          title,
          accountByAuthor {
            id,
            firstName,
            lastName
          }
          subtitle,
          createdAt,
          imagesByPostId {
            nodes {
              id,
              type,
              url,
              title,
              accountByUserId {
                id
              }
            }
          }
        }
      }
    }
  }
`;

const getPostsByTrip = gql`
  query getPostsByTrip($id: Int!) {
    tripById(id: $id) {
      postsByTripId(
        first: 10,
        orderBy: ID_DESC
      ) {
        totalCount,
        nodes {
          id,
          title,
          accountByAuthor {
            id,
            firstName,
            lastName,
            username
          }
          subtitle,
          createdAt,
          imagesByPostId {
            nodes {
              id,
              url,
              type,
              accountByUserId {
                id
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

const searchSite = gql`
  query searchSite($query: String!) {
    searchTrips(
      query: $query,
      first: 5
    ) {
      nodes {
        id,
        name
      }
    },
    searchPosts(
      query: $query,
      first: 10
    ) {
      nodes {
        id,
        title,
        subtitle,
        createdAt
      }
    }
    searchAccounts(
      query: $query,
      first: 10
    ) {
      nodes {
        id,
        username,
        firstName,
        lastName,
        profilePhoto
      }
    }
  }
`;

const searchTags = gql`
  query searchTags($query: String!) {
    searchTags(query: $query) {
      nodes {
        name
      }
    }
  }
`;

const tripsByUserId = gql`
  query tripsByUserId($userId: Int!) {
    allTrips(
      condition: {
        userId: $userId
      },
      orderBy: PRIMARY_KEY_DESC
    ) {
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

const updateAccountById = gql`
  mutation updateAccountById($id: Int!, $firstName: String!, $lastName: String!, $userStatus: String, $heroPhoto: String, $profilePhoto: String, $city: String, $country: String, $autoUpdate: Boolean!) {
    updateAccountById(input:{
      id: $id,
      accountPatch:{
        firstName: $firstName,
        lastName: $lastName,
        userStatus: $userStatus,
        profilePhoto: $profilePhoto,
        heroPhoto: $heroPhoto,
        city: $city,
        country: $country,
        autoUpdateLocation: $autoUpdate
      }
    }) {
      account {
        id,
        username,
        firstName,
        lastName,
        userStatus,
        heroPhoto,
        profilePhoto,
        city,
        country,
        autoUpdateLocation
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
  mutation createPost($author: Int!, $title: String!, $subtitle: String!, $content: String!, $isDraft: Boolean!, $isScheduled: Boolean!, $isPublished: Boolean!, $tripId: Int, $junctureId: Int, $scheduledDate: BigInt, $publishedDate: BigInt) {
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

const deleteImageById = gql`
  mutation deleteImageById($id: Int!) {
    deleteImageById(input:{
      id: $id
    }) {
      clientMutationId
    }
  }
`;

const createImage = gql`
  mutation createImage($tripId: Int, $junctureId: Int, $postId: Int, $userId: Int!, $type: ImageType!, $url: String!, $title: String, $description: String) {
    createImage(
      input: {
        image:{
          tripId: $tripId,
          junctureId: $junctureId,
          postId: $postId,
          userId: $userId,
          type: $type,
          url: $url,
          title: $title,
          description: $description
        }
      }
    ) {
      clientMutationId
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
  mutation updatePostById($postId: Int!, $title: String, $subtitle: String, $content: String, $tripId: Int, $junctureId: Int, $isDraft: Boolean, $isScheduled: Boolean, $isPublished: Boolean, $scheduledDate: BigInt, $publishedDate: BigInt) {
    updatePostById(input:{
      id: $postId,
      postPatch:{
        title: $title,
        subtitle: $subtitle,
        content: $content,
        tripId: $tripId,
        junctureId: $junctureId,
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

const createJuncture = gql`
  mutation($userId: Int!, $tripId: Int!, $name: String!, $arrivalDate: BigInt!, $description: String, $lat: BigFloat!, $lon: BigFloat!, $city: String, $country: String, $isDraft: Boolean, $markerImg: String) {
    createJuncture(input:{
      juncture: {
        userId: $userId,
        tripId: $tripId,
        name: $name,
        arrivalDate: $arrivalDate,
        description: $description,
        lat: $lat,
        lon: $lon,
        city: $city,
        country: $country,
        isDraft: $isDraft,
        markerImg: $markerImg
      }
    }) {
      juncture {
        id
      }
    }
  }
`;

const createTrip = gql`
  mutation($userId: Int!, $name: String!, $description: String, $startDate: BigInt!, $endDate: BigInt, $startLat: BigFloat!, $startLon: BigFloat!) {
    createTrip(input:{
      trip:{
        userId: $userId,
        name: $name,
        description: $description,
        startDate: $startDate,
        endDate: $endDate,
        startLat: $startLat,
        startLon: $startLon
      }
    }) {
      trip {
        id
      }
    }
  }
`;

const updateTrip = gql`
  mutation($tripId: Int!, $name: String, $description: String, $startDate: BigInt, $endDate: BigInt, $startLat: BigFloat, $startLon: BigFloat) {
    updateTripById (
      input: {
        id: $tripId,
        tripPatch:{
          name: $name,
          description: $description,
          startDate: $startDate,
          endDate: $endDate,
          startLat: $startLat,
          startLon: $startLon
        }
      }
    ) {
      clientMutationId
    }
  }
`;

const createEmailListEntry = gql`
  mutation($email: String!) {
    createEmailList(input:{
      emailList: {
        email: $email
      }
    }) {
      clientMutationId
    }
  }
`;

const updateJuncture = gql`
  mutation($junctureId: Int!, $userId: Int, $tripId: Int, $name: String, $arrivalDate: BigInt, $description: String, $lat: BigFloat, $lon: BigFloat, $city: String, $country: String, $isDraft: Boolean, $markerImg: String) {
    updateJunctureById(input:{
      id: $junctureId,
      juncturePatch: {
        userId: $userId,
        tripId: $tripId,
        name: $name,
        arrivalDate: $arrivalDate,
        description: $description,
        lat: $lat,
        lon: $lon,
        city: $city,
        country: $country,
        isDraft: $isDraft,
        markerImg: $markerImg
      }
    }) {
      juncture {
        id
      }
    }
  }
`;

const createLike = gql`
  mutation($tripId: Int, $junctureId: Int, $postId: Int, $imageId: Int, $userId: Int!) {
    createLike(
      input: {
        like: {
          tripId: $tripId,
          junctureId: $junctureId,
          postId: $postId,
          imageId: $imageId,
          userId: $userId
        }
      }
    ) {
      likeEdge {
        node {
          id
        }
      }
    }
  }
`;

const deleteLike = gql`
  mutation($likeId: Int!) {
    deleteLikeById(
      input: {
        id: $likeId
      }
    ) {
      clientMutationId
    }
  }
`;

const resetPassword = gql`
  mutation($email: String!) {
    resetPassword(input: {
      email: $email
    }) {
      string
    }
  }
`;

const updatePassword = gql`
  mutation($userId: Int!, $password: String!, $newPassword: String!) {
    updatePassword(
      input: {
        userId: $userId,
        password: $password,
        newPassword: $newPassword
      }
    ) {
      boolean
    }
  }
`;

const deleteAccountById = gql`
  mutation($userId: Int!) {
    deleteAccountById(input: {
      id: $userId
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

  // get all countries
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

  // flickr photos
  getFlickrPhotos(place: string, tag: string, results: number, additionalTag?: string) {
    return this.http.get(`https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${flickrKey}&tags=${place},${tag}${additionalTag ? ', ' + additionalTag : ''}&tag_mode=all&per_page=${results}&content_type=1&sort=interestingness-desc&format=json&nojsoncallback=1`)
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

  // city info
  getCities(countryCode: string) {
    return this.http.get(`http://api.geonames.org/searchJSON?formatted=true&country=${countryCode}&cities=cities15000&orderby=population&featureClass=p&username=${geonamesUser}&maxRows=10`)
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

  // S3 Uploads
  uploadImages(formData: FormData, sizes: { width: number; height: number; }[], quality: number, isJuncture?: boolean) {
    const formattedSizes = sizes.map((size) => {
      return [size.width, 'x', size.height].join('');
    }).join(';');
    return this.http.post(`http://localhost:8080/upload-images?sizes=${formattedSizes}&quality=${quality}&isJuncture=${isJuncture}`, formData)
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

  // just for fun testing
  uploadImagesLocal(formData: FormData, sizes: { width: number; height: number; }[], quality: number) {
    const formattedSizes = sizes.map((size) => {
      return [size.width, 'x', size.height].join('');
    }).join(';');
    return this.http.post(`http://localhost:8080/upload-images/local?sizes=${formattedSizes}&quality=${quality}`, formData)
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

  // process gpx information
  processGPX(formData: FormData) {
    return this.http.post(`http://localhost:8080/process-gpx`, formData)
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

  // upload gpx information
  uploadGPX(geoJSON, junctureId: number) {
    return this.http.post(`http://localhost:8080/process-gpx/upload?juncture=${junctureId}`, geoJSON)
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

  // get page views
  getViews(path: string) {
    return this.http.get(`http://localhost:8080/analytics/getViews?path=${path}`)
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

  // Geocoding
  reverseGeocodeCoords(lat: number, lon: number) {
    console.log('Getting coord information...');
    const geocoder = new google.maps.Geocoder();
    return Observable.create(observer => {
      geocoder.geocode( {'location': {lat, lng: lon}}, (results, status) => {
        console.log(results);
        if (status === google.maps.GeocoderStatus.OK) {
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

  geocodeCoords(place: string) {
    console.log('Getting coord information...');
    const geocoder = new google.maps.Geocoder();
    return Observable.create(observer => {
      geocoder.geocode({ address: place }, (results, status) => {
        console.log(results);
        if (status === google.maps.GeocoderStatus.OK) {
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

  // password updating
  sendResetEmail(user: string, pw: string) {
    return this.http.post(`http://localhost:8080/mailing/reset`, { user, pw })
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

  getAllImagesByUser(userId: number, first: number, offset: number) {
    return this.apollo.watchQuery<any>({
      query: getAllImagesByUser,
      variables: {
        userId,
        first,
        offset
      }
    });
  }

  getAllImagesByTrip(tripId: number, first: number, offset: number, userId: number) {
    return this.apollo.watchQuery<any>({
      query: getAllImagesByTrip,
      variables: {
        tripId,
        first,
        offset,
        userId
      }
    });
  }

  getRecentImages(amount: number, $userId: number) {
    return this.apollo.watchQuery<any>({
      query: getRecentImages,
      variables: {
        last: amount,
        $userId
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

  getTripById(id: number, userId: number) {
    return this.apollo.watchQuery<any>({
      query: getTripById,
      variables: {
          id,
          userId
      }
    });
  }

  getTripsByUser(id: number) {
    return this.apollo.watchQuery<any>({
      query: getTripsByUser,
      variables: {
          id
      }
    });
  }

  getTripsUserDashboard(id: number) {
    return this.apollo.watchQuery<any>({
      query: getTripsUserDashboard,
      variables: {
          id
      }
    });
  }

  getPartialJunctureById(id: number, userId: number) {
    return this.apollo.watchQuery<any>({
      query: getPartialJunctureById,
      variables: {
          id,
          userId
      }
    });
  }

  getFullJunctureById(id: number, userId: number) {
    return this.apollo.watchQuery<any>({
      query: getFullJunctureById,
      variables: {
          id,
          userId
      }
    });
  }

  getPostById(postId: number, userId: number) {
    return this.apollo.watchQuery<any>({
      query: getPostById,
      variables: {
          id: postId,
          userId
      }
    });
  }

  getPostsByTag(tagId: string) {
    return this.apollo.watchQuery<any>({
      query: getPostsByTag,
      variables: {
        tagId
      }
    });
  }

  getPostsByTrip(id: number) {
    return this.apollo.watchQuery<any>({
      query: getPostsByTrip,
      variables: {
        id
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

  getRecentUserActivity(username: string) {
    return this.apollo.watchQuery<any>({
      query: getRecentUserActivity,
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

  searchSite(query: string) {
    return this.apollo.watchQuery<any>({
      query: searchSite,
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

  updateAccountById(id: number, firstName: string, lastName: string, userStatus: string, heroPhoto: string, profilePhoto: string, city: string, country: string, autoUpdate: boolean) {
    return this.apollo.mutate({
      mutation: updateAccountById,
      variables: {
        id,
        firstName,
        lastName,
        userStatus,
        heroPhoto,
        profilePhoto,
        city,
        country,
        autoUpdate
      }
    });
  }

  createPost(author: number, title: string, subtitle: string, content: string, isDraft: boolean, isScheduled: boolean, isPublished: boolean, tripId: number, junctureId: number, scheduledDate?: number, publishedDate?: number) {
    return this.apollo.mutate({
      mutation: createPost,
      variables: {
        author,
        title,
        subtitle,
        content,
        isDraft,
        isScheduled,
        isPublished,
        tripId,
        junctureId,
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

  deleteImageById(id: number) {
    return this.apollo.mutate({
      mutation: deleteImageById,
      variables: {
        id
      }
    });
  }

  createImage(tripId: number, junctureId: number, postId: number, userId: number, type: ImageType, url: string, title: string, description: string) {
    return this.apollo.mutate({
      mutation: createImage,
      variables: {
        tripId,
        junctureId,
        postId,
        userId,
        type,
        url,
        title,
        description
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

  updatePostById(postId: number, title: string, subtitle: string, content: string, tripId: number, junctureId: number, isDraft: boolean, isScheduled: boolean, isPublished: boolean, scheduledDate?: number, publishedDate?: number) {
    return this.apollo.mutate({
      mutation: updatePostById,
      variables: {
        postId,
        title,
        subtitle,
        content,
        tripId,
        junctureId,
        isDraft,
        isScheduled,
        isPublished,
        scheduledDate: scheduledDate ? scheduledDate : null,
        publishedDate: publishedDate ? publishedDate : null
      }
    });
  }

  createJuncture(userId: number, tripId: number, name: string, arrivalDate: number, description: string, lat: number, lon: number, city: string, country: string, isDraft: boolean, markerImg: string) {
    return this.apollo.mutate({
      mutation: createJuncture,
      variables: {
        userId,
        tripId,
        name,
        arrivalDate,
        description,
        lat,
        lon,
        city,
        country,
        isDraft,
        markerImg
      }
    });
  }

  createTrip(userId: number, name: string, description: string, startDate: number, endDate: number, startLat: number, startLon: number) {
    return this.apollo.mutate({
      mutation: createTrip,
      variables: {
        userId,
        name,
        description,
        startDate,
        endDate,
        startLat,
        startLon
      }
    });
  }

  updateTrip(tripId: number, name: string, description: string, startDate: number, endDate: number, startLat: number, startLon: number) {
    return this.apollo.mutate({
      mutation: updateTrip,
      variables: {
        tripId,
        name,
        description,
        startDate,
        endDate,
        startLat,
        startLon
      }
    });
  }

  createEmailListEntry(email: string) {
    return this.apollo.mutate({
      mutation: createEmailListEntry,
      variables: {
        email
      }
    });
  }

  updateJuncture(junctureId: number, userId: number, tripId, name?: string, arrivalDate?: number, description?: string, lat?: number, lon?: number, city?: string, country?: string, isDraft?: boolean, markerImg?: string) {
    return this.apollo.mutate({
      mutation: updateJuncture,
      variables: {
        junctureId,
        userId,
        tripId,
        name,
        arrivalDate,
        description,
        lat,
        lon,
        city,
        country,
        isDraft,
        markerImg
      }
    });
  }

  createLike(tripId: number, junctureId: number, postId: number, imageId: number, userId: number) {
    return this.apollo.mutate({
      mutation: createLike,
      variables: {
        tripId,
        junctureId,
        postId,
        imageId,
        userId
      }
    });
  }

  deleteLike(likeId: number) {
    return this.apollo.mutate({
      mutation: deleteLike,
      variables: {
        likeId
      }
    });
  }

  resetPassword(email: string) {
    return this.apollo.mutate({
      mutation: resetPassword,
      variables: {
        email
      }
    });
  }

  updatePassword(userId: number, password: string, newPassword: string) {
    return this.apollo.mutate({
      mutation: updatePassword,
      variables: {
        userId,
        password,
        newPassword
      }
    });
  }

  deleteAccountById(userId: number) {
    return this.apollo.mutate({
      mutation: deleteAccountById,
      variables: {
        userId
      }
    });
  }
}
