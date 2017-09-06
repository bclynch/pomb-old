import { Tag } from './Tag.model';

export class Post {
  createdAt: string;
  updatedAt: string;
  id: number;
  leadphoto: string;
  title: string;
  subtitle: string;
  content: string;
  userByAuthor: string;
  isDraft: boolean;
  isScheduled: boolean;
  isPublished: boolean;
  postToTagsByPostId: {
    nodes: { postTagByPostTagId: Tag }[]
  };
  postToCategoriesByPostId: {
    nodes: { postCategoryByPostCategoryId: Tag }[]
  };
  postLeadPhotosByPostId: {
    nodes: {
      title: string,
      leadPhotoLinksByLeadPhotoId: {
        nodes: { url: string, size: number }[]
      }
    }[]
  }
}