import { User } from './User.model';
import { Juncture } from './Juncture.model';
import { Image } from './Image.model';
import { Post } from './Post.model';

export class Trip {
  accountByUserId: User;
  endDate: number;
  id: number;
  imagesByTripId: {
    nodes: Image[]
  };
  juncturesByTripId: {
    nodes: Juncture[]
  };
  name: string;
  postsByTripId: {
    nodes: Post[]
  };
  startDate: number;
  startLat: number;
  startLon: number;
}
