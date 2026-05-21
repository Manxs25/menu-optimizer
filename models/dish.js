const mongoose = require('mongoose');

const DishSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  cost: { type: Number, required: true },
  orders: { type: Number, default: 0 }, // renamed from popularity
}, { timestamps: true });

module.exports = mongoose.model('Dish', DishSchema);
