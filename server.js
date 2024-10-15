require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const Client = require('./clientModel');
const testRoutes = require('./api/test');
const app = express();

app.use('/api', testRoutes);

const PORT = process.env.PORT || 3000;
const dbUrl = process.env.DATABASE_URL;

app.use(express.json());

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Успешное подключение к базе данных');
}).catch((error) => {
  console.error('Ошибка подключения к базе данных:', error);
});

mongoose.connection.on('connected', () => {
  console.log('Подключено к базе данных MongoDB');
});

function isValidDate(dateString) {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

app.post('/api/balance', async (req, res) => {
  const { name, count, pw } = req.body;

  if (pw !== process.env.API_SECRET) {
    return res.status(401).json({ error: 'Неверный пароль' });
  }

  if (!name || typeof count !== 'number' || count < 0) {
    return res.status(400).json({ error: 'Неверные данные' });
  }

  try {
    const client = await Client.findOneAndUpdate(
      { name: name},
      { count: count },
      { new: true, upsert: true }
    );

    res.json({ client: client.name, count: client.count });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.patch('/api/balance', async (req, res) => {
  const clientID = req.query.name;

  try {
    const client = await Client.findOneAndUpdate(
      { name: clientID },
      { $inc: { count: -1 } },
      { new: true}
    );
    if (client) {
      res.json({ count: client.count });
    } else {
      res.status(404).json({ error: 'Не найдено' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.get('/api/balance', async (req, res) => {
  const clientID = req.query.name;

  try {
    const client = await Client.findOne({ name: clientID });
    if (client) {
      res.json({ count: client.count });
    } else {
      res.status(404).json({ error: 'Не найдено' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.post('/api/date', async (req, res) => {
  const { name, expDate, pw } = req.body;

  if (pw !== process.env.API_SECRET) {
    return res.status(401).json({ error: 'Неверный пароль' });
  }

  if (!name) {
    return res.status(400).json({ error: 'Неверные данные' });
  }

  if (!isValidDate(expDate)) {
    return res.status(400).json({ error: 'Некорректная дата' });
  }

  try {
    const client = await Client.findOneAndUpdate(
      { name: name },
      { expDate: new Date(expDate) },
      { new: true, upsert: true }
    );

    res.json({ client: client.name, count: client.expDate });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.get('/api/date', async (req, res) => {
  const clientID = req.query.name;
  const currentTime = new Date();

  try {
    const client = await Client.findOne({ name: clientID });
    if (client) {
      res.json({ isTimeOut: client.expDate < currentTime });
    } else {
      res.status(404).json({ error: 'Пользователь не найден' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = app;

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
