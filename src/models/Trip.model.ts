import { User } from './User.model';
import { Juncture } from './Juncture.model';
import { Image } from './Image.model';
import { Post } from './Post.model';

export class Trip {
  accountByUserId: User;
  endDate: number;
  id: number;
  imagesByTripId: {
    totalCount: number,
    nodes: Image[]
  };
  juncturesByTripId: {
    totalCount: number,
    nodes: Juncture[]
  };
  name: string;
  postsByTripId: {
    totalCount: number,
    nodes: Post[]
  };
  startDate: number;
  startLat: number;
  startLon: number;
  description: string;
}
