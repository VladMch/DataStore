const express = require('express');
const app = express();

// Храним количество яблок в переменной
let appleCount = 10;

const mapReq = new Map([
  ['-122540883', 10],
  ['33453964', 5],
  ['-951667864', 7],
  ['1125609513', 7],
  ['-951667864', 7],
  ['-951667864', 7]
]);

// Middleware для обработки JSON в теле запросов
app.use(express.json());

// GET запрос для получения количества яблок
app.get('/fruit', (req, res) => {
  const name = req.query.name;
  const count = mapReq.get(name);

  if (count !== undefined) {
    res.json({ fruit: name, count });
  } else {
    res.status(404).json({ error: 'Не найдено' });
  }
});

app.post('/fruit', (req, res) => {
  const { name, count } = req.body;

  if (!name || typeof count !== 'number' || count < 0) {
    return res.status(400).json({ error: 'Неверные данные' });
  }

  if(mapReq.has(name)){
    mapReq.set(name, count);
  } else {
    return res.status(400).json({ error: 'Данное имя отсутвует' });
  }
});

// Запуск сервера на порту 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});

