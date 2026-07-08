import { Request, Response, NextFunction } from 'express';
import {
    saveVendorDocument,
    getVendorDocuments,
    getVendorDocumentById,
    updateVendorDocument,
    deleteVendorDocument,
} from '../dbhelper/vendor-document.dao.js';
import { VendorDocument } from '../models/index.js';

// ─── CREATE ───────────────────────────────────────────────────────────────────
// POST /vendor-documents

export const createVendorDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { vendor_id, document_name, document_type, issue_date, expiry_date, verified }: VendorDocument = req.body;
        const doc = await saveVendorDocument({ vendor_id, document_name, document_type, issue_date, expiry_date, verified });
        res.status(201).json({ success: true, data: doc });
    } catch (error) {
        next(error);
    }
};

// ─── READ ALL (dynamic filters via body) ──────────────────────────────────────
// POST /vendor-documents/query

export const queryVendorDocuments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const filters: VendorDocument = req.body ?? {};
        const docs = await getVendorDocuments(filters);
        res.status(200).json({ success: true, count: docs.length, data: docs });
    } catch (error) {
        next(error);
    }
};

// ─── READ ONE ─────────────────────────────────────────────────────────────────
// GET /vendor-documents/:id

export const queryVendorDocumentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = parseInt(String(req.params.id), 10);
        if (isNaN(id)) {
            res.status(400).json({ success: false, message: 'Invalid vendor document id' });
            return;
        }
        const doc = await getVendorDocumentById(id);
        if (!doc) {
            res.status(404).json({ success: false, message: `Vendor document with id ${id} not found` });
            return;
        }
        res.status(200).json({ success: true, data: doc });
    } catch (error) {
        next(error);
    }
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────
// PUT /vendor-documents/:id

export const updateVendorDocumentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = parseInt(String(req.params.id), 10);
        if (isNaN(id)) {
            res.status(400).json({ success: false, message: 'Invalid vendor document id' });
            return;
        }
        const docData: VendorDocument = req.body;
        const updated = await updateVendorDocument(id, docData);
        if (!updated) {
            res.status(404).json({ success: false, message: `Vendor document with id ${id} not found` });
            return;
        }
        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        next(error);
    }
};

// ─── DELETE ───────────────────────────────────────────────────────────────────
// DELETE /vendor-documents/:id

export const deleteVendorDocumentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = parseInt(String(req.params.id), 10);
        if (isNaN(id)) {
            res.status(400).json({ success: false, message: 'Invalid vendor document id' });
            return;
        }
        const deleted = await deleteVendorDocument(id);
        if (!deleted) {
            res.status(404).json({ success: false, message: `Vendor document with id ${id} not found` });
            return;
        }
        res.status(200).json({ success: true, message: 'Vendor document deleted successfully', data: deleted });
    } catch (error) {
        next(error);
    }
};
