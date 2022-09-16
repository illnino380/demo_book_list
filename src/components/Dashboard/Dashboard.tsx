import React, { Dispatch, SetStateAction } from 'react'
import { Link } from 'react-router-dom'
import { removeBook } from '../../api/books'
import { Book } from '../../types/Book'
import { Loader } from '../Loader'

interface Props {
  onSelect: Dispatch<SetStateAction<Book | null>>
  onDelete: (bookId: number) => void
  books: Book[]
  hasError: boolean
  isLoading: boolean
}

export const Dashboard: React.FC<Props> = (props) => {
  const {
    onSelect,
    onDelete,
    books,
    hasError,
    isLoading
  } = props

  const handleDeleteButton = (bookId: number): void => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    removeBook(bookId)
      .then(() => onDelete(bookId))
  }

  return (
    <>
      <div className="table-header">
        <h1 className="title table-title">Dashboard</h1>
        <Link to="/newForm">
          <button className="button">Add new book</button>
        </Link>
      </div>

      {isLoading && <Loader />}

      {hasError && <p>Loading error</p>}

      {!isLoading && !hasError && books.length === 0 && (
        <p>There are no books in list </p>
      )}

      {!isLoading && !hasError && books.length > 0 && (
        <div className="container box" >
          <table className="table table-box is-hoverable">
            <thead>
              <tr className="form-row">
                <th>Book title</th>
                <th>Author Name</th>
                <th>Category</th>
                <th>ISBN</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => {
                return (
                  <tr
                    key={book.id}
                    className="form-row"
                  >
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.category}</td>
                    <td>{book.isbn}</td>
                    <td>
                      <Link to="/newForm">
                        <button
                          onClick={() => onSelect(book)}
                          className="button is-primary is-small edit-button"
                        >
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDeleteButton(book.id)}
                        className="button is-warning is-small"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
