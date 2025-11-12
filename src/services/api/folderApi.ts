import axiosInstance from './axiosInstance';
import type {
    Folder,
    CreateFolderRequest,
    UpdateFolderRequest
} from '../types/api.types';
import { type AxiosResponse } from 'axios';

export const folderApi = {
    // ==================== GET ALL FOLDERS ====================
    getAllFolders: async (userId: number): Promise<Folder[]> => {
        try {
            const response: AxiosResponse<Folder[]> = await axiosInstance.get(
                `/api/users/${userId}/folders`
            );
            return response.data;
        } catch (error) {
            console.error('Get all folders error:', error);
            throw error;
        }
    },

    // ==================== GET SPECIFIC FOLDER ====================
    getFolder: async (userId: number, folderId: number): Promise<Folder> => {
        try {
            const response: AxiosResponse<Folder> = await axiosInstance.get(
                `/api/users/${userId}/folders/${folderId}`
            );
            return response.data;
        } catch (error) {
            console.error('Get folder error:', error);
            throw error;
        }
    },

    // ==================== CREATE FOLDER ====================
    createFolder: async (userId: number, data: CreateFolderRequest): Promise<Folder> => {
        try {
            const response: AxiosResponse<Folder> = await axiosInstance.post(
                `/api/users/${userId}/folders`,
                data
            );
            return response.data;
        } catch (error) {
            console.error('Create folder error:', error);
            throw error;
        }
    },

    // ==================== UPDATE FOLDER ====================
    updateFolder: async (
        userId: number,
        folderId: number,
        data: UpdateFolderRequest
    ): Promise<Folder> => {
        try {
            const response: AxiosResponse<Folder> = await axiosInstance.put(
                `/api/users/${userId}/folders/${folderId}`,
                data
            );
            return response.data;
        } catch (error) {
            console.error('Update folder error:', error);
            throw error;
        }
    },

    // ==================== DELETE FOLDER ====================
    deleteFolder: async (userId: number, folderId: number): Promise<void> => {
        try {
            await axiosInstance.delete(
                `/api/users/${userId}/folders/${folderId}`
            );
        } catch (error) {
            console.error('Delete folder error:', error);
            throw error;
        }
    }
};