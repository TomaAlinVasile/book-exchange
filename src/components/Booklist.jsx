import React from 'react';
const Booklist = () => {
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
                    <img src="logo3.0.png" alt="Company Logo"/>
                        <ul>
                            <li><a href="home">Home</a></li>
                            <li><a href="#about">About</a></li>
                            <li><a href="#services">Services</a></li>
                            <li><a href="booklist">Book List</a></li>
                            <li><a href="#contact">Contact</a></li>
                            
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
            </main>

            <footer>
                <p>Copyright &copy; Book List 2023</p>
            </footer>

            </body>
        </html>

  );
};

export default Booklist;