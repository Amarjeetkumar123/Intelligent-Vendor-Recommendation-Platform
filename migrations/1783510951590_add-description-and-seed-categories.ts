import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {

    // ─── ADD description column to categories ────────────────────────────────────

    pgm.addColumn('categories', {
        description: {
            type: 'text',
            notNull: false,
        },
    });

    // ─── SEED default categories ─────────────────────────────────────────────────

    // pgm.sql(`
    //     INSERT INTO categories (name, description) VALUES
    //         ('ELECTRICAL',   'Electrical installation, wiring, and maintenance services'),
    //         ('PLUMBING',     'Plumbing, pipe fitting, and water supply services'),
    //         ('CIVIL',        'Civil construction, structural, and concrete work'),
    //         ('HVAC',         'Heating, ventilation, and air conditioning services'),
    //         ('PAINTING',     'Interior and exterior painting and surface finishing'),
    //         ('CARPENTRY',    'Woodwork, furniture, and carpentry services'),
    //         ('HOUSEKEEPING', 'Cleaning, sanitation, and housekeeping services'),
    //         ('SECURITY',     'Security guards, surveillance, and access control services')
    //     ON CONFLICT (name) DO NOTHING;
    // `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {

    // ─── REMOVE seeded categories ─────────────────────────────────────────────────

    pgm.sql(`
        DELETE FROM categories
        WHERE name IN (
            'ELECTRICAL', 'PLUMBING', 'CIVIL', 'HVAC',
            'PAINTING', 'CARPENTRY', 'HOUSEKEEPING', 'SECURITY'
        );
    `);

    // ─── DROP description column ──────────────────────────────────────────────────

    pgm.dropColumn('categories', 'description');
}
