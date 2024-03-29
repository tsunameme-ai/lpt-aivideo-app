import { GenerationManager } from '@/libs/generation-manager'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: Request | NextRequest): Promise<Response> {
    const body = await (req as any).json()
    const generationReq = await GenerationManager.getInstance().addGenerationRequest(body.type, body.input)
    return new Response(JSON.stringify(generationReq))
}