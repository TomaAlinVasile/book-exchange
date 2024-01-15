import React, { useState, useEffect } from 'react';
import { db } from '../firebase3';
import { ref, push, onValue, update  } from 'firebase/database';
import { auth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, onAuthStateChanged } from '../firebase';
import { useAuth } from '../AuthContext';
import { Link, useNavigate } from 'react-router-dom';


const Profile = () => {
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
  const [nickname, setNickname] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSaveDetails = async () => {
    try {
      const userRef = ref(db, `users/${user.uid}`);
      await update(userRef, {
        nickname,
        description,
      });

      alert('Details saved successfully!');
    } catch (error) {
      console.error('Error saving details:', error);
      alert('Failed to save details. Please try again.');
    }
  };
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
  const unsubscribe2 = onAuthStateChanged(auth, (authUser) => {
    if (authUser) {
      setUser(authUser);
      setIsLoggedIn(true);
    } else {
      setUser(null);
      setIsLoggedIn(false);
    }
    if (user) {
      const userRef = ref(db, `users/${user.uid}`);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setNickname(data.nickname || '');
          setDescription(data.description || '');
        }
      });
    }
  });
  return () => { unsubscribe2();}
  }, [setUser], [user]);

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
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Book Title 1</title>
    <link rel="stylesheet" href="styles.css"/>
</head>
<body>
<header>
<h3> Your Profile</h3>
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
                    {isLoggedIn && (
                  <>
                    <label>Nickname:</label>
                    <input type="text" value={nickname} onChange={handleNicknameChange} />
                    <label>Description:</label>
                    <textarea value={description} onChange={handleDescriptionChange} />
                    <button onClick={handleSaveDetails}>Save Details</button>
                  </>
                )}
                </header>
                
                <footer>
      <p>Copyright &copy; Book Exchange 2023</p>
    </footer>
</body>
</html> 
  );
};

export default Profile;
