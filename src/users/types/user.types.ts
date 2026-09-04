/** Geographic point stored as PostGIS geography(Point, 4326). */
export interface GeoPoint {
  type: 'Point';
  coordinates: [number, number];
}

/** JWT payload attached to Express requests by AuthGuard. */
export interface AuthRequest {
  sub: string;
}
