import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // 1. Log the exact URL the frontend sent
  console.log("\n--- [NEW API REQUEST RECEIVED] ---");
  console.log("Full request URL from frontend:", request.url);

  const { searchParams } = new URL(request.url);
  const inputMint = searchParams.get('inputMint');
  const outputMint = searchParams.get('outputMint');
  const amount = searchParams.get('amount');
  const slippageBps = searchParams.get('slippageBps');

  // 2. Validate parameters AND log if they are missing
  if (!inputMint || !outputMint || !amount) {
    console.error("BACKEND VALIDATION FAILED: Missing parameters.");
    console.log("Received: ", { inputMint, outputMint, amount });
    return NextResponse.json(
      { error: `Missing required parameters. Server received: inputMint=${inputMint}, outputMint=${outputMint}, amount=${amount}` },
      { status: 400 } // Send 400, not 500, if params are bad
    );
  }

  // 3. Build the Jupiter API URL
  const JUPITER_API_URL = 'https://lite-api.jup.ag/swap/v1/quote';
  const params = new URLSearchParams({
    inputMint: inputMint,
    outputMint: outputMint,
    amount: amount,
    slippageBps: slippageBps || '50'
  });
  const fullJupiterUrl = `${JUPITER_API_URL}?${params.toString()}`;
  
  console.log("Calling Jupiter API with URL:", fullJupiterUrl);

  try {
    // 4. Call Jupiter
    const { data } = await axios.get(fullJupiterUrl);
    console.log("Jupiter API call successful.");
    return NextResponse.json(data); // Send 200 OK

  } catch (error) {
    // 5. THIS IS THE MOST IMPORTANT PART - LOG THE REAL ERROR
    console.error("\n!!!!!! BACKEND CRASH !!!!!!");
    
    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.message);
      // If Jupiter sent an error message (like "invalid mint"), log it
      if (error.response) {
        console.error("JUPITER'S RESPONSE (THE REAL ERROR):", JSON.stringify(error.response.data, null, 2));
        // Send Jupiter's error back to the frontend
        return NextResponse.json(
          { error: "Failed to fetch from Jupiter", jupiterError: error.response.data },
          { status: error.response.status || 500 }
        );
      }
    } else {
      // Catch any other non-API errors
      console.error("Unexpected Error:", error);
    }
    
    return NextResponse.json(
      { error: 'An unknown error occurred on the backend' },
      { status: 500 }
    );
  }
}