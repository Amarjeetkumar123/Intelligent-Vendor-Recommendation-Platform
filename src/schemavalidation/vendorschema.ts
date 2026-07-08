// ─── Vendor Schemas (AJV) ─────────────────────────────────────────────────────

const VENDOR_TYPE_ENUM = ['INDIVIDUAL', 'CONSULTANT', 'CONTRACTOR', 'SUPPLIER', 'SERVICE_PROVIDER', 'MANUFACTURER', 'DISTRIBUTOR'];

// ─── CREATE ───────────────────────────────────────────────────────────────────

export const createVendorSchema: any = {
    type: 'object',
    properties: {
        name:          { type: 'string', minLength: 2, maxLength: 150 },
        vendor_type:   { type: 'string', enum: VENDOR_TYPE_ENUM },
        category_id:   { type: 'integer', minimum: 1 },
        email:         { type: 'string', format: 'email', maxLength: 255, nullable: true },
        mobile_number: { type: 'string', pattern: '^[0-9]{10,15}$', nullable: true },
        address:       { type: 'string', maxLength: 500, nullable: true },
        city:          { type: 'string', maxLength: 100, nullable: true },
        state:         { type: 'string', maxLength: 100, nullable: true },
        pincode:       { type: 'string', pattern: '^[0-9]{6}$', nullable: true },
    },
    required: ['name', 'vendor_type', 'category_id'],
    additionalProperties: false,
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────

export const updateVendorSchema: any = {
    type: 'object',
    properties: {
        name:          { type: 'string', minLength: 2, maxLength: 150, nullable: true },
        vendor_type:   { type: 'string', enum: VENDOR_TYPE_ENUM, nullable: true },
        category_id:   { type: 'integer', minimum: 1, nullable: true },
        email:         { type: 'string', format: 'email', maxLength: 255, nullable: true },
        mobile_number: { type: 'string', pattern: '^[0-9]{10,15}$', nullable: true },
        address:       { type: 'string', maxLength: 500, nullable: true },
        city:          { type: 'string', maxLength: 100, nullable: true },
        state:         { type: 'string', maxLength: 100, nullable: true },
        pincode:       { type: 'string', pattern: '^[0-9]{6}$', nullable: true },
    },
    required: [],
    additionalProperties: false,
};

// ─── QUERY ────────────────────────────────────────────────────────────────────

export const queryVendorSchema: any = {
    type: 'object',
    properties: {
        name:          { type: 'string', maxLength: 150, nullable: true },
        vendor_type:   { type: 'string', enum: VENDOR_TYPE_ENUM, nullable: true },
        category_id:   { type: 'integer', minimum: 1, nullable: true },
        email:         { type: 'string', maxLength: 255, nullable: true },
        mobile_number: { type: 'string', maxLength: 15, nullable: true },
        city:          { type: 'string', maxLength: 100, nullable: true },
        state:         { type: 'string', maxLength: 100, nullable: true },
        pincode:       { type: 'string', pattern: '^[0-9]{6}$', nullable: true },
    },
    required: [],
    additionalProperties: false,
};
