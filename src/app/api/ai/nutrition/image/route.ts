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

interface AnalysisResponse {
  description: string;
  nutritionData: NutritionData;
}

export async function POST(request: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await request.formData();
    const imageFile = formData.get('foodImage') as File | null;

    if (!imageFile) {
      return NextResponse.json(
        { error: 'Food image is required' },
        { status: 400 }
      );
    }

    // Check if the file is an image
    if (!imageFile.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Check file size (limit to 5MB)
    if (imageFile.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Image size should be less than 5MB' },
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
    
    // Get the generative model (using gemini-2.0-pro-vision for image analysis)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    //const model = genAI.getGenerativeModel({ model: 'gemma-3-27b-it' });

    // Convert the file to a byte array
    const bytes = await imageFile.arrayBuffer();
    const imageData = new Uint8Array(bytes);

    // Create the prompt for food image analysis
    const prompt = `
      Analyze this food image and provide:
      1. Food name (a concise name for the meal)
      2. Nutritional information in JSON format
      3. Portion size (e.g., "1 serving", "1 plate", "250g", etc.)
      
      For the nutritional information, please provide the following details:
      - Food name (a concise name for the meal)
      - Portion size (e.g., "1 serving", "1 plate", "250g", etc.)
      - Calories (total calories in kcal)
      - Protein (in grams)
      - Carbohydrates (in grams)
      - Fat (in grams)
      - Meal type (breakfast, lunch, dinner, or snack - choose the most appropriate)
      
      Format your response as follows:
      
      DESCRIPTION:
      Food name (a concise name for the meal), Portion size (e.g., "1 serving", "1 plate", "250g", etc.)
      
      NUTRITION_DATA:
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

    // Generate content from the image
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: imageFile.type,
          data: Buffer.from(imageData).toString('base64')
        }
      }
    ]);
    
    const response = result.response;
    const responseText = response.text();
    
    console.log('Gemini API Response:', responseText);
    
    // Extract the description and JSON from the response
    try {
      // Extract the description
      const descriptionMatch = responseText.match(/DESCRIPTION:\s*([\s\S]*?)(?=NUTRITION_DATA:|$)/i);
      const description = descriptionMatch ? descriptionMatch[1].trim() : '';
      
      // Extract the JSON
      const jsonMatch = responseText.match(/NUTRITION_DATA:\s*(\{[\s\S]*\})/i);
      let nutritionData: NutritionData;
      
      if (jsonMatch) {
        nutritionData = JSON.parse(jsonMatch[1]);
      } else {
        // Try to find any JSON in the response as a fallback
        const fallbackJsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (fallbackJsonMatch) {
          nutritionData = JSON.parse(fallbackJsonMatch[0]);
        } else {
          throw new Error('No valid JSON found in response');
        }
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
      
      // Return both the description and nutrition data
      const analysisResponse: AnalysisResponse = {
        description,
        nutritionData
      };
      
      return NextResponse.json(analysisResponse);
    } catch (error) {
      console.error('Error parsing AI response:', error, responseText);
      return NextResponse.json(
        { error: 'Failed to parse nutritional information', details: error instanceof Error ? error.message : 'Unknown error' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error analyzing food image:', error);
    return NextResponse.json(
      { error: 'Failed to analyze food image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
