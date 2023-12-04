import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Booklist from './components/Booklist';
import Home from './components/Home';
import Book1 from './components/Book1';
import Book2 from './components/Book2';
import firebaseApp from './firebase'; 

import 'firebase/auth';
const App = () => {


  return (
    <Router>
      <Routes>
        <Route
          path="/home"
          element={<Home  />}
        />
        <Route
          path="/booklist"
          element={<Booklist />  }
        />
        <Route path="/book1" element={ <Book1 /> } />
        <Route path="/book2" element={ <Book2 /> } />
      </Routes>
    </Router>
  );
};




export default App;
