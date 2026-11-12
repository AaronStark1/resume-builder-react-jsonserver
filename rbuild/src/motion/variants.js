export const ease = [0.22, 1, 0.36, 1] // "easeOutQuint"-like

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease },
  },
}

export const stagger = (s = 0.08) => ({
  hidden: {},
  show: {
    transition: { staggerChildren: s },
  },
})

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease },
  },
}

export const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease } },
}
