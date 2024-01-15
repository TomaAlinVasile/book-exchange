import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { ref, set, onValue } from 'firebase/database';
import { db } from '../firebase3';
import { auth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, onAuthStateChanged } from '../firebase';
import { useAuth } from '../AuthContext';
const stripePromise = loadStripe('pk_test_51OW9IZHnMpowQTZ1bNh2KUv9NNfiKUHl5JlVYzjcr2fIaVzlzc2zSuuhuszeadukZ8EFZxhk4axopQKBXEpdi6JI00TUBBUfN9');

const BuyPage = () => {

    
  return (
    <div className="buy-page">
      <h1>Checkout</h1>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
};

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
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
      
          const unsubscribe2 = onAuthStateChanged(auth, (authUser) => {
            if (authUser) {
              setUser(authUser);
              setIsLoggedIn(true);
            } else {
              setUser(null);
              setIsLoggedIn(false);
            }
          });
      
          return () => { unsubscribe2();}
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

  const sendEmailConfirmation = async () => {
    try {
      await axios.post('http://localhost:5000//send_email_confirmation', {
        email: user.email, 
      });
    } catch (error) {
      console.error('Error triggering email confirmation:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (result.error) {
      setPaymentError(result.error.message);
      setPaymentSuccess(false);
    } else {
      console.log('PaymentMethod ID:', result.paymentMethod.id);
      setPaymentError(null);
      setPaymentSuccess(true);
      sendEmailConfirmation();
    }
  };

  return (
    <div className="checkout-form">
      <form onSubmit={handleSubmit}>
        <h2>Payment Information</h2>
        <CardElement className="card-element" />
        {paymentError && <div className="error-message">{paymentError}</div>}
        {paymentSuccess && <div className="success-message">Payment successful!</div>}
        <button type="submit" disabled={!stripe} className="pay-now-button">
          Pay Now
        </button>
      </form>
    </div>
  );
};

export default BuyPage;
