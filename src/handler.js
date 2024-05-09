const { nanoid } = require('nanoid');
const books = require('./books');

const addNewBookHandler = (request, h) => {
    // Method POST >> Use payload
    const { name,
        year = 'Tidak diketahui',
        author = 'Tidak diketahui',
        summary = 'Tidak ada',
        publisher = 'Tidak diketahui',
        pageCount = 1,
        readPage = 0,
        reading = false,
    } = request.payload;
    const id = nanoid(16);
    const finished = readPage == pageCount;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    if (!name) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        }).code(400);
    }
    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        }).code(400);
    }

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        finished,
        insertedAt,
        updatedAt
    };
    books.push(newBook);

    const isSuccess = books.filter((book) => book.id == id).length > 0;
    if (!isSuccess) {
        return h.response({
            status: 'fail',
            message: 'Buku gagal ditambahkan'
        }).code(500);
    }
    return h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
            'bookId': id
        }
    }).code(201);
};

const getAllBooksHandler = (request, h) => {
    // Have Query >> Use query
    const { name, reading, finished } = request.query;
    
    let filteredBooks = books;
    if (name) {
        filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
    }
    if (reading) {
        filteredBooks = filteredBooks.filter((book) => book.reading == reading);
    }
    if (finished) {
        filteredBooks = filteredBooks.filter((book) => book.finished == finished);
    }

    filteredBooks = filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
    }));
    return h.response({
        status: 'success',
        data: {
            books: filteredBooks,
        },
    }).code(200);
}

const getBookByIdHandler = (request, h) => {
    // Method GET >> Use params
    const { bookId } = request.params;

    const book = books.find((book) => book.id == bookId);
    if (!book) {
        return h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        }).code(404);
    }
    return h.response({
        status: 'success',
        data: {
            book,
        },
    }).code(200);
};

const editBookByIdHandler = (request, h) => {
    // Method PUT >> Use params and payload
    const { bookId } = request.params;
    const { name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;
    const finished = readPage == pageCount;
    const updatedAt = new Date().toISOString();

    if (!name) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        }).code(400);
    }
    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        }).code(400);
    }

    const bookIndex = books.findIndex((book) => book.id == bookId);
    if (bookIndex == -1) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        }).code(404);
    }
    const editedBook = {
        ...books[bookIndex],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        finished,
        updatedAt,
    };
    books.splice(bookIndex, 1, editedBook);

    return h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
    }).code(200);
}

const deleteBookByIdHandler = (request, h) => {
    // Method DELETE >> Use params
    const { bookId } = request.params;

    const bookIndex = books.findIndex((book) => book.id == bookId);
    if (bookIndex == -1) {
        return h.response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan',
        }).code(404);
    }
    books.splice(bookIndex, 1);

    return h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
    }).code(200);
}

module.exports = {
    addNewBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
};