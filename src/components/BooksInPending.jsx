import React, { useState, useEffect } from 'react';
import { ref, set, onValue } from 'firebase/database';
import { db } from '../firebase3';

const BooksInPending = () => {
  const [pendingBooks, setPendingBooks] = useState([]);

  useEffect(() => {
    const booksRef = ref(db, 'books2');

    const unsubscribe = onValue(booksRef, (snapshot) => {
      const booksData = snapshot.val();
      const pendingBooksArray = [];

      for (const bookId in booksData) {
        const book = booksData[bookId];
        if (book.status === 'pending') {
          pendingBooksArray.push({ id: bookId, ...book });
        }
      }

      setPendingBooks(pendingBooksArray);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleAcceptBook = (bookId) => {
    const bookRef = ref(db, `books2/${bookId}`);
    set(bookRef, { ...pendingBooks.find((book) => book.id === bookId), status: 'accepted' });
  };

  return (
    <div className="books-in-pending-container">
      <h2>Pending Books</h2>
      {pendingBooks.length === 0 ? (
        <p>No books in pending.</p>
      ) : (
        <ul className="books-list">
          {pendingBooks.map((book) => (
            <li key={book.id} className="book-item">
              <h3>{book.title}</h3>
              <p>
                <strong>Author:</strong> {book.author}
              </p>
              <p>
                <strong>Genre:</strong> {book.genre}
              </p>
              <p>
                <strong>Year:</strong> {book.year}
              </p>
              <p>
                <strong>Description:</strong> {book.description}
              </p>
              <button onClick={() => handleAcceptBook(book.id)}>Accept</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BooksInPending;
