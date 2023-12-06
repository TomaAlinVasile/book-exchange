import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyACZptEAenwfO3roJcgPD1k-elt56ZwCxo",
    authDomain: "book-exchage.firebaseapp.com",
    databaseURL: "https://book-exchage-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "book-exchage",
    storageBucket: "book-exchage.appspot.com",
    messagingSenderId: "300904418536",
    appId: "1:300904418536:web:0afa3ba3816c46af8f0d5d",
    measurementId: "G-FCM5ZD8GEB"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

export { db };
