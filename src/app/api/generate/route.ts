import { GenerationManager } from '@/libs/generation-manager'
import { NextRequest } from 'next/server'

export async function POST(req: Request | NextRequest): Promise<Response> {
    const body = await (req as any).json()
    const generationReq = GenerationManager.getInstance().addGenerationRequest(body.type, body.input)
    console.log('POST generation request')
    console.log(GenerationManager.getInstance().generations)
    return new Response(JSON.stringify(generationReq))
    // const url = body.url
    // if (!url || typeof url !== 'string') {
    //     return new Response(JSON.stringify({ error: 'Invalid image URL' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    // }
    // return await fetch(url, { cache: 'no-cache' })
}