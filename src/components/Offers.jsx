import React, { useState, useEffect } from 'react';
import { ref, set, onValue } from 'firebase/database';
import { db } from '../firebase3';
import { auth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, onAuthStateChanged } from '../firebase';
import { useAuth } from '../AuthContext';

const BooksInPending = () => {
  const [pendingBooks, setPendingBooks] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { user, setUser } = useAuth();
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [userData, setUserData] = useState(null);
  const openLoginModal = () => {
    setShowLoginModal(true);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  const openSignUpModal = () => {
    setShowSignUpModal(true);
  };

  const closeSignUpModal = () => {
    setShowSignUpModal(false);
  };
  useEffect(() => {
    const booksRef = ref(db, 'books-recieved');

    

    const fetchData = async () => {
        try {
          const response = await fetch('https://book-exchage-default-rtdb.europe-west1.firebasedatabase.app/users.json');
          const data = await response.json();
          console.log('Fetched data from Firebase:', data);
        } catch (error) {
          console.error('Error fetching data from Firebase:', error);
        }
      };
  
      fetchData();
  
      const unsubscribe2 = onAuthStateChanged(auth, (authUser) => {
        if (authUser) {
          setUser(authUser);
          setIsLoggedIn(true);
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }
      });
      const unsubscribe = onValue(booksRef, (snapshot) => {
        const booksData = snapshot.val();
        const pendingBooksArray = [];
  
        for (const bookId in booksData) {
          const book = booksData[bookId];
          if (book.owner_email === user.email) {
            pendingBooksArray.push({ id: bookId, ...book });
          }
        }
  
        setPendingBooks(pendingBooksArray);
      });
      console.log(user.email);
  
      return () => {unsubscribe(); unsubscribe2();}
    }, [setUser]);
    const handleLogin = async () => {
        try {
          console.log('Input username:', email);
          console.log('Input password:', password);
    
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
    
          alert('Login successful!');
          console.log('Login successful!');
    
          setIsLoggedIn(true);
          setShowLoginModal(false);
    
          setUser(user);
        } catch (error) {
          console.error('Error logging in:', error.code, error.message);
          alert('Login failed. Please check your email and password.');
        }
      };
    
      const handleSignUp = async () => {
        try {
          const newUser = {
            email: newEmail.trim(),
            password: newPassword,
          };
    
          console.log('Email before sign-up:', newUser.email);
    
          if (!newUser.email) {
            console.error('Email is empty');
            return;
          }
    
          const response = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password);
          const user = response.user;
    
          console.log('Sign-up successful!', user);
          alert('Sign-up successful!');
    
          await sendEmailVerification(user);
    
          setShowSignUpModal(false);
        } catch (error) {
          console.error('Error signing up:', error);
    
          alert(`Sign-up failed: ${error.message}`);
        }
      };
    
      const handleLogout = () => {
        auth.signOut()
          .then(() => {
            setUser(null);
            setUserData(userData);
            setIsLoggedIn(false);
          })
          .catch((error) => {
            console.error('Error logging out:', error);
          });
      };

  const handleAcceptBook = (bookId) => {
    const bookRef = ref(db, `books-recieved/${bookId}`);
    set(bookRef, { ...pendingBooks.find((book) => book.id === bookId) });
  };

  return (
    <html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Book Title 1</title>
    <link rel="stylesheet" href="styles.css"/>
    </head>
<body>

<header>
<h1> Exchange Offers</h1>
<nav>
<img src="logo_book.jpg" alt="Company Logo"/>
                        <ul>
                            <li><a href="home">Home</a></li>

                            <li><a href="booklist">Book List</a></li>

                            <li>
                {!isLoggedIn ? (
                  <button className="login-button" onClick={openLoginModal}>
                    {isSignUp ? 'Sign Up' : 'Login'}
                  </button>
                ) : (
                  
                  <button className="logout-button" onClick={handleLogout}>
                    Logout
                  </button>
                )}
                {!isSignUp && !isLoggedIn && (
                  <button className="signup-button" onClick={openSignUpModal}>
                    Sign Up
                  </button>
                )}
      
      
  
{/* Login  */}
{showLoginModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeLoginModal}>&times;</span>
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
              <input
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit">Login</button>
              
            </form>
          </div>
        </div>
      )}

      {/* Sign-up  */}
      {showSignUpModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeSignUpModal}>&times;</span>
            <form onSubmit={(e) => { e.preventDefault(); handleSignUp(); }}>
              {/* username and password) */}
              <input
    type="email"
    placeholder="Email"
    value={newEmail}
    
    onChange={(e) =>  setNewEmail(e.target.value)}
  />
  <input
    type="password"
    placeholder="Password"
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}


/>
<button type="submit">Sign Up</button>
            </form>
          </div>
        </div>
      )}
            </li>
            </ul>
                    </nav>
                </header>
    <div className="books-in-pending-container">
      <h2>Books Offered</h2>

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
              <p>
                <strong>Offer from:</strong> {book.your_email}
              </p>
              
            </li>
          ))}
        </ul>
    </div>
    </body>
</html>
);
};

export default BooksInPending;
