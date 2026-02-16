const OpenAI = require("openai");
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

let _openai;
function getOpenAIClient() {
  if (!_openai) {
    if (!process.env.ARK_API_KEY) {
      throw new Error("Missing ARK_API_KEY in environment variables.");
    }
    _openai = new OpenAI({
      apiKey: process.env.ARK_API_KEY,
      baseURL: "https://ark.cn-beijing.volces.com/api/v3",
    });
  }
  return _openai;
}

async function analyzeWeiboContent(query) {
  const prompt = `Analyze Weibo sentiment for the search query: "${query}". 
    Generate realistic mock data for a dashboard including 6 posts and 10 keywords.
    Return the response as a valid JSON object with the following structure:
    {
      "posts": [
        { "id": "string", "author": "string", "avatar": "string", "content": "string", "time": "string", "sentiment": "POSITIVE|NEGATIVE|NEUTRAL", "likes": number, "comments": number }
      ],
      "keywords": [
        { "name": "string", "frequency": number, "time": number, "importance": number, "type": "POSITIVE|NEGATIVE|NEUTRAL" }
      ],
      "summary": { "positive": number, "negative": number, "neutral": number, "total": number }
    }`;

  try {
    const client = getOpenAIClient();
    const completion = await client.chat.completions.create({
      model: process.env.ARK_MODEL_ID,
      messages: [
        { role: "system", content: "You are a data analysis assistant that provides Weibo sentiment analysis data. ALWAYS respond with ONLY a valid JSON object. No other text." },
        { role: "user", content: prompt }
      ]
    });

    const content = completion.choices[0].message.content;

    // Robust JSON extraction: look for the first '{' and last '}'
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No JSON found in response:", content);
      throw new Error("Model failed to provide data in JSON format.");
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Doubao AI Service Error:", error);
    throw error;
  }
}

module.exports = { analyzeWeiboContent };
