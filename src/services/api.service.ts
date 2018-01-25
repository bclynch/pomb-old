import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
declare var google: any;

import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';

import { AlertService } from './alert.service';

import { PostCategory } from '../models/Post.model';
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
        imagesByPostId {
          nodes {
            type,
            url,
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
      imagesByPostId {
        nodes {
          type,
          url,
          description
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
        url,
        description,
        title
      }
    }
  }
`;

const getAllImagesByTrip = gql`
  query allImages($tripId: Int!, $first: Int, $offset: Int) {
    allImages(
      condition: {
        tripId: $tripId
      },
      first: $first,
      offset: $offset
    ) {
      nodes {
        url,
        description,
        title
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
      imagesByPostId {
        nodes {
          type,
          url,
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
      }
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
      juncturesByUserId(last: 2) {
        nodes {
          id,
          name,
          markerImg
        }
      },
      postsByAuthor(
        last: 3,
        condition: {
          isPublished: true
        }
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
  query tripById($id: Int!) {
    tripById(id: $id) {
      id,
      name,
      startDate,
      endDate,
      startLat,
      startLon
      juncturesByTripId {
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
        username,
        firstName,
        lastName,
        profilePhoto
      },
      imagesByTripId {
        nodes {
          url,
          title,
          type,
          description
        }
      }
    }
  }
`;

const getPartialJunctureById = gql`
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
            createdAt,
            imagesByPostId {
              nodes {
                url,
                type
              }
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
          postId,
          type,
          url,
          description
        }
      }
    }
  }
`;

const getFullJunctureById = gql`
  query junctureById($id: Int!) {
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
      junctureToPostsByJunctureId {
        nodes {
          postByPostId {
             id,
            author,
            accountByAuthor {
              id
            },
          }
        }
      },
      coordsByJunctureId {
        nodes {
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
          postId,
          type,
          url,
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
      imagesByPostId {
        nodes {
          id,
          type,
          url,
          description,
          title
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
        imagesByPostId {
          nodes {
            type,
            url,
            title
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
        imagesByPostId {
          nodes {
            type,
            url,
            title
          }
        }
      }
    }
  }
`;

const getPostsByTrip = gql`
  query getPostsByTrip($id: Int!) {
    tripById(id: $id) {
      id,
      name,
      juncturesByTripId {
        nodes {
          id,
          junctureToPostsByJunctureId {
            nodes {
              postByPostId {
                id,
                title,
                accountByAuthor {
                  firstName,
                  lastName
                }
                subtitle,
                createdAt,
                imagesByPostId {
                  nodes {
                    url,
                    type
                  }
                }
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

const createJuncture = gql`
  mutation($userId: Int!, $tripId: Int!, $name: String!, $arrivalDate: BigInt!, $description: String, $lat: Float!, $lon: Float!, $city: String, $country: String, $isDraft: Boolean, $markerImg: String) {
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
  mutation($userId: Int!, $name: String!, $startDate: BigInt!, $endDate: BigInt, $startLat: Float!, $startLon: Float!) {
    createTrip(input:{
      trip:{
        userId: $userId,
        name: $name,
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
  mutation($junctureId: Int!, $userId: Int, $tripId: Int, $name: String, $arrivalDate: BigInt, $description: String, $lat: Float, $lon: Float, $city: String, $country: String, $isDraft: Boolean, $markerImg: String) {
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

  getAllImagesByTrip(tripId: number, first: number, offset: number) {
    return this.apollo.watchQuery<any>({
      query: getAllImagesByTrip,
      variables: {
        tripId,
        first,
        offset
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

  getPartialJunctureById(id: number) {
    return this.apollo.watchQuery<any>({
      query: getPartialJunctureById,
      variables: {
          id
      }
    });
  }

  getFullJunctureById(id: number) {
    return this.apollo.watchQuery<any>({
      query: getFullJunctureById,
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

  createTrip(userId: number, name: string, startDate: number, endDate: number, startLat: number, startLon: number) {
    return this.apollo.mutate({
      mutation: createTrip,
      variables: {
        userId,
        name,
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
}
