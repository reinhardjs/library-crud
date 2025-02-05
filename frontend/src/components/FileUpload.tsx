import { useState } from 'react';
import { booksApi } from '@/services/api';
import { toast } from 'react-hot-toast';

interface FileUploadProps {
    bookId: number;
    onSuccess?: () => void;
}

export default function FileUpload({ bookId, onSuccess }: FileUploadProps) {
    const [loading, setLoading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        try {
            await booksApi.uploadFile(bookId, file);
            toast.success('File uploaded successfully');
            onSuccess?.();
        } catch (error) {
            console.error('Upload failed:', error);
            toast.error('Failed to upload file');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center space-x-2">
            <input
                type="file"
                onChange={handleFileChange}
                disabled={loading}
                className="hidden"
                id={`file-upload-${bookId}`}
            />
            <label
                htmlFor={`file-upload-${bookId}`}
                className={`cursor-pointer px-3 py-1 font-medium text-blue-600 hover:text-blue-800 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
                {loading ? 'Uploading...' : 'Upload'}
            </label>
        </div>
    );
} 