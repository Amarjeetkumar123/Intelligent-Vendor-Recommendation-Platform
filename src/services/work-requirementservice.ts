import { Request, Response, NextFunction } from 'express';
import {
    saveWorkRequirement,
    getWorkRequirements,
    getWorkRequirementById,
    updateWorkRequirement,
    deleteWorkRequirement,
} from '../dbhelper/work-requirement.dao.js';
import { WorkRequirement } from '../models/index.js';

// ─── CREATE ───────────────────────────────────────────────────────────────────
// POST /work-requirements

export const createWorkRequirement = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {
            work_code, title, description, category_id, city, state,
            estimated_value, priority, expected_start_date, expected_end_date, created_by,
        }: WorkRequirement = req.body;
        const workReq = await saveWorkRequirement({
            work_code, title, description, category_id, city, state,
            estimated_value, priority, expected_start_date, expected_end_date, created_by,
        });
        res.status(201).json({ success: true, data: workReq });
    } catch (error) {
        next(error);
    }
};

// ─── READ ALL (dynamic filters via body) ──────────────────────────────────────
// POST /work-requirements/query

export const queryWorkRequirements = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const filters: WorkRequirement = req.body ?? {};
        const workReqs = await getWorkRequirements(filters);
        res.status(200).json({ success: true, count: workReqs.length, data: workReqs });
    } catch (error) {
        next(error);
    }
};

// ─── READ ONE ─────────────────────────────────────────────────────────────────
// GET /work-requirements/:id

export const queryWorkRequirementById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = parseInt(String(req.params.id), 10);
        if (isNaN(id)) {
            res.status(400).json({ success: false, message: 'Invalid work requirement id' });
            return;
        }
        const workReq = await getWorkRequirementById(id);
        if (!workReq) {
            res.status(404).json({ success: false, message: `Work requirement with id ${id} not found` });
            return;
        }
        res.status(200).json({ success: true, data: workReq });
    } catch (error) {
        next(error);
    }
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────
// PUT /work-requirements/:id

export const updateWorkRequirementById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = parseInt(String(req.params.id), 10);
        if (isNaN(id)) {
            res.status(400).json({ success: false, message: 'Invalid work requirement id' });
            return;
        }
        const reqData: WorkRequirement = req.body;
        const updated = await updateWorkRequirement(id, reqData);
        if (!updated) {
            res.status(404).json({ success: false, message: `Work requirement with id ${id} not found` });
            return;
        }
        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        next(error);
    }
};

// ─── DELETE ───────────────────────────────────────────────────────────────────
// DELETE /work-requirements/:id

export const deleteWorkRequirementById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = parseInt(String(req.params.id), 10);
        if (isNaN(id)) {
            res.status(400).json({ success: false, message: 'Invalid work requirement id' });
            return;
        }
        const deleted = await deleteWorkRequirement(id);
        if (!deleted) {
            res.status(404).json({ success: false, message: `Work requirement with id ${id} not found` });
            return;
        }
        res.status(200).json({ success: true, message: 'Work requirement deleted successfully', data: deleted });
    } catch (error) {
        next(error);
    }
};
