export const durations = {
  fast: 0.25,
  normal: 0.45,
  slow: 0.8,
} as const;

export const easings = {
  premium: [0.22, 1, 0.36, 1],
  smooth: [0.4, 0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
} as const;

export const fadeUp = {
  initial: {
    opacity: 0,
    y: 24,
  },

  animate: {
    opacity: 1,
    y: 0,
  },

  transition: {
    duration: durations.normal,
    ease: easings.premium,
  },
} as const;
