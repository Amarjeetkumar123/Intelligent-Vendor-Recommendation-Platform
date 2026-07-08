import { Category } from '../models/index.js';
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

export const saveCategory = async (categoryDetails: Category): Promise<Category> => {
    const queryText = `
        INSERT INTO categories (name)
        VALUES ($1)
        RETURNING *
    `;
    const result = await pool.query(queryText, [categoryDetails.name]);
    return result.rows[0];
};

// ─── READ ALL (with optional dynamic filters) ─────────────────────────────────

export const getCategories = async (filters: Category = {}): Promise<Category[]> => {
    const { clause, values } = buildWhereClause(filters);
    const result = await pool.query(
        `SELECT * FROM categories ${clause} ORDER BY id ASC`,
        values
    );
    return result.rows;
};

// ─── READ ONE ─────────────────────────────────────────────────────────────────

export const getCategoryById = async (id: number): Promise<Category | null> => {
    const result = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    return result.rows[0] ?? null;
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────

export const updateCategory = async (id: number, categoryDetails: Category): Promise<Category | null> => {
    const fields = Object.keys(categoryDetails) as (keyof Category)[];
    if (fields.length === 0) return getCategoryById(id);

    const setClauses = fields.map((key, index) => `${String(key)} = $${index + 1}`);
    const values = fields.map((key) => categoryDetails[key]);

    const queryText = `
        UPDATE categories
        SET ${setClauses.join(', ')}, updated_at = current_timestamp
        WHERE id = $${fields.length + 1}
        RETURNING *
    `;
    const result = await pool.query(queryText, [...values, id]);
    return result.rows[0] ?? null;
};

// ─── DELETE ───────────────────────────────────────────────────────────────────

export const deleteCategory = async (id: number): Promise<Category | null> => {
    const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
    return result.rows[0] ?? null;
};
