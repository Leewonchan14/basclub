import { Point, ValueTransformer } from "typeorm";

export interface GeoPoint {
  lat: number;
  lng: number;
}

export class GeoPointTransFormer implements ValueTransformer {
  to(entityValue: GeoPoint): Point {
    const { lat, lng } = entityValue;
    return {
      type: "Point",
      coordinates: [lat, lng],
    };
  }
  from(db: Point) {
    const [lat, lng] = db.coordinates;
    return { lat, lng };
  }
}
