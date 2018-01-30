import { Juncture } from './Juncture.model';

export class Coords {
  id: number;
  lat: number;
  lon: number;
  elevation: number;
  coordTime: string;
  junctureByJunctureId: Juncture;
}
