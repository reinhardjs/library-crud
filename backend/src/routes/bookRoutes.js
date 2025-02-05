import {
  createBook,
  getAllBooks,
  updateBook,
  getBookById,
  deleteBook
} from '../controllers/bookController.js';

export default async function bookRoutes(fastify, opts) {

  const bookSchema = {
    body: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        author: { type: 'string' },
        quantity: { type: 'number', minimum: 1 },
      },
      required: ['title', 'author', 'quantity']
    }
  };

  // Create a new book
  fastify.post('/',
    {
      schema: bookSchema,
    },
    createBook
  );

  // Get all books 
  fastify.get('/',
    {},
    getAllBooks
  );

  // Get book by ID
  fastify.get('/:id',
    {},
    getBookById
  );

  // Update a book
  fastify.put('/:id',
    {
      schema: bookSchema,
    },
    updateBook
  );

  // Delete a book
  fastify.delete('/:id',
    {},
    deleteBook
  );
}
