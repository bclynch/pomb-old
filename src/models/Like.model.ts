import { User } from './User.model';
import { Juncture } from './Juncture.model';
import { Image } from './Image.model';
import { Post } from './Post.model';
import { Trip } from './Trip.model';

export class Like {
  id: number;
  tripId: number;
  junctureId: number;
  postId: number;
  imageId: number;
  userId: number;
  imageByImageId: Image;
  tripByTripId: Trip;
  junctureByJunctureId: Juncture;
  postByTripId: Post;
  accountByUserId: User;
}
