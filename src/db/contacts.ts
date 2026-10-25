import { db } from './index.ts';
import { contacts } from './schema.ts';
import { desc } from 'drizzle-orm';

export interface NewContact {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  message: string;
  status?: string;
}

export async function insertContact(data: NewContact) {
  try {
    const result = await db.insert(contacts)
      .values({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        service: data.service || null,
        message: data.message,
        status: data.status || 'new',
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database query failed in insertContact:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function getContacts() {
  try {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  } catch (error) {
    console.error('Database query failed in getContacts:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}
