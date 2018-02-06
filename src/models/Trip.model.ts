import { User } from './User.model';
import { Juncture } from './Juncture.model';
import { Image } from './Image.model';
import { Post } from './Post.model';
import { Like } from './Like.model';

export class Trip {
  accountByUserId: User;
  endDate: number;
  id: number;
  imagesByTripId: {
    totalCount: number;
    nodes: Image[];
  };
  juncturesByTripId: {
    totalCount: number;
    nodes: Juncture[];
  };
  name: string;
  postsByTripId: {
    totalCount: number;
    nodes: Post[];
  };
  likeByTripId: {
    totalCount: number;
    nodes: Like[];
  };
  startDate: number;
  startLat: string;
  startLon: string;
  description: string;
}
