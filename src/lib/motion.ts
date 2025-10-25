// Client-side only imports for framer-motion
// This helps prevent SSR issues with framer-motion

import dynamic from 'next/dynamic';

// Dynamically import motion components with SSR disabled
export const motion = dynamic(
  () => import('framer-motion').then((mod) => mod.motion),
  { ssr: false }
);

export const AnimatePresence = dynamic(
  () => import('framer-motion').then((mod) => mod.AnimatePresence),
  { ssr: false }
);

// Export other framer-motion utilities as needed
export const useAnimation = dynamic(
  () => import('framer-motion').then((mod) => mod.useAnimation),
  { ssr: false }
);

// For variants, we need to export a function that returns the imported variants
export const getVariants = async () => {
  const framerMotion = await import('framer-motion');
  return framerMotion;
};

// Export a function to get the full framer-motion module
export const getFramerMotion = async () => {
  return await import('framer-motion');
};
