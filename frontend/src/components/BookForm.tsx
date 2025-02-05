import * as Dialog from '@radix-ui/react-dialog';
import * as Form from '@radix-ui/react-form';
import { useState } from 'react';
import { booksApi } from '@/services/api';
import { toast } from 'react-hot-toast';

interface Book {
    id: number;
    title: string;
    author: string;
    quantity: number
}

interface BookFormProps {
    onSuccess: () => void;
    initialData?: Book;
}

export default function BookForm({ onSuccess, initialData }: BookFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const formData = new FormData(e.currentTarget);
            const formValues = {
                title: formData.get('title') as string,
                author: formData.get('author') as string,
                quantity: Number(formData.get('quantity')),
            }

            if (initialData) {
                await booksApi.update(initialData.id, formValues);
                toast.success('Book updated successfully')
            } else {
                await booksApi.create(formValues);
                toast.success('Book created successfully')
            }

            onSuccess();
        } catch (error: unknown) {
            const message = error instanceof Error
                ? error.message
                : 'Failed to save book';
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-[400px]">
                <Dialog.Title className="text-xl font-semibold mb-4">
                    {initialData ? 'Edit Book' : 'Add New Book'}
                </Dialog.Title>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded">
                        {error}
                    </div>
                )}

                <Form.Root onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <Form.Field name="title">
                            <Form.Label className="block text-sm font-medium text-gray-700">
                                Title
                            </Form.Label>
                            <Form.Control asChild>
                                <input
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                                    defaultValue={initialData?.title}
                                    required
                                />
                            </Form.Control>
                        </Form.Field>

                        <Form.Field name="author">
                            <Form.Label className="block text-sm font-medium text-gray-700">
                                Author
                            </Form.Label>
                            <Form.Control asChild>
                                <input
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                                    defaultValue={initialData?.author}
                                    required
                                />
                            </Form.Control>
                        </Form.Field>

                        <Form.Field name="quantity">
                            <Form.Label className="block text-sm font-medium text-gray-700">
                                Quantity
                            </Form.Label>
                            <Form.Control asChild>
                                <input
                                    type="number"
                                    min="1"
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                                    defaultValue={initialData?.quantity || 1}
                                    required
                                />
                            </Form.Control>
                        </Form.Field>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <Dialog.Close asChild>
                            <button
                                type="button"
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </Dialog.Close>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </Form.Root>
            </Dialog.Content>
        </Dialog.Portal>
    );
}
