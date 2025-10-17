const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  category: {
    type: String,
    enum: [
      'vegetable', 'fruit', 'protein', 'grain', 'dairy', 
      'spice', 'herb', 'oil', 'sauce', 'nut', 'legume'
    ],
    required: true
  },
  commonNames: [String],
  storageTips: String,
  shelfLife: Number, // in days
  isPerishable: Boolean
}, {
  timestamps: true
});

module.exports = mongoose.model('Ingredient', ingredientSchema);