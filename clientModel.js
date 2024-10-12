const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Название фрукта
  count: { type: Number, required: true, min: 0 }, // Количество фрукта
  expDate: Date
});

const CLient = mongoose.model('CLient', clientSchema);
module.exports = CLient;