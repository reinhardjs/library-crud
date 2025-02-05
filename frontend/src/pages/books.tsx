import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import Layout from '@/components/Layout';
import BookList from '@/components/BookList';
import BookForm from '@/components/BookForm';
import { booksApi } from '@/services/api';

interface Book {
  id: number;
  title: string;
  author: string;
  quantity: number;
}

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await booksApi.getAll();
      setBooks(response.data);
    } catch (error) {
      console.error('Failed to fetch books:', error);
    }
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between mb-6">
          <input
            type="text"
            placeholder="Search books..."
            className="border rounded-md px-4 py-2 w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
            <Dialog.Root open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <Dialog.Trigger asChild>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
                  Add Book
                </button>
              </Dialog.Trigger>
              <BookForm
                onSuccess={() => {
                  setIsAddDialogOpen(false);
                  fetchBooks();
                }}
              />
            </Dialog.Root>
        </div>

        <BookList books={filteredBooks} onUpdate={fetchBooks} />
      </div>
    </Layout>
  );
}
