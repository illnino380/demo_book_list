import React, { SetStateAction, useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { getBooks } from './api/books'

import './App.css'
import { AddNewForm } from './components/AddBookForm'
import { Dashboard } from './components/Dashboard'
import { Book } from './types/Book'

const App: React.FC = () => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [books, setBooks] = useState<Book[]>([])
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)

    getBooks()
      .then(setBooks)
      .catch(() => setHasError(true))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Dashboard
            onSelect={setSelectedBook}
            books={books}
            onDelete={(bookId: number) => setBooks(prevBooks => (
              prevBooks.filter(book => book.id !== bookId)
            ))}
            hasError={hasError}
            isLoading={isLoading}
          />
        }
      />

      <Route
        path="/newForm"
        element={
          <AddNewForm
            selectedBook={selectedBook}
            onSubmit={setSelectedBook}
            books={books}
            onNewBookAdded={(newBook: SetStateAction<Book[]>) => setBooks(newBook)}
          />
        }
      />
    </Routes>
  )
}

export default App
