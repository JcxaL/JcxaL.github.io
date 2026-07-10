/**
 * Atlas geometry — great-circle sampling for route arcs.
 *
 * MapLibre draws LineStrings as Mercator paths, not geodesics, so a
 * two-point line between continents renders as the wrong curve on the
 * globe. Arcs must be pre-densified along the great circle (doc 07 D4).
 *
 * Note: segments that cross the antimeridian are not split here — the
 * current network (East Asia + Atlantic lines) never crosses it. Split
 * into MultiLineString before adding trans-Pacific routes.
 */

export interface LatLng {
  lat: number;
  lng: number;
}

const toRad = (deg: number): number => (deg * Math.PI) / 180;
const toDeg = (rad: number): number => (rad * 180) / Math.PI;

/**
 * Points along the great circle between two coordinates (inclusive),
 * as GeoJSON [lng, lat] positions. Spherical linear interpolation.
 */
export function greatCircle(
  from: LatLng,
  to: LatLng,
  segments = 64,
): [number, number][] {
  const φ1 = toRad(from.lat);
  const λ1 = toRad(from.lng);
  const φ2 = toRad(to.lat);
  const λ2 = toRad(to.lng);

  // Angular distance (haversine).
  const Δφ = φ2 - φ1;
  const Δλ = λ2 - λ1;
  const a =
    Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const δ = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  if (δ === 0) return [[from.lng, from.lat]];

  const sinδ = Math.sin(δ);
  const coords: [number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const f = i / segments;
    const A = Math.sin((1 - f) * δ) / sinδ;
    const B = Math.sin(f * δ) / sinδ;
    const x = A * Math.cos(φ1) * Math.cos(λ1) + B * Math.cos(φ2) * Math.cos(λ2);
    const y = A * Math.cos(φ1) * Math.sin(λ1) + B * Math.cos(φ2) * Math.sin(λ2);
    const z = A * Math.sin(φ1) + B * Math.sin(φ2);
    coords.push([toDeg(Math.atan2(y, x)), toDeg(Math.atan2(z, Math.hypot(x, y)))]);
  }
  return coords;
}
