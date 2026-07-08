// ─── Vendor Document Schemas (AJV) ────────────────────────────────────────────

const DOCUMENT_TYPE_ENUM = ['TAX_REGISTRATION', 'INSURANCE', 'TRADE_LICENSE', 'SAFETY_CERTIFICATE', 'AGREEMENT'];

// ─── CREATE ───────────────────────────────────────────────────────────────────

export const createVendorDocumentSchema: any = {
    type: 'object',
    properties: {
        vendor_id:     { type: 'integer', minimum: 1 },
        document_name: { type: 'string', minLength: 2, maxLength: 255 },
        document_type: { type: 'string', enum: DOCUMENT_TYPE_ENUM },
        issue_date:    { type: 'string', format: 'date', nullable: true },
        expiry_date:   { type: 'string', format: 'date', nullable: true },
        verified:      { type: 'boolean', nullable: true },
    },
    required: ['vendor_id', 'document_name', 'document_type'],
    additionalProperties: false,
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────

export const updateVendorDocumentSchema: any = {
    type: 'object',
    properties: {
        vendor_id:     { type: 'integer', minimum: 1, nullable: true },
        document_name: { type: 'string', minLength: 2, maxLength: 255, nullable: true },
        document_type: { type: 'string', enum: DOCUMENT_TYPE_ENUM, nullable: true },
        issue_date:    { type: 'string', format: 'date', nullable: true },
        expiry_date:   { type: 'string', format: 'date', nullable: true },
        verified:      { type: 'boolean', nullable: true },
    },
    required: [],
    additionalProperties: false,
};

// ─── QUERY ────────────────────────────────────────────────────────────────────

export const queryVendorDocumentSchema: any = {
    type: 'object',
    properties: {
        vendor_id:     { type: 'integer', minimum: 1, nullable: true },
        document_name: { type: 'string', maxLength: 255, nullable: true },
        document_type: { type: 'string', enum: DOCUMENT_TYPE_ENUM, nullable: true },
        verified:      { type: 'boolean', nullable: true },
    },
    required: [],
    additionalProperties: false,
};
