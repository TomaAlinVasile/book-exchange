import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Booklist from './components/Booklist';
import Home from './components/Home';
import Book1 from './components/Book1';
import Book2 from './components/Book2';
import BookListingPage from './components/BookListingPage';
import BooksInPending from './components/BooksInPending';
import BuyPage from './components/BuyPage';
import ExchangePage from './components/ExchangePage'

import firebaseApp from './firebase'; 
import { AuthProvider } from './AuthContext';

import 'firebase/auth';
import Profile from './components/Profile';
import Offers from './components/Offers';
import BuyPage2 from './components/BuyPage2';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const App = () => {
  const stripePromise = loadStripe('pk_test_123');

  return (
    <AuthProvider>
    <Router>
      <Routes>
      <Route path="/book-listing" element={ <BookListingPage />} />
      <Route path="/books-in-pending" element={ <BooksInPending />} />
      <Route path="/buy" element= { <BuyPage />}/>
      <Route path="/buy2" element={ <Elements stripe={stripePromise}>
        <BuyPage2 /> </Elements> }/>
      <Route path="/exchange" element= { <ExchangePage />}/>
      <Route path="/profile" element= { <Profile />}/>
      <Route path="/offers" element= { <Offers />}/>
      <Route path="/home" element={<Home  />}/>
        <Route path="/booklist/*" element={<Booklist />} />
        <Route path="/book1" element={ <Book1 /> } />
        <Route path="/book2" element={ <Book2 /> } />
      </Routes>
    </Router>
    </AuthProvider>
  );
};




export default App;
