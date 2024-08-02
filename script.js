// Book Class: Represents a Book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}
// UI Class: Handle UI Tasks
class UI {
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach(book => {
            UI.addBookToList(book);
        })
    }
    static addBookToList(book){
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href='#' class="btn btn-danger btn-sm delete">X</a></td>
        `
        document.querySelector('#book-list').appendChild(row);
    }
    static deleteBook(el){
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, cN) {
        const div = document.createElement('div');
        div.className = `alert alert-${cN}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        // Vanish in 3 seconds
        setTimeout(()=>{
            document.querySelector('.alert').remove();
        }, 3000)
    }
    static clearfield(){
        document.querySelector('#title').value='';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = ""   
    }
}
// Store class: Handles Storage
class Store{
    static getBooks() {
        let books;
        if(localStorage.getItem('books')===null){
            books = [];
        }
        else{
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn){
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}
// Event: display books
document.addEventListener('DOMContentLoaded', UI.displayBooks);
// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e)=>{
    // prevent actual submit reload
    e.preventDefault();
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;
    // Validate
    if(title === '' || author === '' || isbn === ''){
        UI.showAlert('Please fill in all the fields', 'danger');
    }
    else{
        // instantiate book
        const book = new Book(title, author, isbn);

        // Add Book to UI
        UI.addBookToList(book);

        // Add Book to store
        Store.addBook(book)

        // Show success message
        UI.showAlert('Book Added', 'success');

        // Clear fields

        UI.clearfield();
    }
    
    
})
// Event: Remove a Book

document.querySelector('#book-list').addEventListener('click', (e)=> {
    // Remove book from UI
    UI.deleteBook(e.target);

    // Remove book from the store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    // Show delete message
    UI.showAlert('Book Removed', 'success');
})