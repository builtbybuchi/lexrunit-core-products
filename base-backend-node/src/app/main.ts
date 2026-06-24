import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { rateLimiter, requireAuth } from './core/dependencies';
import { Bindings } from './core/types';
import { clerkMiddleware } from '@hono/clerk-auth';

import { hospitalsRouter } from './api/v1/routes/hospitals';
import { careersRouter } from './api/v1/routes/careers';
import { newsRouter } from './api/v1/routes/news';
import { blogRouter } from './api/v1/routes/blog';
import { contactRouter } from './api/v1/routes/contact';
import { usersRouter } from './api/v1/routes/users';
import { adminRouter } from './api/v1/routes/admin';
import { higsRouter } from './api/v1/routes/higs';

const app = new Hono<{ Bindings: Bindings }>();

// Global Middlewares
app.use('*', cors({
  origin: ['https://lexrunit.com', 'https://www.lexrunit.com', 'http://localhost:5173', 'http://localhost:3000'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'x-lexrunit-api-key'],
  credentials: true,
}));

app.use('*', rateLimiter);

// Root Route
app.get('/', (c) => c.json({ message: 'Base Backend API', version: '0.1.0' }));

// API V1 Group
const api = new Hono<{ Bindings: Bindings }>();
api.use('/admin/*', clerkMiddleware(), requireAuth);
api.use('/users/*', clerkMiddleware(), requireAuth);

api.route('/hospitals', hospitalsRouter);
api.route('/careers', careersRouter);
api.route('/news', newsRouter);
api.route('/blog', blogRouter);
api.route('/contact', contactRouter);
api.route('/users', usersRouter);
api.route('/admin', adminRouter);
api.route('/higs', higsRouter);

// Mount API
app.route('/api/v1', api);

export default app;
