import express from 'express';
import {
    createVendorDocument,
    queryVendorDocuments,
    queryVendorDocumentById,
    updateVendorDocumentById,
    deleteVendorDocumentById,
} from '../services/vendor-documentservice.js';
import {
    validateCreateVendorDocumentSchema,
    validateUpdateVendorDocumentSchema,
    validateQueryVendorDocumentSchema,
} from '../schemavalidation/jsonschemavalidators.js';

const router = express.Router();

// POST   /vendor-documents          → create a vendor document
router.post('/', validateCreateVendorDocumentSchema, createVendorDocument);

// POST   /vendor-documents/query    → get vendor documents with dynamic filters in body
router.post('/query', validateQueryVendorDocumentSchema, queryVendorDocuments);

// GET    /vendor-documents/:id      → get single vendor document by id
router.get('/:id', queryVendorDocumentById);

// PUT    /vendor-documents/:id      → update vendor document fields
router.put('/:id', validateUpdateVendorDocumentSchema, updateVendorDocumentById);

// DELETE /vendor-documents/:id      → delete vendor document
router.delete('/:id', deleteVendorDocumentById);

export default router;
