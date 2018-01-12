export interface GeoJSON {
  type: string;
  geometry: {
    type: string;
    coordinates: number[][]
  };
  properties: {
    coordTimes: string[];
  };
}
