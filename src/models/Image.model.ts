import { User } from './User.model';
import { Like } from './Like.model';

export enum ImageType {
  LEAD_LARGE = 'LEAD_LARGE',
  LEAD_SMALL = 'LEAD_SMALL',
  GALLERY = 'GALLERY',
  BANNER = 'BANNER',
}

export class Image {
  id: number;
  accountByUserId: User;
  description: string;
  title: string;
  type: ImageType;
  url: string;
  postId: number;
  junctureId: number;
  tripId: number;
  likesByImageId: {
    totalCount: number;
    nodes: Like[];
  };
}
