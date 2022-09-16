import { Book, CreateBookFragment } from '../types/Book'

const BASE_URL = 'http://localhost:3001'

type RequestMethod = 'GET' | 'POST' | 'DELETE'

async function request<T> (
  url: string,
  method: RequestMethod = 'GET',
  data: any = null
): Promise<T> {
  const options: RequestInit = { method }

  if (data !== null) {
    options.body = JSON.stringify(data)
    options.headers = {
      'Content-Type': 'application/json; charset=UTF-8'
    }
  }

  return await fetch(BASE_URL + url, options)
    .then(async response => {
      if (!response.ok) {
        throw new Error()
      }

      return await response.json()
    })
}

export const getBooks = async (): Promise<Book[]> => await request<Book[]>('/books')
export const postBook = async (book: CreateBookFragment): Promise<Book> => (
  await request('/books', 'POST', book)
)
export const removeBook = async (bookId: number): Promise<unknown> => (
  await request(`/books/${bookId}`, 'DELETE')
)
