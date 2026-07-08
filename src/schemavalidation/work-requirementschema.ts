// ─── Work Requirement Schemas (AJV) ───────────────────────────────────────────

const PRIORITY_ENUM = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

// ─── CREATE ───────────────────────────────────────────────────────────────────

export const createWorkRequirementSchema: any = {
    type: 'object',
    properties: {
        work_code:           { type: 'string', minLength: 1, maxLength: 50 },
        title:               { type: 'string', minLength: 2, maxLength: 255 },
        description:         { type: 'string', maxLength: 1000, nullable: true },
        category_id:         { type: 'integer', minimum: 1 },
        city:                { type: 'string', maxLength: 100, nullable: true },
        state:               { type: 'string', maxLength: 100, nullable: true },
        estimated_value:     { type: 'number', minimum: 0, nullable: true },
        priority:            { type: 'string', enum: PRIORITY_ENUM, nullable: true },
        expected_start_date: { type: 'string', format: 'date', nullable: true },
        expected_end_date:   { type: 'string', format: 'date', nullable: true },
        created_by:          { type: 'string', minLength: 2, maxLength: 255 },
    },
    required: ['work_code', 'title', 'category_id', 'created_by'],
    additionalProperties: false,
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────

export const updateWorkRequirementSchema: any = {
    type: 'object',
    properties: {
        work_code:           { type: 'string', minLength: 1, maxLength: 50, nullable: true },
        title:               { type: 'string', minLength: 2, maxLength: 255, nullable: true },
        description:         { type: 'string', maxLength: 1000, nullable: true },
        category_id:         { type: 'integer', minimum: 1, nullable: true },
        city:                { type: 'string', maxLength: 100, nullable: true },
        state:               { type: 'string', maxLength: 100, nullable: true },
        estimated_value:     { type: 'number', minimum: 0, nullable: true },
        priority:            { type: 'string', enum: PRIORITY_ENUM, nullable: true },
        expected_start_date: { type: 'string', format: 'date', nullable: true },
        expected_end_date:   { type: 'string', format: 'date', nullable: true },
        created_by:          { type: 'string', minLength: 2, maxLength: 255, nullable: true },
    },
    required: [],
    additionalProperties: false,
};

// ─── QUERY ────────────────────────────────────────────────────────────────────

export const queryWorkRequirementSchema: any = {
    type: 'object',
    properties: {
        work_code:   { type: 'string', maxLength: 50, nullable: true },
        title:       { type: 'string', maxLength: 255, nullable: true },
        category_id: { type: 'integer', minimum: 1, nullable: true },
        city:        { type: 'string', maxLength: 100, nullable: true },
        state:       { type: 'string', maxLength: 100, nullable: true },
        priority:    { type: 'string', enum: PRIORITY_ENUM, nullable: true },
        created_by:  { type: 'string', maxLength: 255, nullable: true },
    },
    required: [],
    additionalProperties: false,
};
