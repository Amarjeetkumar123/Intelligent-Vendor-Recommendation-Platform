// ─── Vendor Document Model ────────────────────────────────────────────────────
// Mirrors the `vendor_documents` table in the database

import { DocumentType } from './enums.js';

export interface VendorDocument {
    id?: number;
    vendor_id?: number;
    document_name?: string;
    document_type?: DocumentType;
    issue_date?: Date | null;
    expiry_date?: Date | null;
    verified?: boolean;
    uploaded_at?: Date | null;
    created_at?: Date;
    updated_at?: Date;
}
