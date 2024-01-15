import React, { useState, useEffect } from 'react';
import { db } from '../firebase3';
import { ref, push, onValue } from 'firebase/database';
import { auth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, onAuthStateChanged } from '../firebase';
import { useAuth } from '../AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Book1 = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
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
  const navigate = useNavigate();

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
      
      const chatRef = ref(db, 'books/book2/chat');
      const unsubscribe = onValue(chatRef, (snapshot) => {
        const messagesData = snapshot.val();
        const messagesArray = messagesData ? Object.values(messagesData) : [];
        setMessages(messagesArray);
      });
    
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
  
      return () => {unsubscribe(); unsubscribe2();}
    }, [setUser]);

    const sendMessage = async (e) => {
      e.preventDefault();

      if (newMessage.trim() !== '') {
        try {
          
          await push(ref(db, 'books/book2/chat'), {
            text: newMessage,
            timestamp: Date.now(),
            user: user.email,
          });

          setNewMessage('');
        } catch (error) {
          console.error('Error sending message:', error.message);
        }
      }
    };

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
    const handleExchange = () => {
      navigate('/exchange')
  };

  const handleBuy = () => {
    navigate('/buy');
};

    return (
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Book Title 1</title>
    <link rel="stylesheet" href="styles.css"/>
    <style>
    {`
        .action-buttons {
            display: flex;
            justify-content: center; 
            margin-top: 20px;
        }

        .exchange-button,
        .buy-button {
            background-color: #3498db; 
            color: #fff; 
            padding: 10px 20px;
            border: none;
            border-radius: 8px; 
            cursor: pointer;
            margin: 0 5px; 
        }

        .exchange-button:hover,
        .buy-button:hover {
            background-color: #2980b9; 
        }
    `}
</style>
<script async src="https://js.stripe.com/v3"></script>
</head>
<body>

<header>
  <h2>Sapiens:</h2>
    <h2> A Brief History of Humankind</h2>
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

    <main>
        <section class="book-details">
            <img src="book1.jpg" alt="Book 1"/>
            <h2>Sapiens: A Brief History of Humankind</h2>
            <p>Author: Yuval Noah Harari</p>
            <p>Genre: Non-Fiction</p>
            <p>Year: 2011</p>
            <p>Description: The book, focusing on Homo sapiens,
               surveys the history of humankind</p>
               <div className="action-buttons">
            <button className="exchange-button" onClick={handleExchange}>
                Exchange
            </button>
            <button className="buy-button" onClick={handleBuy}>
                Buy $11.99

              </button>
        </div>
        </section>



    </main>




 {/* Live Chat  */}
 <section className="live-chat">
 <h2>Live Chat</h2>
          <div id="chat-messages" className="message-box">
            {messages.map((message, index) => (
              <div key={index} className="message">
                <p><strong>{message.user}:</strong> {message.text}</p>
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} className="message-input-form">
            <input
              type="text"
              id="message-input"
              placeholder="Type your message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button type="submit">Send</button>
          </form>
        </section>
      <footer>
      <p>Copyright &copy; Book Exchange 2023</p>
    </footer>
</body>
</html>
);
};

export default Book1;
