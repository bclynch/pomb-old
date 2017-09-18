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
  category: PostCategory
  userByAuthor: string;
  isDraft: boolean;
  isScheduled: boolean;
  isPublished: boolean;
  scheduledDate: number;
  publishedDate: number;
  postToTagsByPostId: {
    nodes: { id: number, postTagByPostTagId: Tag }[]
  };
  postLeadPhotosByPostId: {
    nodes: {
      id: number,
      title: string,
      leadPhotoLinksByLeadPhotoId: {
        nodes: { url: string, size: number }[]
      }
    }[]
  };
  postToGalleryPhotosByPostId: {
    nodes: GalleryPhoto[]
  }
}

// export type PostCategory = 'Trekking' | 'Biking' | 'Travel' | 'Culture' | 'Gear';
export enum PostCategory {
  TREKKING = <any>"Trekking", 
  BIKING = <any>"Biking", 
  CULTURE = <any>"Culture",  
  TRAVEL = <any>"Travel", 
  GEAR = <any>"Gear",     
}