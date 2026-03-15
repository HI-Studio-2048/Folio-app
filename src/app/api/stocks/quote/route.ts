import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const symbols = searchParams.get("symbols");

    if (!symbols) {
        return NextResponse.json({ error: "No symbols provided" }, { status: 400 });
    }

    try {
        const response = await axios.get(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            },
        });

        const quotes = response.data.quoteResponse?.result || [];

        return NextResponse.json({ result: quotes });
    } catch (error: any) {
        console.error("Stock API error:", error.message);
        return NextResponse.json({ error: "Failed to fetch stock data" }, { status: 500 });
    }
}
