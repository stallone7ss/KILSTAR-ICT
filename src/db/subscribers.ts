import { db } from './index.ts';
import { subscribers } from './schema.ts';
import { desc } from 'drizzle-orm';

export interface NewSubscriber {
  email: string;
  fullName?: string;
  source?: string;
}

export async function insertSubscriber(data: NewSubscriber) {
  try {
    const result = await db.insert(subscribers)
      .values({
        email: data.email,
        fullName: data.fullName || null,
        source: data.source || 'footer_newsletter',
        isActive: 1,
      })
      .onConflictDoUpdate({
        target: subscribers.email,
        set: {
          fullName: data.fullName || null,
          isActive: 1,
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database query failed in insertSubscriber:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function getSubscribers() {
  try {
    return await db.select().from(subscribers).orderBy(desc(subscribers.createdAt));
  } catch (error) {
    console.error('Database query failed in getSubscribers:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}
