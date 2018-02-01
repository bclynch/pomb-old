import { Juncture } from './Juncture.model';

export class Coords {
  id: number;
  lat: string;
  lon: string;
  elevation: number;
  coordTime: string;
  junctureByJunctureId: Juncture;
}
