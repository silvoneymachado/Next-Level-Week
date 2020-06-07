import express from 'express';

const app = express();

app.get('/users', (request, response) => {
  response.json(['Fulano', 'Ciclano', 'Beltrano']);
});

app.listen(3333);