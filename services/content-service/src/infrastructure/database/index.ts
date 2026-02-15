/**
 * Database infrastructure barrel export
 * Uses raw pg library via databaseService
 */

import { getDatabaseService } from '@config/db.service';

export { getDatabaseService } from '@config/db.service';
// For compatibility, provide a reference that lazily loads the service
export const databaseService = {
  connect: () => getDatabaseService().connect(),
  disconnect: () => getDatabaseService().disconnect(),
  healthCheck: () => getDatabaseService().healthCheck(),
  getMigrationStatus: () => getDatabaseService().getMigrationStatus(),
  query: (text: string, params?: any[]) => getDatabaseService().query(text, params),
  getPool: () => getDatabaseService().getPool(),
  get connected() {
    return getDatabaseService().connected;
  },
};
