import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '@/config/env';

class DatabaseConnection {
  private static instance: SupabaseClient;

  public static getInstance(): SupabaseClient {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = createClient(
        config.SUPABASE_URL,
        config.SUPABASE_ANON_KEY,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        }
      );
    }
    return DatabaseConnection.instance;
  }

  // For testing purposes only
  public static setInstance(client: SupabaseClient) {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('setInstance can only be used in test environments');
    }
    DatabaseConnection.instance = client;
  }
}

export const supabase = DatabaseConnection.getInstance();
export { DatabaseConnection };
