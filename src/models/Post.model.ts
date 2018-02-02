import { GalleryPhoto } from './GalleryPhoto.model';
import { Image } from './Image.model';

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
    nodes: {
      id: number;
      postTagId: string;
      postTagByPostTagId: PostTag;
    }[]
  };
  imagesByPostId: {
    nodes: Image[];
  };
}

export class PostTag {
  name: string;
  tagDescription: string;
  postToTagsByPostTagId: {
    nodes: {
      postByPostId: Post
    }[]
  };
}
