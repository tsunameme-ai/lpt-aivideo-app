import { txt2img } from "@/actions/stable-diffusion";
import { Utils } from "@/libs/utils";

export async function GET(): Promise<Response> {
    // await Utils.delay(1000)
    // return new Response(JSON.stringify({ "ping": 'pong' }), { status: 200, headers: { 'Content-Type': 'application/json' } })

    try {
        await txt2img({
            pPrompt: 'a cat',
            nPrompt: '',
            modelId: 'ByteDance/SDXL-Lightning',
            width: 64,
            height: 64,
            numOutput: 1
        })
    }
    catch (e) {

    }
    return new Response(JSON.stringify({ 'warmup': 'complete' }), { status: 200, headers: { 'Content-Type': 'application/json' } })

    // return await fetch(`https://mklxf3tzqt7ik6exkhmbmmdqn40queab.lambda-url.us-east-1.on.aws/`, { cache: 'no-cache' })
}