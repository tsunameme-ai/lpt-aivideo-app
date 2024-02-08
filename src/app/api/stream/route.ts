// File: app/api/stream/route.js

import { img2vid, txt2img } from "@/actions/stable-diffusion";
import { GenerationManager } from "@/libs/generation-manager";
import { GenerationRequest, GenerationType } from "@/libs/types";
import { NextRequest } from "next/server";

// Prevents this route's response from being cached on Vercel
export const dynamic = 'force-dynamic'

interface Notify {
    log: (message: string) => void;
    complete: (message: string) => void;
    error: (error: Error | any) => void;
    close: () => void;
}
// const longRunning1 = async (notify: Notify, exec: Function, gr: GenerationRequest) => {
//     notify.log(JSON.stringify({ "data": "Started" }))
//     const output = await exec(gr.input)
//     console.log('~~~~~ long run output~~~~')
//     output.id = gr.id
//     console.log(output)
//     // notify.error(new Error('Something went wrong'))
//     notify.complete(JSON.stringify({ "data": output, complete: true }))
// }

const longRunning = async (notify: Notify, exec: Function, gr: GenerationRequest) => {
    notify.log(JSON.stringify({ "data": "Started" }));
    let count = 0

    const intervalId = setInterval(() => {
        count += 1
        notify.log(JSON.stringify({ "data": `PING ${count}s` }))
    }, 1000);

    try {
        const output = await exec(gr.input)
        output.id = gr.id
        notify.complete(JSON.stringify({ "data": output, complete: true }))
        GenerationManager.getInstance().removeGenerationRequest(gr.id)
    } catch (error) {
        console.error(error);
    } finally {
        clearInterval(intervalId); // Clear the interval when finished
    }
};
// export async function GET(req: NextApiRequest, res: NextApiResponse)

export async function GET(req: Request | NextRequest) {
    const url = new URL(req.url!)

    const id = url.searchParams.get("id")
    if (!id) {
        return new Response(JSON.stringify({ error: `Request Id doesn't exist` }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }
    console.log(id)
    const pendingRqs = await GenerationManager.getInstance().fetchPendingRequests()
    console.log(`api/stream/route ${pendingRqs.size} ${pendingRqs.keys()}`)
    const generationRequest = pendingRqs.get(id)
    if (!generationRequest) {
        return new Response(JSON.stringify({ error: `Request ${id} doesn't exist` }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }
    let func
    if (generationRequest.type === GenerationType.IMG2VID) {
        func = img2vid
    }
    else if (generationRequest.type === GenerationType.TXT2IMG) {
        func = txt2img
    }
    else {
        throw new Error(`Generation type ${generationRequest.type} has no exectuion details.`)
    }
    // const take = url.searchParams.get("take")

    let responseStream = new TransformStream();
    const writer = responseStream.writable.getWriter();
    const encoder = new TextEncoder();
    let closed = false;

    // Invoke long running process
    longRunning({
        log: (msg: string) => {
            writer.write(encoder.encode(`data: ${msg}\n\n`))
        },
        complete: (msg: string) => {
            writer.write(encoder.encode(`data: ${msg}\n\n`))
            if (!closed) {
                writer.close();
                closed = true;
            }
        },
        error: (err: Error) => {
            const msg = JSON.stringify({ error: err.message })
            writer.write(encoder.encode(`data: ${msg}\n\n`))
            if (!closed) {
                writer.close();
                closed = true;
            }
        },
        close: () => {
            if (!closed) {
                writer.close();
                closed = true;
            }
        },
    }, func, generationRequest).then(() => {
        if (!closed) {
            writer.close();
        }
    }).catch(() => {
        if (!closed) {
            writer.close();
        }
    })

    return new Response(responseStream.readable, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "text/event-stream; charset=utf-8",
            Connection: "keep-alive",
            "Cache-Control": "no-cache, no-transform",
            "X-Accel-Buffering": "no",
            "Content-Encoding": "none",
        },
    });
}
