import { User } from './User.model';
import { Trip } from './Trip.model';
import { Post } from './Post.model';
import { Image } from './Image.model';
import { Coords } from './Coords.model';
import { Like } from './Like.model';

export class Juncture {
  arrivalDate: string;
  city: string;
  country: string;
  description: string;
  id: number;
  lat: string;
  lon: string;
  markerImg: string;
  name: string;
  createdAt: number;
  updatedAt: string;
  accountByUserId: User;
  tripByTripId: Trip;
  postsByJunctureId: {
    nodes: Post[];
  };
  imagesByJunctureId: {
    nodes: Image[];
  };
  totalLikes: {
    totalCount: number;
  };
  likesByUser: {
    nodes: { id: number }[];
  };
  coordsByJunctureId: {
    nodes: Coords[];
  };
}
