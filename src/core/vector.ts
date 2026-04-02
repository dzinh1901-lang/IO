import { Vec3Km } from '../types/ephemeris';

export function vec3(x = 0, y = 0, z = 0): Vec3Km {
  return [x, y, z];
}

export function copyVec3(source: Vec3Km): Vec3Km {
  return [source[0], source[1], source[2]];
}

export function addVec3(a: Vec3Km, b: Vec3Km): Vec3Km {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

export function subVec3(a: Vec3Km, b: Vec3Km): Vec3Km {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

export function scaleVec3(v: Vec3Km, scalar: number): Vec3Km {
  return [v[0] * scalar, v[1] * scalar, v[2] * scalar];
}

export function lengthVec3(v: Vec3Km): number {
  return Math.hypot(v[0], v[1], v[2]);
}

export function lerpVec3(a: Vec3Km, b: Vec3Km, t: number): Vec3Km {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function saturate(value: number): number {
  return clamp(value, 0, 1);
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = saturate((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function logLerp(a: number, b: number, t: number): number {
  const safeA = Math.max(a, 1e-9);
  const safeB = Math.max(b, 1e-9);
  return Math.exp(lerp(Math.log(safeA), Math.log(safeB), t));
}
