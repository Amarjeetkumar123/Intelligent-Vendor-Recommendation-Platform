import express from 'express';
import {
    createCategory,
    queryCategories,
    queryCategoryById,
    updateCategoryById,
    deleteCategoryById,
} from '../services/categoryservice.js';
import {
    validateCreateCategorySchema,
    validateUpdateCategorySchema,
    validateQueryCategorySchema,
} from '../schemavalidation/jsonschemavalidators.js';

const router = express.Router();

// POST   /categories          → create a category
router.post('/', validateCreateCategorySchema, createCategory);

// POST   /categories/query    → get categories with dynamic filters in body
router.post('/query', validateQueryCategorySchema, queryCategories);

// GET    /categories/:id      → get single category by id
router.get('/:id', queryCategoryById);

// PUT    /categories/:id      → update category fields
router.put('/:id', validateUpdateCategorySchema, updateCategoryById);

// DELETE /categories/:id      → delete category
router.delete('/:id', deleteCategoryById);

export default router;
