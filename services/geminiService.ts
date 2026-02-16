
import { WeiboPost, KeywordData, SentimentSummary } from "../types";

const API_BASE_URL = 'http://localhost:7777/api';

export const analyzeWeiboContent = async (query: string) => {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    let errorMessage = "Analysis failed";
    try {
      const errorData = await response.json();
      errorMessage = errorData.details || errorData.error || errorMessage;
    } catch (e) {
      errorMessage = `Server Error: ${response.status}`;
    }
    console.error("Backend Error:", errorMessage);
    throw new Error(errorMessage);
  }

  return await response.json() as {
    posts: WeiboPost[],
    keywords: KeywordData[],
    summary: SentimentSummary
  };
};
