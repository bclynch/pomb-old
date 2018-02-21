import { Post } from './Post.model';
import { Image } from './Image.model';
import { Juncture } from './Juncture.model';
import { Trip } from './Trip.model';
import { Track } from './Track.model';

export class User {
  firstName: string;
  lastName: string;
  username: string;
  id: number;
  heroPhoto: string;
  profilePhoto: string;
  city: string;
  country: string;
  userStatus: string;
  autoUpdateLocation: boolean;
  autoUpdateVisited: boolean;
  postsByAuthor: {
    nodes: Post[];
  };
  imagesByUserId: {
    nodes: Image[];
  };
  juncturesByUserId: {
    nodes: Juncture[];
  };
  tripsByUserId: {
    nodes: Trip[];
  };
  tracksByUserId: {
    totalCount: number;
    nodes: Track[];
  };
  tracksByTrackUserId: {
    totalCount: number;
    nodes: Track[];
  };
  totalPostCount: {
    totalCount: number;
  };
  totalTripCount: {
    totalCount: number;
  };
  totalJunctureCount: {
    totalCount: number;
  };
  totalImageCount: {
    totalCount: number;
  };
  userToCountriesByUserId: {
    nodes: {
      id: number;
      countryByCountry: {
        code: string;
        name: string;
      }
    }[]
  };
}
