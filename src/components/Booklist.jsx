import React, { useState, useEffect } from 'react';
import { Link, Route, Routes, useParams } from 'react-router-dom';
import { onValue, ref } from 'firebase/database';
import { db } from '../firebase3';
import BookDetails from './BookDetails';
import { auth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, onAuthStateChanged } from '../firebase';
import { useAuth } from '../AuthContext';

const Booklist = () => {
  const [books, setBooks] = useState([]);
  const { id } = useParams();
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
    const fetchData = async () => {
      try {
        const response = await fetch('https://book-exchage-default-rtdb.europe-west1.firebasedatabase.app/books2.json');
        const data = await response.json();
        console.log('Fetched data from Firebase:', data);
        if (data) {
          const bookList = Object.entries(data).map(([id, book]) => ({ id, ...book }));
          setBooks(bookList);
        }
      } catch (error) {
        console.error('Error fetching data from Firebase:', error);
      }
      const booksRef = ref(db, 'books2');
    onValue(booksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const bookList = Object.values(data);
        setBooks(bookList);
      }
    });
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
          if (authUser) {
            setUser(authUser);
            setIsLoggedIn(true);
          } else {
            setUser(null);
            setIsLoggedIn(false);
          }
        });
    
        return () => unsubscribe();
    };
  
    fetchData();
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

  if (books.length === 0) {
    return null;
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={<BookListContent books={books} />} />
       <Route path="/:id" element={<BookDetails />} />

      </Routes>
    </div>
  );
};

const BookListContent = ({ books }) => {
  const acceptedBooks = books.filter(book => book.status === 'accepted');
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

  
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
          if (authUser) {
            setUser(authUser);
            setIsLoggedIn(true);
          } else {
            setUser(null);
            setIsLoggedIn(false);
          }
        });
    
        return () => unsubscribe();
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
  return (
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Book List</title>
        <link rel="stylesheet" href="/src/styles.css" />
        <script src="script.js"></script>
    </head>
    <body>
    <header>
                    <h1>Book List</h1>
                    <nav>
                    <img src="logo_book.jpg" alt="Company Logo"/>
                        <ul>
                            <li><a href="home">Home</a></li>
                            <li><a href="home#about">About</a></li>
                            <li><a href="home#services">Services</a></li>
                            <li><a href="booklist">Book List</a></li>
                            <li><a href="home#contact">Contact</a></li>
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
    <main>
    <section class="book">
                    <img src="book1.jpg" alt="Book 1" />
                    <h2><a href="book1">Sapiens: A Brief History of Humankind</a></h2>
                    <p>Author: Yuval Noah Harari</p>
                    <p>Genre: Non-Fiction</p>
                    <p>Year: 2011</p>
                </section>

                <section class="book">
                    <img src="book2.jpg" alt="Book 2" />
                    <h2><a href="book2">Thinking, Fast and Slow</a></h2>
                    <p>Author: Daniel Kahneman</p>
                    <p>Genre: Non-Fiction</p>
                    <p>Year: 2011</p>
                </section>
      <section className="book-list">
        {acceptedBooks.map((book) => {
          console.log('Current Book:', book);

          return (
            <div key={book.id} className="book">
              <img src="book_general.jpg" alt={`Book ${book.title}`} />
              <h2>
                <Link to={`/booklist/${book.id}`}>{book.title}</Link>
              </h2>
              <p>Author: {book.author}</p>
              <p>Genre: {book.genre}</p>
              <p>Year: {book.year}</p>
            </div>
          );
        })}
      </section>
    </main>
    <footer>
            <p>Copyright &copy; Book Exchange 2023</p>
            </footer>

            </body>
        </html>

  );
};

export default Booklist;
