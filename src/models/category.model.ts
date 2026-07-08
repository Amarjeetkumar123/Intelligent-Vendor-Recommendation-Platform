// ─── Category Model ───────────────────────────────────────────────────────────
// Mirrors the `categories` table in the database

export interface Category {
    id?: number;
    name?: string;
    description?: string | null;
    created_at?: Date;
    updated_at?: Date;
}
