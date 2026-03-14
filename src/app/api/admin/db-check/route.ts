import { NextResponse } from "next/server";
import { Client } from "pg";

/**
 * Diagnostics: check DB connection and properties table.
 */
export async function GET(req: Request) {
    const dbUrl = process.env.SUPABASE_DB_URL || process.env.POSTGRES_URL;
    if (!dbUrl) {
        return NextResponse.json({
            ok: false,
            error: "SUPABASE_DB_URL or POSTGRES_URL not set",
        });
    }

    const projectRef = dbUrl.match(/postgres\.([a-z0-9]+)\./)?.[1] || "?";
    const appRef = process.env.NEXT_PUBLIC_SUPABASE_URL?.match(/https:\/\/([a-z0-9]+)\./)?.[1] || "?";

    const client = new Client({
        connectionString: dbUrl,
        ssl: { rejectUnauthorized: false },
    });

    try {
        await client.connect();
        const tableCheck = await client.query(`
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN ('properties', 'notifications', 'notification_broadcasts')
        `);
        const existingTables = tableCheck.rows.map((r: any) => r.table_name);

        let propertyCount = 0;
        if (existingTables.includes("properties")) {
            const countRes = await client.query(`SELECT COUNT(*) as c FROM public.properties`);
            propertyCount = parseInt(String(countRes.rows?.[0]?.c ?? 0), 10);
        }

        return NextResponse.json({
            ok: true,
            dbProjectRef: projectRef,
            appProjectRef: appRef,
            match: projectRef === appRef,
            tables: existingTables,
            totalProperties: propertyCount,
        });
    } catch (err: any) {
        return NextResponse.json({
            ok: false,
            error: err.message,
            dbProjectRef: projectRef,
            appProjectRef: appRef,
        });
    } finally {
        await client.end();
    }
}
