import React, { useState, useEffect } from 'react';
import { auth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, onAuthStateChanged } from '../firebase';
//import { onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '../AuthContext';
import Profile from './Profile';

const Home = () => {
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
  const isAdmin = user && user.email === 'admin@admin.com';
  const [contactFormData, setContactFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
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

  const submitFormToFlask = async () => {
    try {
      const response = await fetch('http://localhost:5000/submit_form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactFormData),
      });

      if (response.ok) {
        alert('Form submitted successfully!');

        setContactFormData({
          name: '',
          email: '',
          message: '',
        });
      } else {
        alert('Form submission failed. Please try again later.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleContactFormSubmit = (e) => {
    e.preventDefault();
    submitFormToFlask();
  };

  return (
    <html>
     <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta http-equiv="X-UA-Compatible" content="ie=edge"/>
    <title>Book Exchange</title>
    <link rel="stylesheet" href="/src/styles.css" />
    <script src="script.js"></script>
</head>
<body>
    <header>
        <nav>
            <img src="logo_book.jpg" alt="Company Logo"/>
            <ul>
                <li><a href="#top">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="booklist">Book List</a></li>
                <li><a href="#contact">Contract</a></li>
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
        <h1>Book Exchange</h1>
        <p>This is a book exchange, a perfect place to exchange books</p>
        <br/>
        <a href="#contact" class="cta">Get in Touch</a>
    </header>
<main>
    
    <section id="services">
        <h2>Our Services</h2>
        


{isLoggedIn && (
  <div className="service">
    <img src="service_1.jpg" alt="Service 1"/>
    <h3><a href="/offers">Exchange Offers</a></h3>
    <p>Here you can check what exchange offers you got!</p>
  </div>
)}
        <div class="service">
            <img src="service_2.jpg" alt="Service 2"/>
            <h3><a href="booklist">Book List</a></h3>
            <p>The place where you can find our selection of books</p>
        </div>
        {!isLoggedIn ? (
            <div class="service">
            <img src="service_3.jpg" alt="Service 3"/>
            <h3><a href="/book-listing">List Your Book</a></h3>
            <p>List your old book and exchange it for a new one</p>
        </div>
        ) : isAdmin ? (
            <div className="service">
              <img src="service_3.jpg" alt="Service 4"/>
              <h3><a href="/books-in-pending"> Pending Books </a></h3>
              <p>View and manage pending books here</p>
            </div>
          ) : (
        <div class="service">
            <img src="service_3.jpg" alt="Service 3"/>
            <h3><a href="/book-listing">List Your Book</a></h3>
            <p>List your old book and exchange it for a new one</p>
        </div>
         )}
    </section>
    <section id="about">
        <h2>About Us</h2>
        <p>A book exchange for people that love books. The perfect place
    to list your old books that you already read, and let so new people to enjoy them,
    besides listing them for a possible exchange, you might also sell them!
        </p>
        <img src="about_us.jpg" width="100%" alt=""/>
    </section>

    <section id="contact">
        <h2>Get in Touch</h2>
        <p>You wanna know more about our aplication. Write us right now!</p>
        <form onSubmit={handleContactFormSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={contactFormData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={contactFormData.email}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={contactFormData.message}
            onChange={handleInputChange}
            required
          ></textarea>
          <button type="submit">Submit</button>
        </form>
      </section>
</main>
    <footer>
        <p>Copyright &copy; Book Exchange 2023</p>
    </footer>

</body>
</html>
  );
};

export default Home;
