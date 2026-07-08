import { Vendor } from '../models/index.js';
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

export const saveVendor = async (vendorDetails: Vendor): Promise<Vendor> => {
    const queryText = `
        INSERT INTO vendors
            (name, vendor_type, category_id, email, mobile_number, rating, address, city, state, pincode, vendor_status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
    `;
    const values = [
        vendorDetails.name,
        vendorDetails.vendor_type,
        vendorDetails.category_id,
        vendorDetails.email ?? null,
        vendorDetails.mobile_number ?? null,
        vendorDetails.rating ?? 0,
        vendorDetails.address ?? null,
        vendorDetails.city ?? null,
        vendorDetails.state ?? null,
        vendorDetails.pincode ?? null,
        vendorDetails.vendor_status ?? 'ACTIVE',
    ];
    const result = await pool.query(queryText, values);
    return result.rows[0];
};

// ─── READ ALL (with optional dynamic filters) ─────────────────────────────────

export const getVendors = async (filters: Vendor = {}): Promise<Vendor[]> => {
    const { clause, values } = buildWhereClause(filters);
    const result = await pool.query(
        `SELECT * FROM vendors ${clause} ORDER BY id ASC`,
        values
    );
    return result.rows;
};

// ─── READ ONE ─────────────────────────────────────────────────────────────────

export const getVendorById = async (id: number): Promise<Vendor | null> => {
    const result = await pool.query('SELECT * FROM vendors WHERE id = $1', [id]);
    return result.rows[0] ?? null;
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────

export const updateVendor = async (id: number, vendorDetails: Vendor): Promise<Vendor | null> => {
    const fields = Object.keys(vendorDetails) as (keyof Vendor)[];
    if (fields.length === 0) return getVendorById(id);

    const setClauses = fields.map((key, index) => `${String(key)} = $${index + 1}`);
    const values = fields.map((key) => vendorDetails[key]);

    const queryText = `
        UPDATE vendors
        SET ${setClauses.join(', ')}, updated_at = current_timestamp
        WHERE id = $${fields.length + 1}
        RETURNING *
    `;
    const result = await pool.query(queryText, [...values, id]);
    return result.rows[0] ?? null;
};

// ─── DELETE ───────────────────────────────────────────────────────────────────

export const deleteVendor = async (id: number): Promise<Vendor | null> => {
    const result = await pool.query('DELETE FROM vendors WHERE id = $1 RETURNING *', [id]);
    return result.rows[0] ?? null;
};