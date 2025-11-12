import axiosInstance from './axiosInstance.ts';
import type { 
    Purchase, 
    CreatePurchaseDTO, 
    UpdatePurchaseDTO
} from '../types/api.types.ts';

// ⭐ NO BASE_URL - Vite proxy handles it!

export const purchaseApi = {
    /**
     * Get all purchases
     */
    getAllPurchases: async (): Promise<Purchase[]> => {
        const response = await axiosInstance.get<Purchase[]>(
            '/api/purchases'
        );
        return response.data;
    },

    /**
     * Get all purchases for a specific folder
     */
    getPurchasesByFolder: async (folderId: number): Promise<Purchase[]> => {
        const response = await axiosInstance.get<Purchase[]>(
            `/api/folders/${folderId}/purchases`
        );
        return response.data;
    },

    /**
     * Get a single purchase by ID
     */
    getPurchaseById: async (purchaseId: number): Promise<Purchase> => {
        const response = await axiosInstance.get<Purchase>(
            `/api/purchases/${purchaseId}`
        );
        return response.data;
    },

    /**
     * Create a new purchase with document
     */
    createPurchase: async (data: CreatePurchaseDTO): Promise<Purchase> => {
        const formData = new FormData();
        
        formData.append('idUser', data.idUser.toString());
        formData.append('idFolder', data.idFolder.toString());
        formData.append('idPType', data.idPType.toString());
        formData.append('idPaymentMethod', data.idPaymentMethod.toString());
        formData.append('totalAmount', data.totalAmount.toString());
        formData.append('description', data.description);
        formData.append('purchaseDate', data.purchaseDate);
        
        if (data.file) {
            formData.append('file', data.file);
        }
        
        if (data.idCostCenter) {
            formData.append('idCostCenter', data.idCostCenter.toString());
        }
        
        if (data.guestName) {
            formData.append('guestName', data.guestName);
        }

        const response = await axiosInstance.post<Purchase>(
            '/api/purchases/document', 
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        
        return response.data;
    },

    /**
     * Update a purchase
     */
    updatePurchase: async (purchaseId: number, data: UpdatePurchaseDTO): Promise<Purchase> => {
        const formData = new FormData();
        
        if (data.idUser !== undefined) formData.append('idUser', data.idUser.toString());
        if (data.idFolder !== undefined) formData.append('idFolder', data.idFolder.toString());
        if (data.idPType !== undefined) formData.append('idPType', data.idPType.toString());
        if (data.idPaymentMethod !== undefined) formData.append('idPaymentMethod', data.idPaymentMethod.toString());
        if (data.totalAmount !== undefined) formData.append('totalAmount', data.totalAmount.toString());
        if (data.description !== undefined) formData.append('description', data.description);
        if (data.purchaseDate !== undefined) formData.append('purchaseDate', data.purchaseDate);
        if (data.file) formData.append('file', data.file);
        if (data.idCostCenter !== undefined) formData.append('idCostCenter', data.idCostCenter.toString());
        if (data.guestName !== undefined) formData.append('guestName', data.guestName);

        const response = await axiosInstance.put<Purchase>(
            `/api/purchases/${purchaseId}`, 
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        
        return response.data;
    },

    /**
     * Delete a purchase
     */
    deletePurchase: async (purchaseId: number): Promise<void> => {
        await axiosInstance.delete(`/api/purchases/${purchaseId}`);
    },
};