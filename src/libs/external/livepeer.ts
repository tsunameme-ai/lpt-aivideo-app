import { GenerationOutput, Img2vidInput, Txt2imgInput } from "../types"

export class LivepeerAPI {
    public async txt2img(params: Txt2imgInput): Promise<GenerationOutput> {
        const url = `${process.env.NEXT_PUBLIC_LIVEPEER_ENDPOINT}/text-to-image`
        const postBody = {
            'model_id': params.modelId,
            'prompt': params.pPrompt,
            'negative_prompt': params.nPrompt,
            'guidance_scale': params.guidanceScale,
            'seed': params.seed,
            'width': params.width,
            'height': params.height
        }

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(postBody)
        })

        const data = await res.json()
        return {
            id: 'sync',
            status: 'success',
            mediaUrl: data.images[0].url
        }

    }
    public async fetchAsset(mediaUrl: string): Promise<GenerationOutput> {
        return {
            id: 'sync',
            status: 'success',
            mediaUrl: mediaUrl
        }
    }

    public async img2vid(params: Img2vidInput): Promise<GenerationOutput> {
        const imageFile = params.imageFile
        if (!imageFile) {
            throw new Error(`Livepeer API: image file does not exist.`)
        }
        const fd = new FormData()
        fd.append('image', imageFile)
        fd.append('model_id', 'stabilityai/stable-video-diffusion-img2vid-xt')
        fd.append('motion_bucket_id', params.motionButcketId.toString())

        const url = `${process.env.NEXT_PUBLIC_LIVEPEER_ENDPOINT}/image-to-video`
        const headers = new Headers()
        const res = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: fd,
        })

        const data = await res.json()
        console.log(data)
        return {
            id: 'sync',
            status: 'success',
            mediaUrl: data.images[0].url
        }
    }
}