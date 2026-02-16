
import { WeiboPost, KeywordData, SentimentSummary } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:7777/api';

export const analyzeWeiboContent = async (query: string) => {
  console.log("Requesting analysis from:", API_BASE_URL);

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
  } catch (netError: any) {
    console.error("Network Error:", netError);
    throw new Error(`无法连接到服务器 (${API_BASE_URL})。请检查后端是否正常运行且 CORS 已配置。`);
  }

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
