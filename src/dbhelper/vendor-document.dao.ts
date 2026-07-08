import { VendorDocument } from '../models/index.js';
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

export const saveVendorDocument = async (docDetails: VendorDocument): Promise<VendorDocument> => {
    const queryText = `
        INSERT INTO vendor_documents
            (vendor_id, document_name, document_type, issue_date, expiry_date, verified)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
    `;
    const values = [
        docDetails.vendor_id,
        docDetails.document_name,
        docDetails.document_type,
        docDetails.issue_date ?? null,
        docDetails.expiry_date ?? null,
        docDetails.verified ?? false,
    ];
    const result = await pool.query(queryText, values);
    return result.rows[0];
};

// ─── READ ALL (with optional dynamic filters) ─────────────────────────────────

export const getVendorDocuments = async (filters: VendorDocument = {}): Promise<VendorDocument[]> => {
    const { clause, values } = buildWhereClause(filters);
    const result = await pool.query(
        `SELECT * FROM vendor_documents ${clause} ORDER BY id ASC`,
        values
    );
    return result.rows;
};

// ─── READ ONE ─────────────────────────────────────────────────────────────────

export const getVendorDocumentById = async (id: number): Promise<VendorDocument | null> => {
    const result = await pool.query('SELECT * FROM vendor_documents WHERE id = $1', [id]);
    return result.rows[0] ?? null;
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────

export const updateVendorDocument = async (id: number, docDetails: VendorDocument): Promise<VendorDocument | null> => {
    const fields = Object.keys(docDetails) as (keyof VendorDocument)[];
    if (fields.length === 0) return getVendorDocumentById(id);

    const setClauses = fields.map((key, index) => `${String(key)} = $${index + 1}`);
    const values = fields.map((key) => docDetails[key]);

    const queryText = `
        UPDATE vendor_documents
        SET ${setClauses.join(', ')}, updated_at = current_timestamp
        WHERE id = $${fields.length + 1}
        RETURNING *
    `;
    const result = await pool.query(queryText, [...values, id]);
    return result.rows[0] ?? null;
};

// ─── DELETE ───────────────────────────────────────────────────────────────────

export const deleteVendorDocument = async (id: number): Promise<VendorDocument | null> => {
    const result = await pool.query('DELETE FROM vendor_documents WHERE id = $1 RETURNING *', [id]);
    return result.rows[0] ?? null;
};
