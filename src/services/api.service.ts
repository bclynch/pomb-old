import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
declare var google: any;

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

import { AlertService } from './alert.service';

import { ImageType } from '../models/Image.model';
import { JunctureType } from '../models/Juncture.model';

// needs to be an env var
const flickrKey = '691be9c5a38900c0249854a28a319e2c';
const geonamesUser = 'bclynch';

// queries
import { currentAccountQuery, accountByUsernameQuery, recentUserActivityQuery } from '../api/queries/account.query';
import { allPublishedPostsQuery, allPostsByUserQuery, postByIdQuery, postsByTripQuery, postsByTagQuery } from '../api/queries/post.query';
import { allImagesByUserQuery, allImagesByTripQuery, recentImagesQuery } from '../api/queries/image.query';
import { configQuery } from '../api/queries/config.query';
import { allPostTagsQuery, tagByNameQuery } from '../api/queries/postTag.query';
import { tripByIdQuery, tripsByUserQuery, tripsUserDashboardQuery, tripsByUserIdQuery } from '../api/queries/trip.query';
import { partialJunctureByIdQuery, fullJunctureByIdQuery } from '../api/queries/juncture.query';
import { searchSiteQuery, searchCountriesQuery, searchPostsQuery, searchTagsQuery } from '../api/queries/search.query';
import { checkTrackingByUserQuery, userTrackedTripsQuery } from '../api/queries/tracking.query';
import { allCountriesQuery } from '../api/queries/countries.query';

// mutations
import {
  registerUserAccountMutation,
  authUserAccountMutation,
  registerAdminAccountMutation,
  authAdminAccountMutation,
  updateAccountByIdMutation,
  createEmailListEntryMutation,
  resetPasswordMutation,
  updatePasswordMutation,
  deleteAccountByIdMutation,
  createUserToCountryMutation
} from '../api/mutations/account.mutation';
import { createPostMutation, deletePostByIdMutation, updatePostByIdMutation } from '../api/mutations/post.mutation';
import { createPostTagMutation, deletePostToTagByIdMutation } from '../api/mutations/postTag.mutation';
import { createImageMutation, deleteImageByIdMutation } from '../api/mutations/image.mutation';
import { updateConfigMutation } from '../api/mutations/config.mutation';
import { createJunctureMutation, deleteJunctureByIdMutation, updateJunctureMutation } from '../api/mutations/juncture.mutation';
import { createTripMutation, updateTripMutation, deleteTripByIdMutation } from '../api/mutations/trip.mutation';
import { createLikeMutation, deleteLikeMutation } from '../api/mutations/like.mutation';
import { createTrackMutation, deleteTrackByIdMutation } from '../api/mutations/tracking.mutation';

@Injectable()
export class APIService {

  constructor(
    private http: Http,
    private apollo: Apollo,
    private alertService: AlertService
  ) {}

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
    return this.http.post(`http://localhost:5000/upload-images?sizes=${formattedSizes}&quality=${quality}&isJuncture=${isJuncture}`, formData)
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
    return this.http.post(`http://localhost:5000/upload-images/local?sizes=${formattedSizes}&quality=${quality}`, formData)
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
    return this.http.post(`http://localhost:5000/process-gpx`, formData)
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
    return this.http.post(`http://localhost:5000/process-gpx/upload?juncture=${junctureId}`, geoJSON)
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
    return this.http.get(`http://localhost:5000/analytics/getViews?path=${path}`)
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
          observer.next({ formattedAddress: results[0], country: results.slice(-1)[0] });
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

