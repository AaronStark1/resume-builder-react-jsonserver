/**
 * Look and timing of the ink-bleed theme transition.
 * Values match the ink-bleed-theme-changer reference so the effect keeps its character.
 */
export const inkParams = {
  /** Seconds for the spread (before the fade onto the live page). */
  duration: 1.4,
  /** Tendril reach multiplier, 0 = clean blob. */
  tendril: 1,
  /** Noise frequency multiplier: lower = bigger, lazier shapes. */
  noiseScale: 1,
  /** Frontier half-width in CSS px. */
  softness: 1.4,
  /** Speed at which the shape evolves during the spread. */
  drift: 1,
  /** Global playback rate (e.g. 0.25 for slow motion while debugging). */
  timeScale: 1,
}

/**
 * Pigment pooled at the frontier, keyed by the theme being revealed:
 * ink a touch denser than the dark page (#0c0714), bleach a touch brighter than the light one (#f7f7fb).
 */
export const RIM_COLOR = {
  dark: [0.02, 0.008, 0.04],
  light: [0.998, 0.998, 1.0],
}
