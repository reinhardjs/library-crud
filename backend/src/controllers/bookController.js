import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { createWriteStream, createReadStream } from 'fs';
import { pipeline } from 'stream/promises';
import path from 'path';
import fs from 'fs/promises';

const prisma = new PrismaClient();

const UPLOAD_DIR = './uploads';

// Ensure upload directory exists
try {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
} catch (err) {
  console.error('Failed to create upload directory:', err);
}

// Validation schema
const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
});

export const createBook = async (request, reply) => {
  try {
    const { title, author, quantity } = bookSchema.parse(request.body);

    const book = await prisma.book.create({
      data: {
        title,
        author,
        quantity,
      }
    });

    return reply.code(201).send(book);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ 
        error: error.errors[0].message 
      });
    }
    
    request.log.error(error);
    return reply.status(500).send({ 
      error: 'Book creation failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getAllBooks = async (request, reply) => {
  try {
    const books = await prisma.book.findMany();
    return books;
  } catch (error) {
    console.log(`Failed to retrieve books`, error);
    return reply.status(500).send({ error: 'Failed to retrieve books' });
  }
};

export const getBookById = async (request, reply) => {
  const { id } = request.params;
  
  try {
    const book = await prisma.book.findUnique({
      where: { id: parseInt(id) }
    });

    if (!book) {
      return reply.status(404).send({ error: 'Book not found' });
    }

    return book;
  } catch (error) {
    return reply.status(500).send({ error: 'Failed to retrieve book' });
  }
};

export const updateBook = async (request, reply) => {
  const { id } = request.params;
  const { title, author, quantity } = request.body;

  try {
    const book = await prisma.book.update({
      where: { id: parseInt(id) },
      data: { title, author, quantity }
    });

    return book;
  } catch (error) {
    return reply.status(500).send({ error: 'Book update failed' });
  }
};

export const deleteBook = async (request, reply) => {
  const { id } = request.params;

  try {
    // Check if book exists and has active lendings
    const book = await prisma.book.findUnique({
      where: { id: parseInt(id) }
    });

    if (!book) {
      request.log.error(`Book not found with id: ${id}`);
      return reply.status(404).send({ error: 'Book not found' });
    }

    await prisma.book.delete({
      where: { id: parseInt(id) }
    });

    request.log.info(`Book ${id} deleted successfully`);
    return reply.code(204).send();
  } catch (error) {
    request.log.error({
      msg: 'Book deletion failed',
      error: error.message,
      stack: error.stack,
      bookId: id
    });
    
    return reply.status(500).send({ 
      error: 'Book deletion failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const uploadBookFile = async (request, reply) => {
  const { id } = request.params;
  
  try {
    const data = await request.file();
    if (!data) {
      return reply.status(400).send({ error: 'No file uploaded' });
    }

    // Check if book exists
    const book = await prisma.book.findUnique({
      where: { id: parseInt(id) }
    });

    if (!book) {
      return reply.status(404).send({ error: 'Book not found' });
    }

    const fileExt = path.extname(data.filename);
    const fileName = `book_${id}${fileExt}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    // Save file metadata in database
    await prisma.book.update({
      where: { id: parseInt(id) },
      data: {
        filePath: filePath,
        fileName: fileName
      }
    });

    // Save the file
    await pipeline(data.file, createWriteStream(filePath));

    return reply.send({ message: 'File uploaded successfully' });
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ 
      error: 'File upload failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const downloadBookFile = async (request, reply) => {
  const { id } = request.params;

  try {
    const book = await prisma.book.findUnique({
      where: { id: parseInt(id) }
    });

    if (!book || !book.filePath) {
      return reply.status(404).send({ error: 'File not found' });
    }

    const fileStream = createReadStream(book.filePath);
    reply.type('application/octet-stream');
    reply.header('Content-Disposition', `attachment; filename="${book.fileName}"`);
    
    return reply.send(fileStream);
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ 
      error: 'File download failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
