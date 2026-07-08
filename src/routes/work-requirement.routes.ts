import express from 'express';
import {
    createWorkRequirement,
    queryWorkRequirements,
    queryWorkRequirementById,
    updateWorkRequirementById,
    deleteWorkRequirementById,
} from '../services/work-requirementservice.js';
import {
    validateCreateWorkRequirementSchema,
    validateUpdateWorkRequirementSchema,
    validateQueryWorkRequirementSchema,
} from '../schemavalidation/jsonschemavalidators.js';

const router = express.Router();

// POST   /work-requirements          → create a work requirement
router.post('/', validateCreateWorkRequirementSchema, createWorkRequirement);

// POST   /work-requirements/query    → get work requirements with dynamic filters in body
router.post('/query', validateQueryWorkRequirementSchema, queryWorkRequirements);

// GET    /work-requirements/:id      → get single work requirement by id
router.get('/:id', queryWorkRequirementById);

// PUT    /work-requirements/:id      → update work requirement fields
router.put('/:id', validateUpdateWorkRequirementSchema, updateWorkRequirementById);

// DELETE /work-requirements/:id      → delete work requirement
router.delete('/:id', deleteWorkRequirementById);

export default router;
