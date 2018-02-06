import { GalleryPhoto } from './GalleryPhoto.model';
import { Image } from './Image.model';
import { Like } from './Like.model';

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
  totalLikes: {
    totalCount: number;
  };
  likesByUser: {
    nodes: { id: number }[];
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
