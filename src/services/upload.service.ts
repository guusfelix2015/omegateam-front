import { api } from '../lib/axios';

export interface UploadResponse {
  data: {
    imageUrl: string;
  };
  message: string;
}

export const uploadService = {
  /**
   * Upload user inventory image
   */
  async uploadUserInventoryImage(file: File): Promise<string> {
    try {
      // Create FormData
      const formData = new FormData();
      formData.append('file', file);

      // Upload to backend
      const response = await api.post<UploadResponse>(
        '/upload/user-inventory-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data.data.imageUrl;
    } catch (error) {
      console.error('Failed to upload image:', error);
      throw error;
    }
  },
};

