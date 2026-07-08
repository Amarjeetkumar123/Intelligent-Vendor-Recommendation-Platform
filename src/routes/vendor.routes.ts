import express from 'express';
import {
    createVendor,
    queryVendors,
    queryVendorById,
    updateVendorById,
    deleteVendorById,
} from '../services/vendorservice.js';
import { validateCreateVendorSchema, validateQueryVendorSchema, validateUpdateVendorSchema } from '../schemavalidation/jsonschemavalidators.js';

const router = express.Router();

// POST   /vendors          → create a vendor
router.post('/', validateCreateVendorSchema, createVendor);

// POST   /vendors/query    → get vendors with dynamic filters in body
router.post('/query', validateQueryVendorSchema, queryVendors);

// GET    /vendors/:id      → get single vendor by id
router.get('/:id', queryVendorById);

// PUT    /vendors/:id      → update vendor fields
router.put('/:id', validateUpdateVendorSchema, updateVendorById);

// DELETE /vendors/:id      → delete vendor
router.delete('/:id', deleteVendorById);

export default router;
