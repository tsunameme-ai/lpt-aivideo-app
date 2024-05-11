import { NextRequest } from 'next/server'

export async function GET(req: Request | NextRequest): Promise<Response> {
    const requrl = new URL(req.url)
    const url = requrl.searchParams.get("url")

    // const body = await (req as any).json()
    // const url = body.url
    if (!url || typeof url !== 'string') {
        return new Response(JSON.stringify({ error: 'Invalid image URL' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }
    return await fetch(url, { cache: 'no-cache' })
}