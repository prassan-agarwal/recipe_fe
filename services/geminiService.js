// services/geminiService.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Use gemini-pro-vision for image analysis
    this.model = this.genAI.getGenerativeModel({ 
      model: "gemini-pro-vision"
    });
  }

  async analyzeImage(imageBase64) {
    try {
      console.log('Starting Gemini image analysis...');
      
      // Remove data URL prefix if present
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      
      const prompt = `
        You are an expert chef and nutritionist analyzing food images for recipe generation.

        Carefully examine this food image and identify ALL visible ingredients that could be used in cooking.
        Focus on ingredients that would appear in a recipe.

        RETURN ONLY a comma-separated list of ingredient names. 
        - Be specific: "chicken breast" not just "chicken", "red bell pepper" not just "pepper"
        - Include herbs, spices, oils, and cooking ingredients
        - Skip utensils, plates, packaging, or non-food items
        - If multiple items of same type, list once
        - If no clear food ingredients, return: "none"

        Examples of good responses:
        "chicken breast, red bell pepper, yellow onion, garlic, olive oil, salt, black pepper"
        "tomatoes, fresh basil, mozzarella cheese, olive oil, balsamic vinegar"
        "ground beef, potatoes, carrots, onions, beef broth, thyme, bay leaves"
        "salmon, lemon, dill, butter, asparagus, salt, pepper"

        Now analyze this food image and provide the comma-separated list:
      `;

      const imageParts = [
        {
          inlineData: {
            data: base64Data,
            mimeType: this.getMimeType(imageBase64)
          }
        },
      ];

      console.log('Sending request to Gemini API...');
      
      const result = await this.model.generateContent([prompt, ...imageParts]);
      const response = await result.response;
      const text = response.text().trim().toLowerCase();

      console.log('Gemini raw response:', text);

      // Parse the response
      if (text === 'none' || !text || text.includes('no ingredients') || text.includes('unable to identify')) {
        return [];
      }

      // Extract ingredients from comma-separated list
      const ingredients = text
        .split(',')
        .map(ingredient => ingredient.trim())
        .filter(ingredient => {
          // Filter out empty strings and error messages
          return ingredient.length > 1 && 
                 ingredient !== 'none' &&
                 !ingredient.includes('sorry') &&
                 !ingredient.includes('unable') &&
                 !ingredient.includes('error') &&
                 !ingredient.includes('cannot') &&
                 !ingredient.includes('please provide');
        })
        .map(ingredient => {
          // Clean up the ingredient names
          return ingredient
            .replace(/^ingredients?:?\s*/i, '')
            .replace(/\s*\.$/, '')
            .trim();
        })
        .slice(0, 12); // Limit to 12 ingredients max

      console.log('Parsed ingredients:', ingredients);
      return ingredients;

    } catch (error) {
      console.error('Gemini API error:', error);
      
      if (error.message.includes('API_KEY_INVALID') || error.message.includes('401')) {
        throw new Error('Invalid Gemini API key. Please check your GEMINI_API_KEY in .env file.');
      } else if (error.message.includes('quota') || error.message.includes('429')) {
        throw new Error('Gemini API quota exceeded. Please try again later.');
      } else if (error.message.includes('503') || error.message.includes('500')) {
        throw new Error('Gemini API service temporarily unavailable. Please try again.');
      } else {
        throw new Error('Failed to analyze image with Gemini: ' + error.message);
      }
    }
  }

  getMimeType(base64String) {
    if (base64String.startsWith('data:image/jpeg')) return 'image/jpeg';
    if (base64String.startsWith('data:image/jpg')) return 'image/jpeg';
    if (base64String.startsWith('data:image/png')) return 'image/png';
    if (base64String.startsWith('data:image/webp')) return 'image/webp';
    return 'image/jpeg'; // default
  }

  async analyzeMultipleImages(imagesBase64) {
    const results = [];
    
    for (const imageBase64 of imagesBase64) {
      try {
        const ingredients = await this.analyzeImage(imageBase64);
        results.push({
          success: true,
          ingredients,
          count: ingredients.length
        });
      } catch (error) {
        results.push({
          success: false,
          error: error.message,
          ingredients: []
        });
      }
    }
    
    return results;
  }

  // Additional method for text-based ingredient suggestions
  async suggestIngredientsFromText(description) {
    try {
      const textModel = this.genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const prompt = `
        You are a cooking expert. Based on this food description: "${description}"
        Suggest 5-8 common ingredients that might be used.
        Return ONLY a comma-separated list, nothing else.
      `;

      const result = await textModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();

      return text.split(',').map(ing => ing.trim()).filter(ing => ing.length > 0);
    } catch (error) {
      console.error('Gemini text suggestion error:', error);
      return [];
    }
  }
}

module.exports = new GeminiService();