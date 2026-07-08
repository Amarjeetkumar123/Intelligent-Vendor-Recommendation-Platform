// ─── Work Requirement Model ───────────────────────────────────────────────────
// Mirrors the `work_requirements` table in the database

import { PriorityLevel } from './enums.js';

export interface WorkRequirement {
    id?: number;
    work_code?: string;
    title?: string;
    description?: string | null;
    category_id?: number;
    city?: string | null;
    state?: string | null;
    estimated_value?: number | null;
    priority?: PriorityLevel;
    expected_start_date?: Date | null;
    expected_end_date?: Date | null;
    created_by?: string;
    created_at?: Date;
    updated_at?: Date;
}
