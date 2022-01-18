- Insert two books in books collection:

```js
db.books.insertMany([
  {
    title: 'One Hundred Years of Solitude',
    description: 'Magic realism at its best',
    authors: ['Gabriel García Márquez'],
    favourite: true,
  },
  {
    title: 'In Color Blood',
    description: 'the',
    authors: ['Alexandre Dumas'],
    favourite: false,
  },
])
```

- Find a book by ```title``` field

```js
db.books.findOne({ title: 'In Color Blood' })
```

- Change ```description``` and ```authors``` fields of the book found by ```_id```

```js
db.books.updateOne(
  { _id: '61e626f77274f825d5f0f764' },
  {
    $set: {
      description: 'the "Nonfiction Novel"',
      authors: ['Truman Capote'],
    },
  },
);
```
