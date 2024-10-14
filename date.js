export default function handler(req, res) {
  if (req.method === 'GET') {
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
  } else if (req.method === 'POST') {
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
  }
}
