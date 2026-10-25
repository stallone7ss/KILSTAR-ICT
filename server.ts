import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { insertContact, getContacts } from './src/db/contacts.ts';
import { insertQuote, getQuotes } from './src/db/quotes.ts';
import { insertSubscriber, getSubscribers } from './src/db/subscribers.ts';
import { getOrCreateUser } from './src/db/users.ts';
import { requireAuth, optionalAuth, AuthRequest } from './src/middleware/auth.ts';
import submitHandler from './api/submit.ts';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Vercel Serverless & Codespaces Unified Route: /api/submit
app.all('/api/submit', (req, res) => {
  return submitHandler(req as any, res as any);
});

// Helper to determine if client wants JSON or standard HTML redirect
function respond(req: Request, res: Response, result: { success: boolean; module: string; id?: number; message: string; data?: any }) {
  const accept = req.headers['accept'] || '';
  const isAjax = req.headers['x-requested-with'] === 'XMLHttpRequest' || accept.includes('application/json') || req.is('application/json');

  if (isAjax) {
    return res.status(200).json(result);
  }

  // HTML Form Post redirect back to referring page with status
  const referer = req.headers['referer'] || '/';
  try {
    const redirectUrl = new URL(referer, `http://${req.headers.host || 'localhost:3000'}`);
    redirectUrl.searchParams.set('status', result.success ? 'success' : 'error');
    redirectUrl.searchParams.set('module', result.module);
    if (result.id) redirectUrl.searchParams.set('id', String(result.id));
    return res.redirect(303, redirectUrl.toString());
  } catch {
    return res.redirect(303, `/?status=${result.success ? 'success' : 'error'}&module=${result.module}`);
  }
}

// -----------------------------------------------------------------------------
// Form Submission Endpoints (Cloud SQL PostgreSQL)
// -----------------------------------------------------------------------------

// 1. General Inquiries
app.post(['/api/contacts', '/contact'], optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { name, email, phone, company, service, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required fields.' });
    }

    const record = await insertContact({
      name: String(name).trim(),
      email: String(email).trim(),
      phone: phone ? String(phone).trim() : undefined,
      company: company ? String(company).trim() : undefined,
      service: service ? String(service).trim() : undefined,
      message: String(message).trim(),
    });

    if (req.user?.uid && req.user?.email) {
      await getOrCreateUser(req.user.uid, req.user.email, req.user.name).catch(() => {});
    }

    return respond(req, res, {
      success: true,
      module: 'contacts',
      id: record.id,
      message: 'Inquiry received successfully! Our consultants will contact you shortly.',
      data: record,
    });
  } catch (error: any) {
    console.error('Failed to submit contact inquiry:', error);
    return res.status(500).json({ error: error.message || 'Failed to submit inquiry' });
  }
});

// 2. Project Estimate / Quote Request
app.post(['/api/quotes', '/quote'], optionalAuth, async (req: AuthRequest, res) => {
  try {
    const {
      client_name,
      clientName,
      email,
      phone,
      business_type,
      businessType,
      project_scope,
      projectScope,
      estimated_budget,
      estimatedBudget,
      timeline,
      additional_details,
      additionalDetails,
    } = req.body;

    const resolvedName = client_name || clientName;
    const resolvedScope = project_scope || projectScope;

    if (!resolvedName || !email || !resolvedScope) {
      return res.status(400).json({ error: 'Client name, email, and project scope are required fields.' });
    }

    const record = await insertQuote({
      clientName: String(resolvedName).trim(),
      email: String(email).trim(),
      phone: phone ? String(phone).trim() : undefined,
      businessType: (business_type || businessType) ? String(business_type || businessType).trim() : undefined,
      projectScope: String(resolvedScope).trim(),
      estimatedBudget: (estimated_budget || estimatedBudget) ? String(estimated_budget || estimatedBudget).trim() : undefined,
      timeline: timeline ? String(timeline).trim() : undefined,
      additionalDetails: (additional_details || additionalDetails) ? String(additional_details || additionalDetails).trim() : undefined,
    });

    if (req.user?.uid && req.user?.email) {
      await getOrCreateUser(req.user.uid, req.user.email, req.user.name).catch(() => {});
    }

    return respond(req, res, {
      success: true,
      module: 'quotes',
      id: record.id,
      message: 'Quote estimate request received! We will prepare a detailed proposal.',
      data: record,
    });
  } catch (error: any) {
    console.error('Failed to submit quote request:', error);
    return res.status(500).json({ error: error.message || 'Failed to submit quote request' });
  }
});

// 3. Newsletter Subscription
app.post(['/api/subscribers', '/subscribe'], optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { email, full_name, fullName, source } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required for subscription.' });
    }

    const record = await insertSubscriber({
      email: String(email).trim(),
      fullName: (full_name || fullName) ? String(full_name || fullName).trim() : undefined,
      source: source ? String(source).trim() : 'footer_newsletter',
    });

    return respond(req, res, {
      success: true,
      module: 'subscribers',
      id: record.id,
      message: 'Subscribed successfully to Kilstar Business & ICT Briefings!',
      data: record,
    });
  } catch (error: any) {
    console.error('Failed to subscribe:', error);
    return res.status(500).json({ error: error.message || 'Failed to subscribe' });
  }
});

// -----------------------------------------------------------------------------
// Authenticated API Endpoints (Firebase Auth -> Cloud SQL)
// -----------------------------------------------------------------------------

app.post('/api/auth/sync', requireAuth, async (req: AuthRequest, res) => {
  try {
    if (!req.user || !req.user.uid || !req.user.email) {
      return res.status(401).json({ error: 'Invalid user authentication' });
    }
    const user = await getOrCreateUser(req.user.uid, req.user.email, req.user.name);
    return res.json({ success: true, user });
  } catch (error: any) {
    console.error('Failed to sync authenticated user:', error);
    return res.status(500).json({ error: error.message || 'Failed to sync user' });
  }
});

app.get('/api/contacts', requireAuth, async (_req: AuthRequest, res) => {
  try {
    const data = await getContacts();
    return res.json(data);
  } catch (error: any) {
    console.error('Failed to fetch contacts:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch contacts' });
  }
});

app.get('/api/quotes', requireAuth, async (_req: AuthRequest, res) => {
  try {
    const data = await getQuotes();
    return res.json(data);
  } catch (error: any) {
    console.error('Failed to fetch quotes:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch quotes' });
  }
});

app.get('/api/subscribers', requireAuth, async (_req: AuthRequest, res) => {
  try {
    const data = await getSubscribers();
    return res.json(data);
  } catch (error: any) {
    console.error('Failed to fetch subscribers:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch subscribers' });
  }
});

// Vite Middleware for Full-stack Dev & SPA fallback
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kilstar Solutions server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
