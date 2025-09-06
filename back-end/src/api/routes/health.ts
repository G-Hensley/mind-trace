import { Router } from 'express';
import { supabase } from '@/shared/infrastructure';

export const healthRoutes = Router();

healthRoutes.get('/', async (req, res) => {
  try {
    // Test DB connection
    // Use a generic query to test DB connection, avoiding business table dependency
    const { data, error } = await supabase
      .from('pg_catalog.pg_tables')
      .select('tablename')
      .limit(1);
    if (error) {
      throw error;
    }
    res.json({
      status: 'ok',
      database: 'connected',
      time: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});
