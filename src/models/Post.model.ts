import { GalleryPhoto } from './GalleryPhoto.model';

export class Post {
  createdAt: string;
  updatedAt: string;
  id: number;
  leadphoto: string;
  title: string;
  subtitle: string;
  content: string;
  tripId: number;
  junctureId: number;
  userByAuthor: string;
  isDraft: boolean;
  isScheduled: boolean;
  isPublished: boolean;
  scheduledDate: number;
  publishedDate: number;
  postToTagsByPostId: {
    nodes: { id: number, postTagByPostTagId: any }[]
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
