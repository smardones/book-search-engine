import gql from 'graphql-tag';

export const LOGIN_USER = gql`
    mutation login($email:String!, $password: String!) {
        login(email: $email, password: $password) {
            user {
                _id
                username
                email
            }
            token
            }
        }
`;

export const ADD_USER = gql`
    mutation addUser($username: String!, $email: String!, $password: String!) {
        addUser(username:$username, email: $email, password: $password) {
            user {
                username
                email
            }
            token
            }
        }
  `;

  export const SAVE_BOOK = gql`
    mutation saveBook($authors: [String], $bookId:String, $description:String, $title: String, $img: String, $link: String) {
        saveBook(authors: $author, bookId: $bookId, description: $description, title: $title, img: $img, link: $link) {
            User {
                username
                _id
                email
                bookCount
                savedBooks
            }
        } 
    }
  `;

  export const REMOVE_BOOK = gql`
    mutation removeBook($bookId: String!) {
        removeBook(bookId: $bookId) {
            User {
                username
                _id
                email
                bookCount
                saveBooks
            }
        }
    }
  `;