  // Email endpoints
  sendResetEmail(user: string, pw: string) {
    return this.http.post('http://localhost:5000/mailing/reset', { user, pw })
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

  sendRegistrationEmail(user: string) {
    return this.http.post('http://localhost:5000/mailing/registration', { user })
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

  sendContactEmail(data: { why: string; name: string; email: string; content: string; }) {
    return this.http.post('http://localhost:5000/mailing/contact', { data })
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

  getAllPublishedPosts(quantity: number, offset: number) {
    return this.apollo.watchQuery<any>({
      query: allPublishedPostsQuery,
      variables: {
        quantity,
        offset
      }
    });
  }

  getAllPostsByUser(author: number) {
    return this.apollo.watchQuery<any>({
      query: allPostsByUserQuery,
      variables: {
        author
      }
    });
  }

  getAllImagesByUser(userId: number, first: number, offset: number) {
    return this.apollo.watchQuery<any>({
      query: allImagesByUserQuery,
      variables: {
        userId,
        first,
        offset
      }
    });
  }

  getAllImagesByTrip(tripId: number, first: number, offset: number, userId: number) {
    return this.apollo.watchQuery<any>({
      query: allImagesByTripQuery,
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
      query: recentImagesQuery,
      variables: {
        last: amount,
        $userId
      }
    });
  }

  getTripById(id: number, userId: number) {
    return this.apollo.watchQuery<any>({
      query: tripByIdQuery,
      variables: {
          id,
          userId
      }
    });
  }

  getTripsByUser(id: number) {
    return this.apollo.watchQuery<any>({
      query: tripsByUserQuery,
      variables: {
          id
      }
    });
  }

  getTripsUserDashboard(id: number) {
    return this.apollo.watchQuery<any>({
      query: tripsUserDashboardQuery,
      variables: {
          id
      }
    });
  }

  getPartialJunctureById(id: number, userId: number) {
    return this.apollo.watchQuery<any>({
      query: partialJunctureByIdQuery,
      variables: {
          id,
          userId
      }
    });
  }

  getFullJunctureById(id: number, userId: number) {
    return this.apollo.watchQuery<any>({
      query: fullJunctureByIdQuery,
      variables: {
          id,
          userId
      }
    });
  }

  getPostById(postId: number, userId: number) {
    return this.apollo.watchQuery<any>({
      query: postByIdQuery,
      variables: {
          id: postId,
          userId
      }
    });
  }

  getPostsByTag(tagId: string) {
    return this.apollo.watchQuery<any>({
      query: postsByTagQuery,
      variables: {
        tagId
      }
    });
  }

  getPostsByTrip(id: number) {
    return this.apollo.watchQuery<any>({
      query: postsByTripQuery,
      variables: {
        id
      }
    });
  }

  getAllPostTags() {
    return this.apollo.watchQuery<any>({
      query: allPostTagsQuery
    });
  }

  getConfig() {
    return this.apollo.watchQuery<any>({
      query: configQuery
    });
  }

  getAccountByUsername(username: string, userId: number) {
    return this.apollo.watchQuery<any>({
      query: accountByUsernameQuery,
      variables: {
        username,
        userId
      }
    });
  }

  getRecentUserActivity(username: string) {
    return this.apollo.watchQuery<any>({
      query: recentUserActivityQuery,
      variables: {
        username
      }
    });
  }

  getTagByName(tagName: string) {
    return this.apollo.watchQuery<any>({
      query: tagByNameQuery,
      variables: {
        tagName
      }
    });
  }

  searchSite(query: string) {
    return this.apollo.watchQuery<any>({
      query: searchSiteQuery,
      variables: {
        query
      }
    });
  }

  searchTags(query: string) {
    return this.apollo.watchQuery<any>({
      query: searchTagsQuery,
      variables: {
        query
      }
    });
  }

  searchPosts(query: string, postStatus: 'draft' | 'scheduled' | 'published') {
    return this.apollo.watchQuery<any>({
      query: searchPostsQuery,
      variables: {
        query,
        postStatus,
        // userId
      }
    });
  }

  searchCountries(query: string) {
    return this.apollo.watchQuery<any>({
      query: searchCountriesQuery,
      variables: {
        query
      }
    });
  }

  tripsByUserId(userId: number) {
    return this.apollo.watchQuery<any>({
      query: tripsByUserIdQuery,
      variables: {
        userId
      }
    });
  }

  checkTrackingByUser(trackedUser: number, trackingUser: number) {
    return this.apollo.watchQuery<any>({
      query: checkTrackingByUserQuery,
      variables: {
        trackedUser,
        trackingUser
      }
    });
  }

  getUserTrackedTrips(username: string) {
    return this.apollo.watchQuery<any>({
      query: userTrackedTripsQuery,
      variables: {
        username
      }
    });
  }

  getAllCountries() {
    return this.apollo.watchQuery<any>({
      query: allCountriesQuery,
      variables: {

      }
    });
  }

  // Graphql mutations
  registerUserAccount(username: string, firstName: string, lastName: string, password: string, email: string) {
    return this.apollo.mutate({
      mutation: registerUserAccountMutation,
      variables: {
        username,
        firstName,
        lastName,
        password,
        email
      }
      });
    }

  authUserAccount(email: string, password: string) {
    return this.apollo.mutate({
      mutation: authUserAccountMutation,
      variables: {
        email,
        password
      }
    });
  }

  registerAdminAccount(username: string, firstName: string, lastName: string, password: string, email: string) {
    return this.apollo.mutate({
      mutation: registerAdminAccountMutation,
      variables: {
        username,
        firstName,
        lastName,
        password,
        email
      }
      });
    }

  authAdminAccount(email: string, password: string) {
    return this.apollo.mutate({
      mutation: authAdminAccountMutation,
      variables: {
        email,
        password
      }
    });
  }

  deletePostById(id: number, author: number) {
    return this.apollo.mutate({
      mutation: deletePostByIdMutation,
      variables: {
        id
      },
      refetchQueries: [{
        query: allPostsByUserQuery,
        variables: {
          author
        }
      }]
    });
  }

  updateAccountById(id: number, firstName: string, lastName: string, userStatus: string, heroPhoto: string, profilePhoto: string, city: string, country: string, autoUpdate: boolean) {
    return this.apollo.mutate({
      mutation: updateAccountByIdMutation,
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

  createPost(author: number, title: string, subtitle: string, content: string, isDraft: boolean, isScheduled: boolean, isPublished: boolean, tripId: number, junctureId: number, city: string, country: string, scheduledDate?: number, publishedDate?: number) {
    return this.apollo.mutate({
      mutation: createPostMutation,
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
        city,
        country,
        scheduledDate: scheduledDate ? scheduledDate : null,
        publishedDate: publishedDate ? publishedDate : null
      },
      refetchQueries: [{
        query: allPostsByUserQuery,
        variables: {
          author
        }
      }]
    });
  }

  createPostTag(name: string, tagDescription?: string) {
    return this.apollo.mutate({
      mutation: createPostTagMutation,
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
      mutation: deletePostToTagByIdMutation,
      variables: {
        id
      }
    });
  }

  deleteImageById(id: number) {
    return this.apollo.mutate({
      mutation: deleteImageByIdMutation,
      variables: {
        id
      }
    });
  }

  createImage(tripId: number, junctureId: number, postId: number, userId: number, type: ImageType, url: string, title: string, description: string) {
    return this.apollo.mutate({
      mutation: createImageMutation,
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
      mutation: updateConfigMutation,
      variables: {
        primaryColor,
        secondaryColor,
        tagline,
        heroBanner
      }
    });
  }

  updatePostById(postId: number, author: number, title: string, subtitle: string, content: string, tripId: number, junctureId: number, city: string, country: string, isDraft: boolean, isScheduled: boolean, isPublished: boolean, scheduledDate?: number, publishedDate?: number) {
    return this.apollo.mutate({
      mutation: updatePostByIdMutation,
      variables: {
        postId,
        title,
        subtitle,
        content,
        tripId,
        junctureId,
        city,
        country,
        isDraft,
        isScheduled,
        isPublished,
        scheduledDate: scheduledDate ? scheduledDate : null,
        publishedDate: publishedDate ? publishedDate : null
      },
      refetchQueries: [{
        query: allPostsByUserQuery,
        variables: {
          author
        }
      }]
    });
  }

  createJuncture(userId: number, tripId: number, type: JunctureType, name: string, arrivalDate: number, description: string, lat: number, lon: number, city: string, country: string, isDraft: boolean, markerImg: string, username: string) {
    return this.apollo.mutate({
      mutation: createJunctureMutation,
      variables: {
        userId,
        tripId,
        type,
        name,
        arrivalDate,
        description,
        lat,
        lon,
        city,
        country,
        isDraft,
        markerImg
      },
      refetchQueries: [{
        query: recentUserActivityQuery,
        variables: {
          username
        }
      }]
    });
  }

  updateJuncture(junctureId: number, userId: number, tripId: number, type: JunctureType, name?: string, arrivalDate?: number, description?: string, lat?: number, lon?: number, city?: string, country?: string, isDraft?: boolean, markerImg?: string) {
    return this.apollo.mutate({
      mutation: updateJunctureMutation,
      variables: {
        junctureId,
        userId,
        tripId,
        type,
        name,
        arrivalDate,
        description,
        lat,
        lon,
        city,
        country,
        isDraft,
        markerImg
      },
      refetchQueries: [
        {
          query: tripsUserDashboardQuery,
          variables: {
            id: userId
          }
        },
        {
          query: fullJunctureByIdQuery,
          variables: {
            id: junctureId,
            userId
          }
        }
      ]
    });
  }

  deleteJunctureById(junctureId: number, userId: number) {
    return this.apollo.mutate({
      mutation: deleteJunctureByIdMutation,
      variables: {
        junctureId
      },
      refetchQueries: [{
        query: tripsUserDashboardQuery,
        variables: {
          id: userId
        }
      }]
    });
  }

  createTrip(userId: number, name: string, description: string, startDate: number, endDate: number, startLat: number, startLon: number, username: string) {
    return this.apollo.mutate({
      mutation: createTripMutation,
      variables: {
        userId,
        name,
        description,
        startDate,
        endDate,
        startLat,
        startLon
      },
      refetchQueries: [{
        query: recentUserActivityQuery,
        variables: {
          username
        }
      }]
    });
  }

  updateTrip(tripId: number, name: string, description: string, startDate: number, endDate: number, startLat: number, startLon: number, userId: number) {
    return this.apollo.mutate({
      mutation: updateTripMutation,
      variables: {
        tripId,
        name,
        description,
        startDate,
        endDate,
        startLat,
        startLon
      },
      refetchQueries: [
        {
          query: tripsUserDashboardQuery,
          variables: {
            id: userId
          }
        },
        {
          query: tripByIdQuery,
          variables: {
              id: tripId,
              userId
          }
        }
      ]
    });
  }

  deleteTripById(tripId: number, userId: number) {
    return this.apollo.mutate({
      mutation: deleteTripByIdMutation,
      variables: {
        tripId
      },
      refetchQueries: [{
        query: tripsUserDashboardQuery,
        variables: {
          id: userId
        }
      }]
    });
  }

  createEmailListEntry(email: string) {
    return this.apollo.mutate({
      mutation: createEmailListEntryMutation,
      variables: {
        email
      }
    });
  }

  createLike(tripId: number, junctureId: number, postId: number, imageId: number, userId: number) {
    return this.apollo.mutate({
      mutation: createLikeMutation,
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
      mutation: deleteLikeMutation,
      variables: {
        likeId
      }
    });
  }

  resetPassword(email: string) {
    return this.apollo.mutate({
      mutation: resetPasswordMutation,
      variables: {
        email
      }
    });
  }

  updatePassword(userId: number, password: string, newPassword: string) {
    return this.apollo.mutate({
      mutation: updatePasswordMutation,
      variables: {
        userId,
        password,
        newPassword
      }
    });
  }

  deleteAccountById(userId: number) {
    return this.apollo.mutate({
      mutation: deleteAccountByIdMutation,
      variables: {
        userId
      }
    });
  }

  createTrack(userId: number, trackUserId: number, username: string) {
    return this.apollo.mutate({
      mutation: createTrackMutation,
      variables: {
        userId,
        trackUserId
      },
      refetchQueries: [{
        query: userTrackedTripsQuery,
        variables: {
          username
        }
      }]
    });
  }

  deleteTrackById(trackId: number, username: string) {
    return this.apollo.mutate({
      mutation: deleteTrackByIdMutation,
      variables: {
        trackId
      },
      refetchQueries: [{
        query: userTrackedTripsQuery,
        variables: {
          username
        }
      }]
    });
  }

  createUserToCountry(code: string, userId: number) {
    return this.apollo.mutate({
      mutation: createUserToCountryMutation,
      variables: {
        code,
        userId
      }
    });
  }
}
