import React, { useState, useEffect } from 'react';
import firebase from '../firebase';
import { auth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from '../firebase';

const Home = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignUpModal, setShowSignUpModal] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isSignUp, setIsSignUp] = useState(false);
    const [newEmail, setNewEmail] = useState('');
const [newPassword, setNewPassword] = useState('');
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
            setUserData(data);
        
            // Log the username of user1
            const emailOfUser1 = data && data.user1 && data.user1.email;
            console.log('Username of user1:', emailOfUser1);
        
            // Log all user data
            Object.entries(data).forEach(([userId, user]) => {
              console.log(`User ID: ${userId}, Username: ${user.email}, Password: ${user.password}`);
            });
        
            // Continue with other logic
          } catch (error) {
            console.error('Error fetching data from Firebase:', error);
          }
        };
    
        fetchData();
      }, []); // Empty dependency array ensures this effect runs only once when the component mounts
    
      const handleLogin = async () => {
        try {
          console.log('Input username:', email);
          console.log('Input password:', password);
      
          // Use Firebase's signInWithEmailAndPassword method
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          
          alert('Login successful!');
          console.log('Login successful!');
          
          // Rest of your login logic if needed
          
          setIsLoggedIn(true); // Update login status
          setShowLoginModal(false);
        } catch (error) {
          console.error('Error logging in:', error.code, error.message);
          alert('Login failed. Please check your email and password.');
        }
      };


      const handleSignUp = async () => {
        try {
          const newUser = {
            email: newEmail.trim(), // Trim leading/trailing spaces
            password: newPassword,
          };
      
          // Log the email to check if it's set correctly
          console.log('Email before sign-up:', newUser.email);
      
          if (!newUser.email) {
            // Handle case where email is empty
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
      
          // Display the specific error message to the user
          alert(`Sign-up failed: ${error.message}`);
        }
      };
      




      const handleLogout = () => {
        // Clear user data and update login status
        setUserData(userData);
        setIsLoggedIn(false);
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
        // Optionally, reset the form data
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
            <img src="logo3.0.png" alt="Company Logo"/>
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
                  // Render a logout button or user profile if logged in
                  <button className="logout-button" onClick={handleLogout}>
                    Logout
                  </button>
                )}
                {!isSignUp && !isLoggedIn && (
                  <button className="signup-button" onClick={openSignUpModal}>
                    Sign Up
                  </button>
                )}
      
      
  
{/* Login modal */}
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
              <button type="button" onClick={openSignUpModal}>Sign Up</button>
            </form>
          </div>
        </div>
      )}

      {/* Sign-up modal */}
      {showSignUpModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeSignUpModal}>&times;</span>
            <form onSubmit={(e) => { e.preventDefault(); handleSignUp(); }}>
              {/* Add fields for sign-up (e.g., username and password) */}
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
        <div class="service">
            <img src="service_1.jpg" alt="Service 1"/>
            <h3>Custom Profile</h3>
            <p>Make it easier to find friend in the book space with a well made profile</p>
        </div>
        <div class="service">
            <img src="service_2.jpg" alt="Service 2"/>
            <h3><a href="booklist">Book List</a></h3>
            <p>The place where you can find our selection of books</p>
        </div>
        <div class="service">
            <img src="service_3.jpg" alt="Service 3"/>
            <h3>List Your Book </h3>
            <p>List your old book and exchange it for a new one</p>
        </div>
    </section>
    <section id="about">
        <h2>About Us</h2>
        <p>A book exchange for people that love books</p>
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
