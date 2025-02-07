import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { accounts } from './schema';

export const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });

async function testDBConnection() {
  try {
    const result = await db.execute('select 1');
    console.log("DB Connection Success:", result);
  } catch (error) {
    console.error("DB Connection Error:", error);
  }
}

// Call the function but don't `await` it at the top level
testDBConnection();
