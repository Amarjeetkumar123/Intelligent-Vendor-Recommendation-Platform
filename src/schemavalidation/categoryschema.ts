// ─── Category Schemas (AJV) ───────────────────────────────────────────────────

const CATEGORY_NAME_ENUM = [
    'ELECTRICAL',
    'PLUMBING',
    'CIVIL',
    'HVAC',
    'PAINTING',
    'CARPENTRY',
    'HOUSEKEEPING',
    'SECURITY',
];

// ─── CREATE ───────────────────────────────────────────────────────────────────

export const createCategorySchema: any = {
    type: 'object',
    properties: {
        name:        { type: 'string', enum: CATEGORY_NAME_ENUM },
        description: { type: 'string', maxLength: 500, nullable: true },
    },
    required: ['name'],
    additionalProperties: false,
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────

export const updateCategorySchema: any = {
    type: 'object',
    properties: {
        description: { type: 'string', maxLength: 500, nullable: true },
    },
    required: [],
    additionalProperties: false,
};

// ─── QUERY ────────────────────────────────────────────────────────────────────

export const queryCategorySchema: any = {
    type: 'object',
    properties: {
        name:        { type: 'string', enum: CATEGORY_NAME_ENUM, nullable: true },
        description: { type: 'string', maxLength: 500, nullable: true },
    },
    required: [],
    additionalProperties: false,
};
