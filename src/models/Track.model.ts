import { User } from './User.model';

export class Track {
  id: number;
  userId: number;
  trackUserId: number;
  accountByUserId: User;
  accountByTrackUserId: User;
}
