import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

export async function POST(req: NextRequest) {
    try {
        const { url } = await req.json();

        if (!url || !url.startsWith("http")) {
            return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
        }

        const response = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "Accept-Language": "en-US,en;q=0.9",
                "Accept-Encoding": "gzip, deflate, br",
                "Cache-Control": "max-age=0",
                "Sec-Ch-Ua": '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
                "Sec-Ch-Ua-Mobile": "?0",
                "Sec-Ch-Ua-Platform": '"macOS"',
                "Upgrade-Insecure-Requests": "1"
            },
            timeout: 10000,
        });

        const html = response.data;
        const $ = cheerio.load(html);

        // Try to get OpenGraph meta tags first
        const ogTitle = $('meta[property="og:title"]').attr("content") || $('meta[name="twitter:title"]').attr("content") || $("title").text();
        const ogImage = $('meta[property="og:image"]').attr("content") || $('meta[name="twitter:image"]').attr("content");
        const ogDescription = $('meta[property="og:description"]').attr("content") || $('meta[name="twitter:description"]').attr("content");

        // Simple parsing logic (can be expanded for specific sites)
        let name = ogTitle || "Property from Link";
        let address = ogTitle;
        let price = 0;
        let image = ogImage;

        // Try to find price in a more specific way
        // Site specific selectors
        if (url.includes("zillow.com")) {
            const zillowPrice = $('span[data-testid="price"]').first().text();
            if (zillowPrice) price = parseInt(zillowPrice.replace(/[$,]/g, ""));
        } else if (url.includes("realtor.ca")) {
            const realtorPrice = $("#listingPrice").text();
            if (realtorPrice) price = parseInt(realtorPrice.replace(/[$,]/g, ""));
        }

        // Catch-all price regex
        if (price === 0) {
            const priceMatch = html.match(/\$[\s]*[\d,]+/);
            if (priceMatch) {
                price = parseInt(priceMatch[0].replace(/[$,\s]/g, ""));
            }
        }

        // Strip site names
        name = name.replace(/ \| Zillow| - Realtor.ca| - ViewPoint.ca/gi, "").trim();
        address = address.replace(/ \| Zillow| - Realtor.ca| - ViewPoint.ca/gi, "").trim();

        // Return the extracted data
        return NextResponse.json({
            name,
            address,
            image,
            currentValue: price,
            description: ogDescription
        });
    } catch (error: any) {
        console.error("Scraping error:", error.message);
        return NextResponse.json({
            error: "Could not fetch property details. The site may be blocking access."
        }, { status: 500 });
    }
}
