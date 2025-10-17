const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Favorite = require('../../shared/models/Favorite');
const User = require('../../shared/models/User');


// Middleware to verify token
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get user favorites
router.get('/', authenticateToken, async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user._id })
      .populate('recipeId');
    
    res.json(favorites.map(fav => fav.recipeId));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add to favorites
router.post('/:recipeId', authenticateToken, async (req, res) => {
  try {
    const { recipeId } = req.params;

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      userId: req.user._id,
      recipeId
    });

    if (existingFavorite) {
      return res.status(400).json({ message: 'Recipe already in favorites' });
    }

    const favorite = new Favorite({
      userId: req.user._id,
      recipeId
    });

    await favorite.save();
    await favorite.populate('recipeId');

    res.status(201).json({
      message: 'Recipe added to favorites',
      recipe: favorite.recipeId
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove from favorites
router.delete('/:recipeId', authenticateToken, async (req, res) => {
  try {
    const { recipeId } = req.params;

    const favorite = await Favorite.findOneAndDelete({
      userId: req.user._id,
      recipeId
    });

    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    res.json({ message: 'Recipe removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;