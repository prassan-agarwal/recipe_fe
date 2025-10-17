const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: String,
    required: true
  },
  unit: {
    type: String,
    enum: [
      'cup', 'tbsp', 'tsp', 'oz', 'lb', 'g', 'kg', 'ml', 'l', 
      'piece', 'clove', 'bunch', 'pinch', 'to taste', 'slice',
      'can', 'package', 'bag', 'jar', 'bottle', 'packet', 'leaf', 'stalk'
    ],
    default: 'piece'
  }
});

const nutritionalInfoSchema = new mongoose.Schema({
  calories: Number,
  protein: Number,
  carbs: Number,
  fat: Number
});

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  ingredients: [ingredientSchema],
  instructions: [{
    type: String,
    required: true
  }],
  cookingTime: {
    type: Number,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  cuisine: {
    type: String,
    required: true
  },
  servingSize: {
    type: Number,
    required: true,
    min: 1
  },
  dietaryTags: [{
    type: String
  }],
  nutritionalInfo: nutritionalInfoSchema,
  imageUrl: {
    type: String,
    default: ''
  },
  source: {
    type: String,
    default: 'Smart Recipe Generator'
  }
}, {
  timestamps: true
});

// Index for search functionality
recipeSchema.index({ 
  title: 'text', 
  description: 'text', 
  'ingredients.name': 'text' 
});

recipeSchema.index({ cuisine: 1, difficulty: 1, dietaryTags: 1 });

module.exports = mongoose.model('Recipe', recipeSchema);