import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { transactions, tokens, portfolio, nfts } = await req.json();

    // Add rate limiting check here if needed

    const prompt = `Analyze this wallet's activity and portfolio. Here's the data:
    
    Portfolio Value: $${portfolio}
    
    Tokens: ${JSON.stringify(tokens, null, 2)}
    
    NFTs: ${JSON.stringify(nfts, null, 2)}
    
    Recent Transactions: ${JSON.stringify(transactions, null, 2)}
    
    Please provide:
    1. A summary of wallet activity
    2. Portfolio composition analysis
    3. Trading patterns and behavior
    4. Risk assessment
    5. Recommendations`;

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      return Response.json({ analysis: text });
    } catch (error: any) {
      if (error.message?.includes("429")) {
        return Response.json(
          { error: "API rate limit reached. Please try again later." },
          { status: 429 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("Analysis error:", error);
    return Response.json(
      { error: "Failed to analyze wallet" },
      { status: 500 }
    );
  }
}
