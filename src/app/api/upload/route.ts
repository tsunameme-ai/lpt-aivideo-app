import { NextRequest } from 'next/server'

export async function POST(req: Request | NextRequest): Promise<Response> {
    const body = await (req as any).json()

    const apiUrl = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/image-over-video`
    return await fetch(apiUrl, {
        method: "POST",
        body: JSON.stringify(body)
    })
}