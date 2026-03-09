import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Standard property interface
interface PropertyData {
    name: string;
    address: string;
    currentValue: number;
    type: string;
    description: string;
    image?: string;
    bedrooms?: number;
    bathrooms?: number;
    yearBuilt?: number;
    lotSize?: string;
}

export async function POST(req: Request) {
    console.log("DEBUG: AI Search route triggered");
    try {
        const { query } = await req.json();

        if (!query) {
            return NextResponse.json({ error: "Missing query or address." }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("DEBUG: GEMINI_API_KEY is missing from environment");
            return NextResponse.json({ error: "GEMINI_API_KEY is not configured on the server." }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        const prompt = `
            You are a real estate analysis assistant. 
            User Query: "${query}"
            
            Task: 
            1. Search for recent real estate data or listing details for this property/address.
            2. If you find a listing (Zillow, MLS, etc.), extract the key details.
            3. If specific price isn't found, estimate based on neighborhood comps if possible.
            4. Return a structured JSON object.
            
            Strict JSON Format:
            {
                "name": "Property Name or Address Line 1",
                "address": "Full Formatted Address",
                "currentValue": number (current market value or list price),
                "type": "Condo" | "Single-family" | "Multi-family" | "Commercial" | "Land",
                "units": number (default to 1, but if it is multi-family/condo/etc find the unit count),
                "description": "Short 1-2 sentence description of key features",
                "bedrooms": number,
                "bathrooms": number,
                "yearBuilt": number,
                "lotSize": "Size as string e.g. 0.46 acres",
                "image": "URL to a public photo. CRITICAL: If you cannot find a specific high-resolution photo URL for THIS EXACT property, you MUST return a high-quality Unsplash URL based on property type: Single-family: https://images.unsplash.com/photo-1600585154340-be6161a56a0c, Multi-family/Apartment: https://images.unsplash.com/photo-1460317442991-0ec239387146, Condo/Townhouse: https://images.unsplash.com/photo-1574362848149-11496d93a7c7, Commercial: https://images.unsplash.com/photo-1486406146926-c627a92ad1ab. DO NOT return broken links.",
                "confidence": number (0 to 1)
            }
            
            If the query is clearly not a property, return an object with "error": "Invalid property query".
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        try {
            const data = JSON.parse(responseText);
            if (data.error) {
                return NextResponse.json({ error: data.error }, { status: 400 });
            }
            return NextResponse.json({ ...data, _debug_version: "v2_detailed_errors" });
        } catch (parseError) {
            console.error("JSON Parse Error:", responseText);
            return NextResponse.json({ error: "AI returned an invalid format. Please try again." }, { status: 500 });
        }
    } catch (error: any) {
        console.error("AI Search Error:", error);
        const errorMessage = error.message || "Unknown AI error";
        return NextResponse.json({
            error: `AI Error: ${errorMessage}. Make sure the API key is active and you have restarted your server.`
        }, { status: 500 });
    }
}
