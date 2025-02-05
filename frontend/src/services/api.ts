import axios from 'axios'

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!apiBaseUrl) {
    throw new Error('API base URL is not defined in the environment variables');
}

export const API_BASE_URL = apiBaseUrl;

const api = axios.create({
    baseURL: API_BASE_URL
})

export const booksApi = {
    getAll: () => api.get('/books'),
    create: (data: {
        title: string;
        author: string;
        quantity: number;
    }) => api.post('/books', data),
    update: (id: number, data: {
        title?: string;
        author?: string;
        isbn?: string;
        quantity?: number;
        categoryId?: number;
    }) => api.put(`/books/${id}`, data),
    delete: (id: number) => api.delete(`/books/${id}`),
    uploadFile: (bookId: number, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post(`/books/${bookId}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    downloadFile: (bookId: number) => 
        api.get(`/books/${bookId}/download`, {
            responseType: 'blob'
        }),
};

export default api;
