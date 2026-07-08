// ─── Enum Types (mirrors PostgreSQL custom types) ────────────────────────────

export type VendorType =
    | 'INDIVIDUAL'
    | 'CONSULTANT'
    | 'CONTRACTOR'
    | 'SUPPLIER'
    | 'SERVICE_PROVIDER'
    | 'MANUFACTURER'
    | 'DISTRIBUTOR';

export type DocumentType =
    | 'TAX_REGISTRATION'
    | 'INSURANCE'
    | 'TRADE_LICENSE'
    | 'SAFETY_CERTIFICATE'
    | 'AGREEMENT';

export type VendorStatus =
    | 'ACTIVE'
    | 'INACTIVE'
    | 'SUSPENDED';

export type PriorityLevel =
    | 'LOW'
    | 'MEDIUM'
    | 'HIGH'
    | 'CRITICAL';
