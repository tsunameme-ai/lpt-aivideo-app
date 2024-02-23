import { GenerationOutput, Img2vidNativeInput, Txt2imgInput } from './types'
import { Utils } from './utils'

export class SDAPI {

    public async txt2img(params: Txt2imgInput): Promise<Array<GenerationOutput>> {
        const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/text-to-image`
        const postBody = {
            'model_id': params.modelId,
            'prompt': params.pPrompt,
            'negative_prompt': params.nPrompt,
            'guidance_scale': params.guidanceScale,
            'seed': params.seed,
            'width': params.width,
            'height': params.height,
            'num_images_per_prompt': params.numOutput
        }
        return await this.sendRequest(url, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postBody)
        })
    }

    public async img2vid(params: Img2vidNativeInput): Promise<Array<GenerationOutput>> {
        const postBody = {
            "image_url": params.imageUrl,
            "model_id": "stabilityai/stable-diffusion-xl-base-1.0",
            "width": params.width,
            "height": params.height,
            "motion_bucket_id": params.motionButcketId,
            "noise_aug_strength": params.noiseAugStrength,
            "overlay_base64": params.overlayBase64
        }
        const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/image-to-video`
        return await this.sendRequest(url, {
            cache: 'no-cache',
            method: 'POST',
            body: JSON.stringify(postBody)
        }, 600000)
    }

    private async sendRequest(url: string, init: RequestInit, timeoutMs: number = 40000): Promise<Array<GenerationOutput>> {
        const t = new Date().getTime()
        let resError
        let resOutput
        let status

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        try {
            const res = await fetch(url, { ...init, signal: controller.signal })
            // console.log(res)
            clearTimeout(timeoutId)
            // const res = await fetch(url, init)
            status = res.status
            resOutput = await this.parseResponse(res)
        }
        catch (e: any) {
            console.log(e)
            resError = e
            status = e.status || 'ERROR'
        }
        finally {
            clearTimeout(timeoutId)
            const dur = (new Date().getTime() - t) / 1000
            const segs = url.split('/')
            console.log(`LIVEPEER REQ ${status} ${segs[segs.length - 1]} ${dur}`)
            if (resError) {
                throw resError
            }
            return resOutput!
        }
    }

    private async parseResponse(res: Response): Promise<Array<GenerationOutput>> {
        if (res.ok) {
            const data = await res.json()
            return data.images.map((item: { url: string, seed?: number }) => {
                return {
                    mediaUrl: item.url,
                    seed: item.seed
                }
            })
        }
        let errorMessage = ''
        try {
            const data = await res.json()
            errorMessage = data.error?.message || ''
        }
        catch (e) {
        }
        finally {
            throw new Error(`SD Provider Error: ${res.status} ${errorMessage}`)
        }
    }
}

export class SDStaticAPI {
    public async txt2img(): Promise<Array<GenerationOutput>> {
        await Utils.delay(1000)

        return [{
            mediaUrl: 'https://pub-3626123a908346a7a8be8d9295f44e26.r2.dev/generations/0-5c5efe4b-ec74-4311-9ced-76cc38d80835.png'
        }, {
            mediaUrl: 'https://pub-3626123a908346a7a8be8d9295f44e26.r2.dev/generations/1-5c5efe4b-ec74-4311-9ced-76cc38d80835.png'
        }, {
            mediaUrl: 'https://pub-3626123a908346a7a8be8d9295f44e26.r2.dev/generations/2-5c5efe4b-ec74-4311-9ced-76cc38d80835.png'
        }, {
            mediaUrl: 'https://pub-3626123a908346a7a8be8d9295f44e26.r2.dev/generations/3-5c5efe4b-ec74-4311-9ced-76cc38d80835.png'
        }]

    }

    public async img2vid(): Promise<Array<GenerationOutput>> {
        await Utils.delay(10000)
        return [{
            mediaUrl: 'https://lpt-aivideo-dst.s3.amazonaws.com/1708718637.mp4',
            seed: 1773116098
        }]
    }
}