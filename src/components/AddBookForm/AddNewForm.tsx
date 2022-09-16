import React, { Dispatch, FormEvent, SetStateAction, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { postBook } from '../../api/books'
import { Book } from '../../types/Book'

interface Props {
  selectedBook: Book | null
  books: Book[]
  onNewBookAdded: (newBook: SetStateAction<Book[]>) => void
  onSubmit: Dispatch<SetStateAction<Book | null>>
}

export const AddNewForm: React.FC<Props> = (props) => {
  const { selectedBook, books, onNewBookAdded, onSubmit } = props
  const [bookTitle, setBookTitle] = useState<string>('')
  const [hasNoTitle, setHasNoTitle] = useState(false)
  const [authorName, setAuthorName] = useState<string>('')
  const [hasNoAuthor, setHasNoAuthor] = useState(false)
  const [category, setCategory] = useState<string | number>(0)
  const [hasNoCategory, setHasNoCategory] = useState(false)
  const [isbn, setIsbn] = useState<number | string>('')
  const [hasNoIsbn, setHasNoIsbn] = useState(false)
  const navigate = useNavigate()

  const uniqueCategories = useMemo(() => {
    const allCategories: Array<string | number> = books.map(book => book.category)
    const uniqueCategories = [...Array.from(new Set(allCategories))]
    return uniqueCategories
  }, [books])

  const resetFields = (): void => {
    setBookTitle('')
    setAuthorName('')
    setCategory(0)
    setIsbn('')
  }

  const hasInputsData = (
    bookTitle !== '' &&
      authorName !== '' &&
      category !== 0 &&
      isbn !== ''
  )

  useEffect(() => {
    if (selectedBook !== null) {
      setBookTitle(selectedBook.title)
      setAuthorName(selectedBook.author)
      setCategory(selectedBook.category)
      setIsbn(selectedBook.isbn)
    }
  }, [])

  const handleSubmit = (event: FormEvent): void => {
    event.preventDefault()

    const newBook = {
      title: bookTitle,
      author: authorName,
      category,
      isbn
    }

    if (bookTitle === '') {
      setHasNoTitle(true)
    }

    if (authorName === '') {
      setHasNoAuthor(true)
    }

    if (category === 0) {
      setHasNoCategory(true)
    }

    if (isbn === '') {
      setHasNoIsbn(true)
    }

    if (hasInputsData && selectedBook === null) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      postBook(newBook)
        .then(res => onNewBookAdded(prev => [...prev, res]))
        .then(resetFields)
        .then(() => onSubmit(null))

      navigate('/')
    }

    if (hasInputsData && selectedBook !== null) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      postBook(newBook)
        .then(res => onNewBookAdded(prev => prev.map(book => {
          if (book.id === selectedBook.id) {
            return res
          }

          return book
        })))
        .then(resetFields)
        .then(() => onSubmit(null))

      navigate('/')
    }
  }

  return (
    <>
      <div className="form-header">
        <h1 className="title">Add new book form</h1>
        <button
          className="button"
          onClick={() => navigate('/')}
        >
          Go to table
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="box form"
      >
        <div className="field">
          <label className="label">Book title</label>
          <div className="control">
            <input
              className="input"
              type="text"
              placeholder="Enter a title"
              value={bookTitle}
              onChange={(event) => {
                setHasNoTitle(false)
                setBookTitle(event.target.value)
              }}
            />
          </div>
          {hasNoTitle && (
            <p className="help is-danger">Please, enter the title</p>
          )}
        </div>

        <div className="field">
          <label className="label">Author name</label>
          <div className="control">
            <input
              className="input"
              type="text"
              placeholder="Enter a name"
              value={authorName}
              onChange={(event) => {
                setHasNoAuthor(false)
                setAuthorName(event.target.value)
              }}
            />
          </div>
          {hasNoAuthor && (
            <p className="help is-danger">Please, enter the author</p>
          )}
        </div>

        <div className="field">
          <label className="label">Book category</label>
          <div className="control">
            <div className="select is-fullwidth">
              <select
                value={category}
                onChange={(event) => {
                  setHasNoCategory(false)
                  setCategory(event.target.value)
                }}
              >
                <option
                  value="0"
                  hidden
                >
                  Choose a category
                </option>

                {uniqueCategories.map(currentCategory => (
                  <option
                    key={currentCategory}
                    value={currentCategory}
                  >
                    {currentCategory}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {hasNoCategory && (
            <p className="help is-danger">Please, choose the category</p>
          )}
        </div>

        <div className="field pb-5">
          <label className="label">ISBN</label>
          <div className="control">
            <input
              className="input"
              type="text"
              placeholder="enter a number"
              value={isbn}
              onChange={(event) => {
                setHasNoIsbn(false)
                setIsbn(event.target.value)
              }}
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault()
                }
              }}
            />
          </div>
          {hasNoIsbn && (
            <p className="help is-danger">Please, enter the ISBN</p>
          )}
        </div>

        <button className="button is-primary is-fullwidth">
          Add a book
        </button>
      </form>
    </>
  )
}
