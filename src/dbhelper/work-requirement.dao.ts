import { WorkRequirement } from '../models/index.js';
import { pool } from '../config/database.js';

// ─── Helper: build WHERE clause from filter object ────────────────────────────

const buildWhereClause = <T extends object>(filters: T) => {
    const keys = Object.keys(filters) as (keyof T)[];
    if (keys.length === 0) return { clause: '', values: [] };

    const conditions = keys.map((key, index) => `${String(key)} = $${index + 1}`);
    const values = keys.map((key) => filters[key]);
    return { clause: `WHERE ${conditions.join(' AND ')}`, values };
};

// ─── CREATE ───────────────────────────────────────────────────────────────────

export const saveWorkRequirement = async (reqDetails: WorkRequirement): Promise<WorkRequirement> => {
    const queryText = `
        INSERT INTO work_requirements
            (work_code, title, description, category_id, city, state, estimated_value, priority, expected_start_date, expected_end_date, created_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
    `;
    const values = [
        reqDetails.work_code,
        reqDetails.title,
        reqDetails.description ?? null,
        reqDetails.category_id,
        reqDetails.city ?? null,
        reqDetails.state ?? null,
        reqDetails.estimated_value ?? null,
        reqDetails.priority ?? 'MEDIUM',
        reqDetails.expected_start_date ?? null,
        reqDetails.expected_end_date ?? null,
        reqDetails.created_by,
    ];
    const result = await pool.query(queryText, values);
    return result.rows[0];
};

// ─── READ ALL (with optional dynamic filters) ─────────────────────────────────

export const getWorkRequirements = async (filters: WorkRequirement = {}): Promise<WorkRequirement[]> => {
    const { clause, values } = buildWhereClause(filters);
    const result = await pool.query(
        `SELECT * FROM work_requirements ${clause} ORDER BY id ASC`,
        values
    );
    return result.rows;
};

// ─── READ ONE ─────────────────────────────────────────────────────────────────

export const getWorkRequirementById = async (id: number): Promise<WorkRequirement | null> => {
    const result = await pool.query('SELECT * FROM work_requirements WHERE id = $1', [id]);
    return result.rows[0] ?? null;
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────

export const updateWorkRequirement = async (id: number, reqDetails: WorkRequirement): Promise<WorkRequirement | null> => {
    const fields = Object.keys(reqDetails) as (keyof WorkRequirement)[];
    if (fields.length === 0) return getWorkRequirementById(id);

    const setClauses = fields.map((key, index) => `${String(key)} = $${index + 1}`);
    const values = fields.map((key) => reqDetails[key]);

    const queryText = `
        UPDATE work_requirements
        SET ${setClauses.join(', ')}, updated_at = current_timestamp
        WHERE id = $${fields.length + 1}
        RETURNING *
    `;
    const result = await pool.query(queryText, [...values, id]);
    return result.rows[0] ?? null;
};

// ─── DELETE ───────────────────────────────────────────────────────────────────

export const deleteWorkRequirement = async (id: number): Promise<WorkRequirement | null> => {
    const result = await pool.query('DELETE FROM work_requirements WHERE id = $1 RETURNING *', [id]);
    return result.rows[0] ?? null;
};
