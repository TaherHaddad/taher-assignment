//API 

import books from '../../data/books.json';

export default function handler(req, res) {
        res.status(200).json(books);
}