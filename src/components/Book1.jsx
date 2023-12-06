import React, { useState, useEffect } from 'react';
import { db } from '../firebase3';
import { ref, push, onValue } from 'firebase/database';
const Book1 = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
      
      const chatRef = ref(db, 'books/book2/chat');

      
      const unsubscribe = onValue(chatRef, (snapshot) => {
        const messagesData = snapshot.val();
        const messagesArray = messagesData ? Object.values(messagesData) : [];
        setMessages(messagesArray);
      });

      
      return () => {
        unsubscribe();
      };
    }, []); 

    const sendMessage = async (e) => {
      e.preventDefault();

      if (newMessage.trim() !== '') {
        try {
          
          await push(ref(db, 'books/book2/chat'), {
            text: newMessage,
            timestamp: Date.now(),
          });

          setNewMessage('');
        } catch (error) {
          console.error('Error sending message:', error.message);
        }
      }
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
  <h3>Sapiens:</h3>
                    <h3> A Brief History of Humankind</h3>
                    <nav>
                    <img src="logo_book.jpg" alt="Company Logo"/>
                        <ul>
                            <li><a href="home">Home</a></li>

                            <li><a href="booklist">Book List</a></li>

                            
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
        </section>



    </main>




 {/* Live Chat  */}
 <section className="live-chat">
 <h2>Live Chat</h2>
          <div id="chat-messages" className="message-box">
            {messages.map((message, index) => (
              <div key={index} className="message">
                <p>{message.text}</p>
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
