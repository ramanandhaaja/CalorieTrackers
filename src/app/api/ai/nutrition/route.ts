import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Define the expected response structure
interface NutritionData {
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  [key: string]: string | number;
}

export async function POST(request: NextRequest) {
  try {
    const { mealDescription } = await request.json();

    if (!mealDescription || typeof mealDescription !== 'string') {
      return NextResponse.json(
        { error: 'Meal description is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured' },
        { status: 500 }
      );
    }

    // Initialize the Gemini API client
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Get the generative model (using gemini-1.5-flash for faster responses)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Create the prompt for nutritional analysis
    const prompt = `
      Analyze the following meal description and provide nutritional information in JSON format.
      Meal description: "${mealDescription}"
      
      Please provide the following details:
      - Food name (a concise name for the meal)
      - Portion size (e.g., "1 serving", "1 plate", "250g", etc.)
      - Calories (total calories in kcal)
      - Protein (in grams)
      - Carbohydrates (in grams)
      - Fat (in grams)
      - Meal type (breakfast, lunch, dinner, or snack - choose the most appropriate)
      
      Return ONLY a valid JSON object with the following structure:
      {
        "name": "string",
        "portion": "string",
        "calories": number,
        "protein": number,
        "carbs": number,
        "fat": number,
        "mealType": "breakfast" | "lunch" | "dinner" | "snack"
      }
    `;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = result.response;
    const responseText = response.text();

    console.log(result.response.text());
    
    // Extract the JSON from the response
    try {
      // Try to find JSON in the response using regex
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      let nutritionData: NutritionData;
      
      if (jsonMatch) {
        nutritionData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON found in response');
      }
      
      // Validate the required fields
      const requiredFields = ['name', 'portion', 'calories', 'protein', 'carbs', 'fat', 'mealType'];
      for (const field of requiredFields) {
        if (nutritionData[field as keyof NutritionData] === undefined) {
          throw new Error(`Missing required field: ${field}`);
        }
      }
      
      // Ensure mealType is valid
      const validMealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
      if (!validMealTypes.includes(nutritionData.mealType)) {
        nutritionData.mealType = 'snack'; // Default to snack if invalid
      }
      
      // Ensure numeric values are numbers
      ['calories', 'protein', 'carbs', 'fat'].forEach(field => {
        const value = nutritionData[field as keyof NutritionData];
        const numericValue = typeof value === 'number' ? value : Number(value);
        
        if (isNaN(numericValue)) {
          nutritionData[field as keyof NutritionData] = 0;
        } else {
          nutritionData[field as keyof NutritionData] = numericValue;
        }
      });
      
      return NextResponse.json(nutritionData);
    } catch (error) {
      console.error('Error parsing AI response:', error, responseText);
      return NextResponse.json(
        { error: 'Failed to parse nutritional information', details: error instanceof Error ? error.message : 'Unknown error' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error analyzing meal:', error);
    return NextResponse.json(
      { error: 'Failed to analyze meal', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
