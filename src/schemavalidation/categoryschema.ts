// ─── Category Schemas (AJV) ───────────────────────────────────────────────────

// ─── CREATE ───────────────────────────────────────────────────────────────────

export const createCategorySchema: any = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 2, maxLength: 150 },
    },
    required: ['name'],
    additionalProperties: false,
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────

export const updateCategorySchema: any = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 2, maxLength: 150, nullable: true },
    },
    required: [],
    additionalProperties: false,
};

// ─── QUERY ────────────────────────────────────────────────────────────────────

export const queryCategorySchema: any = {
    type: 'object',
    properties: {
        name: { type: 'string', maxLength: 150, nullable: true },
    },
    required: [],
    additionalProperties: false,
};
