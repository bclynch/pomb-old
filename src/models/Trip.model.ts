import { User } from './User.model';
import { Juncture } from './Juncture.model';
import { Image } from './Image.model';
import { Post } from './Post.model';
import { Like } from './Like.model';

export class Trip {
  accountByUserId: User;
  endDate: string;
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
  totalLikes: {
    totalCount: number;
  };
  likesByUser: {
    nodes: { id: number }[];
  };
  startDate: string;
  startLat: string;
  startLon: string;
  description: string;
}
