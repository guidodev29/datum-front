// ==================== AUTH TYPES ====================
export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
    user: UserInfo;
    passwordChangeRequired?: boolean;
}

export interface UserInfo {
    id: string;
    username: string;
    email: string;
    roles: string[];
    dbUserId: number | null;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}
// ==================== USER TYPES ====================
export interface User {
    id: string;
    firstName: string;
    lastName: string;
    nickname: string;
    email: string;
    keycloakId: string;
}

// ==================== FOLDER TYPES ====================
export interface Folder {
    id: number;
    userId: number;
    folderName: string;
    description: string;
    startDate: string;
    endDate: string;
    validationStatus: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';
    validatedDate: string | null;
    validatedBy: string | null;
    validationNotes: string | null;
    canEdit: boolean;
}

export interface CreateFolderRequest {
    folderName: string;
    description: string;
    startDate: string;
    endDate: string;
}

export interface UpdateFolderRequest {
    folderName?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
}

// ==================== API RESPONSE TYPES ====================
export interface ApiSuccessResponse<T> {
    data: T;
    message?: string;
}

export interface ApiErrorResponse {
    error: string;
    code: number;
    message?: string;
}

// Generic API Response
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Purchase Types

export interface Purchase {
    id: number;
    idUser: number;
    idFolder: number;
    idPType: number;
    idPaymentMethod: number;
    totalAmount: number;
    description: string;
    purchaseDate: string;
    documentUrl?: string;
    idCostCenter?: number;
    guestName?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePurchaseDTO {
    idUser: number;
    idFolder: number;
    idPType: number;
    idPaymentMethod: number;
    totalAmount: number;
    description: string;
    purchaseDate: string;
    file: File | null;
    idCostCenter?: number;
    guestName?: string;
}

export interface UpdatePurchaseDTO {
    idUser?: number;
    idFolder?: number;
    idPType?: number;
    idPaymentMethod?: number;
    totalAmount?: number;
    description?: string;
    purchaseDate?: string;
    file?: File | null;
    idCostCenter?: number;
    guestName?: string;
}

// Purchase type IDs from database
export const PurchaseType = {
    TRANSPORTE: 21,      // Gastos de Transporte
    PRESENTACION: 22,    // Gastos de Presentación
    COMIDA: 23,          // Gastos de Comida
    SERVICIOS: 24        // Servicios
} as const;

export type PurchaseType = typeof PurchaseType[keyof typeof PurchaseType];


// Payment method IDs from database
export const PaymentMethod = {
    TARJETA_CREDITO: 21,      // Tarjeta de Crédito
    VIATICOS: 22,             // Viáticos
    TRANSFERENCIA: 23         // Transferencia
} as const;

export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod];


