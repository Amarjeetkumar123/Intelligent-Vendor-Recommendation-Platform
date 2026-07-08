import express from 'express';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database.js';
import vendorRouter from './routes/vendor.routes.js';
import categoryRouter from './routes/category.routes.js';
import vendorDocumentRouter from './routes/vendor-document.routes.js';
import workRequirementRouter from './routes/work-requirement.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
    res.send('Welcome to the Vendor Recommendation System');
});

app.use('/vendors', vendorRouter);
app.use('/categories', categoryRouter);
app.use('/vendor-documents', vendorDocumentRouter);
app.use('/work-requirements', workRequirementRouter);

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err.message);
    res.status(500).json({ success: false, message: err.message || 'Internal server error' });
});

// ─── Start ────────────────────────────────────────────────────────────────────
connectDatabase();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});