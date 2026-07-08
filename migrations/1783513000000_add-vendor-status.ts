import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export const up = (pgm: MigrationBuilder): void => {
    // 1. Create the custom enum type 'vendor_status' only if it does not exist
    pgm.sql(`
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vendor_status') THEN
                CREATE TYPE vendor_status AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');
            END IF;
        END$$;
    `);

    // 2. Add 'vendor_status' column to 'vendors' table with a default of 'ACTIVE'
    pgm.addColumn('vendors', {
        vendor_status: {
            type: 'vendor_status',
            notNull: true,
            default: 'ACTIVE',
        },
    });
};

export const down = (pgm: MigrationBuilder): void => {
    // 1. Drop the column first
    pgm.dropColumn('vendors', 'vendor_status');

    // 2. Drop the custom enum type
    pgm.dropType('vendor_status');
};
