export const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.22, ease: "easeOut" },
};

export const cardHover = {
  whileHover: { y: -3, transition: { duration: 0.18 } },
  whileTap: { scale: 0.99 },
};
