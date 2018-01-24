import { Tag } from './Tag.model';
import { GalleryPhoto } from './GalleryPhoto.model';

export class Post {
  createdAt: string;
  updatedAt: string;
  id: number;
  leadphoto: string;
  title: string;
  subtitle: string;
  content: string;
  category: PostCategory;
  userByAuthor: string;
  isDraft: boolean;
  isScheduled: boolean;
  isPublished: boolean;
  scheduledDate: number;
  publishedDate: number;
  postToTagsByPostId: {
    nodes: { id: number, postTagByPostTagId: Tag }[]
  };
  imagesByPostId: {
    nodes: {
      id: number;
      description: string;
      title: string;
      type: string;
      url: string;
    }[]
  };
}

export enum PostCategory {
  TREKKING = <any>'trekking',
  BIKING = <any>'biking',
  CULTURE = <any>'culture',
  TRAVEL = <any>'travel',
  GEAR = <any>'gear',
  FOOD = <any>'food',
}
