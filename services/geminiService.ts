
import { GoogleGenAI, Type } from "@google/genai";
import { WeatherData, Occasion, Gender, OutfitRecommendation } from '../types';

let genAI: GoogleGenAI | null = null;

const getGenAI = () => {
  if (!genAI) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key not found in environment variables.");
    }
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
};

// 1. Generate Outfit Text Details
export const generateOutfitDetails = async (
  weather: WeatherData,
  occasion: Occasion,
  gender: Gender,
  location: string
): Promise<Omit<OutfitRecommendation, 'id' | 'timestamp' | 'imageUrl'>> => {
  
  const ai = getGenAI();
  
  const prompt = `
    Act as a culturally aware, high-end personal stylist.
    Recommend a realistic, stylish, and functional everyday outfit for ${gender} for the occasion: "${occasion}".
    Location context: "${location}".
    The weather is: ${weather.temperature}°C, ${weather.condition}, Humidity: ${weather.humidity}%, Wind: ${weather.windSpeed} km/h.
    
    Style guidelines:
    - **Local & Cultural Context (CRITICAL)**: The outfit MUST reflect the specific fashion trends, street style, and cultural sensibilities of "${location}". Do not give a generic outfit; adapt to the city's vibe.
      - **Paris**: Chic, tailored, neutral tones, trench coats, loafers, understated elegance, "je ne sais quoi".
      - **Tokyo**: Experimental, layered, oversized silhouettes, high-quality denim, unique textures, or minimalist clean lines.
      - **New York**: Utilitarian, black/grey/navy dominance, leather jackets, smart-casual, sneakers with coats, fast-paced functional.
      - **London**: Eclectic, trench coats, boots, mix of vintage and modern, prep with an edge, layers for variable weather.
      - **Milan**: Bold but sophisticated, impeccable tailoring, statement accessories, high-quality leather, vibrant accent colors (sprezzatura).
      - **Berlin**: Edgy, techno-minimalism, all-black, functional streetwear, combat boots, long coats, industrial vibe.
      - **Seoul**: Trendy, polished, soft color palettes or monochrome, wide-leg slacks, oversized blazers, pristine sneakers.
      - **Lagos**: Vibrant, bold prints, breathable fabrics for heat, polished accessories, high-impact style.
      - **Stockholm/Copenhagen**: Scandi-minimalism, sleek lines, functional outerwear, monochrome or earthy tones, practical but stylish.
      - **Dubai/Middle East**: Luxury, modest cuts, light breathable fabrics (linen, silk) for heat but covering skin, gold accents, opulent accessories.
      - **Miami/LA**: Relaxed, colorful, athleisure-adjacent, linen, open shirts, sunglasses, sun-conscious.
      - **General**: If the location is unknown, assume a modern "Global City" smart-casual aesthetic.

    - **Demographic Adjustments**:
      - **Kids**: Focus on durability, comfort, ease of movement, and age-appropriate styles (e.g., adjustable waistbands, soft fabrics). Fun prints or bright colors are encouraged if appropriate for the location.
      - **Female/Male/Unisex**: Adhere to standard stylish contemporary norms.

    - **Realistic & Wearable**: Suggest outfits that real people wear today in this location. Avoid overly avant-garde or "runway-only" looks unless the occasion is "Party/Club" or "Wedding". Focus on "Everyday Style" or "Smart Casual".
    - **Color Diversity**: Do NOT default to "Cream/Beige/Black" unless it fits the specific city (like Berlin/NYC). Suggest bold, deep, or pastel colors appropriate for the season and location.
    - **Material & Texture**: You MUST include realistic fabric details for every main item to ground the look. Examples: "Heavyweight French Terry Hoodie", "Raw Denim Jeans", "Ribbed Merino Wool Sweater", "Crisp Poplin Shirt", "Corduroy Jacket", "Brushed Cotton Chinos", "Breathable Linen Blend".

    Return a JSON object with:
    - title (Short catchy name for the look, referencing the location style if applicable)
    - description (2 sentences describing the vibe and how it fits the ${location} aesthetic and weather)
    - items (Array of specific clothing pieces. IMPORTANT: Include the specific color and FABRIC in the item name, e.g., "Emerald Green Silk Blouse" or "Dark Wash Heavy Denim Jeans")
    - colorPalette (Array of 4-5 STRINGS. **CRITICAL**: THESE MUST BE VALID HEX CODES STARTING WITH '#'. Example: ["#2C3E50", "#E74C3C"]. Do NOT use color names like "Red".)
    - whyItWorks (Why this matches the weather/occasion/location)
    - accessories (Array of items)
    - stylingTips (Array of actionable tips)
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          items: { type: Type.ARRAY, items: { type: Type.STRING } },
          colorPalette: { type: Type.ARRAY, items: { type: Type.STRING } },
          whyItWorks: { type: Type.STRING },
          accessories: { type: Type.ARRAY, items: { type: Type.STRING } },
          stylingTips: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["title", "description", "items", "colorPalette", "whyItWorks", "accessories", "stylingTips"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No recommendation generated.");
  
  const data = JSON.parse(text);

  // Fallback: Ensure colorPalette has basic hex codes if the AI somehow failed (rare with schema, but safe)
  if (data.colorPalette && Array.isArray(data.colorPalette)) {
    data.colorPalette = data.colorPalette.map((c: string) => c.startsWith('#') ? c : '#57534e');
  }

  return data;
};

// 2. Generate Outfit Image
export const generateOutfitImage = async (
  details: Omit<OutfitRecommendation, 'id' | 'timestamp' | 'imageUrl'>,
  weather: WeatherData,
  occasion: Occasion,
  gender: Gender,
  realismLevel: 'everyday-realistic' | 'high-fashion' = 'everyday-realistic',
  location: string
): Promise<string> => {
  const ai = getGenAI();

  const genderTerm = gender === 'Kids' ? 'child' : gender;
  
  // Simplified prompt to avoid safety filters and complexity issues
  const prompt = `
    Fashion photography, full body shot of a ${genderTerm} model wearing: ${details.items.join(', ')}.
    Style: ${realismLevel === 'everyday-realistic' ? 'Street style, candid, natural lighting' : 'High fashion editorial'}.
    Location background: ${location}.
    Colors: ${details.colorPalette.join(', ')}.
    Accessories: ${details.accessories.join(', ')}.
    High quality, detailed fabric texture, 4k.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: '3:4',
        }
      },
    });

    if (response.candidates && response.candidates.length > 0) {
      const content = response.candidates[0].content;
      if (content && content.parts) {
        for (const part of content.parts) {
          if (part.inlineData && part.inlineData.data) {
            return `data:${part.inlineData.mimeType || 'image/jpeg'};base64,${part.inlineData.data}`;
          } else if (part.text) {
             console.log("Model returned text instead of image:", part.text);
          }
        }
      }
    }
    
    throw new Error("No image part found in response. The model may have refused the request.");
  } catch (error) {
    console.warn("Image generation failed.", error);
    throw error;
  }
};
