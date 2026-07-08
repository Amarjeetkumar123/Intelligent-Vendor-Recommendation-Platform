import { Request, Response, NextFunction } from 'express';
import {
    saveVendor,
    getVendors,
    getVendorById,
    updateVendor,
    deleteVendor,
} from '../dbhelper/vendor.dao.js';
import { Vendor } from '../models/index.js';

// ─── CREATE ───────────────────────────────────────────────────────────────────
// POST /vendors

export const createVendor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, vendor_type, category_id, email, mobile_number, address, city, state, pincode }: Vendor = req.body;
        const vendor = await saveVendor({ name, vendor_type, category_id, email, mobile_number, address, city, state, pincode });
        res.status(201).json({ success: true, data: vendor });
    } catch (error) {
        next(error);
    }
};

// ─── READ ALL (dynamic filters via body) ──────────────────────────────────────
// POST /vendors/query

export const queryVendors = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const filters: Vendor = req.body ?? {};
        const vendors = await getVendors(filters);
        res.status(200).json({ success: true, count: vendors.length, data: vendors });
    } catch (error) {
        next(error);
    }
};

// ─── READ ONE ─────────────────────────────────────────────────────────────────
// GET /vendors/:id

export const queryVendorById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = parseInt(String(req.params.id), 10);
        if (isNaN(id)) {
            res.status(400).json({ success: false, message: 'Invalid vendor id' });
            return;
        }
        const vendor = await getVendorById(id);
        if (!vendor) {
            res.status(404).json({ success: false, message: `Vendor with id ${id} not found` });
            return;
        }
        res.status(200).json({ success: true, data: vendor });
    } catch (error) {
        next(error);
    }
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────
// PUT /vendors/:id

export const updateVendorById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = parseInt(String(req.params.id), 10);
        if (isNaN(id)) {
            res.status(400).json({ success: false, message: 'Invalid vendor id' });
            return;
        }
        const vendorData: Vendor = req.body;
        const updated = await updateVendor(id, vendorData);
        if (!updated) {
            res.status(404).json({ success: false, message: `Vendor with id ${id} not found` });
            return;
        }
        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        next(error);
    }
};

// ─── DELETE ───────────────────────────────────────────────────────────────────
// DELETE /vendors/:id

export const deleteVendorById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = parseInt(String(req.params.id), 10);
        if (isNaN(id)) {
            res.status(400).json({ success: false, message: 'Invalid vendor id' });
            return;
        }
        const deleted = await deleteVendor(id);
        if (!deleted) {
            res.status(404).json({ success: false, message: `Vendor with id ${id} not found` });
            return;
        }
        res.status(200).json({ success: true, message: 'Vendor deleted successfully', data: deleted });
    } catch (error) {
        next(error);
    }
};