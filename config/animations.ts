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

export const fadeIn = {
  initial: {
    opacity: 0,
  },

  animate: {
    opacity: 1,
  },

  transition: {
    duration: durations.normal,
    ease: easings.smooth,
  },
} as const;

export const scaleIn = {
  initial: {
    opacity: 0,
    scale: 0.96,
  },

  animate: {
    opacity: 1,
    scale: 1,
  },

  transition: {
    duration: durations.normal,
    ease: easings.premium,
  },
} as const;

export const hoverLift = {
  whileHover: {
    y: -4,
  },

  transition: {
    duration: durations.fast,
    ease: easings.premium,
  },
} as const;

export const softFloat = {
  animate: {
    y: [0, -7, 0],
    rotate: [0, 1, 0],
  },

  transition: {
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut",
  },
} as const;
