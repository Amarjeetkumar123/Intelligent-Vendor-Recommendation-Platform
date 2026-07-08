import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

// Must run outside of a transaction to alter enum types in PostgreSQL
export const noTransaction = true;

export const up = (pgm: MigrationBuilder): void => {
    pgm.addTypeValue('vendor_type', 'MANUFACTURER', { ifNotExists: true });
    pgm.addTypeValue('vendor_type', 'DISTRIBUTOR', { ifNotExists: true });
    pgm.addTypeValue('vendor_type', 'SERVICE_PROVIDER', { ifNotExists: true });
    pgm.addTypeValue('vendor_type', 'CONSULTANT', { ifNotExists: true });
};

export const down = (pgm: MigrationBuilder): void => {
    // Note: PostgreSQL does not support dropping enum values directly.
    // In rollback, we leave the enum values as is, since removing them would require
    // renaming the enum, creating a new one, altering columns, and dropping the old type.
};
