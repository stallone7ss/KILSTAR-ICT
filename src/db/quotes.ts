import { db } from './index.ts';
import { quotes } from './schema.ts';
import { desc } from 'drizzle-orm';

export interface NewQuote {
  clientName: string;
  email: string;
  phone?: string;
  businessType?: string;
  projectScope: string;
  estimatedBudget?: string;
  timeline?: string;
  additionalDetails?: string;
  status?: string;
}

export async function insertQuote(data: NewQuote) {
  try {
    const result = await db.insert(quotes)
      .values({
        clientName: data.clientName,
        email: data.email,
        phone: data.phone || null,
        businessType: data.businessType || null,
        projectScope: data.projectScope,
        estimatedBudget: data.estimatedBudget || null,
        timeline: data.timeline || null,
        additionalDetails: data.additionalDetails || null,
        status: data.status || 'pending',
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database query failed in insertQuote:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function getQuotes() {
  try {
    return await db.select().from(quotes).orderBy(desc(quotes.createdAt));
  } catch (error) {
    console.error('Database query failed in getQuotes:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}
