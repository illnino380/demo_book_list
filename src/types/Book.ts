export interface Book {
  id: number
  title: string
  author: string
  category: string | number
  isbn: string | number
}

export type CreateBookFragment = Omit<Book, 'id'>
