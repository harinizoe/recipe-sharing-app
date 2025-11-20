import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your AI cooking assistant 👨‍🍳 I can help you scale recipes, convert measurements, fetch recipe details, and provide cooking tips. What would you like to know?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const [recipes, setRecipes] = useState([]);
  const messagesEndRef = useRef(null);

  // Fetch recipes on component mount
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/recipes');
        setRecipes(response.data.recipes || response.data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };
    fetchRecipes();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Recipe scaling and conversion utilities
  const parseIngredients = (ingredientsText) => {
    const lines = ingredientsText.split(/\n|,/).map(line => line.trim()).filter(line => line);
    const ingredients = [];

    lines.forEach(line => {
      // Enhanced regex to capture quantity, unit, and ingredient
      const match = line.match(/^(\d+(?:\.\d+)?(?:\/\d+)?)\s*(\w+)?\s+(.+)$/);
      if (match) {
        const [, quantity, unit, name] = match;
        ingredients.push({
          quantity: parseFloat(quantity.includes('/') ? eval(quantity) : quantity),
          unit: unit || 'item',
          name: name.trim(),
          original: line
        });
      } else {
        // Try to find numbers anywhere in the line
        const numberMatch = line.match(/(\d+(?:\.\d+)?(?:\/\d+)?)/);
        if (numberMatch) {
          ingredients.push({
            quantity: parseFloat(numberMatch[1].includes('/') ? eval(numberMatch[1]) : numberMatch[1]),
            unit: 'item',
            name: line.replace(numberMatch[1], '').trim(),
            original: line
          });
        } else {
          ingredients.push({
            quantity: 1,
            unit: 'item',
            name: line,
            original: line
          });
        }
      }
    });

    return ingredients;
  };

  const convertUnits = (quantity, fromUnit, toUnit) => {
    const conversions = {
      // Weight conversions (to grams)
      'g': 1,
      'gram': 1,
      'grams': 1,
      'kg': 1000,
      'kilogram': 1000,
      'kilograms': 1000,
      'oz': 28.35,
      'ounce': 28.35,
      'ounces': 28.35,
      'lb': 453.59,
      'pound': 453.59,
      'pounds': 453.59,
      
      // Volume conversions (to ml)
      'ml': 1,
      'milliliter': 1,
      'milliliters': 1,
      'l': 1000,
      'liter': 1000,
      'liters': 1000,
      'cup': 240,
      'cups': 240,
      'tbsp': 15,
      'tablespoon': 15,
      'tablespoons': 15,
      'tsp': 5,
      'teaspoon': 5,
      'teaspoons': 5,
      'pint': 473,
      'pints': 473,
      'quart': 946,
      'quarts': 946,
      'gallon': 3785,
      'gallons': 3785
    };

    const from = fromUnit.toLowerCase();
    const to = toUnit.toLowerCase();

    if (conversions[from] && conversions[to]) {
      // Check if both units are in the same category (weight or volume)
      const weightUnits = ['g', 'gram', 'grams', 'kg', 'kilogram', 'kilograms', 'oz', 'ounce', 'ounces', 'lb', 'pound', 'pounds'];
      const volumeUnits = ['ml', 'milliliter', 'milliliters', 'l', 'liter', 'liters', 'cup', 'cups', 'tbsp', 'tablespoon', 'tablespoons', 'tsp', 'teaspoon', 'teaspoons', 'pint', 'pints', 'quart', 'quarts', 'gallon', 'gallons'];
      
      const fromIsWeight = weightUnits.includes(from);
      const toIsWeight = weightUnits.includes(to);
      const fromIsVolume = volumeUnits.includes(from);
      const toIsVolume = volumeUnits.includes(to);

      if ((fromIsWeight && toIsWeight) || (fromIsVolume && toIsVolume)) {
        const baseValue = quantity * conversions[from];
        return baseValue / conversions[to];
      }
    }

    return quantity; // Return original if conversion not possible
  };

  const scaleIngredients = (ingredients, originalServings, newServings) => {
    const scaleFactor = newServings / originalServings;
    return ingredients.map(ingredient => ({
      ...ingredient,
      quantity: ingredient.quantity * scaleFactor,
      scaledQuantity: ingredient.quantity * scaleFactor
    }));
  };

  const formatQuantity = (quantity) => {
    if (quantity < 0.125) return (quantity * 16).toFixed(2) + '/16';
    if (quantity < 0.25) return '1/8';
    if (quantity < 0.33) return '1/4';
    if (quantity < 0.5) return '1/3';
    if (quantity < 0.67) return '1/2';
    if (quantity < 0.75) return '2/3';
    if (quantity < 1) return '3/4';
    if (quantity % 1 === 0) return quantity.toString();
    return quantity.toFixed(2);
  };

  // Find recipe by name or ID
  const findRecipe = (searchTerm) => {
    return recipes.find(recipe => 
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe._id === searchTerm ||
      (recipe.cuisine && recipe.cuisine.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (recipe.category && recipe.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  // Enhanced AI response with recipe database integration
  const getAIResponse = async (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Recipe lookup functionality
    if (message.includes('show recipe') || message.includes('get recipe') || message.includes('find recipe')) {
      const recipeMatch = message.match(/(?:show|get|find)\s+recipe\s+(?:for\s+)?(.+)/);
      if (recipeMatch) {
        const searchTerm = recipeMatch[1].trim();
        const recipe = findRecipe(searchTerm);
        
        if (recipe) {
          return `📖 **${recipe.title}**\n\n` +
                 `👥 **Serves:** ${recipe.servings || 'Not specified'}\n` +
                 `⏱️ **Prep:** ${recipe.prepTime || 'N/A'} | **Cook:** ${recipe.cookTime || 'N/A'}\n` +
                 `🍽️ **Cuisine:** ${recipe.cuisine || 'Not specified'}\n` +
                 `📊 **Difficulty:** ${recipe.difficulty || 'Not specified'}\n\n` +
                 `**Ingredients:**\n${recipe.ingredients}\n\n` +
                 `**Instructions:**\n${recipe.steps}\n\n` +
                 `💡 Want me to scale this recipe for a different number of people? Just ask!`;
        } else {
          const availableRecipes = recipes.slice(0, 5).map(r => r.title).join(', ');
          return `❌ I couldn't find a recipe matching "${searchTerm}". \n\nAvailable recipes include: ${availableRecipes}${recipes.length > 5 ? '...' : ''}`;
        }
      }
    }

    // List available recipes
    if (message.includes('list recipes') || message.includes('show all recipes') || message.includes('what recipes')) {
      if (recipes.length === 0) {
        return "📝 No recipes found in your database. Add some recipes first!";
      }
      
      let response = `📚 **Available Recipes (${recipes.length} total):**\n\n`;
      recipes.slice(0, 10).forEach((recipe, index) => {
        response += `${index + 1}. **${recipe.title}** (${recipe.cuisine || 'Unknown cuisine'})\n`;
      });
      
      if (recipes.length > 10) {
        response += `\n... and ${recipes.length - 10} more recipes!\n`;
      }
      
      response += `\n💡 Say "show recipe [name]" to get full details and scale any recipe!`;
      return response;
    }

    // Recipe scaling with database integration
    if (message.includes('scale') || message.includes('adjust') || message.includes('person') || message.includes('people') || message.includes('serving')) {
      // Check if user wants to scale a specific recipe from database
      const recipeScaleMatch = message.match(/scale\s+(.+?)\s+(?:from\s+(\d+)\s+to\s+(\d+)|for\s+(\d+))/);
      if (recipeScaleMatch) {
        const recipeName = recipeScaleMatch[1];
        const fromServings = recipeScaleMatch[2] ? parseInt(recipeScaleMatch[2]) : null;
        const toServings = recipeScaleMatch[3] ? parseInt(recipeScaleMatch[3]) : parseInt(recipeScaleMatch[4]);
        
        const recipe = findRecipe(recipeName);
        if (recipe) {
          const originalServings = fromServings || recipe.servings || 4;
          const ingredients = parseIngredients(recipe.ingredients);
          const scaledIngredients = scaleIngredients(ingredients, originalServings, toServings);
          
          let response = `📏 **${recipe.title} - Scaled for ${toServings} people:**\n\n`;
          response += `**Scaled Ingredients:**\n`;
          scaledIngredients.forEach(ingredient => {
            const formattedQuantity = formatQuantity(ingredient.scaledQuantity);
            response += `• ${formattedQuantity} ${ingredient.unit} ${ingredient.name}\n`;
          });
          
          response += `\n**Instructions remain the same:**\n${recipe.steps}\n\n`;
          response += `✨ Recipe scaled from ${originalServings} to ${toServings} servings (${(toServings/originalServings).toFixed(2)}x)!`;
          
          return response;
        } else {
          return `❌ I couldn't find a recipe named "${recipeName}". Try "list recipes" to see available options.`;
        }
      }
      const servingMatch = message.match(/(\d+)\s*(?:person|people|serving)/);
      if (servingMatch) {
        const newServings = parseInt(servingMatch[1]);
        return `🔢 I can help you scale recipes! To scale a recipe for ${newServings} people, I need to know:
1. The current recipe serving size
2. The ingredients list

For example, say: "Scale this recipe from 4 to ${newServings} people: 2 cups flour, 1 kg chicken, 500ml milk"

I can also convert between units like cups to grams, kg to pounds, etc.!`;
      }
      
      // Check if user provided ingredients to scale
      const scaleMatch = message.match(/scale.*from\s*(\d+).*to\s*(\d+)/);
      if (scaleMatch) {
        const originalServings = parseInt(scaleMatch[1]);
        const newServings = parseInt(scaleMatch[2]);
        
        // Extract ingredients from the message
        const ingredientsStart = message.indexOf(':');
        if (ingredientsStart !== -1) {
          const ingredientsText = userMessage.substring(ingredientsStart + 1);
          const ingredients = parseIngredients(ingredientsText);
          const scaledIngredients = scaleIngredients(ingredients, originalServings, newServings);
          
          let response = `📏 **Scaled Recipe (${originalServings} → ${newServings} servings):**\n\n`;
          scaledIngredients.forEach(ingredient => {
            const formattedQuantity = formatQuantity(ingredient.scaledQuantity);
            response += `• ${formattedQuantity} ${ingredient.unit} ${ingredient.name}\n`;
          });
          
          return response + `\n✨ Recipe successfully scaled by ${(newServings/originalServings).toFixed(2)}x!`;
        }
      }
    }

    // Unit conversion functionality
    if (message.includes('convert') || message.includes('how many') || message.includes('grams') || message.includes('cups') || message.includes('kg')) {
      const conversionMatch = message.match(/(\d+(?:\.\d+)?)\s*(\w+)\s*(?:to|in|=)\s*(\w+)/);
      if (conversionMatch) {
        const [, quantity, fromUnit, toUnit] = conversionMatch;
        const converted = convertUnits(parseFloat(quantity), fromUnit, toUnit);
        
        if (converted !== parseFloat(quantity)) {
          return `🔄 **Unit Conversion:**\n${quantity} ${fromUnit} = ${formatQuantity(converted)} ${toUnit}\n\nI can convert between weight (g, kg, oz, lb) and volume (ml, l, cups, tbsp, tsp) units!`;
        } else {
          return `❌ I cannot convert between ${fromUnit} and ${toUnit} as they are different measurement types (weight vs volume). Try converting within the same category!`;
        }
      }
      
      return `🔄 I can help with unit conversions! Try asking:\n• "Convert 2 cups to ml"\n• "How many grams in 1 kg?"\n• "500ml to cups"\n\nI handle weight (g, kg, oz, lb) and volume (ml, l, cups, tbsp, tsp) conversions!`;
    }

    // Recipe-related responses
    if (message.includes('recipe') || message.includes('cook') || message.includes('make')) {
      if (message.includes('chicken')) {
        return "🍗 For chicken recipes, I recommend trying grilled chicken with herbs, chicken curry, or a simple chicken stir-fry. Would you like a specific recipe or cooking technique?";
      }
      if (message.includes('pasta')) {
        return "🍝 Pasta is versatile! Try carbonara, aglio e olio, or a fresh tomato basil pasta. The key is to not overcook the pasta - al dente is perfect!";
      }
      if (message.includes('dessert')) {
        return "🍰 For desserts, chocolate chip cookies are always a hit! Or try a simple fruit crumble. What's your skill level - beginner or experienced baker?";
      }
      if (message.includes('vegetarian') || message.includes('vegan')) {
        return "🥗 Great choice! Try lentil curry, vegetable stir-fry, or quinoa salad. These are nutritious and delicious. Need specific ingredients or cooking methods?";
      }
      return "🍳 I'd love to help you find the perfect recipe! What type of cuisine are you in the mood for? Italian, Asian, Mexican, or something else?";
    }

    // Cooking tips and techniques
    if (message.includes('tip') || message.includes('how to') || message.includes('technique')) {
      if (message.includes('knife') || message.includes('cut') || message.includes('chop')) {
        return "🔪 Knife skills are essential! Keep your knife sharp, use a claw grip with your non-cutting hand, and rock the knife for efficient chopping. Practice makes perfect!";
      }
      if (message.includes('season') || message.includes('salt')) {
        return "🧂 Season throughout cooking, not just at the end! Taste as you go. Salt enhances flavors, but don't forget herbs and spices for complexity.";
      }
      if (message.includes('oil') || message.includes('fry')) {
        return "🫒 Use the right oil for the job! Olive oil for low heat, vegetable oil for frying, and always let your pan heat up before adding oil.";
      }
      return "💡 Here are some key cooking tips: mise en place (prep everything first), taste as you cook, don't overcrowd pans, and let meat rest after cooking!";
    }

    // Ingredient substitutions
    if (message.includes('substitute') || message.includes('replace') || message.includes('instead of')) {
      if (message.includes('egg')) {
        return "🥚 Egg substitutes: 1 egg = 1/4 cup applesauce, 1 mashed banana, or 1 tbsp ground flaxseed + 3 tbsp water (let sit 5 min).";
      }
      if (message.includes('butter')) {
        return "🧈 Butter substitutes: Use equal amounts of coconut oil, vegetable oil, or applesauce (for baking). Each gives different results!";
      }
      if (message.includes('milk')) {
        return "🥛 Milk alternatives: Almond, oat, soy, or coconut milk work well. For baking, use unsweetened versions for best results.";
      }
      return "🔄 I can help with substitutions! What ingredient do you need to replace? Common swaps include applesauce for oil, Greek yogurt for sour cream, etc.";
    }

    // Meal planning
    if (message.includes('meal plan') || message.includes('weekly') || message.includes('prep')) {
      return "📅 Meal planning tips: Start with 2-3 recipes per week, prep ingredients on Sunday, choose recipes with overlapping ingredients, and don't forget leftovers!";
    }

    // Nutrition questions
    if (message.includes('healthy') || message.includes('nutrition') || message.includes('calories')) {
      return "🥗 For healthy cooking: Include lots of vegetables, choose lean proteins, use whole grains, limit processed foods, and watch portion sizes. Balance is key!";
    }

    // Time-saving tips
    if (message.includes('quick') || message.includes('fast') || message.includes('time')) {
      return "⏰ Quick cooking tips: Use a pressure cooker, prep ingredients in advance, choose one-pot meals, and keep your pantry stocked with basics!";
    }

    // Storage and food safety
    if (message.includes('store') || message.includes('keep') || message.includes('fresh')) {
      return "❄️ Food storage: Refrigerate leftovers within 2 hours, use airtight containers, label with dates, and follow the 'first in, first out' rule!";
    }

    // Baking specific
    if (message.includes('bake') || message.includes('bread') || message.includes('cake')) {
      return "🍞 Baking tips: Measure ingredients precisely, preheat your oven, don't overmix batters, and use room temperature ingredients unless specified otherwise!";
    }

    // Spices and flavoring
    if (message.includes('spice') || message.includes('flavor') || message.includes('bland')) {
      return "🌶️ To add flavor: Layer spices throughout cooking, use fresh herbs when possible, don't forget acid (lemon, vinegar), and taste and adjust seasoning!";
    }

    // Kitchen equipment
    if (message.includes('equipment') || message.includes('tools') || message.includes('pan')) {
      return "🍳 Essential tools: Sharp knife, cutting board, good pans (cast iron, non-stick), measuring tools, and a reliable thermometer. Quality over quantity!";
    }

    // Greetings and general
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "👋 Hello! I'm here to help with all your cooking questions. Whether you need recipes, techniques, or meal planning advice, just ask!";
    }

    if (message.includes('thank') || message.includes('thanks')) {
      return "😊 You're welcome! Happy cooking! Feel free to ask me anything else about recipes, techniques, or meal planning.";
    }

    // Default response for unrecognized queries
    const defaultResponses = [
      "🤔 That's an interesting question! Could you be more specific? I can help with recipes, cooking techniques, ingredient substitutions, or meal planning.",
      "👨‍🍳 I'm here to help with cooking! Try asking about specific recipes, cooking tips, ingredient substitutions, or meal planning advice.",
      "🍽️ I'd love to help you in the kitchen! What specific cooking challenge are you facing? Recipes, techniques, or meal planning?",
      "📚 I have lots of cooking knowledge to share! Ask me about recipes, cooking methods, ingredient swaps, or kitchen tips."
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(async () => {
      const botResponse = await getAIResponse(inputMessage);
      const botMessage = {
        id: messages.length + 2,
        text: botResponse,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const quickQuestions = [
    "List recipes",
    "Show recipe chicken", 
    "Scale pasta for 6 people",
    "Convert 2 cups to grams",
    "Find recipe italian"
  ];

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <div
        className="chatbot-toggle position-fixed"
        style={{
          bottom: '20px',
          right: '20px',
          zIndex: 1050
        }}
      >
        <button
          className={`btn btn-primary rounded-circle shadow-lg ${isOpen ? 'd-none' : ''}`}
          onClick={() => setIsOpen(true)}
          style={{
            width: '60px',
            height: '60px',
            fontSize: '1.5rem'
          }}
        >
          🤖
        </button>
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <div
          className="chatbot-window position-fixed shadow-lg"
          style={{
            bottom: '20px',
            right: '20px',
            width: '400px',
            height: '600px',
            zIndex: 1050,
            backgroundColor: 'white',
            borderRadius: '15px',
            border: '1px solid #e9ecef'
          }}
        >
          {/* Header */}
          <div className="chatbot-header p-3 border-bottom" style={{ borderRadius: '15px 15px 0 0', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <div className="me-2" style={{ fontSize: '1.5rem' }}>🤖</div>
                <div>
                  <h6 className="mb-0 text-white fw-bold">AI Cooking Assistant</h6>
                  <small className="text-white-50">Always here to help!</small>
                </div>
              </div>
              <button
                className="btn btn-sm text-white"
                onClick={() => setIsOpen(false)}
                style={{ fontSize: '1.2rem' }}
              >
                ×
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            className="chatbot-messages p-3 overflow-auto"
            style={{ height: '400px', backgroundColor: '#f8f9fa' }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message mb-3 d-flex ${message.isBot ? 'justify-content-start' : 'justify-content-end'}`}
              >
                <div
                  className={`message-bubble p-2 rounded-3 ${
                    message.isBot
                      ? 'bg-white border text-dark'
                      : 'text-white'
                  }`}
                  style={{
                    maxWidth: '80%',
                    background: message.isBot ? 'white' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}
                >
                  <div style={{ fontSize: '0.9rem' }}>{message.text}</div>
                  <small className={`d-block mt-1 ${message.isBot ? 'text-muted' : 'text-white-50'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </small>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="message mb-3 d-flex justify-content-start">
                <div className="message-bubble p-2 rounded-3 bg-white border">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length <= 1 && (
            <div className="px-3 pb-2">
              <small className="text-muted">Quick questions:</small>
              <div className="d-flex flex-wrap gap-1 mt-1">
                {quickQuestions.slice(0, 3).map((question, index) => (
                  <button
                    key={index}
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleQuickQuestion(question)}
                    style={{ fontSize: '0.75rem' }}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="chatbot-input p-3 border-top">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Ask me about cooking..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                disabled={isTyping}
              />
              <button
                className="btn btn-primary"
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isTyping}
              >
                <i className="bi bi-send"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Typing Animation CSS */}
      <style>{`
        .typing-indicator {
          display: flex;
          gap: 4px;
          align-items: center;
        }
        
        .typing-indicator span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #6c757d;
          animation: typing 1.4s infinite ease-in-out;
        }
        
        .typing-indicator span:nth-child(1) {
          animation-delay: -0.32s;
        }
        
        .typing-indicator span:nth-child(2) {
          animation-delay: -0.16s;
        }
        
        @keyframes typing {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .chatbot-window {
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        
        .message-bubble {
          word-wrap: break-word;
        }
      `}</style>
    </>
  );
};

export default AIChatbot;
