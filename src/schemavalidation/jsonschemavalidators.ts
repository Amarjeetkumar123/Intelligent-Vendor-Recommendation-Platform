import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { createVendorSchema, updateVendorSchema, queryVendorSchema } from './vendorschema.js';
import { createCategorySchema, updateCategorySchema, queryCategorySchema } from './categoryschema.js';
import { createVendorDocumentSchema, updateVendorDocumentSchema, queryVendorDocumentSchema } from './vendor-documentschema.js';
import { createWorkRequirementSchema, updateWorkRequirementSchema, queryWorkRequirementSchema } from './work-requirementschema.js';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const validateRequestBodyWithSchema = (schema: any, req: any, res: any, next: any) => {
    try {
        const validate = ajv.compile(schema);
        const valid = validate(req.body);
        if (!valid) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validate.errors?.map((e) => ({
                    field: e.instancePath || e.params,
                    message: e.message,
                })),
            });
        }
        next();
    } catch (error: any) {
        next(error);
    }
};

// ─── Vendor ───────────────────────────────────────────────────────────────────
export const validateCreateVendorSchema    = (req: any, res: any, next: any) => validateRequestBodyWithSchema(createVendorSchema, req, res, next);
export const validateUpdateVendorSchema    = (req: any, res: any, next: any) => validateRequestBodyWithSchema(updateVendorSchema, req, res, next);
export const validateQueryVendorSchema     = (req: any, res: any, next: any) => validateRequestBodyWithSchema(queryVendorSchema, req, res, next);

// ─── Category ─────────────────────────────────────────────────────────────────
export const validateCreateCategorySchema  = (req: any, res: any, next: any) => validateRequestBodyWithSchema(createCategorySchema, req, res, next);
export const validateUpdateCategorySchema  = (req: any, res: any, next: any) => validateRequestBodyWithSchema(updateCategorySchema, req, res, next);
export const validateQueryCategorySchema   = (req: any, res: any, next: any) => validateRequestBodyWithSchema(queryCategorySchema, req, res, next);

// ─── Vendor Document ──────────────────────────────────────────────────────────
export const validateCreateVendorDocumentSchema = (req: any, res: any, next: any) => validateRequestBodyWithSchema(createVendorDocumentSchema, req, res, next);
export const validateUpdateVendorDocumentSchema = (req: any, res: any, next: any) => validateRequestBodyWithSchema(updateVendorDocumentSchema, req, res, next);
export const validateQueryVendorDocumentSchema  = (req: any, res: any, next: any) => validateRequestBodyWithSchema(queryVendorDocumentSchema, req, res, next);

// ─── Work Requirement ─────────────────────────────────────────────────────────
export const validateCreateWorkRequirementSchema = (req: any, res: any, next: any) => validateRequestBodyWithSchema(createWorkRequirementSchema, req, res, next);
export const validateUpdateWorkRequirementSchema = (req: any, res: any, next: any) => validateRequestBodyWithSchema(updateWorkRequirementSchema, req, res, next);
export const validateQueryWorkRequirementSchema  = (req: any, res: any, next: any) => validateRequestBodyWithSchema(queryWorkRequirementSchema, req, res, next);
