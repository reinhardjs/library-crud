import {
  createBook,
  getAllBooks,
  updateBook,
  getBookById,
  deleteBook,
  uploadBookFile,
  downloadBookFile
} from '../controllers/bookController.js';

export default async function bookRoutes(fastify, opts) {
  // Register multipart support
  await fastify.register(import('@fastify/multipart'), {
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB limit
    }
  });

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

  // Upload file for a book
  fastify.post('/:id/upload',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' }
          },
          required: ['id']
        }
      }
    },
    uploadBookFile
  );

  // Download file for a book
  fastify.get('/:id/download',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' }
          },
          required: ['id']
        }
      }
    },
    downloadBookFile
  );
}
