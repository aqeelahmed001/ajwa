// Export auth functions from our new JWT system
import { getCurrentUserServer } from './jwt';
import type { UserJwtPayload } from './jwt';

// Export the getCurrentUser function for server components
export { getCurrentUserServer as getCurrentUser };

// Helper functions
export async function isAdmin(user: UserJwtPayload | null) {
  return user?.role === 'admin';
}
