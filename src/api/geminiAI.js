const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const callGeminiSpecRefiner = async (userDescription) => {
    if (!API_KEY) {
        console.error("Gemini API Key is missing in .env");
        // Fallback mock for demo if key is missing
        return {
            description: `(Mock AI): ${userDescription} [Key Missing]`,
            cooling_capacity: "Unknown",
            temp_min: "0",
            temp_max: "100"
        };
    }

    const prompt = `
    You are a scientific equipment expert. 
    Analyze this user request: "${userDescription}". 
    Extract the following fields in JSON format: 
    { "cooling_capacity": "string", "temp_min": "number", "temp_max": "number", "category": "string", "description": "refined technical description" }.
    Do not wrap in markdown. Return only JSON.
  `;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const data = await response.json();
        const textResponse = data.candidates[0].content.parts[0].text;
        return JSON.parse(textResponse);
    } catch (error) {
        console.error("Gemini API Error:", error);
        return null;
    }
};

export const callGeminiProposalGenerator = async (rfqTitle, price) => {
    if (!API_KEY) return "Error: Missing API Key";

    const prompt = `
    Write a professional, persuasive short bid proposal for a scientific equipment vendor.
    Project: ${rfqTitle}.
    Bid Price: $${price}.
    Tone: Professional, confident, highlighting warranty and service.
  `;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Error generating proposal.";
    }
};