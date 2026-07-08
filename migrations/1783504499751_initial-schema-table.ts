import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export const up = (pgm: MigrationBuilder): void => {

    // ─── ENUM TYPES ─────────────────────────────────────────────────────────────

    pgm.createType('vendor_type', ['INDIVIDUAL', 'CONSULTANT', 'CONTRACTOR', 'SUPPLIER', 'SERVICE_PROVIDER']);

    // ─── TABLE 0: categories ─────────────────────────────────────────────────────

    pgm.createTable('categories', {
        id: { type: 'serial', primaryKey: true },
        name: { type: 'varchar(100)', notNull: true, unique: true },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });


    pgm.createType('document_type', [
        'TAX_REGISTRATION',
        'INSURANCE',
        'TRADE_LICENSE',
        'SAFETY_CERTIFICATE',
        'AGREEMENT',
    ]);

    pgm.createType('vendor_status', [
        'ACTIVE',
        'INACTIVE',
        'SUSPENDED',
    ]);

    // ─── TABLE 1: vendors ────────────────────────────────────────────────────────

    pgm.createTable('vendors', {
        id: { type: 'serial', primaryKey: true },
        name: { type: 'varchar(100)', notNull: true },
        vendor_type: { type: 'vendor_type', notNull: true },
        category_id: {
            type: 'integer',
            notNull: true,
            references: '"categories"',
            onDelete: 'RESTRICT',
        },
        email: { type: 'varchar(100)' },
        mobile_number: { type: 'varchar(20)' },
        rating: { type: 'decimal(3,2)', default: 0 },
        address: { type: 'text' },
        city: { type: 'varchar(100)' },
        state: { type: 'varchar(100)' },
        pincode: { type: 'varchar(20)' },
        vendor_status: { type: 'varchar(20)' },
        
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });

    pgm.createIndex('vendors', 'email');
    pgm.createIndex('vendors', 'vendor_type');
    pgm.createIndex('vendors', 'category_id');

    // ─── TABLE 2: vendor_documents ───────────────────────────────────────────────

    pgm.createTable('vendor_documents', {
        id: { type: 'serial', primaryKey: true },
        vendor_id: {
            type: 'integer',
            notNull: true,
            references: '"vendors"',
            onDelete: 'CASCADE',
        },
        document_name: { type: 'varchar(255)', notNull: true },
        document_type: { type: 'document_type', notNull: true },
        issue_date: { type: 'date' },
        expiry_date: { type: 'date' },
        verified: { type: 'boolean', default: false },
        uploaded_at: {
            type: 'timestamp',
            default: pgm.func('current_timestamp'),
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });

    pgm.createIndex('vendor_documents', 'vendor_id');
    pgm.createIndex('vendor_documents', 'document_type');

    // ─── TABLE 3: work_requirements ──────────────────────────────────────────────

    pgm.createType('priority_level', [
        'LOW',
        'MEDIUM',
        'HIGH',
        'CRITICAL',
    ]);

    pgm.createTable('work_requirements', {
        id: { type: 'serial', primaryKey: true },
        work_code: { type: 'varchar(50)', notNull: true, unique: true },
        title: { type: 'varchar(255)', notNull: true },
        description: { type: 'text' },
        category_id: {
            type: 'integer',
            notNull: true,
            references: '"categories"',
            onDelete: 'RESTRICT',
        },
        city: { type: 'varchar(100)' },
        state: { type: 'varchar(100)' },
        estimated_value: { type: 'decimal(15,2)' },
        priority: { type: 'priority_level', notNull: true, default: 'MEDIUM' },
        expected_start_date: { type: 'date' },
        expected_end_date: { type: 'date' },
        created_by: { type: 'varchar(100)', notNull: true },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });

    pgm.createIndex('work_requirements', 'work_code');
    pgm.createIndex('work_requirements', 'category_id');
    pgm.createIndex('work_requirements', 'city');
    pgm.createIndex('work_requirements', 'priority');
};

export const down = (pgm: MigrationBuilder): void => {
    pgm.dropTable('work_requirements');
    pgm.dropTable('vendor_documents');
    pgm.dropTable('vendors');
    pgm.dropTable('categories');
    pgm.dropType('priority_level');
    pgm.dropType('document_type');
    pgm.dropType('vendor_status');
    pgm.dropType('vendor_type');
};

