import { NextRequest } from 'next/server'

export async function POST(req: Request | NextRequest) {
    try {
        const body = await (req as any).json()
        const url = body.url
        if (!url || typeof url !== 'string') {
            return new Response(JSON.stringify({ error: 'Invalid image URL' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
        }
        const response = await fetch(url)
        if (response.status !== 200) {
            return new Response(JSON.stringify({ error: 'Invalid image URL' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
        }
        const blob = await response.blob()
        return new Response(blob, { status: 200, headers: { 'Content-Type': 'image/jpeg' } })
    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify({ error: 'Error fetching image' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
    }
}