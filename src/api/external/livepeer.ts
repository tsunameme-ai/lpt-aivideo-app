import { API } from "../api"
import { GenerationOutput, Img2vidInput, Txt2imgInput } from "../types"

export class LivepeerAPI {
    public static async txt2img(params: Txt2imgInput): Promise<GenerationOutput> {
        const url = `${process.env.NEXT_PUBLIC_LIVEPEER_ENDPOINT}/text-to-image`
        const postBody = {
            'model_id': 'stabilityai/stable-diffusion-xl-base-1.0',
            'prompt': params.pPrompt,
            'negative_prompt': params.nPrompt,
            'guidance_scale': params.guidanceScale,
            'seed': params.seed
        }

        const headers = new Headers()
        headers.append('Content-Type', 'application/json')
        headers.append('Access-Control-Allow-Origin', '*')

        const res = await fetch(url, {
            method: 'POST',
            headers: headers,
            mode: 'no-cors',
            body: JSON.stringify(postBody)
        })
        console.log(res)

        // const data = await res.json()
        const data = {
            "images": [
                {
                    "url": "https://storage.googleapis.com/livepeer-ai-video-dev/3f1795d7/bdc1d7b8.png"
                }
            ]
        }
        return {
            id: 'sync',
            status: 'success',
            mediaUrl: data.images[0].url
        }

    }
    public static async fetchAsset(mediaUrl: string): Promise<GenerationOutput> {
        return {
            id: 'sync',
            status: 'success',
            mediaUrl: mediaUrl
        }
    }
    public static async img2vid(params: Img2vidInput): Promise<GenerationOutput> {
        const data = { "images": [{ "url": "https://storage.googleapis.com/livepeer-ai-video-dev/698da978/41a81130.mp4" }] }
        await API.delay(1000)
        return {
            id: 'sync',
            status: 'success',
            mediaUrl: data.images[0].url
        }
    }
    public static async img2vid1(params: Img2vidInput) {
        const imageFile = params.imageFile
        if (!imageFile) {
            throw new Error(`Livepeer API: image file does not exist.`)
        }
        const fd = new FormData()
        fd.append('image', imageFile)
        fd.append('model_id', 'stabilityai/stable-video-diffusion-img2vid-xt')
        fd.append('motion_bucket_id', params.motionButcketId.toString())
        console.log(`--check form data--`)
        console.log(`has image ${fd.has('image')}`)
        console.log(fd.get('image'))
        console.log(`has model_id ${fd.has('model_id')}`)
        console.log(fd.get('model_id'))
        console.log(`has motion_bucket_id ${fd.has('motion_bucket_id')}`)
        console.log(fd.get('motion_bucket_id'))

        const url = `${process.env.NEXT_PUBLIC_LIVEPEER_ENDPOINT}/image-to-video`
        const headers = new Headers()
        headers.append('Access-Control-Allow-Origin', '*')
        headers.append('Prefer', 'respond-async')
        console.log(`???? post livepeer ${url}`)
        console.log(`--check headers--`)
        console.log(headers.get('Prefer'))
        // console.log(headers)
        const res = await fetch(url, {
            method: 'POST',
            headers: headers,
            mode: 'no-cors',
            body: fd,
        })
        console.log(res)

        return await res.json()
    }
}