import { GenerationManager } from '@/libs/generation-manager'
import { NextRequest } from 'next/server'

export async function POST(req: Request | NextRequest): Promise<Response> {
    const body = await (req as any).json()
    const generationReq = await GenerationManager.getInstance().addGenerationRequest(body.type, body.input)
    const pendingRqs = await GenerationManager.getInstance().fetchPendingRequests()
    console.log(`AFTER Generation Request ${pendingRqs.size} ${pendingRqs.keys()}`)
    return new Response(JSON.stringify(generationReq))
}