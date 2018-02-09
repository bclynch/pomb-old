import { Post } from './Post.model';
import { Image } from './Image.model';
import { Juncture } from './Juncture.model';
import { Trip } from './Trip.model';

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
}
