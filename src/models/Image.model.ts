import { User } from './User.model';

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
}
