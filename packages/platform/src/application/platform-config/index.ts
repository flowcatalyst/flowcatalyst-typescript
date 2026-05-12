/**
 * Platform Config Use Cases (set / delete on the configs themselves).
 *
 * Note: access-control grants for the configs (who can read/write what)
 * live in `application/config-access/` — separate concern.
 */

export * from "./set/index.js";
export * from "./delete/index.js";
