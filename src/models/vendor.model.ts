// ─── Vendor Model ─────────────────────────────────────────────────────────────
// Mirrors the `vendors` table in the database

import { VendorType } from './enums.js';

export interface Vendor {
    id?: number;
    name?: string;
    vendor_type?: VendorType;
    category_id?: number;
    email?: string | null;
    mobile_number?: string | null;
    rating?: number;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    pincode?: string | null;
    created_at?: Date;
    updated_at?: Date;
}