import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';

// Firebase Authenticated Users
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  displayName: text('display_name'),
  role: text('role').default('user'),
  createdAt: timestamp('created_at').defaultNow(),
});

// General Inquiries Table
export const contacts = pgTable('contacts', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  company: text('company'),
  service: text('service'),
  message: text('message').notNull(),
  status: text('status').default('new'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Business Estimate Requests Table
export const quotes = pgTable('quotes', {
  id: serial('id').primaryKey(),
  clientName: text('client_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  businessType: text('business_type'),
  projectScope: text('project_scope').notNull(),
  estimatedBudget: text('estimated_budget'),
  timeline: text('timeline'),
  additionalDetails: text('additional_details'),
  status: text('status').default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Newsletter & Tech Advisory Subscribers
export const subscribers = pgTable('subscribers', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  fullName: text('full_name'),
  source: text('source').default('footer_newsletter'),
  isActive: integer('is_active').default(1),
  createdAt: timestamp('created_at').defaultNow(),
});
