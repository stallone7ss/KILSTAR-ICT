import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  initDb,
  getAllSubmissions,
  getSubmissionById,
  createSubmission,
  updateSubmission,
  deleteSubmission,
  getDatabaseStats,
  exportSubmissionsData,
  seedSampleData,
  SubmissionInput,
  verifyAdminPassword,
  createAdminSession,
  validateAdminToken,
  destroyAdminSession,
  changeAdminPassword
} from './server/db.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Initialize SQLite database and seed if empty
  initDb();

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Admin Authentication Middleware
  const requireAdminAuth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    let token = '';
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.headers['x-admin-token']) {
      token = String(req.headers['x-admin-token']);
    } else if (req.query.token) {
      token = String(req.query.token);
    }

    if (!token || !validateAdminToken(token)) {
      return res.status(401).json({
        error: 'Unauthorized: Only the administrator with valid credentials can view and manage client form requests.'
      });
    }

    next();
  };

  // REST API Routes
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'KILSTA Form Database API',
      timestamp: new Date().toISOString()
    });
  });

  // Admin Login
  app.post('/api/admin/login', (req: Request, res: Response) => {
    try {
      const { password } = req.body;
      if (!password || !verifyAdminPassword(password)) {
        return res.status(401).json({ error: 'Incorrect administrator password.' });
      }

      const session = createAdminSession();
      console.log('[Admin Auth] Administrator logged in successfully.');
      res.json({
        success: true,
        token: session.token,
        expiresAt: session.expiresAt,
        role: 'Administrator',
        message: 'Authentication successful'
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Login error', message: err.message });
    }
  });

  // Admin Session Verification
  app.get('/api/admin/verify', (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const token = (authHeader && authHeader.startsWith('Bearer '))
        ? authHeader.substring(7)
        : String(req.headers['x-admin-token'] || req.query.token || '');

      const valid = validateAdminToken(token);
      if (!valid) {
        return res.status(401).json({ valid: false, error: 'Session expired or invalid.' });
      }

      res.json({ valid: true, role: 'Administrator' });
    } catch (err: any) {
      res.status(500).json({ error: 'Verification error', message: err.message });
    }
  });

  // Admin Logout
  app.post('/api/admin/logout', (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const token = (authHeader && authHeader.startsWith('Bearer '))
        ? authHeader.substring(7)
        : String(req.headers['x-admin-token'] || req.body?.token || '');

      if (token) {
        destroyAdminSession(token);
      }
      res.json({ success: true, message: 'Logged out successfully.' });
    } catch (err: any) {
      res.status(500).json({ error: 'Logout error', message: err.message });
    }
  });

  // Admin Change Password
  app.post('/api/admin/change-password', requireAdminAuth, (req: Request, res: Response) => {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword || newPassword.trim().length < 4) {
        return res.status(400).json({ error: 'New password must be at least 4 characters long.' });
      }

      const success = changeAdminPassword(currentPassword, newPassword);
      if (!success) {
        return res.status(400).json({ error: 'Current administrator password verification failed.' });
      }

      console.log('[Admin Auth] Administrator password updated.');
      res.json({ success: true, message: 'Administrator password changed successfully.' });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update password', message: err.message });
    }
  });

  // Protected: Get Submissions with filters, search, pagination (Admin only)
  app.get('/api/submissions', requireAdminAuth, (req: Request, res: Response) => {
    try {
      const { form_type, status, priority, search, limit, offset } = req.query;
      const result = getAllSubmissions({
        form_type: form_type as string,
        status: status as string,
        priority: priority as string,
        search: search as string,
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined,
      });
      res.json(result);
    } catch (err: any) {
      console.error('Error fetching submissions:', err);
      res.status(500).json({ error: 'Failed to retrieve submissions', message: err.message });
    }
  });

  // Protected: Get Database Stats (Admin only)
  app.get('/api/submissions/stats', requireAdminAuth, (_req: Request, res: Response) => {
    try {
      const stats = getDatabaseStats();
      res.json(stats);
    } catch (err: any) {
      console.error('Error fetching stats:', err);
      res.status(500).json({ error: 'Failed to retrieve stats', message: err.message });
    }
  });

  // Protected: Export Submissions (CSV or JSON) (Admin only)
  app.get('/api/submissions/export', requireAdminAuth, (req: Request, res: Response) => {
    try {
      const format = (req.query.format as string) === 'json' ? 'json' : 'csv';
      const data = exportSubmissionsData(format);
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="kilsta_submissions_${timestamp}.csv"`);
        return res.send(data);
      } else {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="kilsta_submissions_${timestamp}.json"`);
        return res.send(data);
      }
    } catch (err: any) {
      console.error('Export error:', err);
      res.status(500).json({ error: 'Failed to export data', message: err.message });
    }
  });

  // Protected: Re-seed sample data (Admin only)
  app.post('/api/submissions/seed', requireAdminAuth, (req: Request, res: Response) => {
    try {
      const { forceReset } = req.body;
      seedSampleData(Boolean(forceReset));
      const stats = getDatabaseStats();
      res.json({ message: 'Database reset and seeded successfully with Milne Bay sample records', stats });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to seed database', message: err.message });
    }
  });

  // Protected: Get Single Submission (Admin only)
  app.get('/api/submissions/:id', requireAdminAuth, (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const submission = getSubmissionById(id);
      if (!submission) {
        return res.status(404).json({ error: 'Submission not found' });
      }
      res.json(submission);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to get submission', message: err.message });
    }
  });

  // PUBLIC: Create Form Submission (Anyone on website can submit a form request)
  app.post('/api/submissions', (req: Request, res: Response) => {
    try {
      const {
        form_type,
        full_name,
        email,
        phone,
        organization,
        location,
        subject,
        service_category,
        message,
        priority,
        payload,
        internal_notes
      } = req.body;

      if (!form_type || !full_name || !email) {
        return res.status(400).json({
          error: 'Missing required fields: form_type, full_name, and email are required.'
        });
      }

      const input: SubmissionInput = {
        form_type,
        full_name: full_name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : '',
        organization: organization ? organization.trim() : '',
        location: location ? location.trim() : 'Milne Bay Province',
        subject: subject ? subject.trim() : undefined,
        service_category: service_category ? service_category.trim() : undefined,
        message: message ? message.trim() : '',
        priority: priority || 'normal',
        payload: payload || {},
        internal_notes: internal_notes || '',
      };

      const created = createSubmission(input);
      console.log(`[Form Database] Public submission received: ${created.ref_code} from ${created.full_name}`);
      res.status(201).json(created);
    } catch (err: any) {
      console.error('Create submission error:', err);
      res.status(500).json({ error: 'Failed to submit form', message: err.message });
    }
  });

  // Protected: Update Submission (status, priority, internal_notes) (Admin only)
  app.patch('/api/submissions/:id', requireAdminAuth, (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { status, priority, internal_notes, subject, message } = req.body;
      const updated = updateSubmission(id, {
        status,
        priority,
        internal_notes,
        subject,
        message
      });

      if (!updated) {
        return res.status(404).json({ error: 'Submission not found' });
      }

      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update submission', message: err.message });
    }
  });

  // Protected: Delete Submission (Admin only)
  app.delete('/api/submissions/:id', requireAdminAuth, (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const success = deleteSubmission(id);
      if (!success) {
        return res.status(404).json({ error: 'Submission not found' });
      }
      res.json({ message: 'Submission deleted successfully', id });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to delete submission', message: err.message });
    }
  });

  // In development, hook Vite middleware; in production, serve built dist files
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KILSTA Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
