/**
 * GSAP ease names for the motion tokens (tokens/tokens.json → motion.easing.*).
 * GSAP cannot consume CSS cubic-bezier custom properties, so these named
 * constants mirror the tokens per the CLAUDE.md rule-1 carve-out (a); each
 * names the token it mirrors. Change the token → update the mirror here.
 */

/** Mirrors motion.easing.trainDecelerate — cubic-bezier(0.16, 1, 0.3, 1). */
export const EASE_TRAIN_DECELERATE = "expo.out";

/** Mirrors motion.easing.trainAccelerate — cubic-bezier(0.7, 0, 0.84, 0). */
export const EASE_TRAIN_ACCELERATE = "expo.in";

/** Mirrors motion.easing.standard — cubic-bezier(0.4, 0, 0.2, 1). */
export const EASE_STANDARD = "power2.inOut";
