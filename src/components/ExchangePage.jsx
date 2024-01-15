import React, { useState } from 'react';
import { db } from '../firebase3';
import { ref, push } from 'firebase/database';

const ExchangePage = () => {
  const [bookDetails, setBookDetails] = useState({
    title: '',
    author: '',
    genre: '',
    year: '',
    description: '',
    owner_email: '',
    your_email: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Book details submitted:', bookDetails);
    const booksRef = ref(db, 'books-recieved');
    push(booksRef, bookDetails)
      .then(() => {
        console.log('Book details submitted successfully!');
      })
      .catch((error) => {
        console.error('Error submitting book details:', error);
      });
  };

  return (
    <div className="book-listing-container">
      
      <form className="book-listing-form" onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={bookDetails.title}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />
        <label>
          Author:
          <input
            type="text"
            name="author"
            value={bookDetails.author}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />
        <label>
          Genre:
          <input
            type="text"
            name="genre"
            value={bookDetails.genre}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Year:
          <input
            type="text"
            name="year"
            value={bookDetails.year}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Description:
          <textarea
            name="description"
            value={bookDetails.description}
            onChange={handleInputChange}
          ></textarea>
        </label>
        <br />
        <label>
          Owner Email:
          <input
            type="email"
            name="owner_email"
            value={bookDetails.owner_email}
            onChange={handleInputChange}
          ></input>
        </label>
        <br />
        <label>
          Your Email:
          <input
            type="email"
            name="your_email"
            value={bookDetails.your_email}
            onChange={handleInputChange}
          ></input>
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ExchangePage;