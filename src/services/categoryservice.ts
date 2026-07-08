import { Request, Response, NextFunction } from 'express';
import {
    saveCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
} from '../dbhelper/category.dao.js';
import { Category } from '../models/index.js';

// ─── CREATE ───────────────────────────────────────────────────────────────────
// POST /categories

export const createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, description }: Category = req.body;
        const category = await saveCategory({ name, description });
        res.status(201).json({ success: true, data: category });
    } catch (error) {
        next(error);
    }
};

// ─── READ ALL (dynamic filters via body) ──────────────────────────────────────
// POST /categories/query

export const queryCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const filters: Category = req.body ?? {};
        const categories = await getCategories(filters);
        res.status(200).json({ success: true, count: categories.length, data: categories });
    } catch (error) {
        next(error);
    }
};

// ─── READ ONE ─────────────────────────────────────────────────────────────────
// GET /categories/:id

export const queryCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = parseInt(String(req.params.id), 10);
        if (isNaN(id)) {
            res.status(400).json({ success: false, message: 'Invalid category id' });
            return;
        }
        const category = await getCategoryById(id);
        if (!category) {
            res.status(404).json({ success: false, message: `Category with id ${id} not found` });
            return;
        }
        res.status(200).json({ success: true, data: category });
    } catch (error) {
        next(error);
    }
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────
// PUT /categories/:id

export const updateCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = parseInt(String(req.params.id), 10);
        if (isNaN(id)) {
            res.status(400).json({ success: false, message: 'Invalid category id' });
            return;
        }
        const categoryData: Category = req.body;
        const updated = await updateCategory(id, categoryData);
        if (!updated) {
            res.status(404).json({ success: false, message: `Category with id ${id} not found` });
            return;
        }
        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        next(error);
    }
};

// ─── DELETE ───────────────────────────────────────────────────────────────────
// DELETE /categories/:id

export const deleteCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = parseInt(String(req.params.id), 10);
        if (isNaN(id)) {
            res.status(400).json({ success: false, message: 'Invalid category id' });
            return;
        }
        const deleted = await deleteCategory(id);
        if (!deleted) {
            res.status(404).json({ success: false, message: `Category with id ${id} not found` });
            return;
        }
        res.status(200).json({ success: true, message: 'Category deleted successfully', data: deleted });
    } catch (error) {
        next(error);
    }
};
